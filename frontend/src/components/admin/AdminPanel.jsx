import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const axiosInstance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    // Foydalanuvchilar ro'yxatini olish
    if (activeTab === 'users') {
      axiosInstance
        .get('http://localhost:5000/api/results')
        .then((response) => setUsers(response.data))
        .catch((error) => console.error('Foydalanuvchilarni olishda xatolik:', error));
    }

    // Savollar ro'yxatini olish
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
    console.log(users)

    // Fanlar ro'yxatini olish
    if (activeTab === 'subjects') {
      axiosInstance
        .get('http://localhost:5000/api/fanlar')
        .then((response) => setSubjects(response.data))
        .catch((error) => console.error('Fanlarni olishda xatolik:', error));
    }
  }, [activeTab]);

  // Savollarni o'chirish funksiyasi
  const deleteQuestions = () => {
    axiosInstance
      .delete('http://localhost:5000/deleteAll/delete')
      .then((response) => {
        alert("Savollar va variantlar o'chirildi");
        setQuestions([]); // Savollarni tozalash
      })
      .catch((error) => console.error("Savollarni o'chirishda xatolik:", error));
  };

  // Yangi savol qo'shish funksiyasi
  const handleSubmit = () => {
    const newQuestionData = {
      text: newQuestion,
      variants: newOptions.map((option, index) => ({
        text: option,
        isCorrect: index === 0, // Birinchi variantni to'g'ri deb hisoblash
      })),
    };

    axiosInstance
      .post('http://localhost:5000/api/question', newQuestionData)
      .then((response) => {
        alert("Yangi savol qo'shildi");
        setShowModal(false);
        setNewQuestion('');
        setNewOptions(['', '', '', '']);
        // Savollarni yangilash
        axiosInstance
          .get('http://localhost:5000/savollar/question')
          .then((response) => setQuestions(response.data))
          .catch((error) => console.error('Savollarni olishda xatolik:', error));
      })
      .catch((error) => console.error('Yangi savol qo\'shishda xatolik:', error));
  };
  console.log(questions)

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newOptions];
    updatedOptions[index] = value;
    setNewOptions(updatedOptions);
  };

  // Savolni o'chirish funksiyasi
  const deleteQuestion = (id) => {
    axiosInstance
      .delete(`http://localhost:5000/api/question/${id}`)
      .then((response) => {
        alert("Savol o'chirildi");
        setQuestions(questions.filter((question) => question._id !== id));
      })
      .catch((error) => console.error("Savolni o'chirishda xatolik:", error));
  };
  const handleNewCategoryClick = () => {
    navigate('/admin/word'); // URLni '/admin/word' ga yo'naltiramiz
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
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
            onClick={() => deleteQuestions()} // delete funksiyasini shu yerga qo'ydik
            className={`cursor-pointer py-2`}
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
            onClick={handleNewCategoryClick} // Yangi fan kategoriyasini bosganda URL o'zgaradi
            className="cursor-pointer py-2 bg-blue-600 text-white rounded mt-4 px-2"
          >
            Yangi Fan Qo'shish
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-full lg:w-3/4 bg-gray-100 p-6">
        {/* Foydalanuvchilar ro'yxati */}
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
        <td className="border px-4 py-2">{user.userId.name}</td>
        <td className="border px-4 py-2">{user.userId.email}</td>
        <td className="border px-4 py-2">{user.score}</td>
        <td className="border px-4 py-2">{user.percentage}</td>
        <td className="border px-4 py-2">
          <button
            onClick={() => deleteQuestion(user._id)}
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

        {/* Savollar ro'yxati */}
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
                  <th className="px-4 py-2">Savol</th>
                  <th className="px-8 py-2">Variantlar</th>
                  <th className="px-8 py-2">O'chirish</th>
                  <th className="px-8 py-2">Fan nomi</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question, index) => (
                  <tr key={index} className="bg-gray-100">
                    <td className="px-4 py-2">{question.text}</td>
                    <td className="px-8 py-2">
                      <ul>
                        {question.variants.map((variant, idx) => (
                          <li key={idx}>{variant.text}{variant.isCorrect?('   ','      (to`g`ri)'):(' ')}</li>
                         
                        ))}
                      </ul>
                    </td>
                    <td className="px-8 py-2">
                      <button
                        onClick={() => deleteQuestion(question._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        O'chirish
                      </button>
                    </td>
                    <td className="px-8 py-2">{question.fanName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Yangi savol qo'shish modali */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Yangi Savol Qo'shish</h2>
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="border border-gray-300 p-2 w-full rounded-lg mb-4"
                placeholder="Savolni kiriting"
              />
              {newOptions.map((option, index) => (
                <input
                  key={index}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="border border-gray-300 p-2 w-full rounded-lg mb-2"
                  placeholder={`Variant ${index + 1}`}
                />
              ))}
              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-4"
              >
                Qo'shish
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        )}

        {/* Fanlar ro'yxati */}
        {activeTab === 'subjects' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Fanlar ro'yxati</h2>
            <table className="min-w-full table-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">Fan Nomi</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject, index) => (
                  <tr key={index} className="bg-gray-100">
                    <td className="px-4 py-2">{subject.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
