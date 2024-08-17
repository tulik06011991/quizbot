import React, { useState } from 'react';

const Test = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  const questions = [
    {
      question: 'Which is the capital of France?',
      options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    },
    {
      question: 'What is the largest planet in our solar system?',
      options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
    },
    {
      question: 'Who wrote "Hamlet"?',
      options: ['Charles Dickens', 'William Shakespeare', 'Mark Twain', 'Leo Tolstoy'],
    },
  ];

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null); // Reset selected option for next question
    } else {
      alert('You have reached the end of the quiz!');
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-4/5 max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{currentQuestion.question}</h2>
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`w-full py-3 px-4 rounded-lg text-lg font-medium ${
                selectedOption === option
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        {selectedOption && (
          <p className="mt-4 text-lg text-green-600 font-semibold">
            You selected: {selectedOption}
          </p>
        )}
        <button
          onClick={handleNextQuestion}
          className="mt-6 w-full py-3 px-4 bg-green-500 text-white font-semibold text-lg rounded-lg hover:bg-green-600"
        >
          Next Question
        </button>
      </div>
    </div>
  );
};

export default Test;
