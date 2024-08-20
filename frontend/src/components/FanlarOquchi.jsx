import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Navigatsiya uchun import

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
  const navigate = useNavigate(); // useNavigate hookini oling

  const handleAddSubject = () => {
    const newSubject = prompt('Yangi fan nomini kiriting:');
    if (newSubject) {
      setSubjectList([...subjectList, { name: newSubject, category: 'Yangi fan' }]);
    }
  };

  const handleSubjectClick = (subject) => {
    // Har bir fan uchun navigatsiya
    navigate(`/menu/${subject.name.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Fanlar Ro'yxati</h1>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            onClick={handleAddSubject}
          >
            Yangi Fan Qo'shish
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {subjectList.map((subject, index) => (
            <div
              key={index}
              onClick={() => handleSubjectClick(subject)} // Fan bosilganda navigatsiya qilish
              className="p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105 cursor-pointer"
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
