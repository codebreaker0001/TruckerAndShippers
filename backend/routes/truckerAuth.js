// routes/truckerAuth.js
import express from 'express';
import { register, login } from '../controller/authControllers.js';

const router = express.Router();

// Enforce trucker role during registration
router.post('/register', (req, res, next) => {
  req.body.role = 'trucker';
  next();
}, register);

router.post('/login', login);

export default router;
