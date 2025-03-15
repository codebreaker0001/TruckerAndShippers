// src/components/BidForm.jsx
import React, { useState } from 'react';
import api from '../api';
import { getToken } from '../utils/auth';

const BidForm = ({ loadId, onBidPlaced }) => {
  const [bidAmount, setBidAmount] = useState('');

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(
        '/bids/place',
        { loadId, bidAmount: Number(bidAmount) },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      alert('Bid placed successfully!');
      setBidAmount('');
      if (onBidPlaced) onBidPlaced();
    } catch (err) {
      console.error('Error placing bid:', err.response?.data);
      alert(err.response?.data?.message || 'Failed to place bid.');
    }
  };
  
  return (
    <form onSubmit={handleBidSubmit} className="space-y-2">
      <input
        type="number"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
        placeholder="Enter your bid amount"
        className="p-2 border rounded w-full"
        required
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
        Place Bid
      </button>
    </form>
  );
};

export default BidForm;
