import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Test = () => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null); // Yakuniy natijani ko'rsatish uchun
  const [userId, setUserId] = useState(null); // Foydalanuvchi ID'sini saqlash uchun
  const [token, setToken] = useState(null); // JWT tokenni saqlash uchun

  // Sahifa yuklanganda foydalanuvchi ID'sini va tokenni olish
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedToken = localStorage.getItem('token');
    console.log('Stored User ID:', storedUserId); // Debugging uchun
    console.log('Stored Token:', storedToken); // Debugging uchun

    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error('LocalStorage’da foydalanuvchi ID topilmadi.');
    }

    if (storedToken) {
      setToken(storedToken);
    } else {
      console.error('LocalStorage’da token topilmadi.');
    }

    const fetchQuizData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/test/quiz', {
          headers: {
            Authorization: `Bearer ${storedToken}` // Tokenni so'rovga qo'shish
          }
        });
        setQuizData(response.data);
      } catch (error) {
        console.error('Quiz ma\'lumotlarini olishda xatolik:', error);
      }
    };

    fetchQuizData();
  }, []);

  // Variant tanlash
  const handleOptionChange = (optionId) => {
    setAnswers({
      ...answers,
      [quizData[currentQuestionIndex]._id]: optionId
    });
  };

  // Keyingi savolga o'tish
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Oldingi savolga o'tish
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Testni yakunlash va natijani olish
  const handleFinishQuiz = async () => {
    console.log('User ID during finish:', userId); // Debugging uchun
    if (!userId) {
      console.error('Foydalanuvchi ID topilmadi.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/test/quiz/finish', {
        userId, // Foydalanuvchi ID
        answers
      }, {
        headers: {
          Authorization: `Bearer ${token}` // Tokenni so'rovga qo'shish
        }
      });
      setResult(response.data); // Natijani ko'rsatish uchun
    } catch (error) {
      console.error('Natijani olishda xatolik:', error);
    }
  };

  if (quizData.length === 0) {
    return <div>Yuklanmoqda...</div>;
  }

  const question = quizData[currentQuestionIndex];

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', height: '100vh' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>{question.question}</h2>
        <div style={{ marginTop: '10px' }}>
          {question.options.map((option) => (
            <div key={option._id} style={{ marginBottom: '10px' }}>
              <input
                type="radio"
                id={`option-${option._id}`}
                name={`question-${currentQuestionIndex}`}
                value={option._id}
                checked={answers[question._id] === option._id}
                onChange={() => handleOptionChange(option._id)}
                style={{ marginRight: '10px' }}
              />
              <label htmlFor={`option-${option._id}`} style={{ cursor: 'pointer' }}>
                {option.option}
              </label>
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
        {currentQuestionIndex < quizData.length - 1 ? (
          <button
            onClick={handleNextQuestion}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Keyingi
          </button>
        ) : (
          <button
            onClick={handleFinishQuiz}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Yakunlash
          </button>
        )}
      </div>

      {/* Agar natija mavjud bo'lsa, uni ko'rsatish */}
      {result && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <h3>Test yakunlandi!</h3>
          <p>To'g'ri javoblar soni: {result.correctCount}/{quizData.length}</p>
          <p>Foiz: {((result.correctCount / quizData.length) * 100).toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
};

export default Test;
