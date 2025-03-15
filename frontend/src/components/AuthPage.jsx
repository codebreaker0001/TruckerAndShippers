// src/components/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { setToken } from '../utils/auth';

const AuthPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle between login & register
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Truckers' eligibility fields
  const [accidents, setAccidents] = useState(0);
  const [theftComplaints, setTheftComplaints] = useState(0);
  const [truckAge, setTruckAge] = useState('');
  const [licenseIssueDate, setLicenseIssueDate] = useState('');

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
      navigate('/'); // Redirect to home if role is not set
    } else {
      setRole(userRole);
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        email,
        password,
        role,
      };

      // Add eligibility fields for truckers
      if (role === 'trucker') {
        payload.accidents = Number(accidents);
        payload.theftComplaints = Number(theftComplaints);
        payload.truckAge = Number(truckAge);
        payload.licenseIssueDate = licenseIssueDate;
      }

      await api.post(`/auth/${role}/register`, payload);
      alert('Registration successful! Please log in.');
      setIsLogin(true); // Switch to login after registration
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      alert(err.response?.data?.message || 'Registration failed.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/auth/${role}/login`, { email, password });
      setToken(res.data.token);
      localStorage.setItem('userRole', res.data.user.role); // Store role for frontend checks
      navigate('/loads');
    } catch (err) {
      console.error('Login error:', err.response?.data);
      alert(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 space-y-10 p-4">
      <h1 className="text-4xl font-bold">{role === 'trucker' ? 'Trucker' : 'Shipper'} Authentication</h1>

      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">{isLogin ? 'Login' : 'Register'}</h2>

        {isLogin ? (
          // Login Form
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" required />
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
              Login
            </button>
          </form>
        ) : (
          // Registration Form
          <form onSubmit={handleRegister} className="space-y-4">
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" required />

            {/* Trucker-specific fields */}
            {role === 'trucker' && (
              <>
                <input
                  type="number"
                  placeholder="Number of Accidents"
                  value={accidents}
                  onChange={(e) => setAccidents(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Number of Theft Complaints"
                  value={theftComplaints}
                  onChange={(e) => setTheftComplaints(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Truck Age (years)"
                  value={truckAge}
                  onChange={(e) => setTruckAge(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="date"
                  placeholder="License Issue Date"
                  value={licenseIssueDate}
                  onChange={(e) => setLicenseIssueDate(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </>
            )}

            <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition">
              Register
            </button>
          </form>
        )}

        {/* Toggle between Login & Register */}
        <div className="text-center mt-4">
          {isLogin ? (
            <p>
              Don't have an account?{" "}
              <button onClick={() => setIsLogin(false)} className="text-blue-500 underline">
                Register
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button onClick={() => setIsLogin(true)} className="text-blue-500 underline">
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
