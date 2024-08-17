import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Test = ({ testId }) => {
  const [test, setTest] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/test`);
       
        setTest(response.data);
      } catch (err) {
        setError('Testni yuklashda xatolik yuz berdi');
      }
    };
    
    fetchTest();
  }, []);
  
  console.log(test)
  if (error) {
    return <div>{error}</div>;
  }

  if (!test) {
    return <div>Test yuklanmoqda...</div>;
  }
  console.log(test)

  return (
    <div className="test-container">
      <h1>{test.originalFileName}</h1>
      {test.questions.map((question, index) => (
        <div key={index} className="question">
          <p>{index + 1}. {question.questionText}</p>
          <ul>
            {question.options.map((option, idx) => (
              <li key={idx}>{option}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Test;
