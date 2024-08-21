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

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Tokenni olish
  return token ? children : <Navigate to="/" replace />; // Token bo'lmasa login sahifasiga yo'naltirish
};

const App = () => {
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
