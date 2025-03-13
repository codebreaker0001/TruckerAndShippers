// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import TruckerAuth from './components/TruckerAuth';
import ShipperAuth from './components/ShipperAuth';
import Navbar from './components/Navbar';
import Loads from './components/Load';
import { getToken } from './utils/auth';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/trucker" element={<TruckerAuth />} />
        <Route path="/auth/shipper" element={<ShipperAuth />} />
        <Route 
          path="/loads" 
          element={getToken() ? <Loads /> : <Navigate to="/" replace />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
