import React from 'react'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>English Flashcards</h1>
        <p>Learn English vocabulary through emoji-based flashcards</p>
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
            </div>
            
            <div className="feature-card">
              <span className="feature-emoji">🃏</span>
              <h3>Interactive Cards</h3>
              <p>Flip cards to reveal English words with pronunciation</p>
            </div>
            
            <div className="feature-card">
              <span className="feature-emoji">📊</span>
              <h3>Progress Tracking</h3>
              <p>Track your learning progress through levels</p>
            </div>
            
            <div className="feature-card">
              <span className="feature-emoji">🎯</span>
              <h3>Quizzes</h3>
              <p>Test your knowledge with multiple-choice quizzes</p>
            </div>
          </div>
          
          <div className="action-buttons">
            <button className="primary-button">Get Started</button>
            <button className="secondary-button">Learn More</button>
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