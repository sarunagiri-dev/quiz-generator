"use client";

import { useState } from 'react';

// Define the type for a single quiz question
type Question = {
  question: string;
  options: string[];
  correctOptionIndex: number;
};

// Define the type for the user's answers
type UserAnswers = {
  [key: number]: number;
};

export default function Home() {
  const [topic, setTopic] = useState('');
  const [quiz, setQuiz] = useState<Question[] | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setLoading(true);
    setError(null);
    setQuiz(null);
    setQuizFinished(false);
    setUserAnswers({});
    setScore(null);

    try {
      const response = await fetch('http://localhost:5000/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate quiz');
      }

      const data: Question[] = await response.json();
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

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: optionIndex,
    });
  };

  const handleSubmitQuiz = () => {
    if (!quiz) return;
    let correctAnswers = 0;
    quiz.forEach((question, index) => {
      if (userAnswers[index] === question.correctOptionIndex) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setQuizFinished(true);
  };

  const handleRestart = () => {
    setTopic('');
    setQuiz(null);
    setUserAnswers({});
    setScore(null);
    setError(null);
    setQuizFinished(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600 dark:text-blue-400">AI Quiz Generator</h1>

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

        {loading && (
            <div className="text-center">
                <p>Generating your quiz, please wait...</p>
            </div>
        )}

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
            <button
              onClick={handleSubmitQuiz}
              className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Submit Quiz
            </button>
          </div>
        )}

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
                        style = { color: 'green', fontWeight: 'bold' };
                      } else if (oIndex === userAnswer) {
                        style = { color: 'red', fontWeight: 'bold' };
                      }
                      return <p key={oIndex} style={style}>{option}</p>;
                    })}
                  </div>
                  {!isCorrect && <p className="text-sm mt-1">Your answer: <span style={{color: 'red'}}>{q.options[userAnswer]}</span></p>}
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
