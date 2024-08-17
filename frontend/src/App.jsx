import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register'
import NotFound from './components/NotFound'; 
import Test from './components/Test';
import Word from './components/Word';
import Fanlar from './components/Fanlar';
import FanlarOquvchi from './components/FanlarOquchi'



const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/test" element={<Test />} />
        <Route path="/word" element={<Word />} />
        <Route path="/fanlar" element={<Fanlar />} />
        <Route path="/fanlaroquvchi" element={<FanlarOquvchi />} />
        <Route path="*" element={<NotFound />} /> {/* 404 sahifasini qo'shish */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
