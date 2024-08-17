import React, { useState } from 'react';
import axios from 'axios';

const Word = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    if (selectedFile) {
      const fileType = selectedFile.type;
      const validTypes = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];

      if (!validTypes.includes(fileType)) {
        setError('Invalid file type. Please upload a Word document (.docx or .doc).');
        setFile(null); // Clear file if invalid
      } else {
        setFile(selectedFile);
        setError(null); // Clear any previous error
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('wordFile', file);

    setUploading(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response?.data.message || 'An error occurred while uploading.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload a Word File</h2>
        <div className="mb-4">
          <input
            type="file"
            accept=".docx, .doc"
            onChange={handleFileChange}
            className="block w-full text-gray-700 bg-gray-100 border border-gray-300 rounded-md p-2"
          />
        </div>
        <button
          onClick={handleUpload}
          className={`w-full py-3 px-4 text-white font-semibold text-lg rounded-lg ${
            uploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        {success && (
          <p className="mt-4 text-lg text-green-600 font-semibold">{success}</p>
        )}
        {error && (
          <p className="mt-4 text-lg text-red-600 font-semibold">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Word;
