import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppProvider } from '../context/AppContext';
import App from '../App';

// Mock the localStorage utility since App uses it in useEffect
jest.mock('../utils/localStorage', () => ({
  saveUsers: jest.fn(),
  loadUsers: jest.fn(() => []),
  saveCurrentUser: jest.fn(),
  loadCurrentUser: jest.fn(() => null),
  saveWords: jest.fn(),
  loadWords: jest.fn(() => []),
  generateUserId: jest.fn(() => 'test-id-123'),
  clearAllData: jest.fn(),
}));

// Mock defaultWords to provide the loadDefaultWords function
jest.mock('../utils/defaultWords', () => ({
  defaultWords: [
    { id: '1', emoji: '🍎', english: 'apple', hebrew: 'תפוח', level: 1 },
    { id: '2', emoji: '🍌', english: 'banana', hebrew: 'בננה', level: 1 },
  ],
  loadDefaultWords: jest.fn(() => [
    { id: '1', emoji: '🍎', english: 'apple', hebrew: 'תפוח', level: 1 },
    { id: '2', emoji: '🍌', english: 'banana', hebrew: 'בננה', level: 1 },
  ])
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <AppProvider>
      {component}
    </AppProvider>
  );
};

describe('App Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    renderWithProvider(<App />);
    expect(document.body).toBeInTheDocument();
  });

  it('should render the header', () => {
    renderWithProvider(<App />);
    expect(screen.getByText('English Flashcards')).toBeInTheDocument();
  });

  it('should show welcome message when no user is selected', () => {
    renderWithProvider(<App />);
    expect(screen.getByText(/Welcome!/)).toBeInTheDocument();
  });

  it('should have proper document structure', () => {
    renderWithProvider(<App />);
    const appContainer = document.querySelector('.app');
    expect(appContainer).toBeInTheDocument();
  });

  it('should show management buttons', () => {
    renderWithProvider(<App />);
    expect(screen.getByText('👤 Manage Profiles')).toBeInTheDocument();
    expect(screen.getByText('📝 Manage Words')).toBeInTheDocument();
  });

  it('should show get started button when no user is logged in', () => {
    renderWithProvider(<App />);
    expect(screen.getByText('🚀 Get Started')).toBeInTheDocument();
  });
}); 