import { User, Word } from '../context/AppContext';
import { loadUsers, loadWords, saveUsers, saveWords, saveCurrentUser, loadCurrentUser } from './localStorage';

export interface ExportData {
  version: string;
  exportDate: string;
  users: User[];
  words: Word[];
  currentUser: User | null;
}

export interface ImportOptions {
  mergeUsers: boolean;
  mergeWords: boolean;
  replaceAll: boolean;
}

// Export all app data to JSON
export const exportAllData = (): ExportData => {
  const users = loadUsers();
  const words = loadWords();
  const currentUser = loadCurrentUser();

  return {
    version: '1.0',
    exportDate: new Date().toISOString(),
    users,
    words,
    currentUser
  };
};

// Download data as JSON file
export const downloadDataAsFile = (data: ExportData, filename?: string): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `english-flashcards-backup-${new Date().toISOString().split('T')[0]}.json`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Validate imported data structure
export const validateImportData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check if data is an object
  if (!data || typeof data !== 'object') {
    errors.push('Invalid data format: expected JSON object');
    return { isValid: false, errors };
  }

  // Check version (optional, for future compatibility)
  if (data.version && typeof data.version !== 'string') {
    errors.push('Invalid version format');
  }

  // Validate users array
  if (data.users) {
    if (!Array.isArray(data.users)) {
      errors.push('Users data must be an array');
    } else {
      data.users.forEach((user: any, index: number) => {
        if (!user.id || typeof user.id !== 'string') {
          errors.push(`User ${index + 1}: missing or invalid ID`);
        }
        if (!user.username || typeof user.username !== 'string') {
          errors.push(`User ${index + 1}: missing or invalid username`);
        }
        if (!user.progress || typeof user.progress !== 'object') {
          errors.push(`User ${index + 1}: missing or invalid progress`);
        } else {
          if (!Array.isArray(user.progress.completedLevels)) {
            errors.push(`User ${index + 1}: completedLevels must be an array`);
          }
          if (typeof user.progress.currentLevel !== 'number') {
            errors.push(`User ${index + 1}: currentLevel must be a number`);
          }
        }
        if (!user.quizResults || typeof user.quizResults !== 'object') {
          errors.push(`User ${index + 1}: missing or invalid quizResults`);
        }
      });
    }
  }

  // Validate words array
  if (data.words) {
    if (!Array.isArray(data.words)) {
      errors.push('Words data must be an array');
    } else {
      data.words.forEach((word: any, index: number) => {
        if (!word.id || typeof word.id !== 'string') {
          errors.push(`Word ${index + 1}: missing or invalid ID`);
        }
        if (!word.emoji || typeof word.emoji !== 'string') {
          errors.push(`Word ${index + 1}: missing or invalid emoji`);
        }
        if (!word.english || typeof word.english !== 'string') {
          errors.push(`Word ${index + 1}: missing or invalid english`);
        }
        if (!word.hebrew || typeof word.hebrew !== 'string') {
          errors.push(`Word ${index + 1}: missing or invalid hebrew`);
        }
        if (typeof word.level !== 'number' || word.level < 1) {
          errors.push(`Word ${index + 1}: level must be a positive number`);
        }
      });
    }
  }

  return { isValid: errors.length === 0, errors };
};

// Merge or replace users
const mergeUsers = (existingUsers: User[], importedUsers: User[]): User[] => {
  const userMap = new Map(existingUsers.map(user => [user.id, user]));
  
  importedUsers.forEach(importedUser => {
    const existingUser = userMap.get(importedUser.id);
    if (existingUser) {
      // Merge progress: combine completed levels and take higher current level
      const mergedCompletedLevels = Array.from(new Set([
        ...existingUser.progress.completedLevels,
        ...importedUser.progress.completedLevels
      ])).sort((a, b) => a - b);
      
      // Merge quiz results: imported results override existing ones
      const mergedQuizResults = {
        ...existingUser.quizResults,
        ...importedUser.quizResults
      };
      
      userMap.set(importedUser.id, {
        ...existingUser,
        username: importedUser.username, // Use imported username
        progress: {
          completedLevels: mergedCompletedLevels,
          currentLevel: Math.max(existingUser.progress.currentLevel, importedUser.progress.currentLevel)
        },
        quizResults: mergedQuizResults
      });
    } else {
      userMap.set(importedUser.id, importedUser);
    }
  });
  
  return Array.from(userMap.values());
};

// Merge or replace words
const mergeWords = (existingWords: Word[], importedWords: Word[]): Word[] => {
  const wordMap = new Map(existingWords.map(word => [word.id, word]));
  
  importedWords.forEach(importedWord => {
    wordMap.set(importedWord.id, importedWord); // Imported words override existing ones
  });
  
  return Array.from(wordMap.values());
};

// Import data with options
export const importData = async (
  data: ExportData, 
  options: ImportOptions
): Promise<{ success: boolean; message: string; importedCounts: { users: number; words: number } }> => {
  try {
    // Validate data first
    const validation = validateImportData(data);
    if (!validation.isValid) {
      return {
        success: false,
        message: `Import failed: ${validation.errors.join(', ')}`,
        importedCounts: { users: 0, words: 0 }
      };
    }

    let finalUsers: User[] = [];
    let finalWords: Word[] = [];
    let currentUser: User | null = null;

    if (options.replaceAll) {
      // Replace all data
      finalUsers = data.users || [];
      finalWords = data.words || [];
      currentUser = data.currentUser;
    } else {
      // Merge data
      const existingUsers = loadUsers();
      const existingWords = loadWords();

      if (options.mergeUsers && data.users) {
        finalUsers = mergeUsers(existingUsers, data.users);
      } else if (data.users) {
        finalUsers = [...existingUsers, ...data.users];
      } else {
        finalUsers = existingUsers;
      }

      if (options.mergeWords && data.words) {
        finalWords = mergeWords(existingWords, data.words);
      } else if (data.words) {
        finalWords = [...existingWords, ...data.words];
      } else {
        finalWords = existingWords;
      }

      // For current user, use imported if exists and user exists in final users list
      if (data.currentUser && finalUsers.some(u => u.id === data.currentUser?.id)) {
        currentUser = data.currentUser;
      }
    }

    // Save to localStorage
    if (finalUsers.length > 0) {
      saveUsers(finalUsers);
    }
    if (finalWords.length > 0) {
      saveWords(finalWords);
    }
    if (currentUser) {
      saveCurrentUser(currentUser);
    }

    return {
      success: true,
      message: `Import successful! ${data.users?.length || 0} users and ${data.words?.length || 0} words imported.`,
      importedCounts: {
        users: data.users?.length || 0,
        words: data.words?.length || 0
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      importedCounts: { users: 0, words: 0 }
    };
  }
};

// Parse JSON file
export const parseJsonFile = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target?.result as string);
        resolve(jsonData);
      } catch (error) {
        reject(new Error('Invalid JSON file format'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
}; 