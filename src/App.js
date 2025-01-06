import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate
import store, { persistor } from './slices/store'; // Import persistor
import Login from './components/Login';
import Signup from './components/Signup';
import HomePage from './components/HomePage';
import ForgotPassword from './components/ForgotPassword';
import VerifyAccount from './components/VerifyAccount';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            {/* Redirect root URL to /login */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginWrapper />} />
            <Route path="/signup" element={<SignupWrapper />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verify-account"
              element={
                <ProtectedRoute>
                  <VerifyAccount />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
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
