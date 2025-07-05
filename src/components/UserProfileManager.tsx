import React, { useState } from 'react';
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
    <div className="user-profile-manager">
      <div className="profile-manager-header">
        <h2>👤 User Profiles</h2>
        {onClose && (
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close profile manager"
          >
            ✕
          </button>
        )}
      </div>

      {/* Current User Display */}
      {state.currentUser && (
        <div className="current-user-section">
          <h3>Current User</h3>
          <div className="current-user-card">
            <div className="user-info">
              <span className="user-emoji">👤</span>
              <div>
                <strong>{state.currentUser.username}</strong>
                <p>Level {state.currentUser.progress.currentLevel} • {state.currentUser.progress.completedLevels.length} levels completed</p>
              </div>
            </div>
            <div className="user-actions">
              <button 
                className="reset-button"
                onClick={() => handleResetProgress(state.currentUser!.id)}
                title="Reset progress"
              >
                🔄
              </button>
              <button 
                className="delete-button"
                onClick={() => handleDeleteUser(state.currentUser!.id)}
                title="Delete profile"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Users List */}
      {state.users.length > 0 && (
        <div className="all-users-section">
          <h3>All Profiles ({state.users.length})</h3>
          <div className="users-list">
            {state.users.map(user => (
              <div 
                key={user.id} 
                className={`user-card ${state.currentUser?.id === user.id ? 'current' : ''}`}
              >
                <div className="user-info" onClick={() => handleSwitchUser(user)}>
                  <span className="user-emoji">👤</span>
                  <div>
                    <strong>{user.username}</strong>
                    <p>Level {user.progress.currentLevel} • {user.progress.completedLevels.length} completed</p>
                  </div>
                  {state.currentUser?.id === user.id && (
                    <span className="current-badge">Current</span>
                  )}
                </div>
                <div className="user-actions">
                  <button 
                    className="reset-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResetProgress(user.id);
                    }}
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
                    title="Delete profile"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create New User Section */}
      <div className="create-user-section">
        <h3>Create New Profile</h3>
        
        {!isCreating ? (
          <button 
            className="create-profile-button"
            onClick={() => setIsCreating(true)}
          >
            ➕ Add New Profile
          </button>
        ) : (
          <form onSubmit={handleCreateUser} className="create-user-form">
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Enter username..."
                maxLength={30}
                autoFocus
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-actions">
              <button type="submit" className="create-button">
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
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Empty State */}
      {state.users.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">👤</div>
          <h3>No Profiles Yet</h3>
          <p>Create your first profile to start learning English vocabulary!</p>
        </div>
      )}
    </div>
  );
};

export default UserProfileManager; 