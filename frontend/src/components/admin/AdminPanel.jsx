import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Axios orqali API chaqiruvlarini amalga oshirish uchun

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);

  // Sahifa yuklanganda ma'lumotlarni olish
  useEffect(() => {
    const token = localStorage.getItem('token'); // Tokenni localStorage'dan olish

const axiosInstance = axios.create({
  headers: {
    'Authorization': `Bearer ${token}` // Tokenni Authorization headerga qo'shish
  }
});
    // Foydalanuvchilar ro'yxatini olish
    if (activeTab === 'users') {
     axiosInstance.get('http://localhost:5000/api/results')
        .then(response => {
          setUsers(response.data); // Foydalanuvchilar ro'yxatini o'rnatish
        })
        .catch(error => {
          console.error('Foydalanuvchilarni olishda xatolik:', error);
        });
    }
    console.log(users)
    

    // Savollar ro'yxatini olish
    if (activeTab === 'questions') {
      axiosInstance.get('http://localhost:5000/savollar/question')
      .then(response => {
        if (Array.isArray(response.data)) {
          setQuestions(response.data); // Savollarni o'rnatish
        } else {
          console.error('Savollar massiv formatida emas:', response.data);
        }
      })
      .catch(error => {
        console.error('Savollarni olishda xatolik:', error);
      });
    }
   console.log(questions)
   
    

    // Fanlar ro'yxatini olish
    if (activeTab === 'subjects') {
     axiosInstance.get('/api/subjects')
        .then(response => {
          setSubjects(response.data); // Fanlarni o'rnatish
        })
        .catch(error => {
          console.error('Fanlarni olishda xatolik:', error);
        });
    }
  }, [activeTab]);

  // Savolni o'chirish funksiyasi
  const deleteQuestion = () => {
   axiosInstance.delete(`http://localhost:5000/deleteAll/delete`)
      .then(response => {
        alert('savollar o"chirildi'); // Savol o'chirilgandan keyin yangilash
      })
      .catch(error => {
        console.error('Savolni o\'chirishda xatolik:', error);
      });
  };

  // Yangi savol qo'shish funksiyasi
  const handleSubmit = () => {
    console.log('Yangi savol qo\'shildi:', newQuestion, newOptions);
    setShowModal(false);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newOptions];
    updatedOptions[index] = value;
    setNewOptions(updatedOptions);
  };

  // UI qismi
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
            onClick={() => setActiveTab('deleteQuestions')} 
            className={`cursor-pointer py-2 ${activeTab === 'deleteQuestions' ? 'bg-gray-600' : ''}`}
          ><button onClick={deleteQuestion}> Umumiy Savollarni O'chirish</button>
           
          </li>
          <li 
            onClick={() => setActiveTab('subjects')} 
            className={`cursor-pointer py-2 ${activeTab === 'subjects' ? 'bg-gray-600' : ''}`}
          >
            Fanlar
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
                  <th className="px-4 py-2">Ism</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">To'plagan ballari</th>
                  <th className="px-4 py-2">Sinf</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className="bg-gray-100">
                    <td className="px-4 py-2">{user.userId.name}</td>
                    <td className="px-4 py-2">{user.userId.email}</td>
                    <td className="px-4 py-2">{user.score}</td>
                    <td className="px-4 py-2">{user.class}</td>
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
                <tr  >
                  
                  <th className="px-4 py-2 ">Savol</th>
                  
                  <th className="px-8 py-2">Amallar</th>
                  <th className="px-8 py-2"></th>
                  <th className="px-8 py-2"></th>
                  
                </tr>
              </thead>
              <tbody>
                {questions.map((question, index) => (
                  <tr key={index} className="bg-gray-100">
                    
                     <td className="px-6 py-2">{question.text}</td>
                    <td className="px-4 py-2 ">
                      {
                        questions.variants.map((v, index

                        )=>(
                          <td className="px-6 py-2">{v.text}</td>

                        ))
                      }
                      
                      
                    <td className="px-4 py-2">{question.id}</td>
                    <td className="px-4 py-2">{question.id}</td>
                      <button 
                        className="bg-red-600 text-white px-2 py-1 rounded mr-2" 
                        onClick={() => deleteQuestion(question)}
                      >
                        O'chirish
                      </button>
                      <button className="bg-green-600 text-white px-2 py-1 rounded">O'zgartirish</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Umumiy savollarni o'chirish */}
        {activeTab === 'deleteQuestions' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Umumiy Savollarni O'chirish</h2>
            <p>Bu bo'limda barcha savollarni o'chirishingiz mumkin.</p>
            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4">
              Savollarni O'chirish
            </button>
          </div>
        )}

        {/* Fanlar ro'yxati */}
        {activeTab === 'subjects' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Fanlar Ro'yxati</h2>
            <ul>
              {subjects.map((subject, index) => (
                <li key={index} className="mb-2">
                  <button 
                    onClick={() => alert(`Fan: ${subject}`)} 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    {subject}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Yangi savol qo'shish modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-xl font-bold mb-4">Yangi Savol Qo'shish</h2>
              <input 
                type="text" 
                placeholder="Savolni kiriting" 
                className="w-full p-2 mb-4 border rounded"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
              {newOptions.map((option, index) => (
                <input 
                  key={index} 
                  type="text" 
                  placeholder={`Variant ${index + 1}`} 
                  className="w-full p-2 mb-2 border rounded"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              ))}
              <div className="flex justify-end">
                <button 
                  className="bg-gray-600 text-white px-4 py-2 rounded mr-2" 
                  onClick={() => setShowModal(false)}
                >
                  Bekor qilish
                </button>
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded" 
                  onClick={handleSubmit}
                >
                  Qo'shish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
