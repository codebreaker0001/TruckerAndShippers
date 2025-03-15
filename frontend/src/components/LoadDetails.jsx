// src/components/LoadDetails.jsx
import React from 'react';
import LoadTracking from './LoadTracking';

const LoadDetails = ({ load }) => {
  return (
    <div className="bg-white p-4 rounded shadow my-4">
      <h2 className="text-2xl font-bold">{load.details}</h2>
      <p className="text-gray-600">Route: {load.route}</p>
      <p className="text-gray-500">Posted on: {new Date(load.createdAt).toLocaleDateString()}</p>
      {/* Embed the tracking component */}
      <LoadTracking loadId={load._id} />
    </div>
  );
};

export default LoadDetails;
