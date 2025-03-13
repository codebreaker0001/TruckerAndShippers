// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import routes
import truckerAuthRoutes from './routes/truckerAuth.js';
import shipperAuthRoutes from './routes/shipperAuth.js';
import loadRoutes from './routes/load.js';

// Use routes
app.use('/api/auth/trucker', truckerAuthRoutes);
app.use('/api/auth/shipper', shipperAuthRoutes);
app.use('/api/loads', loadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
