// routes/load.js
import express from 'express';
import { createLoad, getLoads } from '../controller/loadController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createLoad);
router.get('/', authMiddleware, getLoads);

export default router;
