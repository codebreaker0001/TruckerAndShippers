import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import AuthPage from './components/AuthPage';
import Loads from './components/Load';
import Benefits from './components/Benefits'; // Import the Benefits component
import Navbar from './components/Navbar';
import { getToken } from './utils/auth';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/loads" element={getToken() ? <Loads /> : <Navigate to="/" replace />} />
        <Route path="/benefits" element={getToken() ? <Benefits /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
