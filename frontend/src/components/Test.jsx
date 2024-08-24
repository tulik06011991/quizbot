import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Countdown from 'react-countdown';
import '../index.css'; // Stylingni alohida faylda saqlaymiz

const Quiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [timeUp, setTimeUp] = useState(false); // Timer tugaganligi holati
  const [submitted, setSubmitted] = useState(false); // Formani yuborish holati
  const [natija, setNatija] = useState({}); // Natijalarni saqlash

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get('http://localhost:5000/test/quiz');
        setQuizData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch quiz data');
        setLoading(false);
      }
    };

    fetchQuiz();
  }, []);

  useEffect(() => {
    if (timeUp && !submitted) {
      handleSubmit(); // Timer tugagandan so'ng submit qilish
    }
  }, [timeUp]);

  const handleOptionChange = (questionIndex, variantId) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questionIndex]: variantId
    }));
  };

  const handleTimerComplete = () => {
    setTimeUp(true);
  };
  const handleSubmit = async () => {
    if (submitted) return; // Agar form yuborilgan bo'lsa, hech narsa qilmaslik
  
    const userId = localStorage.getItem('userID'); // localStorage dan userId olish
  
    try {
      const response = await axios.post('http://localhost:5000/test/submit', {
        userId, // Foydalanuvchi ID
        answers: selectedOptions // Savollar va variantlar
      });
      setNatija(response.data); // Natijani saqlash
      setSubmitted(true);
    } catch (err) {
      alert('Failed to submit quiz. Please try again.');
    }
  };
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="quiz-container">
      <div className="timer-container">
        <Countdown
          date={Date.now() + 45 * 60 * 1000} // 45 daqiqa
          onComplete={handleTimerComplete}
          renderer={({ minutes, seconds }) => (
            <div className="timer">
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </div>
          )}
        />
      </div>
      {timeUp || submitted ? (
        <div className="result-container">
          <p>Your score: {natija.score} / {natija.totalQuestions}</p>
          <p>Percentage: {natija.percentage}%</p>
        </div>
      ) : (
        <div className="questions-container">
          {quizData.map((item, index) => (
            <div key={index} className="question-container">
              <p className="question-text">{item.question}</p>
              <ul className="variant-list">
                {item.variants.map((variant) => (
                  <li key={variant._id} className="variant-item">
                    <label>
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={variant._id}
                        checked={selectedOptions[index] === variant._id}
                        onChange={() => handleOptionChange(index, variant._id)}
                        disabled={timeUp} // Timer tugaganidan keyin variantlarni tanlashni bloklash
                      />
                      {variant.text}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {!timeUp && (
        <button
          className="submit-button"
          onClick={handleSubmit}
          disabled={submitted} // Agar form yuborilgan bo'lsa, tugmani bloklash
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default Quiz;
