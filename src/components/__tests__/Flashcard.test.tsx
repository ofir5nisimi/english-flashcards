import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AppProvider } from '../../context/AppContext';
import Flashcard from '../Flashcard';

// Mock the arrayUtils
jest.mock('../../utils/arrayUtils', () => ({
  shuffleArray: jest.fn((arr) => [...arr]), // Return same order for predictable testing
}));

// Mock the localStorage utility with default words
jest.mock('../../utils/localStorage', () => ({
  saveUsers: jest.fn(),
  loadUsers: jest.fn(() => []),
  saveCurrentUser: jest.fn(),
  loadCurrentUser: jest.fn(() => null),
  saveWords: jest.fn(),
  loadWords: jest.fn(() => []),
  generateUserId: jest.fn(() => 'test-id-123'),
  clearAllData: jest.fn(),
}));

// Mock defaultWords to provide test data with loadDefaultWords function
jest.mock('../../utils/defaultWords', () => ({
  defaultWords: [],
  loadDefaultWords: jest.fn(() => [])
}));

const mockProps = {
  level: 1,
  onBack: jest.fn(),
  onClose: jest.fn(),
  onQuizSelect: jest.fn(),
};

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <AppProvider>
      {component}
    </AppProvider>
  );
};

describe('Flashcard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset speech synthesis mocks
    (global.speechSynthesis.speak as jest.Mock).mockClear();
    (global.speechSynthesis.cancel as jest.Mock).mockClear();
  });

  it('should render flashcard container', async () => {
    renderWithProvider(<Flashcard {...mockProps} />);
    
    const container = document.querySelector('.flashcard-container');
    expect(container).toBeInTheDocument();
  });

  it('should show no words message when no words are available', async () => {
    renderWithProvider(<Flashcard {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('No words available for Level 1')).toBeInTheDocument();
      expect(screen.getByText('Add some words to this level to start learning!')).toBeInTheDocument();
    });
  });

  it('should show back button in no words state', async () => {
    renderWithProvider(<Flashcard {...mockProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('← Back to Levels')).toBeInTheDocument();
    });
  });

  it('should call onBack when back button is clicked in no words state', async () => {
    renderWithProvider(<Flashcard {...mockProps} />);
    
    await waitFor(() => {
      const backButton = screen.getByText('← Back to Levels');
      fireEvent.click(backButton);
      expect(mockProps.onBack).toHaveBeenCalledTimes(1);
    });
  });

  it('should render with correct props', () => {
    renderWithProvider(<Flashcard {...mockProps} />);
    
    // Test that component doesn't crash and renders something
    expect(document.querySelector('.flashcard-container')).toBeInTheDocument();
  });

  it('should handle different level props', async () => {
    renderWithProvider(<Flashcard {...mockProps} level={5} />);
    
    await waitFor(() => {
      expect(screen.getByText('No words available for Level 5')).toBeInTheDocument();
    });
  });
}); 