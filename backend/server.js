// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import http from 'http';
import { Server } from 'socket.io';

// Import your routes
import truckerAuthRoutes from './routes/truckerAuth.js';
import shipperAuthRoutes from './routes/shipperAuth.js';
import loadRoutes from './routes/load.js';
import bidRoutes from './routes/bid.js';

import benefitsRoutes from './routes/benefits.js';
// ...


dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mount routes
app.use('/api/auth/trucker', truckerAuthRoutes);
app.use('/api/auth/shipper', shipperAuthRoutes);
app.use('/api/loads', loadRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/benefits', benefitsRoutes);

// Create HTTP server and attach Socket.io
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // For development; restrict in production
    methods: ["GET", "POST"]
  }
});

// Socket.io logic for load tracking
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // When a client (shipper or trucker) wants to track a specific load
  socket.on('joinLoad', (loadId) => {
    socket.join(loadId);
    console.log(`Socket ${socket.id} joined room for load ${loadId}`);
  });

  // Truckers send location updates for a load
  socket.on('locationUpdate', ({ loadId, location }) => {
    console.log(`Received location update for load ${loadId}:`, location);
    // Emit update to all clients in the room (e.g., shippers monitoring this load)
    io.to(loadId).emit('locationUpdate', location);
  });

  // Optional: alert for significant events (e.g., delay, deviation)
  socket.on('sendAlert', ({ loadId, alertMessage }) => {
    console.log(`Alert for load ${loadId}: ${alertMessage}`);
    io.to(loadId).emit('alert', alertMessage);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
