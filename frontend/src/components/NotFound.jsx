// src/components/NotFound.js
import React from 'react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">404 - Page Not Found</h2>
        <p className="text-gray-600 mb-4">The page you are looking for does not exist.</p>
        <a href="/" className="text-blue-500 hover:text-blue-700">Go to Home</a>
      </div>
    </div>
  );
};

export default NotFound;
