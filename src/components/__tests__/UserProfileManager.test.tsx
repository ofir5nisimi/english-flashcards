import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppProvider } from '../../context/AppContext';
import UserProfileManager from '../UserProfileManager';

// Mock the localStorage utility
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

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <AppProvider>
      {component}
    </AppProvider>
  );
};

describe('UserProfileManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the main interface initially', () => {
    renderWithProvider(<UserProfileManager />);
    
    expect(screen.getByText('👤 User Profiles')).toBeInTheDocument();
    expect(screen.getByText('Create New Profile')).toBeInTheDocument();
    expect(screen.getByText('➕ Add New Profile')).toBeInTheDocument();
  });

  it('should show empty state when no profiles exist', () => {
    renderWithProvider(<UserProfileManager />);
    
    expect(screen.getByText('No Profiles Yet')).toBeInTheDocument();
    expect(screen.getByText('Create your first profile to start learning English vocabulary!')).toBeInTheDocument();
  });

  it('should render with correct CSS classes', () => {
    renderWithProvider(<UserProfileManager />);
    
    const container = document.querySelector('.user-profile-manager');
    expect(container).toBeInTheDocument();
    
    const header = document.querySelector('.profile-manager-header');
    expect(header).toBeInTheDocument();
    
    const createSection = document.querySelector('.create-user-section');
    expect(createSection).toBeInTheDocument();
  });

  it('should have accessible add new profile button', () => {
    renderWithProvider(<UserProfileManager />);
    
    const addButton = screen.getByText('➕ Add New Profile');
    expect(addButton).toBeInTheDocument();
    expect(addButton.tagName).toBe('BUTTON');
  });
}); 