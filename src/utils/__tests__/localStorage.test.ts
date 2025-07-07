import { 
  saveUsers, 
  loadUsers, 
  saveCurrentUser, 
  loadCurrentUser, 
  saveWords, 
  loadWords, 
  generateUserId, 
  clearAllData 
} from '../localStorage';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('localStorage utilities', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('User management', () => {
    describe('saveUsers and loadUsers', () => {
      it('should save and load users correctly', () => {
        const users = [
          { 
            id: '1', 
            username: 'Alice', 
            progress: { completedLevels: [1], currentLevel: 2 },
            quizResults: { 1: { score: 90, passed: true, attempts: 1 } }
          },
          { 
            id: '2', 
            username: 'Bob', 
            progress: { completedLevels: [], currentLevel: 1 },
            quizResults: {} as { [levelId: number]: { score: number; passed: boolean; attempts: number } }
          }
        ];

        saveUsers(users);

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'english-flashcards-users',
          JSON.stringify(users)
        );
      });

      it('should load users from localStorage', () => {
        const users = [
          { 
            id: '1', 
            username: 'Alice', 
            progress: { completedLevels: [1], currentLevel: 2 },
            quizResults: { 1: { score: 90, passed: true, attempts: 1 } }
          },
          { 
            id: '2', 
            username: 'Bob', 
            progress: { completedLevels: [], currentLevel: 1 },
            quizResults: {} as { [levelId: number]: { score: number; passed: boolean; attempts: number } }
          }
        ];
        mockLocalStorage.getItem.mockReturnValue(JSON.stringify(users));

        const result = loadUsers();

        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('english-flashcards-users');
        expect(result).toEqual(users);
      });

      it('should return empty array when no users exist', () => {
        mockLocalStorage.getItem.mockReturnValue(null);

        const result = loadUsers();

        expect(result).toEqual([]);
      });

      it('should handle invalid JSON when loading users', () => {
        mockLocalStorage.getItem.mockReturnValue('invalid json');

        const result = loadUsers();

        expect(result).toEqual([]);
      });
    });

    describe('saveCurrentUser and loadCurrentUser', () => {
      it('should save current user correctly', () => {
        const user = { 
          id: '1', 
          username: 'Alice', 
          progress: { completedLevels: [1], currentLevel: 2 },
          quizResults: { 1: { score: 90, passed: true, attempts: 1 } }
        };

        saveCurrentUser(user);

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'english-flashcards-current-user',
          JSON.stringify(user)
        );
      });

      it('should remove current user when null is passed', () => {
        saveCurrentUser(null);

        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('english-flashcards-current-user');
      });

      it('should load current user from localStorage', () => {
        const user = { 
          id: '1', 
          username: 'Alice', 
          progress: { completedLevels: [1], currentLevel: 2 },
          quizResults: { 1: { score: 90, passed: true, attempts: 1 } }
        };
        mockLocalStorage.getItem.mockReturnValue(JSON.stringify(user));

        const result = loadCurrentUser();

        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('english-flashcards-current-user');
        expect(result).toEqual(user);
      });

      it('should return null when no current user exists', () => {
        mockLocalStorage.getItem.mockReturnValue(null);

        const result = loadCurrentUser();

        expect(result).toBeNull();
      });
    });
  });

  describe('Word management', () => {
    describe('saveWords and loadWords', () => {
      it('should save words correctly', () => {
        const words = [
          { id: '1', emoji: '🍎', english: 'apple', hebrew: 'תפוח', level: 1 },
          { id: '2', emoji: '🍌', english: 'banana', hebrew: 'בננה', level: 1 }
        ];

        saveWords(words);

        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'english-flashcards-words',
          JSON.stringify(words)
        );
      });

      it('should load words from localStorage', () => {
        const words = [
          { id: '1', emoji: '🍎', english: 'apple', hebrew: 'תפוח', level: 1 },
          { id: '2', emoji: '🍌', english: 'banana', hebrew: 'בננה', level: 1 }
        ];
        mockLocalStorage.getItem.mockReturnValue(JSON.stringify(words));

        const result = loadWords();

        expect(mockLocalStorage.getItem).toHaveBeenCalledWith('english-flashcards-words');
        expect(result).toEqual(words);
      });

      it('should return empty array when no words exist', () => {
        mockLocalStorage.getItem.mockReturnValue(null);

        const result = loadWords();

        expect(result).toEqual([]);
      });
    });
  });

  describe('generateUserId', () => {
    it('should generate a unique string ID', () => {
      const id1 = generateUserId();
      const id2 = generateUserId();

      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
      expect(id1).not.toBe(id2);
      expect(id1.length).toBeGreaterThan(0);
      expect(id2.length).toBeGreaterThan(0);
    });
  });

  describe('clearAllData', () => {
    it('should clear all localStorage data', () => {
      clearAllData();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('english-flashcards-users');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('english-flashcards-current-user');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('english-flashcards-words');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledTimes(3);
    });
  });
}); 