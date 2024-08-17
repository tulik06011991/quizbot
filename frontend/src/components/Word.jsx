import React, { useState } from 'react';
import axios from 'axios';

const WordUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('wordFile', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(response.data.message);
      setError(null);
      setFile(null); // Faylni formdan o'chirish
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error uploading file');
      setSuccess(null);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 lg:p-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Upload Word File</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <div className="mb-6">
          <label htmlFor="file" className="block text-lg font-medium text-gray-700 mb-2">Select Word File</label>
          <input
            type="file"
            id="file"
            name="wordFile"
            accept=".doc,.docx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default WordUpload;
