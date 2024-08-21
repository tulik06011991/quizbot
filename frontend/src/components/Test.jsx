// components/Test.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Test = () => {
  const [quiz, setQuiz] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get('http://localhost:5000/test/quiz'); // Sizning API URL manzilingiz
        setQuiz(response.data);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuiz();
  }, []);

  const handleOptionChange = (questionIndex, optionIndex) => {
    setSelectedOptions(prevState => ({
      ...prevState,
      [questionIndex]: optionIndex
    }));
  };

  const handleNext = () => {
    setCurrentQuestionIndex(prevIndex => Math.min(prevIndex + 1, quiz.length - 1));
  };

  const handleSubmit = async () => {
    try {
      const answers = quiz.map((q, index) => ({
        questionId: q._id,
        selectedOption: selectedOptions[index]
      }));

      const response = await axios.post('/api/submit-quiz', answers); // Sizning API URL manzilingiz
      console.log('Quiz submitted:', response.data);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  if (quiz.length === 0) {
    return <div>Loading...</div>;
  }

  // Hozirgi savolni olish
  const currentQuestion = quiz[currentQuestionIndex];
  if (!currentQuestion) {
    return <div>Question not found</div>;
  }

  return (
    <div>
      <h2>Question {currentQuestionIndex + 1}</h2>
      <p>{currentQuestion.question}</p>
      <ul>
        {currentQuestion.options && currentQuestion.options.length > 0 ? (
          currentQuestion.options.map((option, index) => (
            <li key={index}>
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={index}
                checked={selectedOptions[currentQuestionIndex] === index}
                onChange={() => handleOptionChange(currentQuestionIndex, index)}
              />
              {option.option}
            </li>
          ))
        ) : (
          <li>No options available</li>
        )}
      </ul>
      <button onClick={handleNext} disabled={currentQuestionIndex === quiz.length - 1}>
        Next
      </button>
      {currentQuestionIndex === quiz.length - 1 && <button onClick={handleSubmit}>Submit</button>}
    </div>
  );
};

export default Test;
