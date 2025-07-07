import React, { useState, useEffect } from 'react';
import { useAppContext, Word } from '../context/AppContext';
import { shuffleArray } from '../utils/arrayUtils';
import './Quiz.css';

interface QuizProps {
  level: number;
  onComplete: (score: number, passed: boolean) => void;
  onBack: () => void;
}

interface QuizQuestion {
  word: Word;
  options: string[];
  correctAnswer: string;
}

const Quiz: React.FC<QuizProps> = ({ level, onComplete, onBack }) => {
  const { state } = useAppContext();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateQuestions();
  }, [level, state.words]);

  const generateQuestions = () => {
    setIsLoading(true);
    
    // Get words for this level (cumulative - includes all previous levels + current level words)
    const levelWords = state.words.filter(word => word.level <= level);
    
    if (levelWords.length === 0) {
      setIsLoading(false);
      return;
    }

    // Shuffle words and take up to 10 questions for the quiz
    const shuffledWords = shuffleArray([...levelWords]);
    const quizWords = shuffledWords.slice(0, Math.min(10, shuffledWords.length));
    
    // Generate questions with multiple choice options
    const quizQuestions: QuizQuestion[] = quizWords.map(word => {
      // Get 3 random incorrect options from other words
      const otherWords = state.words.filter(w => w.id !== word.id && w.english !== word.english);
      const incorrectOptions = shuffleArray(otherWords)
        .slice(0, 3)
        .map(w => w.english);
      
      // Combine correct answer with incorrect options and shuffle
      const allOptions = shuffleArray([word.english, ...incorrectOptions]);
      
      return {
        word,
        options: allOptions,
        correctAnswer: word.english
      };
    });

    setQuestions(quizQuestions);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedAnswer('');
    setShowResult(false);
    setIsLoading(false);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
    } else {
      // Quiz completed, calculate results
      showQuizResults(newAnswers);
    }
  };

  const showQuizResults = (finalAnswers: string[]) => {
    const correctAnswers = finalAnswers.filter((answer, index) => 
      answer === questions[index].correctAnswer
    ).length;
    
    const score = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= 70; // 70% to pass
    
    setShowResult(true);
    onComplete(score, passed);
  };

  const handleRetry = () => {
    generateQuestions();
  };

  if (isLoading) {
    return (
      <div className="quiz-container">
        <div className="quiz-loading">
          <h2>Preparing Quiz...</h2>
          <p>Loading questions for Level {level}</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="quiz-no-words">
          <h2>No Quiz Available</h2>
          <p>Level {level} doesn't have enough words for a quiz yet.</p>
          <button className="back-button" onClick={onBack}>
            ← Back to Levels
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const correctAnswers = answers.filter((answer, index) => 
      answer === questions[index].correctAnswer
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= 70;

    return (
      <div className="quiz-container">
        <div className="quiz-results">
          <div className="results-header">
            <h2>Quiz Results</h2>
            <div className={`score-display ${passed ? 'passed' : 'failed'}`}>
              <div className="score-circle">
                <span className="score-number">{score}%</span>
              </div>
              <p className={`result-status ${passed ? 'passed' : 'failed'}`}>
                {passed ? '🎉 Passed!' : '❌ Failed'}
              </p>
            </div>
          </div>

          <div className="results-details">
            <p>
              You answered <strong>{correctAnswers}</strong> out of <strong>{questions.length}</strong> questions correctly.
            </p>
            {passed ? (
              <p className="success-message">
                Congratulations! You've completed Level {level}!
              </p>
            ) : (
              <p className="retry-message">
                You need 70% or higher to pass. Keep studying and try again!
              </p>
            )}
          </div>

          <div className="results-actions">
            <button className="secondary-button" onClick={onBack}>
              ← Back to Levels
            </button>
            {!passed && (
              <button className="primary-button" onClick={handleRetry}>
                🔄 Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-info">
          <h2>Level {level} Quiz</h2>
          <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
        </div>
        <div className="quiz-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="quiz-question">
        <div className="question-content">
          <div className="question-visual">
            <div className="emoji-display">{currentQuestion.word.emoji}</div>
            <div className="hebrew-display">{currentQuestion.word.hebrew}</div>
          </div>
          <h3>What is the English word?</h3>
        </div>

        <div className="answer-options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${selectedAnswer === option ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(option)}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="quiz-navigation">
        <button className="secondary-button" onClick={onBack}>
          ← Back to Levels
        </button>
        <button 
          className="primary-button"
          onClick={handleNextQuestion}
          disabled={!selectedAnswer}
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
        </button>
      </div>
    </div>
  );
};

export default Quiz; 