// src/components/Loads.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import { getToken } from '../utils/auth';
import BidForm from './BidForm'; // For truckers to place bids
import LoadTracking from './LoadTracking'; // For shippers to track loads

const Loads = () => {
  const [loads, setLoads] = useState([]);
  const [details, setDetails] = useState('');
  const [route, setRoute] = useState('');
  const [userRole, setUserRole] = useState('');
  const [filterRoute, setFilterRoute] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // For truckers: track which load has bid form open
  const [activeBidLoadId, setActiveBidLoadId] = useState(null);
  
  // For shippers: track which load's bids are visible (allow multiple loads)
  const [visibleBids, setVisibleBids] = useState({});
  
  // For shippers: track which load's tracking is active
  const [trackingLoadId, setTrackingLoadId] = useState(null);

  useEffect(() => {
    fetchLoads();
    const storedRole = localStorage.getItem('userRole');
    console.log('User role from localStorage:', storedRole);
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  const fetchLoads = async () => {
    try {
      let query = '?';
      if (filterRoute) query += `route=${filterRoute}&`;
      if (startDate) query += `startDate=${startDate}&`;
      if (endDate) query += `endDate=${endDate}&`;
      const res = await api.get(`/loads${query}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      console.log('Fetched loads:', res.data);
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
      fetchLoads();
    } catch (err) {
      console.error('Error posting load:', err.response?.data);
      alert('Failed to post load.');
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchLoads();
  };

  // For truckers: Toggle bid form for a specific load
  const toggleBidForm = (loadId) => {
    console.log('Toggling bid form for load:', loadId);
    setActiveBidLoadId(activeBidLoadId === loadId ? null : loadId);
  };

  // For shippers: Toggle view bids for a load and fetch bids if needed
  const toggleViewBids = async (loadId) => {
    // Allow multiple loads' bids to be toggled independently
    if (visibleBids[loadId]) {
      // Hide bids if already visible
      setVisibleBids((prev) => {
        const newBids = { ...prev };
        delete newBids[loadId];
        return newBids;
      });
    } else {
      try {
        const res = await api.get(`/bids/load/${loadId}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        console.log(`Fetched bids for load ${loadId}:`, res.data);
        setVisibleBids((prev) => ({
          ...prev,
          [loadId]: res.data,
        }));
      } catch (err) {
        console.error('Error fetching bids:', err.response?.data);
        alert('Failed to load bids.');
      }
    }
  };

  // For shippers: Toggle load tracking for a load
  const toggleTracking = (loadId) => {
    console.log('Toggling tracking for load:', loadId);
    setTrackingLoadId((prev) => (prev === loadId ? null : loadId));
  };

  

  // For shippers: Call API to select the winning bid for a load
  const handleSelectWinningBid = async (loadId) => {
    try {
      await api.post(`/bids/select/${loadId}`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      alert('Winning bid selected.');
      fetchLoads();
      setVisibleBids((prev) => {
        const newBids = { ...prev };
        delete newBids[loadId];
        return newBids;
      });
    } catch (err) {
      console.error('Error selecting winning bid:', err.response?.data);
      alert('Failed to select winning bid.');
    }
  };

  

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Available Loads</h2>

      {/* Filter Loads Form (Visible to both Truckers & Shippers) */}
      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-4">Filter Loads</h3>
        <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block font-medium mb-1">Route:</label>
            <input 
              type="text" 
              value={filterRoute} 
              onChange={(e) => setFilterRoute(e.target.value)} 
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
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
              Filter Loads
            </button>
          </div>
        </form>
      </div>

      {/* Post Load Form: Only for Shippers */}
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
            <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition">
              Post Load
            </button>
          </form>
        </div>
      )}

      {/* Loads List */}
      <ul className="space-y-4">
        {loads.map((load) => (
          <li key={load._id} className="bg-white p-4 rounded shadow mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{load.details}</h3>
                <p className="text-gray-600">{load.route}</p>
                <p className="text-gray-500 text-sm">
                  Posted on: {new Date(load.createdAt).toLocaleDateString()}
                </p>
              </div>
              {/* For Truckers: Toggle Bid Form */}
              {userRole === 'trucker' && (
                <button
                  onClick={() => toggleBidForm(load._id)}
                  className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                >
                  {activeBidLoadId === load._id ? 'Cancel Bid' : 'Place Bid'}
                </button>
              )}
              {/* For Shippers: Buttons to View Bids and Track Load */}
              {userRole === 'shipper' && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => toggleViewBids(load._id)}
                    className="bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition"
                  >
                    {visibleBids[load._id] ? 'Hide Bids' : 'View Bids'}
                  </button>
                  <button
                    onClick={() => toggleTracking(load._id)}
                    className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition"
                  >
                    {trackingLoadId === load._id ? 'Hide Tracking' : 'Track Load'}
                  </button>
                </div>
              )}
            </div>

            {/* For Truckers: Show BidForm if toggled */}
            {userRole === 'trucker' && activeBidLoadId === load._id && (
              <div className="mt-4">
                <BidForm loadId={load._id} onBidPlaced={() => { fetchLoads(); setActiveBidLoadId(null); }} />
              </div>
            )}

            {/* For Shippers: Display Bids if toggled */}
            
            {userRole === 'shipper' && visibleBids[load._id] && (
              <div className="mt-4 p-4 border-t">
                <h4 className="text-lg font-semibold mb-2">Bids for this Load:</h4>
                {visibleBids[load._id].length > 0 ? (

                  <ul className="space-y-2">
                    {visibleBids[load._id].map((bid) => (
                      <li key={bid._id} className="p-2 border rounded">
                        <p className="font-medium">Bid Amount: ₹{bid.bidAmount}</p>
                        <p className="text-sm text-gray-500">
                          Bid Time: {new Date(bid.bidTime).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No bids placed for this load yet.</p>
                )}
                {/* Always show the Select Winning Bid button if there are bids and load is open */}
                {visibleBids[load._id] && visibleBids[load._id].length > 0 && (
                  <button
                    onClick={() => handleSelectWinningBid(load._id)}
                    className="mt-4 w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
                  >
                    Select Winning Bid
                  </button>
                )}
              </div>
            )}

            {/* For Shippers: Display Load Tracking if toggled */}
            {userRole === 'shipper' && trackingLoadId === load._id && (
              <div className="mt-4">
                <LoadTracking loadId={load._id} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Loads;
