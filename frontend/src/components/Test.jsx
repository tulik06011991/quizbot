import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Test = () => {
  const [quiz, setQuiz] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [timer, setTimer] = useState(45 * 60); // 45 daqiqa timer
  const [isSubmitted, setIsSubmitted] = useState(false);

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

    // Timer sozlash
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 0) {
          clearInterval(interval);
          handleSubmit(); // Timer tugagandan so'ng submit qilish
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Component unmount bo'lganda intervalni to'xtatish
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
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  if (quiz.length === 0) {
    return <div className="loading">Loading...</div>;
  }

  // Hozirgi savolni olish
  const currentQuestion = quiz[currentQuestionIndex];
  if (!currentQuestion) {
    return <div className="no-question">Question not found</div>;
  }

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <div className="test-container">
      <h2>Question {currentQuestionIndex + 1}</h2>
      <p>{currentQuestion.question}</p>
      <ul className="options-list">
        {currentQuestion.options && currentQuestion.options.length > 0 ? (
          currentQuestion.options.map((option, index) => (
            <li key={index} className="option-item">
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
      <div className="controls">
        <button
          onClick={handleNext}
          disabled={currentQuestionIndex === quiz.length - 1 || isSubmitted}
        >
          Next
        </button>
        {currentQuestionIndex === quiz.length - 1 && !isSubmitted && (
          <button onClick={handleSubmit}>Submit</button>
        )}
      </div>
      <div className="timer">
        Time left: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </div>
      {isSubmitted && <div className="results">Thank you for completing the quiz!</div>}
    </div>
  );
};

export default Test;


