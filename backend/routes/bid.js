// routes/bid.js
import express from 'express';
import { placeBid, getBidsForLoad, selectWinningBid } from '../controller/bidController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Endpoint for truckers to place a bid
router.post('/place', authMiddleware, placeBid);

// Endpoint to get all bids for a specific load
router.get('/load/:loadId', authMiddleware, getBidsForLoad);

// (Optional) Endpoint to select the winning bid for a load
router.post('/select/:loadId', authMiddleware, selectWinningBid);

export default router;
