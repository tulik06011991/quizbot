import React from 'react';
import { useState } from 'react';

const AuthForm = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isLogin = mode === 'login';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Form submission logic here
    alert(`${isLogin ? 'Login' : 'Register'} successfully!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6">{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </div>
        </form>

        <p className="text-gray-600 text-center mt-4">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <a href={isLogin ? '/register' : '/login'} className="text-blue-500 ml-1">
            {isLogin ? 'Register' : 'Login'}
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;


<s></s>