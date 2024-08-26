import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import NotFound from './components/NotFound'; 
import Test from './components/Test';
import Word from './components/admin/Word';
import Fanlar from './components/Fanlar';
import FanlarOquvchi from './components/FanlarOquchi'
import Menu from './components/Menu';
import AdminPanel from './components/admin/AdminPanel';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); 
  return token ? children : <Navigate to="/" replace />; 
};

const App = () => {
  // const [userId, setUserId] = useState(null);

  // useEffect(() => {
  //   const storedUserId = localStorage.getItem('userID');
  //   setUserId(storedUserId);

  //   if (storedUserId) {
  //     // Masalan, foydalanuvchi ma'lumotlarini olish uchun so'rov
  //     axios.get(`http://localhost:5000/auth/login/${storedUserId}`)
  //       .then(response => {
  //         console.log('User data:', response.data);
  //       })
  //       .catch(error => {
  //         console.error('User ma\'lumotlarini olishda xatolik:', error);
  //       });
  //   } else {
  //     console.error('Foydalanuvchi ID topilmadi.');
  //   }
  // }, []);

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
          path="/fanlaroquvchi/test"
          element={
            <PrivateRoute>
              <Test />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/word"
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
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
