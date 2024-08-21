import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Test = () => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 daqiqa

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

    // Timerni ishga tushirish
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          // Vaqt tugagandan so'ng natijalarni ko'rsatish
          showResults();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Komponentdan chiqishda taymerni to'xtatish
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

  const showResults = () => {
    // Natijalarni ko'rsatish uchun kerakli amallar
    console.log('Test tugadi, natijalarni ko\'rsating');
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (quizData.length === 0) {
    return <div>Yuklanmoqda...</div>;
  }

  const question = quizData[currentQuestionIndex];

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        {/* Timer */}
        <div
          style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: timeLeft <= 60 ? 'red' : 'black',
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: '#f0f0f0',
            display: 'inline-block',
            textAlign: 'center',
            width: '120px',
          }}
        >
          {formatTime(timeLeft)}
        </div>
      </div>

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
