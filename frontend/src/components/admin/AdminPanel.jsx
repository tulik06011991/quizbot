import React, { useState } from 'react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [showModal, setShowModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');

  // Foydalanuvchilar ro'yxati
  const users = [
    { name: 'Ali', email: 'ali@gmail.com', score: 90, class: 'A' },
    { name: 'Vali', email: 'vali@gmail.com', score: 85, class: 'B' },
  ];

  // Savollar ro'yxati
  const questions = [
    { id: 1, question: 'React nima?', options: ['JavaScript kutubxonasi', 'CSS ramkasi'] },
    { id: 2, question: 'MongoDB nima?', options: ['Ma\'lumotlar bazasi', 'Dasturlash tili'] },
  ];

  // Fanlar ro'yxati
  const subjects = ['Matematika', 'Ingliz tili', 'Fizika'];

  // Yangi savol qo'shish uchun
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newOptions];
    updatedOptions[index] = value;
    setNewOptions(updatedOptions);
  };

  const handleSubmit = () => {
    console.log('Yangi savol qo\'shildi:', newQuestion, newOptions);
    setShowModal(false);
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setActiveTab('subjectDetail');
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
            onClick={() => setActiveTab('deleteQuestions')} 
            className={`cursor-pointer py-2 ${activeTab === 'deleteQuestions' ? 'bg-gray-600' : ''}`}
          >
            Umumiy Savollarni O'chirish
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
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.score}</td>
                    <td className="px-4 py-2">{user.class}</td>
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
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Savol</th>
                  <th className="px-4 py-2">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((question, index) => (
                  <tr key={index} className="bg-gray-100">
                    <td className="px-4 py-2">{question.id}</td>
                    <td className="px-4 py-2">{question.question}</td>
                    <td className="px-4 py-2">
                      <button className="bg-red-600 text-white px-2 py-1 rounded mr-2">O'chirish</button>
                      <button className="bg-green-600 text-white px-2 py-1 rounded">O'zgartirish</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'deleteQuestions' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Umumiy Savollarni O'chirish</h2>
            <p>Bu bo'limda barcha savollarni o'chirishingiz mumkin.</p>
            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4">
              Savollarni O'chirish
            </button>
          </div>
        )}

        {activeTab === 'subjects' && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Fanlar Ro'yxati</h2>
            <ul>
              {subjects.map((subject, index) => (
                <li key={index} className="mb-2">
                  <button 
                    onClick={() => handleSubjectClick(subject)} 
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    {subject}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'subjectDetail' && (
          <button>

            <a href="/admin/word" className="px-6 py-3 bg-blue-500 text-white text-lg rounded-full shadow-lg hover:bg-blue-400 transition duration-300" >Start Quiz</a>
          </button>
        )}

        {/* Modal for adding new question */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Yangi Savol Qo'shish</h2>
              <input 
                type="text" 
                placeholder="Savol" 
                value={newQuestion} 
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full p-2 border mb-4 rounded"
              />
              {newOptions.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Variant ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full p-2 border mb-2 rounded"
                />
              ))}
              <button 
                onClick={handleSubmit} 
                className="bg-green-600 text-white px-4 py-2 rounded mr-2"
              >
                              Qo'shish
              </button>
              <button 
                onClick={() => setShowModal(false)} 
                className="bg-gray-500 text-white px-4 py-2 rounded"
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

