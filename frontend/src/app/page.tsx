"use client";

import { useState } from 'react';

/**
 * Type Definitions
 */

/** Represents a single quiz question with multiple choice options */
type Question = {
  /** The question text */
  question: string;
  /** Array of 4 multiple choice options */
  options: string[];
  /** Index (0-3) of the correct answer in the options array */
  correctOptionIndex: number;
  /** Optional explanation of why the answer is correct */
  explanation?: string;
};

/** Represents a completed quiz result */
type QuizResult = {
  /** The topic/subject of the quiz */
  topic: string;
  /** Number of correct answers */
  score: number;
  /** Total number of questions in the quiz */
  totalQuestions: number;
  /** ISO timestamp when the quiz was completed */
  timestamp: string;
};

/** Maps question indices to selected option indices */
type UserAnswers = {
  [questionIndex: number]: number;
};

/**
 * Main Quiz Application Component
 * 
 * Provides a complete quiz experience including:
 * - Topic input and quiz generation
 * - Interactive question answering
 * - Results display with explanations
 * - Quiz history tracking
 * 
 * @returns {JSX.Element} The main quiz application interface
 */
export default function Home() {
  // === State Management ===
  // The topic for the quiz entered by the user.
  const [topic, setTopic] = useState('');
  // The array of quiz questions received from the backend.
  const [quiz, setQuiz] = useState<Question[] | null>(null);
  // An object to store the user's selected answers.
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  // The user's final score.
  const [score, setScore] = useState<number | null>(null);
  // A boolean to indicate if the initial quiz is being generated.
  const [loading, setLoading] = useState(false);
  // A boolean to indicate if more questions are being loaded.
  const [loadingMore, setLoadingMore] = useState(false);
  // A string to store any error messages.
  const [error, setError] = useState<string | null>(null);
  // A boolean to indicate if the quiz has been submitted and the results are being shown.
  const [quizFinished, setQuizFinished] = useState(false);
  // Array to store quiz results history
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  // Boolean to show/hide results history
  const [showResults, setShowResults] = useState(false);

  /**
   * Generates a new quiz for the specified topic
   * 
   * Validates input, calls the backend API, and handles both success and error cases.
   * Falls back to mock data if the API fails.
   * 
   * @async
   * @function handleGenerateQuiz
   * @returns {Promise<void>}
   */
  const handleGenerateQuiz = async () => {
    // Basic validation to ensure a topic is entered.
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    // Set loading state and reset previous quiz data.
    setLoading(true);
    setError(null);
    setQuiz(null);
    setQuizFinished(false);
    setUserAnswers({});
    setScore(null);

    try {
      // Fetch the quiz from the backend API.
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      // Handle non-successful HTTP responses.
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate quiz');
      }

      const data: Question[] = await response.json();
      // Validate the data received from the backend.
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("The AI returned invalid quiz data. Please try again.");
      }
      setQuiz(data);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Loads additional questions for the current topic
   * 
   * Fetches 5 more questions from the backend API and appends them to the existing quiz.
   * Maintains the same topic and handles errors gracefully.
   * 
   * @async
   * @function handleLoadMore
   * @returns {Promise<void>}
   */
  const handleLoadMore = async () => {
    setLoadingMore(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }), // Use the same topic
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate more questions');
      }

      const newQuestions: Question[] = await response.json();
      if (!Array.isArray(newQuestions) || newQuestions.length === 0) {
        throw new Error("The AI returned invalid quiz data. Please try again.");
      }
      // Append new questions to the existing quiz array.
      setQuiz(prevQuiz => prevQuiz ? [...prevQuiz, ...newQuestions] : newQuestions);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred while loading more questions.');
    } finally {
      setLoadingMore(false);
    }
  };

  /**
   * Records the user's answer selection for a question
   * 
   * Updates the userAnswers state with the selected option for the given question.
   * Allows users to change their answers before submitting.
   * 
   * @function handleAnswerSelect
   * @param {number} questionIndex - Zero-based index of the question (0-4)
   * @param {number} optionIndex - Zero-based index of the selected option (0-3)
   * @returns {void}
   */
  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: optionIndex,
    });
  };

  /**
   * Calculates the user's score and transitions the UI to the results view.
   */
  /**
   * Calculates the final score and saves the quiz result
   * 
   * Compares user answers with correct answers, calculates the score,
   * transitions to results view, and saves the result to the backend.
   * 
   * @async
   * @function handleSubmitQuiz
   * @returns {Promise<void>}
   */
  const handleSubmitQuiz = async () => {
    if (!quiz) return;
    
    let correctAnswers = 0;
    // Calculate score by comparing user answers with correct answers
    quiz.forEach((question, index) => {
      if (userAnswers[index] === question.correctOptionIndex) {
        correctAnswers++;
      }
    });
    
    setScore(correctAnswers);
    setQuizFinished(true);
    
    // Persist quiz result to backend
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic, 
          score: correctAnswers, 
          totalQuestions: quiz.length 
        })
      });
    } catch (error) {
      console.error('Failed to save quiz result:', error);
    }
  };

  /**
   * Resets the entire application state to allow the user to start a new quiz.
   */
  /**
   * Loads and displays the quiz results history
   * 
   * Fetches the user's quiz history from the backend and displays it in a modal.
   * Shows the last 10 quiz attempts with scores and dates.
   * 
   * @async
   * @function loadQuizResults
   * @returns {Promise<void>}
   */
  const loadQuizResults = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/results`);
      if (response.ok) {
        const data = await response.json();
        setQuizResults(data.results || data); // Handle both paginated and simple responses
        setShowResults(true);
      }
    } catch (error) {
      console.error('Failed to load quiz results:', error);
    }
  };

  /**
   * Resets the application to its initial state
   * 
   * Clears all quiz data, user answers, and UI state to allow starting a new quiz.
   * Returns the user to the topic input screen.
   * 
   * @function handleRestart
   * @returns {void}
   */
  const handleRestart = () => {
    setTopic('');
    setQuiz(null);
    setUserAnswers({});
    setScore(null);
    setError(null);
    setQuizFinished(false);
    setShowResults(false);
  };

  // === JSX Rendering ===
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-blue-600 dark:text-blue-400">QuizAI</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">Your study companion</p>

        {/* View 1: Topic Input Form (Initial State) */}
        {!quiz && !quizFinished && (
          <div className="flex flex-col items-center">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic (e.g., Photosynthesis)"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
              disabled={loading}
            />
            <button
              onClick={handleGenerateQuiz}
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 transition-colors"
            >
              {loading ? 'Generating...' : 'Generate Quiz'}
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        )}

        {/* Loading indicator for initial quiz generation */}
        {loading && (
            <div className="text-center">
                <p>Generating your quiz, please wait...</p>
            </div>
        )}

        {/* View 2: Active Quiz */}
        {quiz && !quizFinished && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-center">Quiz on: {topic}</h2>
            {quiz.map((q, qIndex) => (
              <div key={qIndex} className="mb-6">
                <p className="font-semibold mb-2">{qIndex + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((option, oIndex) => (
                    <label key={oIndex} className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                      <input
                        type="radio"
                        name={`question-${qIndex}`}
                        checked={userAnswers[qIndex] === oIndex}
                        onChange={() => handleAnswerSelect(qIndex, oIndex)}
                        className="mr-3"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={handleSubmitQuiz}
                className="w-full sm:w-1/2 bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit Quiz
              </button>
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="w-full sm:w-1/2 bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 disabled:bg-gray-400 dark:disabled:bg-gray-700 transition-colors"
              >
                {loadingMore ? 'Loading...' : 'Load More Questions'}
              </button>
            </div>
            {/* Show error messages related to loading more questions */}
            {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          </div>
        )}

        {/* View 3: Quiz Results */}
        {quizFinished && quiz && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-center">Quiz Results</h2>
            <p className="text-xl text-center mb-6">You scored <span className="font-bold">{score}</span> out of <span className="font-bold">{quiz.length}</span></p>

            {quiz.map((q, qIndex) => {
              const userAnswer = userAnswers[qIndex];
              const isCorrect = userAnswer === q.correctOptionIndex;
              return (
                <div key={qIndex} className="mb-4 p-3 rounded-lg" style={{ border: `2px solid ${isCorrect ? 'green' : 'red'}` }}>
                  <p className="font-semibold">{qIndex + 1}. {q.question}</p>
                  <div className="mt-2">
                    {q.options.map((option, oIndex) => {
                      let style = {};
                      if (oIndex === q.correctOptionIndex) {
                        // Style for the correct answer
                        style = { color: 'green', fontWeight: 'bold' };
                      } else if (oIndex === userAnswer) {
                        // Style for the user's incorrect answer
                        style = { color: 'red', fontWeight: 'bold' };
                      }
                      return <p key={oIndex} style={style}>{option}</p>;
                    })}
                  </div>
                  {/* Show the user's incorrect answer explicitly if they got it wrong */}
                  {!isCorrect && userAnswer !== undefined && <p className="text-sm mt-1">Your answer: <span style={{color: 'red'}}>{q.options[userAnswer]}</span></p>}
                  <p className="text-sm mt-1">Correct answer: <span style={{color: 'green'}}>{q.options[q.correctOptionIndex]}</span></p>
                  {q.explanation && <p className="text-sm mt-2 p-2 bg-blue-50 dark:bg-blue-900 rounded"><strong>Explanation:</strong> {q.explanation}</p>}
                </div>
              );
            })}

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                onClick={handleRestart}
                className="w-full sm:w-1/2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Take Another Quiz
              </button>
              <button
                onClick={loadQuizResults}
                className="w-full sm:w-1/2 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                View Results History
              </button>
            </div>
          </div>
        )}

        {showResults && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">Quiz Results History</h2>
            {quizResults.length === 0 ? (
              <p className="text-center">No quiz results yet.</p>
            ) : (
              <div className="space-y-2">
                {quizResults.slice(-10).reverse().map((result, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{result.topic}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(result.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm">
                      Score: {result.score}/{result.totalQuestions} ({Math.round((result.score/result.totalQuestions)*100)}%)
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowResults(false)}
              className="w-full mt-4 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close History
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
