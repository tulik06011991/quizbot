import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const subjects = [
  { name: 'Ingliz tili', category: 'Tillar' },
  { name: 'Tarix', category: 'Gumanitar fanlar' },
  { name: 'Biologiya', category: 'Tabiiy fanlar' },
  { name: 'Matematika', category: 'Aniq fanlar' },
  { name: 'Tarbiya', category: 'Ijtimoiy fanlar' },
  { name: 'Informatika', category: 'Texnologiyalar' },
];

const Fanlar = () => {
  const [subjectList, setSubjectList] = useState(subjects);
  const navigate = useNavigate();

  const handleSubjectClick = (subjectName) => {
    // API so'rov yuborish (masalan, tanlangan fan ma'lumotlarini olish)
    axios.get(`http://localhost:5000/api/subject/${subjectName}`)
      .then(response => {
        // O'zingizga kerakli ma'lumotlar bilan ishlang
        console.log('Fan ma\'lumotlari:', response.data);
        // URL ga o'tish
        navigate(`/subject/${subjectName}`);
      })
      .catch(error => console.error('Fan ma\'lumotlarini olishda xatolik:', error));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Fanlar Ro'yxati</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {subjectList.map((subject, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => handleSubjectClick(subject.name)}
            >
              <h2 className="text-xl font-bold text-gray-700 mb-2">{subject.name}</h2>
              <p className="text-gray-600">{subject.category}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Fanlar;
