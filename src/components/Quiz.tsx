import React, { useState, useEffect } from 'react';
import { useAppContext, Word } from '../context/AppContext';
import { shuffleArray } from '../utils/arrayUtils';
import { useScreenReader } from '../hooks/useScreenReader';
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
  const { announce, cleanup } = useScreenReader();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateQuestions();
    
    // Cleanup screen reader on unmount
    return () => {
      cleanup();
    };
  }, [level, state.words, cleanup]);

  // Announce question changes
  useEffect(() => {
    if (questions.length > 0 && !isLoading) {
      const currentQuestion = questions[currentQuestionIndex];
      announce(`Question ${currentQuestionIndex + 1} of ${questions.length}. What is the English word for emoji ${currentQuestion.word.emoji} and Hebrew ${currentQuestion.word.hebrew}?`);
    }
  }, [currentQuestionIndex, questions, isLoading, announce]);

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
    announce(`Selected answer: ${answer}`);
  };

  const handleNextQuestion = () => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      announce(`Moving to question ${currentQuestionIndex + 2}`);
    } else {
      // Quiz completed, calculate results
      announce('Quiz completed. Calculating results...');
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
    
    // Announce results
    setTimeout(() => {
      announce(`Quiz completed! You scored ${score} percent. You answered ${correctAnswers} out of ${questions.length} questions correctly. You ${passed ? 'passed' : 'failed'} the quiz.`);
    }, 500);
  };

  const handleRetry = () => {
    announce('Restarting quiz...');
    generateQuestions();
  };

  if (isLoading) {
    return (
      <main className="quiz-container">
        <section className="quiz-loading">
          <h2>Preparing Quiz...</h2>
          <p>Loading questions for Level {level}</p>
        </section>
      </main>
    );
  }

  if (questions.length === 0) {
    return (
      <main className="quiz-container">
        <section className="quiz-no-words">
          <h2>No Quiz Available</h2>
          <p>Level {level} doesn't have enough words for a quiz yet.</p>
          <button className="back-button" onClick={onBack} aria-label="Go back to level selector">
            ← Back to Levels
          </button>
        </section>
      </main>
    );
  }

  if (showResult) {
    const correctAnswers = answers.filter((answer, index) => 
      answer === questions[index].correctAnswer
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= 70;

    return (
      <main className="quiz-container">
        <section className="quiz-results">
          <header className="results-header">
            <h2>Quiz Results</h2>
            <div className={`score-display ${passed ? 'passed' : 'failed'}`} role="status" aria-live="polite">
              <div className="score-circle" role="img" aria-label={`Quiz score: ${score} percent`}>
                <span className="score-number">{score}%</span>
              </div>
              <p className={`result-status ${passed ? 'passed' : 'failed'}`}>
                {passed ? '🎉 Passed!' : '❌ Failed'}
              </p>
            </div>
          </header>

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

          <nav className="results-actions" aria-label="Quiz completion actions">
            <button className="secondary-button" onClick={onBack} aria-label="Return to level selector">
              ← Back to Levels
            </button>
            {!passed && (
              <button className="primary-button" onClick={handleRetry} aria-label="Retry the quiz">
                🔄 Try Again
              </button>
            )}
          </nav>
        </section>
      </main>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <main className="quiz-container">
      <header className="quiz-header">
        <div className="quiz-info">
          <h2>Level {level} Quiz</h2>
          <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
        </div>
        <div className="quiz-progress" role="status" aria-label={`Quiz progress: ${Math.round(progress)} percent complete`}>
          <div className="progress-bar" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>
      </header>

      <section className="quiz-question" aria-labelledby="current-question">
        <div className="question-content">
          <div className="question-visual">
            <div className="emoji-display" role="img" aria-label={`Emoji: ${currentQuestion.word.emoji}`}>{currentQuestion.word.emoji}</div>
            <div className="hebrew-display" lang="he">{currentQuestion.word.hebrew}</div>
          </div>
          <h3 id="current-question">What is the English word?</h3>
        </div>

        <form className="answer-options" role="radiogroup" aria-labelledby="current-question">
          {currentQuestion.options.map((option, index) => (
            <label
              key={index}
              className={`option-button ${selectedAnswer === option ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="quiz-answer"
                value={option}
                checked={selectedAnswer === option}
                onChange={() => handleAnswerSelect(option)}
                className="option-radio"
                aria-describedby={`option-${index}-label`}
              />
              <span className="option-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
              <span className="option-text" id={`option-${index}-label`}>{option}</span>
            </label>
          ))}
        </form>
      </section>

      <nav className="quiz-navigation" aria-label="Quiz navigation">
        <button className="secondary-button" onClick={onBack} aria-label="Go back to level selector">
          ← Back to Levels
        </button>
        <button 
          className="primary-button"
          onClick={handleNextQuestion}
          disabled={!selectedAnswer}
          aria-label={currentQuestionIndex < questions.length - 1 ? 'Go to next question' : 'Finish quiz and see results'}
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
        </button>
      </nav>
    </main>
  );
};

export default Quiz; 