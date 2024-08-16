import React from 'react'

const Menu = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
    {/* Navbar */}
    <header className="w-full py-4 bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Quiz Bot</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="text-white hover:text-gray-300">Home</a></li>
            <li><a href="#" className="text-white hover:text-gray-300">Quizzes</a></li>
            <li><a href="#" className="text-white hover:text-gray-300">Profile</a></li>
          </ul>
        </nav>
      </div>
    </header>

    {/* Main Section */}
    <main className="flex-grow flex flex-col justify-center items-center text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to the Quiz Bot</h2>
      <p className="text-gray-600 mb-8">Test your knowledge and improve your skills</p>
      <button className="px-6 py-3 bg-blue-500 text-white text-lg rounded-full shadow-lg hover:bg-blue-400 transition duration-300">
        Start Quiz
      </button>
    </main>

    {/* Footer */}
    <footer className="w-full py-4 bg-gray-800">
      <div className="max-w-7xl mx-auto text-center text-white">
        &copy; {new Date().getFullYear()} Quiz Bot. All rights reserved.
      </div>
    </footer>
  </div>
  )
}

export default Menu