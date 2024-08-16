import React from 'react'

const Footer = () => {
  return (
    <footer className="w-full py-4 bg-gray-800">
    <div className="max-w-7xl mx-auto text-center text-white">
      &copy; {new Date().getFullYear()} Quiz Bot. All rights reserved.
    </div>
  </footer>
  )
}

export default Footer