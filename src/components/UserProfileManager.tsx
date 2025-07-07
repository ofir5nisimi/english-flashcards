import React, { useState, useEffect, useRef } from 'react';
import { useAppContext, User } from '../context/AppContext';
import { generateUserId } from '../utils/localStorage';
import './UserProfileManager.css';

interface UserProfileManagerProps {
  onClose?: () => void;
}

const UserProfileManager: React.FC<UserProfileManagerProps> = ({ onClose }) => {
  const { state, dispatch } = useAppContext();
  const [newUsername, setNewUsername] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  
  // Focus management refs
  const containerRef = useRef<HTMLElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const usernameInputRef = useRef<HTMLInputElement>(null);

  // Focus management effect
  useEffect(() => {
    // Focus the first focusable element when component mounts
    if (firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }

    // Trap focus within the component
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const container = containerRef.current;
        if (!container) return;

        const focusableElements = container.querySelectorAll(
          'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Focus username input when creating mode is activated
  useEffect(() => {
    if (isCreating && usernameInputRef.current) {
      usernameInputRef.current.focus();
    }
  }, [isCreating]);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newUsername.trim()) {
      setError('Username cannot be empty');
      return;
    }

    if (newUsername.trim().length < 2) {
      setError('Username must be at least 2 characters long');
      return;
    }

    // Check if username already exists
    if (state.users.some(user => user.username.toLowerCase() === newUsername.trim().toLowerCase())) {
      setError('Username already exists');
      return;
    }

    const newUser: User = {
      id: generateUserId(),
      username: newUsername.trim(),
      progress: {
        completedLevels: [],
        currentLevel: 1,
      },
      quizResults: {},
    };

    dispatch({ type: 'ADD_USER', payload: newUser });
    dispatch({ type: 'SET_CURRENT_USER', payload: newUser });
    
    setNewUsername('');
    setIsCreating(false);
    
    if (onClose) {
      onClose();
    }
  };

  const handleSwitchUser = (user: User) => {
    dispatch({ type: 'SET_CURRENT_USER', payload: user });
    if (onClose) {
      onClose();
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this profile? This action cannot be undone.')) {
      dispatch({ type: 'DELETE_USER', payload: userId });
    }
  };

  const handleResetProgress = (userId: string) => {
    if (window.confirm('Are you sure you want to reset all progress for this profile? This action cannot be undone.')) {
      dispatch({ type: 'RESET_USER_PROGRESS', payload: userId });
    }
  };

  return (
    <main className="user-profile-manager" ref={containerRef}>
      <header className="profile-manager-header">
        <h2>👤 User Profiles</h2>
        {onClose && (
          <button 
            ref={firstFocusableRef}
            className="close-button" 
            onClick={onClose}
            aria-label="Close profile manager"
          >
            ✕
          </button>
        )}
      </header>

      {/* Current User Display */}
      {state.currentUser && (
        <section className="current-user-section" aria-labelledby="current-user-heading">
          <h3 id="current-user-heading">Current User</h3>
          <div className="current-user-card" role="group" aria-labelledby="current-user-heading">
            <div className="user-info">
              <span className="user-emoji" role="img" aria-label="User icon">👤</span>
              <div>
                <strong>{state.currentUser.username}</strong>
                <p>Level {state.currentUser.progress.currentLevel} • {state.currentUser.progress.completedLevels.length} levels completed</p>
              </div>
            </div>
            <div className="user-actions" role="group" aria-label={`Actions for ${state.currentUser.username}`}>
              <button 
                className="reset-button"
                onClick={() => handleResetProgress(state.currentUser!.id)}
                aria-label={`Reset progress for ${state.currentUser.username}`}
                title="Reset progress"
              >
                🔄
              </button>
              <button 
                className="delete-button"
                onClick={() => handleDeleteUser(state.currentUser!.id)}
                aria-label={`Delete profile for ${state.currentUser.username}`}
                title="Delete profile"
              >
                🗑️
              </button>
            </div>
          </div>
        </section>
      )}

      {/* All Users List */}
      {state.users.length > 0 && (
        <section className="all-users-section" aria-labelledby="all-users-heading">
          <h3 id="all-users-heading">All Profiles ({state.users.length})</h3>
          <div className="users-list" role="list" aria-label="List of all user profiles">
            {state.users.map(user => (
              <article 
                key={user.id} 
                className={`user-card ${state.currentUser?.id === user.id ? 'current' : ''}`}
                role="listitem"
              >
                <div 
                  className="user-info" 
                  onClick={() => handleSwitchUser(user)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Switch to ${user.username} profile`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSwitchUser(user);
                    }
                  }}
                >
                  <span className="user-emoji" role="img" aria-label="User icon">👤</span>
                  <div>
                    <strong>{user.username}</strong>
                    <p>Level {user.progress.currentLevel} • {user.progress.completedLevels.length} completed</p>
                  </div>
                  {state.currentUser?.id === user.id && (
                    <span className="current-badge" aria-label="Currently selected user">Current</span>
                  )}
                </div>
                <div className="user-actions" role="group" aria-label={`Actions for ${user.username}`}>
                  <button 
                    className="reset-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResetProgress(user.id);
                    }}
                    aria-label={`Reset progress for ${user.username}`}
                    title="Reset progress"
                  >
                    🔄
                  </button>
                  <button 
                    className="delete-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteUser(user.id);
                    }}
                    aria-label={`Delete profile for ${user.username}`}
                    title="Delete profile"
                  >
                    🗑️
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Create New User Section */}
      <section className="create-user-section" aria-labelledby="create-user-heading">
        <h3 id="create-user-heading">Create New Profile</h3>
        
        {!isCreating ? (
          <button 
            ref={!onClose ? firstFocusableRef : undefined}
            className="create-profile-button"
            onClick={() => setIsCreating(true)}
            aria-label="Start creating a new user profile"
          >
            ➕ Add New Profile
          </button>
        ) : (
          <form onSubmit={handleCreateUser} className="create-user-form" aria-labelledby="create-user-heading">
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                ref={usernameInputRef}
                id="username"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter username..."
                maxLength={30}
                aria-describedby="username-requirements"
                aria-invalid={error ? 'true' : 'false'}
              />
              <div id="username-requirements" className="input-help">
                Username must be at least 2 characters long and unique.
              </div>
            </div>
            
            {error && (
              <div className="error-message" role="alert" aria-live="polite">
                {error}
              </div>
            )}
            
            <div className="form-actions">
              <button type="submit" className="create-button" aria-label="Create new user profile">
                Create Profile
              </button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => {
                  setIsCreating(false);
                  setNewUsername('');
                  setError('');
                }}
                aria-label="Cancel profile creation"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Empty State */}
      {state.users.length === 0 && (
        <section className="empty-state">
          <div className="empty-state-icon" role="img" aria-label="User icon">👤</div>
          <h3>No Profiles Yet</h3>
          <p>Create your first profile to start learning English vocabulary!</p>
        </section>
      )}
    </main>
  );
};

export default UserProfileManager; 