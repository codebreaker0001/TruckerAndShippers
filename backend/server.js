// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import bidRoutes from './routes/bid.js';
import User from './models/user.js'
import Load from './models/load.js'

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();


// const User = require('./models/load.js')
// const Load = require('./models/user.js')
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

app.use('/api/bids', bidRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
