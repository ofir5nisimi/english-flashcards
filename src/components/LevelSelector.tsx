import React from 'react';
import { useAppContext, Word } from '../context/AppContext';
import './LevelSelector.css';

interface LevelSelectorProps {
  onLevelSelect: (level: number) => void;
  onClose: () => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ onLevelSelect, onClose }) => {
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

  // Get maximum unlocked level
  const maxUnlockedLevel = availableLevels.reduce((max, level) => {
    return isLevelUnlocked(level) ? Math.max(max, level) : max;
  }, 1);

  const handleLevelClick = (level: number) => {
    if (isLevelUnlocked(level)) {
      onLevelSelect(level);
    }
  };

  return (
    <div className="level-selector">
      <div className="selector-header">
        <h2>Choose Your Level</h2>
        <button 
          className="close-button"
          onClick={onClose}
          aria-label="Close level selector"
        >
          ✕
        </button>
      </div>

      <div className="selector-description">
        <p>Each level contains new words plus all words from previous levels.</p>
        <p>Complete Level {maxUnlockedLevel} to unlock Level {maxUnlockedLevel + 1}!</p>
      </div>

      {availableLevels.length === 0 ? (
        <div className="empty-state">
          <p>No words available yet!</p>
          <p>Add some words first to create levels.</p>
        </div>
      ) : (
        <div className="levels-grid">
          {availableLevels.map(level => {
            const levelInfo = getLevelInfo(level);
            const unlocked = isLevelUnlocked(level);
            const completed = isLevelCompleted(level);
            
            return (
              <div
                key={level}
                className={`level-card ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'completed' : ''}`}
                onClick={() => handleLevelClick(level)}
                tabIndex={unlocked ? 0 : -1}
                role="button"
                aria-label={`Level ${level} - ${levelInfo.totalWords} words total`}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && unlocked) {
                    e.preventDefault();
                    handleLevelClick(level);
                  }
                }}
              >
                <div className="level-header">
                  <h3>Level {level}</h3>
                  {completed && <span className="completed-badge">✓</span>}
                  {!unlocked && <span className="locked-badge">🔒</span>}
                </div>

                <div className="level-stats">
                  <div className="stat-item">
                    <span className="stat-label">New Words:</span>
                    <span className="stat-value">{levelInfo.newWords}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Total Words:</span>
                    <span className="stat-value">{levelInfo.totalWords}</span>
                  </div>
                </div>

                {!unlocked && (
                  <div className="unlock-requirement">
                    Complete previous levels to unlock
                  </div>
                )}

                {unlocked && (
                  <div className="level-action">
                    {completed ? 'Study Again' : 'Start Level'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="selector-footer">
        <div className="progress-summary">
          <span>Completed Levels: {state.currentUser?.progress.completedLevels.length || 0}</span>
          <span>Current Level: {state.currentUser?.progress.currentLevel || 1}</span>
        </div>
      </div>
    </div>
  );
};

export default LevelSelector; 