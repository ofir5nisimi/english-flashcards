import { useState, useEffect } from 'react'
import { useAppContext } from './context/AppContext'
import { useLocalStorage } from './hooks/useLocalStorage'
import { loadDefaultWords } from './utils/defaultWords'
import UserProfileManager from './components/UserProfileManager'
import WordListManager from './components/WordListManager'
import LevelSelector from './components/LevelSelector'
import Flashcard from './components/Flashcard'
import Quiz from './components/Quiz'
import './App.css'

function App() {
  const { state, dispatch } = useAppContext()
  const { clearAllData } = useLocalStorage()
  const [showProfileManager, setShowProfileManager] = useState(false)
  const [showWordManager, setShowWordManager] = useState(false)
  const [showLevelSelector, setShowLevelSelector] = useState(false)
  const [showLearningMode, setShowLearningMode] = useState(false)
  const [showQuizMode, setShowQuizMode] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<number>(1)

  // Load default words if no words exist
  useEffect(() => {
    if (state.words.length === 0) {
      const defaultWords = loadDefaultWords();
      dispatch({ type: 'SET_WORDS', payload: defaultWords });
    }
  }, [state.words.length, dispatch]);

  const handleGetStarted = () => {
    if (state.currentUser) {
      // User is already logged in, show level selector
      setShowLevelSelector(true)
    } else {
      // No user selected, show profile manager
      setShowProfileManager(true)
    }
  }

  const handleContinueLearning = () => {
    if (state.currentUser) {
      setShowLevelSelector(true)
    } else {
      setShowProfileManager(true)
    }
  }

  const handleManageProfiles = () => {
    setShowProfileManager(true)
  }

  const handleManageWords = () => {
    setShowWordManager(true)
  }

  const handleCloseProfileManager = () => {
    setShowProfileManager(false)
  }

  const handleCloseWordManager = () => {
    setShowWordManager(false)
  }

  const handleCloseLevelSelector = () => {
    setShowLevelSelector(false)
  }

  const handleLevelSelect = (level: number) => {
    setSelectedLevel(level)
    setShowLevelSelector(false)
    setShowLearningMode(true)
    // Update current level in user progress
    if (state.currentUser) {
      const newProgress = {
        ...state.currentUser.progress,
        currentLevel: level
      }
      dispatch({
        type: 'UPDATE_USER_PROGRESS',
        payload: { userId: state.currentUser.id, progress: newProgress }
      })
    }
  }

  const handleCloseLearningMode = () => {
    setShowLearningMode(false)
  }

  const handleBackToLevels = () => {
    setShowLearningMode(false)
    setShowLevelSelector(true)
  }

  const handleQuizSelect = (level: number) => {
    setSelectedLevel(level)
    setShowLevelSelector(false)
    setShowQuizMode(true)
  }

  const handleQuizComplete = (score: number, passed: boolean) => {
    if (state.currentUser) {
      dispatch({
        type: 'UPDATE_QUIZ_RESULT',
        payload: {
          userId: state.currentUser.id,
          level: selectedLevel,
          score,
          passed
        }
      })
    }
  }

  const handleCloseQuizMode = () => {
    setShowQuizMode(false)
  }

  const handleBackToLevelsFromQuiz = () => {
    setShowQuizMode(false)
    setShowLevelSelector(true)
  }

  // Show profile manager
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

  // Show word manager
  if (showWordManager) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>English Flashcards</h1>
          <p>Manage your vocabulary words and levels</p>
        </header>
        
        <main className="app-main">
          <WordListManager onClose={handleCloseWordManager} />
        </main>
        
        <footer className="app-footer">
          <p>© 2024 English Flashcards - Learn English with Fun!</p>
        </footer>
      </div>
    )
  }

  // Show level selector
  if (showLevelSelector) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>English Flashcards</h1>
          <p>Choose your learning level</p>
        </header>
        
        <main className="app-main">
          <LevelSelector 
            onLevelSelect={handleLevelSelect} 
            onQuizSelect={handleQuizSelect}
            onClose={handleCloseLevelSelector} 
          />
        </main>
        
        <footer className="app-footer">
          <p>© 2024 English Flashcards - Learn English with Fun!</p>
        </footer>
      </div>
    )
  }

  // Show quiz mode
  if (showQuizMode) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>English Flashcards</h1>
          <p>Level {selectedLevel} - Quiz Mode</p>
        </header>
        
        <main className="app-main">
          <Quiz 
            level={selectedLevel} 
            onComplete={handleQuizComplete}
            onBack={handleBackToLevelsFromQuiz}
          />
        </main>
        
        <footer className="app-footer">
          <p>© 2024 English Flashcards - Learn English with Fun!</p>
        </footer>
      </div>
    )
  }

  // Show learning mode (flashcards)
  if (showLearningMode) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>English Flashcards</h1>
          <p>Level {selectedLevel} - Learning Mode</p>
        </header>
        
        <main className="app-main">
          <Flashcard 
            level={selectedLevel} 
            onBack={handleBackToLevels}
            onClose={handleCloseLearningMode}
            onQuizSelect={handleQuizSelect}
          />
        </main>
        
        <footer className="app-footer">
          <p>© 2024 English Flashcards - Learn English with Fun!</p>
        </footer>
      </div>
    )
  }

  // Main homepage
  return (
    <div className="app">
      <header className="app-header">
        <h1>English Flashcards</h1>
        <p>Learn English vocabulary through emoji-based flashcards</p>
      </header>
      
      <main className="app-main">
        <div className="welcome-section">
          <h2>Welcome{state.currentUser ? `, ${state.currentUser.username}` : ''}!</h2>
          <p>Start your English learning journey with interactive flashcards.</p>
          
          <div className="action-buttons">
            <button 
              className="primary-button"
              onClick={handleGetStarted}
            >
              {state.currentUser ? '📚 Continue Learning' : '🚀 Get Started'}
            </button>
            
            {state.currentUser && (
              <button 
                className="secondary-button"
                onClick={handleContinueLearning}
              >
                📊 Choose Level
              </button>
            )}
          </div>

          <div className="management-section">
            <h3>Management</h3>
            <div className="management-buttons">
              <button 
                className="management-button"
                onClick={handleManageProfiles}
              >
                👤 Manage Profiles
              </button>
              
              <button 
                className="management-button"
                onClick={handleManageWords}
              >
                📝 Manage Words
              </button>
            </div>
          </div>

          {state.currentUser && (
            <div className="user-stats">
              <h3>Your Progress</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-number">{state.currentUser.progress.completedLevels.length}</span>
                  <span className="stat-label">Completed Levels</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{state.currentUser.progress.currentLevel}</span>
                  <span className="stat-label">Current Level</span>
                </div>
                <div className="stat-card">
                  <span className="stat-number">{state.words.length}</span>
                  <span className="stat-label">Total Words</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="debug-section">
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