import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Test = () => {
  const [quiz, setQuiz] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [timer, setTimer] = useState(45 * 60); // 45 daqiqa timer

  useEffect(() => {
    // Savollar va variantlarni olish uchun API chaqiruv
    const fetchQuiz = async () => {
      try {
        const response = await axios.get('http://localhost:5000/test/quiz'); // Quizni olish
        setQuiz(response.data); // Ma'lumotlarni quiz state'iga saqlash
      } catch (error) {
        console.error('Error fetching quiz:', error);
      }
    };

    fetchQuiz();

    // Timer funksiyasi
    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 0) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Variantni tanlash funksiyasi
  const handleOptionChange = (questionIndex, optionIndex) => {
    setSelectedOptions(prevState => ({
      ...prevState,
      [questionIndex]: optionIndex
    }));
  };

  // Keyingi savolga o'tish
  const handleNext = () => {
    setCurrentQuestionIndex(prevIndex => Math.min(prevIndex + 1, quiz.length - 1));
  };

  // Quizni topshirish funksiyasi
  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem('userId'); // `userId` ni `localStorage`dan olish
      if (!userId) {
        console.error('User ID not found in localStorage');
        return;
      }
  
      const answers = quiz.map((q, index) => ({
        questionId: q._id,
        selectedOptionId: String(selectedOptions[index]) // Tanlangan variant
      }));
  
      const response = await axios.post('http://localhost:5000/api/check-answers', {
        userId,
        answers
      });
  
      setResults(response.data); // Natijalarni saqlash
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  if (quiz.length === 0) {
    return <div className="loading">Loading...</div>; // Agar savollar hali yuklanmagan bo'lsa
  }

  const currentQuestion = quiz[currentQuestionIndex];
  if (!currentQuestion) {
    return <div className="no-question">Question not found</div>; // Agar savol topilmasa
  }

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <div className="test-container">
      <h2>Question {currentQuestionIndex + 1}</h2>
      <p>{currentQuestion.question}</p> {/* Savol matnini chiqarish */}
      <ul className="options-list">
        {currentQuestion.variants && currentQuestion.variants.length > 0 ? (
          currentQuestion.variants.map((variant, index) => (
            <li key={index} className="option-item">
              <input
                type="radio"
                name={`question-${currentQuestionIndex}`}
                value={index}
                checked={selectedOptions[currentQuestionIndex] === index}
                onChange={() => handleOptionChange(currentQuestionIndex, index)}
              />
              {variant.text} {/* Variant matnini chiqarish */}
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
      {isSubmitted && results && (
        <div className="results">
          <h3>Quiz Results</h3>
          <p>Correct answers: {results.correctCount}</p>
          <p>Total questions: {results.totalQuestions}</p>
          <p>Accuracy: {results.percentage}%</p>
        </div>
      )}
    </div>
  );
};

export default Test;
