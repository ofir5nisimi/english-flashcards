import React, { useState, useEffect, useRef } from 'react'
import { useAppContext, Word } from '../context/AppContext'
import { shuffleArray } from '../utils/arrayUtils'
import './Flashcard.css'

interface FlashcardProps {
  level: number
  onBack: () => void
  onClose: () => void
}

const Flashcard: React.FC<FlashcardProps> = ({ level, onBack, onClose }) => {
  const { state } = useAppContext()
  const [isFlipped, setIsFlipped] = useState(false)
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [levelWords, setLevelWords] = useState<Word[]>([])
  const [speechReady, setSpeechReady] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const speechInitialized = useRef(false)

  // Initialize speech synthesis and load voices
  useEffect(() => {
    if ('speechSynthesis' in window && !speechInitialized.current) {
      speechInitialized.current = true
      
      const initializeSpeech = () => {
        // Load voices
        const voices = speechSynthesis.getVoices()
        if (voices.length > 0) {
          setSpeechReady(true)
        }
      }

      // Check if voices are already loaded
      initializeSpeech()
      
      // Listen for voices changed event (some browsers load voices asynchronously)
      speechSynthesis.onvoiceschanged = initializeSpeech
      
      // Fallback: set ready after a delay even if no voices event fired
      setTimeout(() => setSpeechReady(true), 1000)
    }
  }, [])

  // Get words for current level (cumulative - includes all words from level 1 to current level)
  useEffect(() => {
    const wordsForLevel = state.words.filter(word => word.level <= level)
    const shuffledWords = shuffleArray(wordsForLevel)
    setLevelWords(shuffledWords)
    setCurrentWordIndex(0)
    setIsFlipped(false)
    setHasPlayedAudio(false)
  }, [level, state.words])

  const currentWord = levelWords[currentWordIndex]

  const handleCardClick = () => {
    if (!isFlipped) {
      setIsFlipped(true)
      if (!hasPlayedAudio) {
        // Play audio after flip animation with retry logic
        setTimeout(() => {
          speakWordWithRetry()
          setHasPlayedAudio(true)
        }, 400) // Slightly longer delay for smoother experience
      }
    } else {
      setIsFlipped(false)
      setHasPlayedAudio(false)
    }
  }

  const speakWord = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window) || !currentWord) {
        resolve(false)
        return
      }

      try {
        // Cancel any ongoing speech
        speechSynthesis.cancel()
        
        // Wait a brief moment for cancel to complete
        setTimeout(() => {
          const utterance = new SpeechSynthesisUtterance(currentWord.english)
          utterance.lang = 'en-US'
          utterance.rate = 0.8
          utterance.volume = 1.0
          
          // Add event handlers
          utterance.onstart = () => {
            console.log('Speech started successfully')
            resolve(true)
          }
          
          utterance.onerror = (event) => {
            console.error('Speech error:', event.error)
            resolve(false)
          }
          
          utterance.onend = () => {
            console.log('Speech ended')
          }
          
          // Attempt to speak
          speechSynthesis.speak(utterance)
          
          // Fallback timeout in case events don't fire
          setTimeout(() => resolve(true), 100)
        }, 50)
      } catch (error) {
        console.error('Speech synthesis error:', error)
        resolve(false)
      }
    })
  }

  const speakWordWithRetry = async () => {
    if (!speechReady) {
      console.log('Speech not ready yet, waiting...')
      // Wait a bit and try again
      setTimeout(() => speakWordWithRetry(), 500)
      return
    }

    const success = await speakWord()
    
    if (!success) {
      console.log('First speech attempt failed, retrying...')
      // Retry once after a short delay
      setTimeout(async () => {
        await speakWord()
      }, 200)
    }
  }

  const nextWord = () => {
    if (currentWordIndex < levelWords.length - 1 && !isTransitioning) {
      setIsTransitioning(true)
      // Instantly reset state and change word - no animations
      setIsFlipped(false)
      setHasPlayedAudio(false)
      setCurrentWordIndex(currentWordIndex + 1)
      // Use requestAnimationFrame to ensure state updates are applied
      requestAnimationFrame(() => {
        setIsTransitioning(false)
      })
    }
  }

  const previousWord = () => {
    if (currentWordIndex > 0 && !isTransitioning) {
      setIsTransitioning(true)
      // Instantly reset state and change word - no animations
      setIsFlipped(false)
      setHasPlayedAudio(false)
      setCurrentWordIndex(currentWordIndex - 1)
      // Use requestAnimationFrame to ensure state updates are applied
      requestAnimationFrame(() => {
        setIsTransitioning(false)
      })
    }
  }

  if (!currentWord) {
    return (
      <div className="flashcard-container">
        <div className="no-words-message">
          <h2>No words available for Level {level}</h2>
          <p>Add some words to this level to start learning!</p>
          <button className="back-button" onClick={onBack}>
            ← Back to Levels
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flashcard-container">
      <div className="flashcard-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Levels
        </button>
        <div className="progress-info">
          <span>Level {level}</span>
          <span>{currentWordIndex + 1} / {levelWords.length}</span>
        </div>
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
      </div>

      <div 
        className={`flashcard ${isFlipped ? 'flipped' : ''} ${isTransitioning ? 'transitioning' : ''}`}
        onClick={handleCardClick}
        tabIndex={0}
        role="button"
        aria-label={isFlipped ? `English word: ${currentWord.english}` : `Emoji: ${currentWord.emoji}, Hebrew: ${currentWord.hebrew}. Click to reveal English word.`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleCardClick()
          }
        }}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <div className="flashcard-emoji">{currentWord.emoji}</div>
            <div className="flashcard-hebrew">{currentWord.hebrew}</div>
                         <div className="flashcard-hint">לחץ כדי לגלות את המילה באנגלית</div>
          </div>
          
          <div className="flashcard-back">
            <div className="flashcard-emoji">{currentWord.emoji}</div>
            <div className="flashcard-english">{currentWord.english}</div>
            <div className="audio-controls">
              <button 
                className="replay-button"
                onClick={(e) => {
                  e.stopPropagation()
                  speakWordWithRetry()
                }}
                aria-label="Replay pronunciation"
              >
                🔊 Play Again
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="navigation-controls">
        <button 
          className="nav-button"
          onClick={previousWord}
          disabled={currentWordIndex === 0 || isTransitioning}
          aria-label="Previous word"
        >
          ← Previous
        </button>
        
        <div className="word-counter">
          {currentWordIndex + 1} of {levelWords.length}
        </div>
        
        <button 
          className="nav-button"
          onClick={nextWord}
          disabled={currentWordIndex === levelWords.length - 1 || isTransitioning}
          aria-label="Next word"
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default Flashcard 