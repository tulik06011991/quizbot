import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar'; // Navbarni import qilish
import Footer from './Footer'; // Footerni import qilish

const Test = () => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 daqiqa, sekundlarda

  useEffect(() => {
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

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleSubmit(); // Vaqt tugashi bilan avtomatik jo'natish
    }
  }, [timeLeft, submitted]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

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

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/test/submit', {
        answers
      });
      setResult(response.data); 
      setSubmitted(true);
    } catch (error) {
      console.error('Natijani yuborishda xatolik:', error);
    }
  };

  if (quizData.length === 0) {
    return <div>Yuklanmoqda...</div>;
  }

  if (submitted && result) {
    return (
      <div style={containerStyles}>
        <h2>Test natijasi:</h2>
        <p>To'g'ri javoblar soni: {result.correctAnswersCount}</p>
        <p>Umumiy savollar soni: {result.totalQuestions}</p>
      </div>
    );
  }

  const question = quizData[currentQuestionIndex];

  return (
    <div>
      
      <div style={contentStyles}>
        <div style={testContainerStyles}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: timeLeft < 60 ? 'red' : 'black' }}>
              Vaqt: {formatTime(timeLeft)}
            </div>
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
              onClick={currentQuestionIndex === quizData.length - 1 ? handleSubmit : handleNextQuestion}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {currentQuestionIndex === quizData.length - 1 ? 'Yakunlash' : 'Keyingi'}
            </button>
          </div>
        </div>
      </div>
     {/* Footerni qo'shish */}
    </div>
  );
};

const contentStyles = {
  paddingTop: '80px', // Navbarni hisobga olib, ustini bo'sh qoldiramiz
  paddingBottom: '60px', // Footer uchun pastda bo'sh joy qoldiramiz
  minHeight: '100vh',
};

const testContainerStyles = {
  padding: '20px',
  maxWidth: '600px',
  margin: 'auto',
  backgroundColor: '#f9f9f9',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const containerStyles = {
  textAlign: 'center',
  margin: '50px 0',
};

export default Test;
