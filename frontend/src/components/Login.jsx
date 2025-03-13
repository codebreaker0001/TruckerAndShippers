// src/components/Loads.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import { getToken } from '../utils/auth';

const Loads = () => {
  const [loads, setLoads] = useState([]);
  const [details, setDetails] = useState('');
  const [route, setRoute] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    fetchLoads();
    // Retrieve role from token (assumes role is stored during login)
    const storedRole = localStorage.getItem('userRole');
    setUserRole(storedRole);
  }, []);

  const fetchLoads = async () => {
    try {
      const res = await api.get('/loads', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setLoads(res.data);
    } catch (err) {
      console.error('Error fetching loads:', err.response?.data);
    }
  };

  const handlePostLoad = async (e) => {
    e.preventDefault();
    try {
      await api.post('/loads/create', { details, route }, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      alert('Load posted successfully!');
      setDetails('');
      setRoute('');
      fetchLoads(); // Refresh loads list
    } catch (err) {
      console.error('Error posting load:', err.response?.data);
      alert('Failed to post load.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Available Loads</h2>

      {/* Show "Post Load" form only for shippers */}
      {userRole === 'shipper' && (
        <div className="bg-white p-6 rounded shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">Post a Load</h3>
          <form onSubmit={handlePostLoad} className="space-y-4">
            <input
              type="text"
              placeholder="Load Details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="text"
              placeholder="Route (e.g., Delhi to Mumbai)"
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
              Post Load
            </button>
          </form>
        </div>
      )}

      {/* Display available loads */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loads.map((load) => (
          <li key={load._id} className="p-4 bg-white rounded shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold">{load.details}</h3>
            <p className="text-gray-600">{load.route}</p>
            <p className="text-gray-500 text-sm mt-2">
              Posted on: {new Date(load.createdAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Loads;
