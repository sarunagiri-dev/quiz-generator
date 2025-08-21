"use client";

import { useState } from 'react';

// === Type Definitions ===
// Defines the structure of a single quiz question object.
type Question = {
  question: string;
  options: string[];
  correctOptionIndex: number;
};

// Defines the structure for storing the user's answers.
// The key is the question index (number), and the value is the selected option index (number).
type UserAnswers = {
  [key: number]: number;
};

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

  /**
   * Handles the initial generation of the quiz.
   * This function is called when the "Generate Quiz" button is clicked.
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
      const response = await fetch('http://localhost:5000/api/quiz', {
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
   * Fetches 5 more questions from the backend and appends them to the current quiz.
   */
  const handleLoadMore = async () => {
    setLoadingMore(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/quiz', {
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
   * Records the user's selected answer for a specific question.
   * @param questionIndex The index of the question being answered.
   * @param optionIndex The index of the option selected by the user.
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
  const handleSubmitQuiz = () => {
    if (!quiz) return;
    let correctAnswers = 0;
    // Loop through the quiz questions and compare user's answers with correct answers.
    quiz.forEach((question, index) => {
      if (userAnswers[index] === question.correctOptionIndex) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setQuizFinished(true); // Set quiz as finished to show the results screen.
  };

  /**
   * Resets the entire application state to allow the user to start a new quiz.
   */
  const handleRestart = () => {
    setTopic('');
    setQuiz(null);
    setUserAnswers({});
    setScore(null);
    setError(null);
    setQuizFinished(false);
  };

  // === JSX Rendering ===
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600 dark:text-blue-400">AI Quiz Generator</h1>

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
                </div>
              );
            })}

            <button
              onClick={handleRestart}
              className="w-full mt-6 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Take Another Quiz
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
