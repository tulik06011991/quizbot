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
  const [Id, setId] = useState(null)

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
        .catch((error) => console.error('Foydalanuvchilarni olishda xatolik:', error));
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

    if (activeTab === 'subjects') {
      axiosInstance
        .get('http://localhost:5000/api/fanlar')
        .then((response) => setSubjects(response.data))
        .catch((error) => console.error('Fanlarni olishda xatolik:', error));
    }
  }, [activeTab]);
  console.log(users);
  

  const deleteQuestions = () => {
    axiosInstance
      .delete('http://localhost:5000/deleteAll/delete')
      .then((response) => {
        alert('Savollar va variantlar o\'chirildi');
        setQuestions([]);
      })
      .catch((error) => console.error('Savollarni o\'chirishda xatolik:', error));
  };
  const deleteUser = (id) => {
    setId(id)
    axiosInstance
      .delete(`http://localhost:5000/api/result/${Id}`, Id)
      .then((response) => {
        alert('Foydalanuvchi  o\'chirildi');
        
      })
      .catch((error) => console.error('Savollarni o\'chirishda xatolik:', error));
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
      <td className="border px-4 py-2">{user.userId._id}</td>
      <td className="border px-4 py-2">
        <button
          onClick={() => deleteUser(user.userId._id)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          O'chirish
        </button>
      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Savollar ro'yxati</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Yangi Savol Qo'shish
            </button>
            <table className="min-w-full table-auto mt-4">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">Savol</th>
                  <th className="px-8 py-2 text-left">Variantlar</th>
                  <th className="px-8 py-2 text-left">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question, index) => (
                  <tr key={index} className="bg-gray-100">
                    <td className="border px-4 py-2">{question.text}</td>
                    <td className="border px-4 py-2">
                      {question.variants.map((variant, idx) => (
                        <div key={idx}>{variant.text}</div>
                      ))}
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => openUpdateModal(question)}
                        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                      >
                        Yangilash
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'subjects' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Fanlar ro'yxati</h2>
            <table className="min-w-full table-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">Fanning nomi</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject, index) => (
                  <tr key={index} className="bg-gray-100">
                    <td className="border px-4 py-2">{subject.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for adding new question */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">Yangi Savol Qo'shish</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Savol:</label>
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Variantlar:</label>
              {newOptions.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Variant ${index + 1}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                />
              ))}
            </div>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Qo'shish
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 ml-2"
            >
              Yopish
            </button>
          </div>
        </div>
      )}

      {/* Modal for updating question */}
      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-bold mb-4">Savolni Yangilash</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Savol:</label>
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Variantlar:</label>
              {newOptions.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Variant ${index + 1}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                />
              ))}
            </div>
            <button
              onClick={handleUpdateQuestion}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              Yangilash
            </button>
            <button
              onClick={() => setShowUpdateModal(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 ml-2"
            >
              Yopish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
