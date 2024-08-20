import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Test = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(300); // 5 daqiqa
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // Timer yangilanishi
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit(); // Avtomatik submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Savollarni olish
    axios.get('/api/questions')
      .then(response => {
        setQuestions(response.data);
      })
      .catch(error => {
        console.error('Savollarni olishda xatolik:', error);
      });

    return () => clearInterval(interval);
  }, []);

  const handleChange = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; // Agar submit jarayonida bo'lsa, davom etmaslik
    setIsSubmitting(true);

    const userId = localStorage.getItem('userId'); // Foydalanuvchi ID'sini olish
    if (!userId) {
      alert('Foydalanuvchi ID topilmadi');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('/api/submit-quiz', { answers, userId });
      setResult(response.data);
    } catch (error) {
      console.error('Testni yuborishda xatolik:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div>
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: '#f4f4f4',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <h3>Timer</h3>
          <p>{formatTime(timer)}</p>
        </div>
        <h1>Test</h1>
        {questions.map(question => (
          <div key={question._id}>
            <h2>{question.question}</h2>
            {question.options.map(option => (
              <div key={option._id}>
                <input
                  type="radio"
                  id={option._id}
                  name={question._id}
                  value={option.option}
                  onChange={() => handleChange(question._id, option.option)}
                />
                <label htmlFor={option._id}>{option.option}</label>
              </div>
            ))}
          </div>
        ))}
        <button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Yuborilmoqda...' : 'Yuborish'}
        </button>
        {result && (
          <div>
            <h2>Natija</h2>
            <p>To'g'ri javoblar soni: {result.correctAnswersCount}</p>
            <p>Jami savollar: {result.totalQuestions}</p>
            <p>Foiz: {result.scorePercentage}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Test;
