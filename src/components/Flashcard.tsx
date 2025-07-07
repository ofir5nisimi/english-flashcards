import React, { useState, useEffect } from 'react'
import './Flashcard.css'

interface FlashcardProps {
  emoji: string
  hebrew: string
  english: string
}

const Flashcard: React.FC<FlashcardProps> = ({ emoji, hebrew, english }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  
  // Initialize speech synthesis on component mount
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Load voices
      speechSynthesis.getVoices()
      console.log('Speech synthesis initialized')
      console.log('Available voices:', speechSynthesis.getVoices().length)
    }
  }, [])

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const speakEnglish = () => {
    if ('speechSynthesis' in window) {
      // Stop any currently speaking utterance
      speechSynthesis.cancel()
      
      // Create new utterance
      const utterance = new SpeechSynthesisUtterance(english)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      utterance.volume = 1.0
      
      // Add error handling
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error)
      }
      
      utterance.onstart = () => {
        console.log('Speech started for:', english)
      }
      
      // Small delay to ensure speechSynthesis is ready
      setTimeout(() => {
        speechSynthesis.speak(utterance)
      }, 100)
    } else {
      console.warn('Speech synthesis not supported in this browser')
    }
  }

  // Auto-speak when card flips to English (but only on user interaction)
  useEffect(() => {
    if (isFlipped) {
      // Only auto-speak if the flip was triggered by user interaction
      speakEnglish()
    }
  }, [isFlipped, english])

  return (
    <div className={`flashcard ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <div className="flashcard-emoji">{emoji}</div>
          <div className="flashcard-hebrew">{hebrew}</div>
          <div className="flashcard-hint">Click to reveal</div>
        </div>
        <div className="flashcard-back">
          <div className="flashcard-emoji">{emoji}</div>
          <div className="flashcard-english">{english}</div>
          <div className="audio-controls">
            <button 
              className="replay-button"
              onClick={(e) => {
                e.stopPropagation()
                console.log('Replay button clicked')
                speakEnglish()
              }}
              title="Replay pronunciation"
            >
              🔊 Play
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Flashcard 