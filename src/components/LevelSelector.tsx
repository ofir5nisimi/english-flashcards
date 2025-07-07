import React from 'react';
import { useAppContext, Word } from '../context/AppContext';
import './LevelSelector.css';

interface LevelSelectorProps {
  onLevelSelect: (level: number) => void;
  onQuizSelect: (level: number) => void;
  onClose: () => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ onLevelSelect, onQuizSelect, onClose }) => {
  const { state } = useAppContext();

  // Group words by level
  const wordsByLevel = state.words.reduce((acc, word) => {
    if (!acc[word.level]) {
      acc[word.level] = [];
    }
    acc[word.level].push(word);
    return acc;
  }, {} as Record<number, Word[]>);

  // Calculate available levels (levels that have words)
  const availableLevels = Object.keys(wordsByLevel).map(Number).sort((a, b) => a - b);
  
  // Calculate words per cumulative level (each level includes all previous words + new words)
  const getLevelInfo = (level: number) => {
    const newWordsInLevel = state.words.filter(word => word.level === level).length;
    const totalWordsUpToLevel = state.words.filter(word => word.level <= level).length;
    
    return {
      newWords: newWordsInLevel,
      totalWords: totalWordsUpToLevel
    };
  };

  // Check if level is unlocked (previous levels must have at least 10 words each)
  const isLevelUnlocked = (level: number) => {
    if (level === 1) return true;
    
    // Check if previous levels have sufficient words
    for (let i = 1; i < level; i++) {
      const wordsInLevel = state.words.filter(word => word.level === i).length;
      if (wordsInLevel < 10) {
        return false;
      }
    }
    
    return true;
  };

  // Check if user has completed this level
  const isLevelCompleted = (level: number) => {
    return state.currentUser?.progress.completedLevels.includes(level) || false;
  };

  // Get quiz result for a level
  const getQuizResult = (level: number) => {
    return state.currentUser?.quizResults[level] || null;
  };

  // Check if level has enough words for a quiz (at least 4 words needed for multiple choice)
  const canTakeQuiz = (level: number) => {
    const totalWords = state.words.filter(word => word.level <= level).length;
    return totalWords >= 4 && isLevelUnlocked(level);
  };

  // Get maximum unlocked level
  const maxUnlockedLevel = availableLevels.reduce((max, level) => {
    return isLevelUnlocked(level) ? Math.max(max, level) : max;
  }, 1);

  const handleLevelClick = (level: number) => {
    if (isLevelUnlocked(level)) {
      onLevelSelect(level);
    }
  };

  const handleQuizClick = (level: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering level click
    if (canTakeQuiz(level)) {
      onQuizSelect(level);
    }
  };

  return (
    <main className="level-selector">
      <header className="selector-header">
        <h2>Choose Your Level</h2>
        <button 
          className="close-button"
          onClick={onClose}
          aria-label="Close level selector"
        >
          ✕
        </button>
      </header>

      <section className="selector-description">
        <p>Each level contains new words plus all words from previous levels.</p>
        <p>Study flashcards and take quizzes to unlock new levels!</p>
      </section>

      {availableLevels.length === 0 ? (
        <section className="empty-state">
          <p>No words available yet!</p>
          <p>Add some words first to create levels.</p>
        </section>
      ) : (
        <section className="levels-section" aria-label="Available learning levels">
          <div className="levels-grid" role="grid" aria-label="Learning levels with study and quiz options">
            {availableLevels.map(level => {
              const levelInfo = getLevelInfo(level);
              const unlocked = isLevelUnlocked(level);
              const completed = isLevelCompleted(level);
              const quizResult = getQuizResult(level);
              const canQuiz = canTakeQuiz(level);
              
              return (
                <article
                  key={level}
                  className={`level-card ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'completed' : ''}`}
                  role="gridcell"
                  aria-labelledby={`level-${level}-title`}
                  aria-describedby={`level-${level}-stats ${quizResult ? `level-${level}-quiz` : ''}`}
                >
                  <header className="level-header">
                    <h3 id={`level-${level}-title`}>Level {level}</h3>
                    <div className="level-badges" role="status" aria-label={`Level ${level} status`}>
                      {completed && <span className="completed-badge" aria-label="Completed">✓</span>}
                      {!unlocked && <span className="locked-badge" aria-label="Locked">🔒</span>}
                    </div>
                  </header>

                  <div className="level-stats" id={`level-${level}-stats`} role="group" aria-label={`Level ${level} statistics`}>
                    <div className="stat-item">
                      <span className="stat-label">New Words:</span>
                      <span className="stat-value">{levelInfo.newWords}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Total Words:</span>
                      <span className="stat-value">{levelInfo.totalWords}</span>
                    </div>
                  </div>

                  {quizResult && (
                    <div className={`quiz-status ${quizResult.passed ? 'passed' : 'failed'}`} id={`level-${level}-quiz`} role="status">
                      <div className="quiz-score">
                        Quiz: {quizResult.score}% {quizResult.passed ? '✓' : '✗'}
                      </div>
                      <div className="quiz-attempts">
                        Attempts: {quizResult.attempts}
                      </div>
                    </div>
                  )}

                  {!unlocked && (
                    <div className="unlock-requirement" role="status" aria-label="Level locked">
                      Complete previous levels to unlock
                    </div>
                  )}

                  {unlocked && (
                    <div className="level-actions" role="group" aria-label={`Actions for Level ${level}`}>
                      <button
                        className="level-action-button study-button"
                        onClick={() => handleLevelClick(level)}
                        aria-label={`Study Level ${level} with ${levelInfo.totalWords} words`}
                      >
                        📚 {completed ? 'Study Again' : 'Study'}
                      </button>
                      
                      {canQuiz && (
                        <button
                          className={`level-action-button quiz-button ${quizResult?.passed ? 'quiz-passed' : ''}`}
                          onClick={(e) => handleQuizClick(level, e)}
                          aria-label={`Take quiz for Level ${level} - ${quizResult ? 'Retake previous quiz' : 'Take quiz for the first time'}`}
                        >
                          🧠 {quizResult ? 'Retake Quiz' : 'Take Quiz'}
                        </button>
                      )}
                      
                      {!canQuiz && levelInfo.totalWords < 4 && (
                        <div className="quiz-disabled" role="status" aria-label="Quiz unavailable">
                          Need 4+ words for quiz
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}

      <footer className="selector-footer">
        <div className="progress-summary" role="status" aria-label="Overall progress summary">
          <span>Completed Levels: {state.currentUser?.progress.completedLevels.length || 0}</span>
          <span>Current Level: {state.currentUser?.progress.currentLevel || 1}</span>
          <span>Total Quizzes Passed: {
            Object.values(state.currentUser?.quizResults || {})
              .filter(result => result.passed).length
          }</span>
        </div>
      </footer>
    </main>
  );
};

export default LevelSelector; 