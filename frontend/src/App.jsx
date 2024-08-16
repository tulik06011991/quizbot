import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
// import Register from './components/Register'

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
