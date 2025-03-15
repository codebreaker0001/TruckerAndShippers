// src/components/LoadTracking.jsx
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default icon issues with Leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Helper component to change the view when location updates
function ChangeMapView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

const LoadTracking = ({ loadId }) => {
  const [location, setLocation] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  // Define a default location (e.g., Bangalore coordinates)
  const defaultLocation = [12.9716, 77.5946];

  useEffect(() => {
    if (!loadId) return;

    const socket = io('http://localhost:5000'); // update with your backend URL if needed

    socket.emit('joinLoad', loadId);
    console.log("Joined room for load:", loadId);

    socket.on('connect', () => {
      console.log("Socket connected with id:", socket.id);
    });

    // Listen for location updates
    socket.on('locationUpdate', (newLocation) => {
      console.log("Received location update:", newLocation);
      // Expecting newLocation to be an object with latitude and longitude properties
      setLocation([newLocation.latitude, newLocation.longitude]);
    });

    // Listen for alerts
    socket.on('alert', (message) => {
      console.log("Received alert:", message);
      setAlertMessage(message);
      setTimeout(() => setAlertMessage(null), 5000);
    });

    return () => socket.disconnect();
  }, [loadId]);

  return (
    <div className="mt-4 p-4 border rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Real-Time Load Tracking</h3>
      <MapContainer center={location || defaultLocation} zoom={13} style={{ height: '300px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <Marker position={location || defaultLocation}>
          <Popup>
            {location ? 'Current load location' : 'Default location (no updates yet)'}
          </Popup>
        </Marker>
        <ChangeMapView center={location || defaultLocation} />
      </MapContainer>
      {alertMessage && (
        <div className="mt-2 p-2 bg-red-200 text-red-800 rounded">
          <strong>Alert:</strong> {alertMessage}
        </div>
      )}
    </div>
  );
};

export default LoadTracking;
