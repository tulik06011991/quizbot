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

  const handleOptionChange = (questionIndex, variantIndex) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questionIndex]: variantIndex
    }));
  };

  const handleTimerComplete = () => {
    setTimeUp(true);
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
      {timeUp ? (
        <div className="time-up-message">
          <p>Time's up!</p>
        </div>
      ) : (
        <div className="questions-container">
          {quizData.map((item, index) => (
            <div key={index} className="question-container">
              <p className="question-text">{item.question}</p>
              <ul className="variant-list">
                {item.variants.map((variant, vIndex) => (
                  <li key={vIndex} className="variant-item">
                    <label>
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={vIndex}
                        checked={selectedOptions[index] === vIndex}
                        onChange={() => handleOptionChange(index, vIndex)}
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
    </div>
  );
};

export default Quiz;
