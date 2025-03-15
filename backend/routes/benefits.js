// routes/benefits.js
import express from 'express';
import { getTruckBenefits, claimBenefit } from '../controller/benefitsController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET benefits list – available only for truckers
router.get('/trucker', authMiddleware, getTruckBenefits);

// POST benefit claim – only truckers can claim
router.post('/claim', authMiddleware, claimBenefit);

export default router;
