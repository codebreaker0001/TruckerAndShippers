// controllers/authController.js
import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { name, email, password, role, accidents, theftComplaints, truckAge, licenseIssueDate } = req.body;

    if (!role || !['trucker', 'shipper'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role selected.' });
    }

    // Check if a user with the same email & role already exists
    const existingUser = await User.findOne({ email, role });
    if (existingUser) {
      return res.status(400).json({ message: `An account already exists for this ${role}.` });
    }

    // If trucker, validate eligibility criteria
    if (role === 'trucker') {
      const licenseYears = (new Date().getFullYear()) - (new Date(licenseIssueDate).getFullYear());
      if (accidents > 0) {
        return res.status(400).json({ message: 'Truckers with accident history are not eligible.' });
      }
      if (theftComplaints > 0) {
        return res.status(400).json({ message: 'Truckers with theft complaints are not eligible.' });
      }
      if (truckAge > 5) {
        return res.status(400).json({ message: 'Truck age must not be more than 5 years.' });
      }
      if (licenseYears < 5) {
        return res.status(400).json({ message: 'Driver\'s license must be held for more than 5 years.' });
      }
    }

    // Hash password and save the user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      accidents,
      theftComplaints,
      truckAge,
      licenseIssueDate,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed.', error: error.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email, password, and role.' });
    }

    // Find user by email and role (must match both)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials or role mismatch.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed.', error: error.message });
  }
};