import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Menu from './components/Menu';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import NotFound from './components/NotFound'; 
import Test from './components/Test';
import Word from './components/Word';
import Fanlar from './components/Fanlar';
import FanlarOquvchi from './components/FanlarOquchi'

// PrivateRoute funksiyasini token tekshiruvi uchun yaratamiz
const PrivateRoute = ({ element: Component, ...rest }) => {
  const token = localStorage.getItem('token'); // Tokenni localStorage dan olamiz
  return token ? Component : <Navigate to="/login" />; // Agar token bo'lsa, komponentni render qilamiz, aks holda login sahifasiga yo'naltiramiz
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Login va Register sahifalari umumiy */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* PrivateRoute orqali himoyalangan sahifalar */}
        <Route path="/fanlaroquvchi/menu" element={<PrivateRoute element={<Menu />} />} />
        <Route path="/menu/biologiya" element={<PrivateRoute element={<Test />} />} />
        <Route path="/word" element={<PrivateRoute element={<Word />} />} />
        <Route path="/fanlar" element={<PrivateRoute element={<Fanlar />} />} />
        <Route path="/fanlaroquvchi" element={<PrivateRoute element={<FanlarOquvchi />} />} />
        
        {/* 404 NotFound sahifasi */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
