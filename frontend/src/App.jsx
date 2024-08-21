import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import NotFound from './components/NotFound'; 
import Test from './components/Test';
import Word from './components/Word';
import Fanlar from './components/Fanlar';
import FanlarOquvchi from './components/FanlarOquchi';
import Menu from './components/Menu'; // Menu komponentini qo'shdik

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Tokenni olish
  return token ? children : <Navigate to="/" replace />; // Token bo'lmasa login sahifasiga yo'naltirish
};

const App = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);

    if (storedUserId) {
      // Masalan, foydalanuvchi ma'lumotlarini olish uchun so'rov
      axios.get(`http://localhost:5000/auth/login/${storedUserId}`)
        .then(response => {
          // Foydalanuvchi ma'lumotlarini saqlash (agar kerak bo'lsa)
          console.log('User data:', response.data);
        })
        .catch(error => {
          console.error('User ma\'lumotlarini olishda xatolik:', error);
        });
    } else {
      console.error('Foydalanuvchi ID topilmadi.');
    }
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/menu"
          element={
            <PrivateRoute>
              <Menu />
            </PrivateRoute>
          }
        />
        <Route
          path="/test"
          element={
            <PrivateRoute>
              <Test />
            </PrivateRoute>
          }
        />
        <Route
          path="/word"
          element={
            <PrivateRoute>
              <Word />
            </PrivateRoute>
          }
        />
        <Route
          path="/fanlar"
          element={
            <PrivateRoute>
              <Fanlar />
            </PrivateRoute>
          }
        />
        <Route
          path="/fanlaroquvchi"
          element={
            <PrivateRoute>
              <FanlarOquvchi />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} /> {/* 404 sahifasini qo'shish */}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
