import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  saveUsers, 
  loadUsers, 
  saveCurrentUser, 
  loadCurrentUser, 
  saveWords, 
  loadWords 
} from '../utils/localStorage';

export const useLocalStorage = () => {
  const { state, dispatch } = useAppContext();

  // Load data from localStorage on app initialization
  useEffect(() => {
    const loadData = () => {
      try {
        const users = loadUsers();
        const currentUser = loadCurrentUser();
        const words = loadWords();

        // Load users and words into state
        dispatch({ type: 'LOAD_DATA', payload: { users, words } });
        
        // Set current user if exists and is valid
        if (currentUser && users.find(u => u.id === currentUser.id)) {
          dispatch({ type: 'SET_CURRENT_USER', payload: currentUser });
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
      }
    };

    loadData();
  }, [dispatch]);

  // Save users to localStorage whenever users state changes
  useEffect(() => {
    if (state.users.length > 0) {
      saveUsers(state.users);
    }
  }, [state.users]);

  // Save current user to localStorage whenever current user changes
  useEffect(() => {
    saveCurrentUser(state.currentUser);
  }, [state.currentUser]);

  // Save words to localStorage whenever words state changes
  useEffect(() => {
    if (state.words.length > 0) {
      saveWords(state.words);
    }
  }, [state.words]);

  return {
    // Return any utility functions if needed
    clearAllData: () => {
      dispatch({ type: 'SET_CURRENT_USER', payload: null });
      dispatch({ type: 'LOAD_DATA', payload: { users: [], words: [] } });
      localStorage.clear();
    }
  };
}; 