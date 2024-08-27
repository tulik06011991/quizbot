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
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'users') {
          const response = await axiosInstance.get('http://localhost:5000/api/results');
          setUsers(response.data);
        }
        if (activeTab === 'questions') {
          const response = await axiosInstance.get('http://localhost:5000/savollar/question');
          if (Array.isArray(response.data)) {
            setQuestions(response.data);
          } else {
            console.error('Savollar massiv formatida emas:', response.data);
          }
        }
        if (activeTab === 'subjects') {
          const response = await axiosInstance.get('http://localhost:5000/api/fanlar');
          setSubjects(response.data);
        }
      } catch (error) {
        console.error(`${activeTab} ni olishda xatolik:`, error);
      }
    };

    fetchData();
  }, [activeTab]);

  const deleteQuestions = async () => {
    try {
      await axiosInstance.delete('http://localhost:5000/deleteAll/delete');
      alert('Savollar va variantlar o\'chirildi');
      setQuestions([]);
    } catch (error) {
      console.error('Savollarni o\'chirishda xatolik:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axiosInstance.delete(`http://localhost:5000/deleteAll/delete/${userId}`);
      alert('Foydalanuvchi o\'chirildi');
      setUsers(users.filter(user => user.userId?._id !== userId));
    } catch (error) {
      console.error('Foydalanuvchini o\'chirishda xatolik:', error);
    }
  };

  const handleSubmit = async () => {
    const newQuestionData = {
      text: newQuestion,
      variants: newOptions.map((option, index) => ({
        text: option,
        isCorrect: index === 0,
      })),
    };

    try {
      await axiosInstance.post('http://localhost:5000/api/question', newQuestionData);
      alert('Yangi savol qo\'shildi');
      setShowModal(false);
      setNewQuestion('');
      setNewOptions(['', '', '', '']);
      const response = await axiosInstance.get('http://localhost:5000/savollar/question');
      setQuestions(response.data);
    } catch (error) {
      console.error('Yangi savol qo\'shishda xatolik:', error);
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newOptions];
    updatedOptions[index] = value;
    setNewOptions(updatedOptions);
  };

  const handleUpdateQuestion = async () => {
    const updatedQuestionData = {
      text: newQuestion,
      variants: newOptions.map((option, index) => ({
        text: option,
        isCorrect: index === 0,
      })),
    };

    try {
      await axiosInstance.put(`http://localhost:5000/api/question/${currentQuestion._id}`, updatedQuestionData);
      alert('Savol yangilandi');
      setShowUpdateModal(false);
      setNewQuestion('');
      setNewOptions(['', '', '', '']);
      const response = await axiosInstance.get('http://localhost:5000/savollar/question');
      setQuestions(response.data);
    } catch (error) {
      console.error('Savolni yangilashda xatolik:', error);
    }
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
            onClick={deleteQuestions}
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
                {users.map((user) => (
                  <tr key={user.userId?._id} className="bg-gray-100">
                    <td className="border px-4 py-2">{user.userId?.name || 'N/A'}</td>
                    <td className="border px-4 py-2">{user.userId?.email || 'N/A'}</td>
                    <td className="border px-4 py-2">{user.score}</td>
                    <td className="border px-4 py-2">{user.percentage}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => deleteUser(user.userId?._id)}
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
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
            >
              Yangi Savol Qo'shish
            </button>
            <table className="min-w-full table-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left">Savol</th>
                  <th className="px-4 py-2 text-left">Variantlar</th>
                  <th className="px-4 py-2 text-left">To'g'ri Javob</th>
                  
                </tr>
              </thead>
              <tbody>
                {questions.map((question) => (
                  <tr key={question._id} className="bg-gray-100">
                    <td className="border px-4 py-2">{question.text}</td>
                    <td className="border px-4 py-2">
                      {question.variants.map((variant, index) => (
                        <div key={index}>{variant.text}</div>
                      ))}
                    </td>
                    <td className="border px-4 py-2">
                      {question.variants.find((v) => v.isCorrect)?.text || 'N/A'}
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
            <ul>
              {subjects.map((subject) => (
                <li key={subject._id} className="py-2 border-b">
                  {subject.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Yangi Savol Qo'shish</h2>
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Savol matni"
                className="border p-2 w-full mb-4"
              />
              {newOptions.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Variant ${index + 1}`}
                  className="border p-2 w-full mb-2"
                />
              ))}
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Saqlash
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

        {showUpdateModal && currentQuestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Savolni Yangilash</h2>
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Savol matni"
                className="border p-2 w-full mb-4"
              />
              {newOptions.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Variant ${index + 1}`}
                  className="border p-2 w-full mb-2"
                />
              ))}
              <button
                onClick={handleUpdateQuestion}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
    </div>
  );
};

export default AdminPanel;
