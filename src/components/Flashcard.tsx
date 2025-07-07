import React, { useState, useEffect, useRef } from 'react'
import { useAppContext, Word } from '../context/AppContext'
import { shuffleArray } from '../utils/arrayUtils'
import { useScreenReader } from '../hooks/useScreenReader'
import './Flashcard.css'

interface FlashcardProps {
  level: number
  onBack: () => void
  onClose: () => void
  onQuizSelect: (level: number) => void
}

const Flashcard: React.FC<FlashcardProps> = ({ level, onBack, onClose, onQuizSelect }) => {
  const { state } = useAppContext()
  const { announce, cleanup } = useScreenReader()
  const [isFlipped, setIsFlipped] = useState(false)
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [levelWords, setLevelWords] = useState<Word[]>([])
  const [speechReady, setSpeechReady] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const speechInitialized = useRef(false)
  
  // Focus management refs
  const flashcardRef = useRef<HTMLDivElement>(null)
  const backButtonRef = useRef<HTMLButtonElement>(null)

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

  // Focus management when component mounts
  useEffect(() => {
    if (backButtonRef.current) {
      backButtonRef.current.focus()
    }
    
    // Announce initial state
    announce(`Starting flashcard study for Level ${level}. Use arrow keys to navigate between cards, Enter or Space to flip cards.`)
    
    // Cleanup screen reader on unmount
    return () => {
      cleanup()
    }
  }, [level, announce, cleanup])

  // Focus management when word changes
  useEffect(() => {
    if (flashcardRef.current && !isTransitioning && currentWordIndex > 0) {
      // Announce the new word to screen readers
      const currentWord = levelWords[currentWordIndex]
      if (currentWord) {
        announce(`Card ${currentWordIndex + 1} of ${levelWords.length}. Emoji: ${currentWord.emoji}, Hebrew: ${currentWord.hebrew}`)
      }
    }
  }, [currentWordIndex, isTransitioning, levelWords, announce])

  const currentWord = levelWords[currentWordIndex]

  const handleCardClick = () => {
    if (!isFlipped) {
      setIsFlipped(true)
      announce(`Card flipped. English word: ${currentWord.english}`)
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
      announce(`Card flipped back. Showing emoji: ${currentWord.emoji} and Hebrew: ${currentWord.hebrew}`)
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

  // Add keyboard navigation support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault()
        nextWord()
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault()
        previousWord()
        break
      case 'r':
      case 'R':
        if (isFlipped && speechReady) {
          e.preventDefault()
          speakWordWithRetry()
        }
        break
      case 'Escape':
        e.preventDefault()
        onClose()
        break
    }
  }

  if (!currentWord) {
    return (
      <main className="flashcard-container" onKeyDown={handleKeyDown}>
        <section className="no-words-message">
          <h2>No words available for Level {level}</h2>
          <p>Add some words to this level to start learning!</p>
          <button className="back-button" onClick={onBack} ref={backButtonRef}>
            ← Back to Levels
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="flashcard-container" onKeyDown={handleKeyDown}>
      <header className="flashcard-header">
        <button className="back-button" onClick={onBack} aria-label="Go back to level selector" ref={backButtonRef}>
          ← Back to Levels
        </button>
        <div className="progress-info" role="status" aria-label={`Currently studying Level ${level}, viewing word ${currentWordIndex + 1} of ${levelWords.length}`}>
          <span>Level {level}</span>
          <span>{currentWordIndex + 1} / {levelWords.length}</span>
        </div>
        <button className="close-button" onClick={onClose} aria-label="Close flashcard study mode">
          ✕
        </button>
      </header>

      <section className="flashcard-study-area">
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
          ref={flashcardRef}
        >
          <div className="flashcard-inner">
            <div className="flashcard-front">
              <div className="flashcard-emoji" role="img" aria-label={`Emoji: ${currentWord.emoji}`}>{currentWord.emoji}</div>
              <div className="flashcard-hebrew" lang="he">{currentWord.hebrew}</div>
              <div className="flashcard-hint" lang="he">לחץ כדי לגלות את המילה באנגלית</div>
            </div>
            
            <div className="flashcard-back">
              <div className="flashcard-emoji" role="img" aria-label={`Emoji: ${currentWord.emoji}`}>{currentWord.emoji}</div>
              <div className="flashcard-english" lang="en">{currentWord.english}</div>
              <div className="audio-controls">
                <button 
                  className="replay-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    speakWordWithRetry()
                  }}
                  aria-label={`Replay pronunciation of ${currentWord.english}`}
                >
                  🔊 Play Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav className="navigation-controls" aria-label="Flashcard navigation">
        <button 
          className="nav-button"
          onClick={previousWord}
          disabled={currentWordIndex === 0 || isTransitioning}
          aria-label="Go to previous word"
        >
          ← Previous
        </button>
        
        <div className="word-counter" role="status" aria-live="polite">
          {currentWordIndex + 1} of {levelWords.length}
        </div>
        
        <button 
          className="nav-button"
          onClick={nextWord}
          disabled={currentWordIndex === levelWords.length - 1 || isTransitioning}
          aria-label="Go to next word"
        >
          Next →
        </button>
      </nav>

      {/* Quiz Access Section */}
      <section className="quiz-access" aria-labelledby="quiz-section-heading">
        {levelWords.length >= 4 ? (
          <div className="quiz-section">
            <h3 id="quiz-section-heading">Ready for a Quiz?</h3>
            <p>Test your knowledge of Level {level} words with a multiple-choice quiz!</p>
            <button 
              className="quiz-access-button"
              onClick={() => onQuizSelect(level)}
              aria-label={`Take quiz for Level ${level}`}
            >
              🧠 Take Level {level} Quiz
            </button>
          </div>
        ) : (
          <div className="quiz-unavailable">
            <h3 id="quiz-section-heading">Quiz Not Available</h3>
            <p>Quiz will be available when this level has at least 4 words.</p>
            <p>Current words: {levelWords.length}/4</p>
          </div>
        )}
      </section>
    </main>
  )
}

export default Flashcard 