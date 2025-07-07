import React, { useState } from 'react';
import { useAppContext, Word } from '../context/AppContext';
import './WordListManager.css';

interface WordFormData {
  emoji: string;
  english: string;
  hebrew: string;
  level: number | string;
}

interface WordListManagerProps {
  onClose: () => void;
}

const WordListManager: React.FC<WordListManagerProps> = ({ onClose }) => {
  const { state, dispatch } = useAppContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [formData, setFormData] = useState<WordFormData>({
    emoji: '',
    english: '',
    hebrew: '',
    level: 1
  });
  const [formErrors, setFormErrors] = useState<Partial<WordFormData>>({});

  const validateForm = (): boolean => {
    const errors: Partial<WordFormData> = {};
    
    if (!formData.emoji.trim()) {
      errors.emoji = 'Emoji is required';
    }
    
    if (!formData.english.trim()) {
      errors.english = 'English word is required';
    }
    
    if (!formData.hebrew.trim()) {
      errors.hebrew = 'Hebrew translation is required';
    }
    
    const levelNumber = typeof formData.level === 'string' ? parseInt(formData.level) : formData.level;
    if (isNaN(levelNumber) || levelNumber < 1) {
      errors.level = 'Level must be at least 1';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      emoji: '',
      english: '',
      hebrew: '',
      level: 1
    });
    setFormErrors({});
    setEditingWord(null);
    setShowAddForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (editingWord) {
      // Update existing word
      const updatedWord: Word = {
        ...editingWord,
        emoji: formData.emoji.trim(),
        english: formData.english.trim(),
        hebrew: formData.hebrew.trim(),
        level: typeof formData.level === 'string' ? parseInt(formData.level) : formData.level
      };
      dispatch({ type: 'UPDATE_WORD', payload: updatedWord });
    } else {
      // Add new word
      const newWord: Word = {
        id: `word-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        emoji: formData.emoji.trim(),
        english: formData.english.trim(),
        hebrew: formData.hebrew.trim(),
        level: typeof formData.level === 'string' ? parseInt(formData.level) : formData.level
      };
      dispatch({ type: 'ADD_WORD', payload: newWord });
    }

    resetForm();
  };

  const handleEdit = (word: Word) => {
    setEditingWord(word);
    setFormData({
      emoji: word.emoji,
      english: word.english,
      hebrew: word.hebrew,
      level: word.level
    });
    setShowAddForm(true);
  };

  const handleDelete = (wordId: string) => {
    if (window.confirm('Are you sure you want to delete this word?')) {
      dispatch({ type: 'DELETE_WORD', payload: wordId });
    }
  };

  const handleFormChange = (field: keyof WordFormData, value: string | number) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: field === 'level' ? Number(value) : value 
    }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Group words by level for better organization
  const wordsByLevel = state.words.reduce((acc, word) => {
    if (!acc[word.level]) {
      acc[word.level] = [];
    }
    acc[word.level].push(word);
    return acc;
  }, {} as Record<number, Word[]>);

  const levels = Object.keys(wordsByLevel).map(Number).sort((a, b) => a - b);

  return (
    <div className="word-list-manager">
      <div className="manager-header">
        <h2>Word List Manager</h2>
        <button 
          className="close-button"
          onClick={onClose}
          aria-label="Close word manager"
        >
          ✕
        </button>
      </div>

      <div className="manager-actions">
        <button 
          className="add-word-button"
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm}
        >
          ➕ Add New Word
        </button>
        <div className="words-stats">
          <span>Total Words: {state.words.length}</span>
          <span>Levels: {levels.length}</span>
        </div>
      </div>

      {showAddForm && (
        <div className="word-form-container">
          <form onSubmit={handleSubmit} className="word-form">
            <h3>{editingWord ? 'Edit Word' : 'Add New Word'}</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="emoji">Emoji *</label>
                <input
                  id="emoji"
                  type="text"
                  value={formData.emoji}
                  onChange={(e) => handleFormChange('emoji', e.target.value)}
                  placeholder="🍎"
                  className={formErrors.emoji ? 'error' : ''}
                />
                {formErrors.emoji && <span className="error-text">{formErrors.emoji}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="level">Level *</label>
                <input
                  id="level"
                  type="number"
                  min="1"
                  value={formData.level}
                  onChange={(e) => handleFormChange('level', parseInt(e.target.value) || 1)}
                  className={formErrors.level ? 'error' : ''}
                />
                {formErrors.level && <span className="error-text">{formErrors.level}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="english">English Word *</label>
              <input
                id="english"
                type="text"
                value={formData.english}
                onChange={(e) => handleFormChange('english', e.target.value)}
                placeholder="Apple"
                className={formErrors.english ? 'error' : ''}
              />
              {formErrors.english && <span className="error-text">{formErrors.english}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="hebrew">Hebrew Translation *</label>
              <input
                id="hebrew"
                type="text"
                value={formData.hebrew}
                onChange={(e) => handleFormChange('hebrew', e.target.value)}
                placeholder="תפוח"
                className={formErrors.hebrew ? 'error' : ''}
              />
              {formErrors.hebrew && <span className="error-text">{formErrors.hebrew}</span>}
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                {editingWord ? 'Update Word' : 'Add Word'}
              </button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="words-list">
        {levels.length === 0 ? (
          <div className="empty-state">
            <p>No words added yet. Click "Add New Word" to get started!</p>
          </div>
        ) : (
          levels.map(level => (
            <div key={level} className="level-section">
              <h3 className="level-header">
                Level {level} ({wordsByLevel[level].length} words)
              </h3>
              <div className="words-grid">
                {wordsByLevel[level].map(word => (
                  <div key={word.id} className="word-card">
                    <div className="word-content">
                      <div className="word-emoji">{word.emoji}</div>
                      <div className="word-details">
                        <div className="word-english">{word.english}</div>
                        <div className="word-hebrew">{word.hebrew}</div>
                      </div>
                    </div>
                    <div className="word-actions">
                      <button 
                        className="edit-button"
                        onClick={() => handleEdit(word)}
                        aria-label={`Edit ${word.english}`}
                      >
                        ✏️
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDelete(word.id)}
                        aria-label={`Delete ${word.english}`}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WordListManager; 