import { useState } from 'react'
import { useAppContext } from './context/AppContext'
import { useLocalStorage } from './hooks/useLocalStorage'
import UserProfileManager from './components/UserProfileManager'
import Flashcard from './components/Flashcard'
import './App.css'

function App() {
  const { state } = useAppContext()
  const { clearAllData } = useLocalStorage()
  const [showProfileManager, setShowProfileManager] = useState(false)
  const [showLearningMode, setShowLearningMode] = useState(false)

  const handleGetStarted = () => {
    if (state.currentUser) {
      // User is already logged in, show flashcard learning
      setShowLearningMode(true)
    } else {
      // No user selected, show profile manager
      setShowProfileManager(true)
    }
  }

  const handleManageProfiles = () => {
    setShowProfileManager(true)
  }

  const handleCloseProfileManager = () => {
    setShowProfileManager(false)
  }

  const handleCloseLearningMode = () => {
    setShowLearningMode(false)
  }

  if (showProfileManager) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>English Flashcards</h1>
          <p>Learn English vocabulary through emoji-based flashcards</p>
        </header>
        
        <main className="app-main">
          <UserProfileManager onClose={handleCloseProfileManager} />
        </main>
        
        <footer className="app-footer">
          <p>© 2024 English Flashcards - Learn English with Fun!</p>
        </footer>
      </div>
    )
  }

  if (showLearningMode) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>English Flashcards</h1>
          <p>Learning Session - {state.currentUser?.username}</p>
          <button 
            className="back-button"
            onClick={handleCloseLearningMode}
          >
            ← Back to Dashboard
          </button>
        </header>
        
        <main className="app-main">
          <Flashcard emoji="🍎" hebrew="תפוח" english="Apple" />
        </main>
        
        <footer className="app-footer">
          <p>© 2024 English Flashcards - Learn English with Fun!</p>
        </footer>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>English Flashcards</h1>
        <p>Learn English vocabulary through emoji-based flashcards</p>
        
        {/* User Status Bar */}
        <div className="user-status-bar">
          {state.currentUser ? (
            <div className="current-user-info">
              <span className="user-greeting">
                👋 Welcome back, <strong>{state.currentUser.username}</strong>!
              </span>
              <span className="user-progress">
                Level {state.currentUser.progress.currentLevel} • {state.currentUser.progress.completedLevels.length} completed
              </span>
              <button 
                className="manage-profiles-button"
                onClick={handleManageProfiles}
                title="Manage Profiles"
              >
                👤 Manage Profiles
              </button>
            </div>
          ) : (
            <div className="no-user-info">
              <span>No user selected</span>
              <button 
                className="select-user-button"
                onClick={handleManageProfiles}
              >
                👤 Select User
              </button>
            </div>
          )}
        </div>
      </header>
      
      <main className="app-main">
        <div className="welcome-section">
          <h2>Welcome to English Flashcards! 🎯</h2>
          <p>
            Master English vocabulary with our interactive flashcard system. 
            Each card features an emoji, Hebrew translation, and pronunciation to help you learn effectively.
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-emoji">👤</span>
              <h3>User Profiles</h3>
              <p>Create and manage multiple local profiles</p>
              <div className="feature-status">
                {state.users.length > 0 ? (
                  <span className="status-active">✅ {state.users.length} profile(s) created</span>
                ) : (
                  <span className="status-inactive">➕ Create your first profile</span>
                )}
              </div>
            </div>
            
            <div className="feature-card">
              <span className="feature-emoji">🃏</span>
              <h3>Interactive Cards</h3>
              <p>Flip cards to reveal English words with pronunciation</p>
              <div className="feature-status">
                {state.currentUser ? (
                  <span className="status-active">✅ Ready to learn</span>
                ) : (
                  <span className="status-inactive">❌ Select a user first</span>
                )}
              </div>
            </div>
            
            <div className="feature-card">
              <span className="feature-emoji">📊</span>
              <h3>Progress Tracking</h3>
              <p>Track your learning progress through levels</p>
              <div className="feature-status">
                {state.currentUser ? (
                  <span className="status-active">✅ Tracking enabled</span>
                ) : (
                  <span className="status-inactive">❌ Select a user first</span>
                )}
              </div>
            </div>
            
            <div className="feature-card">
              <span className="feature-emoji">🎯</span>
              <h3>Quizzes</h3>
              <p>Test your knowledge with multiple-choice quizzes</p>
              <div className="feature-status">
                <span className="status-coming-soon">🚧 Coming Soon</span>
              </div>
            </div>
          </div>
          
          <div className="action-buttons">
            <button 
              className="primary-button"
              onClick={handleGetStarted}
            >
              {state.currentUser ? 'Continue Learning' : 'Get Started'}
            </button>
            <button 
              className="secondary-button"
              onClick={handleManageProfiles}
            >
              👤 Manage Profiles
            </button>
          </div>

          {/* Debug/Development Actions */}
          <div className="debug-actions">
            <h3>Development Actions</h3>
            <button 
              className="debug-button"
              onClick={() => {
                if (window.confirm('This will clear all data. Are you sure?')) {
                  clearAllData()
                }
              }}
            >
              🗑️ Clear All Data
            </button>
            <div className="debug-info">
              <p>Users: {state.users.length} | Words: {state.words.length}</p>
              <p>Current User: {state.currentUser?.username || 'None'}</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="app-footer">
        <p>© 2024 English Flashcards - Learn English with Fun!</p>
      </footer>
    </div>
  )
}

export default App 