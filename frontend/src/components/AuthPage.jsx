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
      await api.post(`/auth/${role}/register`, {
        name,
        email,
        password,
      });
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
      const res = await api.post(`/auth/${role}/login`, { email, password, role }); // Ensure role is sent
      setToken(res.data.token);
      localStorage.setItem('userRole', res.data.user.role); // ✅ Store role in localStorage
      navigate('/loads');
    } catch (err) {
      console.error('Login error:', err.response?.data);
      alert(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 space-y-10 p-4">
      <h1 className="text-4xl font-bold">{role === 'trucker' ? 'Trucker' : 'Shipper'} {isLogin ? 'Login' : 'Register'}</h1>

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
          // Register Form
          <form onSubmit={handleRegister} className="space-y-4">
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" required />
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
