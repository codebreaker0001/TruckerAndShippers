// routes/shipperAuth.js
import express from 'express';
import { register, login } from '../controller/authControllers.js';

const router = express.Router();

// Enforce shipper role during registration
router.post('/register', (req, res, next) => {
  req.body.role = 'shipper';
  next();
}, register);

router.post('/login', login);

export default router;
