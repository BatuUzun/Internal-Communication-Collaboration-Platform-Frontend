// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import HomePage from './components/HomePage';
import ForgotPassword from './components/ForgotPassword';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect root URL to /login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginWrapper />} />
        <Route path="/signup" element={<SignupWrapper />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
};

// Wrapper for Login Component to use navigate
const LoginWrapper = () => {
  const navigate = useNavigate();
  return <Login onSwitchToSignup={() => navigate('/signup')} />;
};

// Wrapper for Signup Component to use navigate
const SignupWrapper = () => {
  const navigate = useNavigate();
  return <Signup onSwitchToLogin={() => navigate('/login')} />;
};

export default App;
