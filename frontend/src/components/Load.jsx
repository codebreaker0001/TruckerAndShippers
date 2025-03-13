import React, { useState, useEffect } from 'react';
import api from '../api';
import axios from 'axios';

const Loads = () => {
  const [loads, setLoads] = useState([]);
  const [routeFilter, setRouteFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchLoads = async () => {
    try {
      let query = '?';
      if (routeFilter) query += `route=${routeFilter}&`;
      if (startDate) query += `startDate=${startDate}&`;
      if (endDate) query += `endDate=${endDate}&`;
      const res = await api.get(`/loads${query}`);
      setLoads(res.data);
    } catch (err) {
      console.error('Error fetching loads:', err.response?.data);
    }
  };

  useEffect(() => {
    fetchLoads();
    // eslint-disable-next-line
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchLoads();
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Available Loads</h2>
      <form onSubmit={handleFilter} className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block font-medium mb-1">Route:</label>
          <input 
            type="text" 
            value={routeFilter} 
            onChange={(e) => setRouteFilter(e.target.value)} 
            placeholder="e.g., Delhi to Mumbai" 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Start Date:</label>
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">End Date:</label>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex items-end">
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Filter Loads
          </button>
        </div>
      </form>

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
