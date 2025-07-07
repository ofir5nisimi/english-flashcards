import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types for our application state
export interface User {
  id: string;
  username: string;
  progress: {
    completedLevels: number[];
    currentLevel: number;
  };
  quizResults: {
    [levelId: number]: {
      score: number;
      passed: boolean;
      attempts: number;
    };
  };
}

export interface Word {
  id: string;
  emoji: string;
  english: string;
  hebrew: string;
  level: number;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  words: Word[];
  currentLevel: number;
  isLoading: boolean;
}

// Action types
export type AppAction =
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'UPDATE_USER_PROGRESS'; payload: { userId: string; progress: User['progress'] } }
  | { type: 'UPDATE_QUIZ_RESULT'; payload: { userId: string; level: number; score: number; passed: boolean } }
  | { type: 'SET_WORDS'; payload: Word[] }
  | { type: 'ADD_WORD'; payload: Word }
  | { type: 'UPDATE_WORD'; payload: Word }
  | { type: 'DELETE_WORD'; payload: string }
  | { type: 'SET_CURRENT_LEVEL'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET_USER_PROGRESS'; payload: string }
  | { type: 'LOAD_DATA'; payload: { users: User[]; words: Word[] } };

// Initial state
const initialState: AppState = {
  currentUser: null,
  users: [],
  words: [],
  currentLevel: 1,
  isLoading: false,
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
        currentUser: state.currentUser?.id === action.payload ? null : state.currentUser,
      };
    
    case 'UPDATE_USER_PROGRESS':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.userId
            ? { ...user, progress: action.payload.progress }
            : user
        ),
        currentUser: state.currentUser?.id === action.payload.userId
          ? { ...state.currentUser, progress: action.payload.progress }
          : state.currentUser,
      };
    
    case 'UPDATE_QUIZ_RESULT':
      return {
        ...state,
        users: state.users.map(user => {
          if (user.id === action.payload.userId) {
            const updatedQuizResults = {
              ...user.quizResults,
              [action.payload.level]: {
                score: action.payload.score,
                passed: action.payload.passed,
                attempts: (user.quizResults[action.payload.level]?.attempts || 0) + 1
              }
            };
            
            // If quiz passed, add level to completed levels and update current level
            const updatedProgress = action.payload.passed ? {
              ...user.progress,
              completedLevels: user.progress.completedLevels.includes(action.payload.level) 
                ? user.progress.completedLevels
                : [...user.progress.completedLevels, action.payload.level].sort((a, b) => a - b),
              currentLevel: Math.max(user.progress.currentLevel, action.payload.level + 1)
            } : user.progress;
            
            return {
              ...user,
              quizResults: updatedQuizResults,
              progress: updatedProgress
            };
          }
          return user;
        }),
        currentUser: state.currentUser?.id === action.payload.userId ? (() => {
          const user = state.users.find(u => u.id === action.payload.userId);
          if (!user) return state.currentUser;
          
          const updatedQuizResults = {
            ...user.quizResults,
            [action.payload.level]: {
              score: action.payload.score,
              passed: action.payload.passed,
              attempts: (user.quizResults[action.payload.level]?.attempts || 0) + 1
            }
          };
          
          // If quiz passed, add level to completed levels and update current level
          const updatedProgress = action.payload.passed ? {
            ...user.progress,
            completedLevels: user.progress.completedLevels.includes(action.payload.level) 
              ? user.progress.completedLevels
              : [...user.progress.completedLevels, action.payload.level].sort((a, b) => a - b),
            currentLevel: Math.max(user.progress.currentLevel, action.payload.level + 1)
          } : user.progress;
          
          return {
            ...state.currentUser,
            quizResults: updatedQuizResults,
            progress: updatedProgress
          };
        })() : state.currentUser,
      };
    
    case 'SET_WORDS':
      return { ...state, words: action.payload };
    
    case 'ADD_WORD':
      return { ...state, words: [...state.words, action.payload] };
    
    case 'UPDATE_WORD':
      return {
        ...state,
        words: state.words.map(word =>
          word.id === action.payload.id ? action.payload : word
        ),
      };
    
    case 'DELETE_WORD':
      return {
        ...state,
        words: state.words.filter(word => word.id !== action.payload),
      };
    
    case 'SET_CURRENT_LEVEL':
      return { ...state, currentLevel: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'RESET_USER_PROGRESS':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload
            ? { ...user, progress: { completedLevels: [], currentLevel: 1 }, quizResults: {} }
            : user
        ),
        currentUser: state.currentUser?.id === action.payload
          ? { ...state.currentUser, progress: { completedLevels: [], currentLevel: 1 }, quizResults: {} }
          : state.currentUser,
      };
    
    case 'LOAD_DATA':
      return {
        ...state,
        users: action.payload.users,
        words: action.payload.words,
      };
    
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
} 