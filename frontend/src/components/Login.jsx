import axios from 'axios';
import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/auth/login',
        { email, password }
      );

      if (response.status === 200) {
        const { token, user } = response.data;
console.log(user)

        // Token va user ma'lumotlarini localStorage ga saqlash
        localStorage.setItem('token', token);
        localStorage.setItem('userID', user.id);

        if (user.role === true) {
          // Admin panelga yo'naltirish
          alert('Welcome to the admin panel!');
          window.location.href = '/admin';
        } else {
          // User panelga yo'naltirish
          alert('Welcome to the user panel!');
          window.location.href = '/fanlaroquvchi';
        }
      }
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      alert('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h2>

        <form onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password input */}
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring focus:border-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit button */}
          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Login
            </button>
          </div>
        </form>

        {/* Sign up link */}
        <p className="text-center text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-500 hover:text-blue-700">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
