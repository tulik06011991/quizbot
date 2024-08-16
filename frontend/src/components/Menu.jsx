import React from 'react'

const Menu = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
 

    <main className="flex-grow flex flex-col justify-center items-center text-center">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to the Quiz Bot</h2>
      <p className="text-gray-600 mb-8">Test your knowledge and improve your skills</p>
      <button className="px-6 py-3 bg-blue-500 text-white text-lg rounded-full shadow-lg hover:bg-blue-400 transition duration-300">
        Start Quiz
      </button>
    </main>

  </div>
  )
}

export default Menu