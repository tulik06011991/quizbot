import React from 'react';
import { FaPlus } from 'react-icons/fa'; // React-icons kutubxonasidan + icon

const subjects = [
  { name: 'Ingliz tili', category: 'Tillar' },
  { name: 'Tarix', category: 'Gumanitar fanlar' },
  { name: 'Biologiya', category: 'Tabiiy fanlar' },
  { name: 'Matematika', category: 'Aniq fanlar' },
  { name: 'Tarbiya', category: 'Ijtimoiy fanlar' },
  { name: 'Informatika', category: 'Texnologiyalar' },
];

const Fanlar = () => {
  const handleAddSubject = () => {
    // Yangi fan qo'shish uchun ishlatiladigan funksiyani yozishingiz mumkin
    alert('Yangi fan qo\'shish funksiyasi!');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow container mx-auto py-8">
        <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">Fanlar Ro'yxati</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <div
              key={index}
              className="relative p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition duration-300 transform hover:scale-105"
            >
              <h2 className="text-xl font-bold text-gray-700 mb-2">{subject.name}</h2>
              <p className="text-gray-600">{subject.category}</p>
              {/* + icon tepa o'ng burchagida joylashadi */}
              <FaPlus
                className="absolute top-4 right-4 text-blue-500 cursor-pointer hover:text-blue-700"
                size={20}
                onClick={handleAddSubject}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Fanlar;
