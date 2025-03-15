// src/components/Benefits.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import { getToken } from '../utils/auth';

const Benefits = () => {
  const [benefits, setBenefits] = useState([]);
  const [selectedBenefit, setSelectedBenefit] = useState('');
  const [claimDescription, setClaimDescription] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBenefits();
  }, []);

  const fetchBenefits = async () => {
    try {
      const res = await api.get('/benefits/trucker', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setBenefits(res.data);
    } catch (err) {
      console.error('Error fetching benefits:', err.response?.data);
      setMessage('Failed to load benefits.');
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBenefit) {
      setMessage('Please select a benefit to claim.');
      return;
    }
    try {
      const res = await api.post('/benefits/claim', { benefitType: selectedBenefit, description: claimDescription }, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setMessage(res.data.message);
      // Clear form fields after successful submission
      setSelectedBenefit('');
      setClaimDescription('');
    } catch (err) {
      console.error('Error submitting claim:', err.response?.data);
      setMessage(err.response?.data?.message || 'Failed to submit claim.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Truckers Benefits</h2>
      {message && <p className="mb-4 text-red-600">{message}</p>}
      <ul className="space-y-4 mb-6">
        {benefits.map((benefit, index) => (
          <li key={index} className="p-4 bg-white rounded shadow">
            <h3 className="text-xl font-semibold">{benefit.benefitType}</h3>
            <p>{benefit.description}</p>
          </li>
        ))}
      </ul>
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-2xl font-semibold mb-4">Claim a Benefit</h3>
        <form onSubmit={handleClaimSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Select Benefit:</label>
            <select
              value={selectedBenefit}
              onChange={(e) => setSelectedBenefit(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">-- Select a Benefit --</option>
              {benefits.map((benefit, index) => (
                <option key={index} value={benefit.benefitType}>
                  {benefit.benefitType}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Description (Optional):</label>
            <textarea
              value={claimDescription}
              onChange={(e) => setClaimDescription(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Describe your claim or why you need this benefit..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Submit Claim
          </button>
        </form>
      </div>
    </div>
  );
};

export default Benefits;
