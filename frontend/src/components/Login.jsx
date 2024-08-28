import axios from 'axios';
import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Xato holatini saqlash uchun

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email, password });

      if (response.status === 200) {
        const { token, user } = response.data;

        // Token va user ma'lumotlarini localStorage ga saqlash
        localStorage.setItem('token', token);
        localStorage.setItem('userID', user.id);

        if (user.role === true) {
          // Admin panelga yo'naltirish
          window.location.href = '/admin';
        } else {
          // User panelga yo'naltirish
          window.location.href = '/fanlaroquvchi';
        }
      }
    } catch (error) {
      // Xato bo'lsa, foydalanuvchiga xatolikni ko'rsatish
      setErrorMessage('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Welcome Back!</h2>
        <p className="text-center text-gray-600 mb-6">Login to access your account</p>

        <form onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className={`w-full px-4 py-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 
              ${errorMessage ? 'border-red-500' : 'border-gray-300'}`} // Xato bo'lsa qizil border
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password input */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className={`w-full px-4 py-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 
              ${errorMessage ? 'border-red-500' : 'border-gray-300'}`} // Xato bo'lsa qizil border
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error message */}
          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          {/* Submit button */}
          <div className="mb-6">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out"
            >
              Log In
            </button>
          </div>
        </form>

        {/* Sign up link */}
        <p className="text-center text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-indigo-600 hover:text-indigo-800 font-semibold">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
