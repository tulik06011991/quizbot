import React, { useState } from 'react';
import axios from 'axios';

const Word = () => {
  const [file, setFile] = useState(null);    // Yuklanadigan faylni saqlash
  const [uploading, setUploading] = useState(false);  // Yuklash holati
  const [message, setMessage] = useState(''); // Natija haqida xabar

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);  // Faylni o'qish
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a Word file.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Faylni yuklash
      await axios.post('http://localhost:5000/api//upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('File uploaded successfully!');
    } catch (error) {
      setMessage('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Upload Word File</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center w-full h-32 border-4 border-dashed rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200">
            <div className="flex flex-col items-center justify-center pt-7">
              <svg
                className="w-8 h-8 text-gray-500 group-hover:text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16V7a4 4 0 018 0v9m5 4H4m16-4a4 4 0 01-8 0M8 12h8m-4-4v8"
                ></path>
              </svg>
              <p className="pt-1 text-sm text-gray-500">
                {file ? file.name : 'Click to select a Word file'}
              </p>
            </div>
            <input type="file" className="hidden" onChange={handleFileChange} accept=".doc,.docx" />
          </label>
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 text-white rounded-md ${
            uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {message && (
        <p className={`mt-4 text-center ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Word;
