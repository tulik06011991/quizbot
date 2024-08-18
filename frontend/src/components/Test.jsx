import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Test = () => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    // Savollar va variantlarni olish
    const fetchQuizData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/test/quiz');
        setQuizData(response.data);
      } catch (error) {
        console.error('Quiz ma\'lumotlarini olishda xatolik:', error);
      }
    };

    fetchQuizData();
  }, []);

  const handleOptionChange = (option) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: option
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (quizData.length === 0) {
    return <div>Yuklanmoqda...</div>;
  }

  const question = quizData[currentQuestionIndex];

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>{question.question}</h2>
        <div style={{ marginTop: '10px' }}>
          {question.options.map((option, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <input
                type="radio"
                id={`option-${index}`}
                name={`question-${currentQuestionIndex}`}
                value={option}
                checked={answers[currentQuestionIndex] === option}
                onChange={() => handleOptionChange(option)}
                style={{ marginRight: '10px' }}
              />
              <label htmlFor={`option-${index}`} style={{ cursor: 'pointer' }}>{option}</label>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          style={{
            backgroundColor: '#d3d3d3',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          Oldingi
        </button>
        <button
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === quizData.length - 1}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: currentQuestionIndex === quizData.length - 1 ? 'not-allowed' : 'pointer'
          }}
        >
          Keyingi
        </button>
      </div>
    </div>
  );
};

export default Test;
