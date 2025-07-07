import React, { useState, useEffect, Suspense } from 'react'
import { useAppContext } from './context/AppContext'
import { useLocalStorage } from './hooks/useLocalStorage'
import { loadDefaultWords } from './utils/defaultWords'
import './App.css'

// Lazy load components that are not immediately needed
const UserProfileManager = React.lazy(() => import('./components/UserProfileManager'))
const WordListManager = React.lazy(() => import('./components/WordListManager'))
const LevelSelector = React.lazy(() => import('./components/LevelSelector'))
const Flashcard = React.lazy(() => import('./components/Flashcard'))
const Quiz = React.lazy(() => import('./components/Quiz'))
const ExportImport = React.lazy(() => import('./components/ExportImport'))

// Loading component for suspense
const LoadingFallback = () => (
  <div className="loading-fallback">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
)

function App() {
  const { state, dispatch } = useAppContext()
  const { clearAllData } = useLocalStorage()
  const [showProfileManager, setShowProfileManager] = useState(false)
  const [showWordManager, setShowWordManager] = useState(false)
  const [showLevelSelector, setShowLevelSelector] = useState(false)
  const [showLearningMode, setShowLearningMode] = useState(false)
  const [showQuizMode, setShowQuizMode] = useState(false)
  const [showExportImport, setShowExportImport] = useState(false)
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

  const handleManageExportImport = () => {
    setShowExportImport(true)
  }

  const handleCloseProfileManager = () => {
    setShowProfileManager(false)
  }

  const handleCloseWordManager = () => {
    setShowWordManager(false)
  }

  const handleCloseExportImport = () => {
    setShowExportImport(false)
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
        <a href="#main-content" className="skip-link">Skip to main content</a>
        
        <header className="app-header">
          <h1>English Flashcards</h1>
          <p>Learn English vocabulary through emoji-based flashcards</p>
        </header>
        
        <main className="app-main" id="main-content">
          <Suspense fallback={<LoadingFallback />}>
            <UserProfileManager onClose={handleCloseProfileManager} />
          </Suspense>
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
        <a href="#main-content" className="skip-link">Skip to main content</a>
        
        <header className="app-header">
          <h1>English Flashcards</h1>
          <p>Manage your vocabulary words and levels</p>
        </header>
        
        <main className="app-main" id="main-content">
          <Suspense fallback={<LoadingFallback />}>
            <WordListManager onClose={handleCloseWordManager} />
          </Suspense>
        </main>
        
        <footer className="app-footer">
          <p>© 2024 English Flashcards - Learn English with Fun!</p>
        </footer>
      </div>
    )
  }

  // Show export/import manager
  if (showExportImport) {
    return (
      <div className="app">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        
        <header className="app-header">
          <h1>English Flashcards</h1>
          <p>Export and import your data for backup and transfer</p>
        </header>
        
        <main className="app-main" id="main-content">
          <Suspense fallback={<LoadingFallback />}>
            <ExportImport onClose={handleCloseExportImport} />
          </Suspense>
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
        <a href="#main-content" className="skip-link">Skip to main content</a>
        
        <header className="app-header">
          <h1>English Flashcards</h1>
          <p>Choose your learning level</p>
        </header>
        
        <main className="app-main" id="main-content">
          <Suspense fallback={<LoadingFallback />}>
            <LevelSelector 
              onLevelSelect={handleLevelSelect} 
              onQuizSelect={handleQuizSelect}
              onClose={handleCloseLevelSelector} 
            />
          </Suspense>
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
        <a href="#main-content" className="skip-link">Skip to main content</a>
        
        <header className="app-header">
          <h1>English Flashcards</h1>
          <p>Level {selectedLevel} - Quiz Mode</p>
        </header>
        
        <main className="app-main" id="main-content">
          <Suspense fallback={<LoadingFallback />}>
            <Quiz 
              level={selectedLevel} 
              onComplete={handleQuizComplete}
              onBack={handleBackToLevelsFromQuiz}
            />
          </Suspense>
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
        <a href="#main-content" className="skip-link">Skip to main content</a>
        
        <header className="app-header">
          <h1>English Flashcards</h1>
          <p>Level {selectedLevel} - Learning Mode</p>
        </header>
        
        <main className="app-main" id="main-content">
          <Suspense fallback={<LoadingFallback />}>
            <Flashcard 
              level={selectedLevel} 
              onBack={handleBackToLevels}
              onClose={handleCloseLearningMode}
              onQuizSelect={handleQuizSelect}
            />
          </Suspense>
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
      <a href="#main-content" className="skip-link">Skip to main content</a>
      
      <header className="app-header">
        <h1>English Flashcards</h1>
        <p>Learn English vocabulary through emoji-based flashcards</p>
      </header>
      
      <main className="app-main" id="main-content">
        <section className="welcome-section">
          <h2>Welcome{state.currentUser ? `, ${state.currentUser.username}` : ''}!</h2>
          <p>Start your English learning journey with interactive flashcards.</p>
          
          <div className="action-buttons">
            <button 
              className="primary-button"
              onClick={handleGetStarted}
              aria-label={state.currentUser ? 'Continue learning with existing profile' : 'Get started with English flashcards'}
            >
              {state.currentUser ? '📚 Continue Learning' : '🚀 Get Started'}
            </button>
            
            {state.currentUser && (
              <button 
                className="secondary-button"
                onClick={handleContinueLearning}
                aria-label="Choose a learning level"
              >
                📊 Choose Level
              </button>
            )}
          </div>

          <section className="management-section">
            <h3>Management</h3>
            <div className="management-buttons">
              <button 
                className="management-button"
                onClick={handleManageProfiles}
                aria-label="Manage user profiles"
              >
                👤 Manage Profiles
              </button>
              
              <button 
                className="management-button"
                onClick={handleManageWords}
                aria-label="Manage vocabulary words and levels"
              >
                📝 Manage Words
              </button>

              <button 
                className="management-button"
                onClick={handleManageExportImport}
                aria-label="Export or import data for backup and transfer"
              >
                💾 Export / Import
              </button>
            </div>
          </section>

          {state.currentUser && (
            <section className="user-stats">
              <h3>Your Progress</h3>
              <div className="stats-grid" role="grid" aria-label="User progress statistics">
                <div className="stat-card" role="gridcell">
                  <span className="stat-number">{state.currentUser.progress.completedLevels.length}</span>
                  <span className="stat-label">Completed Levels</span>
                </div>
                <div className="stat-card" role="gridcell">
                  <span className="stat-number">{state.currentUser.progress.currentLevel}</span>
                  <span className="stat-label">Current Level</span>
                </div>
                <div className="stat-card" role="gridcell">
                  <span className="stat-number">{state.words.length}</span>
                  <span className="stat-label">Total Words</span>
                </div>
              </div>
            </section>
          )}
        </section>

        <aside className="debug-section">
          <div className="debug-actions">
            <h3>Development Actions</h3>
            <button 
              className="debug-button"
              onClick={() => {
                if (window.confirm('This will clear all data. Are you sure?')) {
                  clearAllData()
                }
              }}
              aria-label="Clear all application data - warning: this action cannot be undone"
            >
              🗑️ Clear All Data
            </button>
            <div className="debug-info" role="status" aria-label="Application statistics">
              <p>Users: {state.users.length} | Words: {state.words.length}</p>
              <p>Current User: {state.currentUser?.username || 'None'}</p>
            </div>
          </div>
        </aside>
      </main>
      
      <footer className="app-footer">
        <p>© 2024 English Flashcards - Learn English with Fun!</p>
      </footer>
    </div>
  )
}

export default App 