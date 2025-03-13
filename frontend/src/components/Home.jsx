// src/components/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleSelect = (userType) => {
    // Navigate to the respective auth page based on role
    if (userType === 'trucker') {
      navigate('/auth/trucker');
    } else if (userType === 'shipper') {
      navigate('/auth/shipper');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Select Your Role</h1>
      <div className="flex gap-8">
        {/* Trucker Card */}
        <div 
          onClick={() => handleSelect('trucker')}
          className="cursor-pointer bg-white shadow-md hover:shadow-lg p-8 rounded-lg w-64 text-center transition transform hover:scale-105"
        >
          <h2 className="text-2xl font-semibold mb-4">Trucker</h2>
          <p className="text-gray-600">I am a trucker looking for loads.</p>
        </div>

        {/* Shipper Card */}
        <div 
          onClick={() => handleSelect('shipper')}
          className="cursor-pointer bg-white shadow-md hover:shadow-lg p-8 rounded-lg w-64 text-center transition transform hover:scale-105"
        >
          <h2 className="text-2xl font-semibold mb-4">Shipper</h2>
          <p className="text-gray-600">I am a shipper posting loads.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
