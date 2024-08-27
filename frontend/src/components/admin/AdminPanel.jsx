import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    if (activeTab === 'users') {
      axiosInstance
        .get('http://localhost:5000/api/results')
        .then((response) => setUsers(response.data))
        .catch(navigate('/'));
    }

    if (activeTab === 'questions') {
      axiosInstance
        .get('http://localhost:5000/savollar/question')
        .then((response) => {
          if (Array.isArray(response.data)) {
            setQuestions(response.data);
          } else {
            console.error('Savollar massiv formatida emas:', response.data);
          }
        })
        .catch((error) => console.error('Savollarni olishda xatolik:', error));
    }
    console.log(questions);
    

    if (activeTab === 'subjects') {
      axiosInstance
        .get('http://localhost:5000/api/fanlar')
        .then((response) => setSubjects(response.data))
        .catch((error) => console.error('Fanlarni olishda xatolik:', error));
    }
  }, [activeTab]);
console.log(users, 'oxshamadi');

  const deleteQuestions = () => {
    axiosInstance
      .delete('http://localhost:5000/deleteAll/delete')
      .then((response) => {
        alert('Savollar va variantlar o\'chirildi');
        setQuestions([]);
      })
      .catch((error) => console.error('Savollarni o\'chirishda xatolik:', error));
  };

  const deleteUser = (Id) => {
    axiosInstance
      .delete(`http://localhost:5000/api/result/${Id}`)
      .then((response) => {
        alert('Foydalanuvchi o\'chirildi');
        setUsers(users.filter((user) => user.userId && user.userId._id !== Id)); // Update users list after deletion
      })
      .catch((error) => console.error('Foydalanuvchini o\'chirishda xatolik:', error));
  };

  const handleSubmit = () => {
    const newQuestionData = {
      text: newQuestion,
      variants: newOptions.map((option, index) => ({
        text: option,
        isCorrect: index === 0,
      })),
    };

    axiosInstance
      .post('http://localhost:5000/api/question', newQuestionData)
      .then((response) => {
        alert('Yangi savol qo\'shildi');
        setShowModal(false);
        setNewQuestion('');
        setNewOptions(['', '', '', '']);
        axiosInstance
          .get('http://localhost:5000/savollar/question')
          .then((response) => setQuestions(response.data))
          .catch((error) => console.error('Savollarni olishda xatolik:', error));
      })
      .catch((error) => console.error('Yangi savol qo\'shishda xatolik:', error));
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newOptions];
    updatedOptions[index] = value;
    setNewOptions(updatedOptions);
  };

  const handleUpdateQuestion = () => {
    const updatedQuestionData = {
      text: newQuestion,
      variants: newOptions.map((option, index) => ({
        text: option,
        isCorrect: index === 0,
      })),
    };

    axiosInstance
      .put(`http://localhost:5000/api/question/${currentQuestion._id}`, updatedQuestionData)
      .then((response) => {
        alert('Savol yangilandi');
        setShowUpdateModal(false);
        setNewQuestion('');
        setNewOptions(['', '', '', '']);
        axiosInstance
          .get('http://localhost:5000/savollar/question')
          .then((response) => setQuestions(response.data))
          .catch((error) => console.error('Savollarni olishda xatolik:', error));
      })
      .catch((error) => console.error('Savolni yangilashda xatolik:', error));
  };

  const handleNewCategoryClick = () => {
    navigate('/admin/word');
  };

  const openUpdateModal = (question) => {
    setCurrentQuestion(question);
    setNewQuestion(question.text);
    setNewOptions(question.variants.map((variant) => variant.text));
    setShowUpdateModal(true);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="w-full lg:w-1/4 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        <ul>
          <li
            onClick={() => setActiveTab('users')}
            className={`cursor-pointer py-2 ${activeTab === 'users' ? 'bg-gray-600' : ''}`}
          >
            Foydalanuvchilar
          </li>
          <li
            onClick={() => setActiveTab('questions')}
            className={`cursor-pointer py-2 ${activeTab === 'questions' ? 'bg-gray-600' : ''}`}
          >
            Savollar
          </li>
          <li
            onClick={() => deleteQuestions()}
            className="cursor-pointer py-2"
          >
            Umumiy Savollarni O'chirish
          </li>
          <li
            onClick={() => setActiveTab('subjects')}
            className={`cursor-pointer py-2 ${activeTab === 'subjects' ? 'bg-gray-600' : ''}`}
          >
            Fanlar
          </li>
          <li
            onClick={handleNewCategoryClick}
            className="cursor-pointer py-2 bg-blue-600 text-white rounded mt-4 px-2"
          >
            Yangi Fan Qo'shish
          </li>
        </ul>
      </div>

      <div className="w-full lg:w-3/4 bg-gray-100 p-6">
        {activeTab === 'users' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Foydalanuvchilar ro'yxati</h2>
            {users.length === 0 ? (
              <p className="text-center text-gray-500">Foydalanuvchilar yo'q</p>
            ) : (
              <table className="min-w-full table-auto">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left">Ism</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">To'plagan ballari</th>
                    <th className="px-4 py-2 text-left">Foizi</th>
                    <th className="px-4 py-2 text-left">Foydalanuvchi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index} className="bg-gray-100">
                      <td className="border px-4 py-2">{user.userId ? user.userId.name : 'N/A'}</td>
                      <td className="border px-4 py-2">{user.userId ? user.userId.email : 'N/A'}</td>
                      <td className="border px-4 py-2">{user.score}</td>
                      <td className="border px-4 py-2">{user.percentage}</td>
                     
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => deleteUser(user.userId ? user.userId._id : null)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          disabled={!user.userId} // Disable button if user.userId is null
                        >
                          O'chirish
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Savollar ro'yxati</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-500 text-white px-4 py-2 rounded mb-4"
            >
              Yangi Savol Qo'shish
            </button>
            {questions.length === 0 ? (
              <p className="text-center text-gray-500">Savollar yo'q</p>
            ) : (
              <ul>
                {questions.map((question) => (
                  <li key={question._id} className="border-b border-gray-300 py-2">
                    <div className="font-bold">{question.text}</div>
                    <ul className="list-disc pl-5">
                      {question.variants.map((variant, index) => (
                        <li key={index} className={`${variant.isCorrect ? 'font-bold' : ''}`}>
                          {variant.text}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => openUpdateModal(question)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
                    >
                      Yangilash
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'subjects' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Fanlar ro'yxati</h2>
            {subjects.length === 0 ? (
              <p className="text-center text-gray-500">Fanlar yo'q</p>
            ) : (
              <ul>
                {subjects.map((subject) => (
                  <li key={subject._id} className="border-b border-gray-300 py-2">
                    {subject.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Modal for adding new question */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Yangi Savol Qo'shish</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Savol:</label>
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="border rounded w-full px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Variantlar:</label>
              {newOptions.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Variant ${index + 1}`}
                  className="border rounded w-full px-3 py-2 mb-2"
                />
              ))}
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Saqlash
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for updating question */}
            {/* Modal for updating question */}
            {showUpdateModal && currentQuestion && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Savolni Yangilash</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Savol:</label>
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="border rounded w-full px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Variantlar:</label>
              {newOptions.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Variant ${index + 1}`}
                  className="border rounded w-full px-3 py-2 mb-2"
                />
              ))}
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleUpdateQuestion}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Yangilash
              </button>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

