import { User, Word } from '../context/AppContext';

const STORAGE_KEYS = {
  USERS: 'english-flashcards-users',
  CURRENT_USER: 'english-flashcards-current-user',
  WORDS: 'english-flashcards-words',
} as const;

// User management functions
export const saveUsers = (users: User[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
};

export const loadUsers = (): User[] => {
  try {
    const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error('Error loading users from localStorage:', error);
    return [];
  }
};

export const saveCurrentUser = (user: User | null): void => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (error) {
    console.error('Error saving current user to localStorage:', error);
  }
};

export const loadCurrentUser = (): User | null => {
  try {
    const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error loading current user from localStorage:', error);
    return null;
  }
};

// Word management functions
export const saveWords = (words: Word[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(words));
  } catch (error) {
    console.error('Error saving words to localStorage:', error);
  }
};

export const loadWords = (): Word[] => {
  try {
    const wordsJson = localStorage.getItem(STORAGE_KEYS.WORDS);
    return wordsJson ? JSON.parse(wordsJson) : [];
  } catch (error) {
    console.error('Error loading words from localStorage:', error);
    return [];
  }
};

// Generate unique ID for users
export const generateUserId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Clear all data (for testing or reset purposes)
export const clearAllData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}; 