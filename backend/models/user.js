// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['shipper', 'trucker'], required: true },
}, { timestamps: true });

// Ensure that the combination of email & role is unique
userSchema.index({ email: 1, role: 1 }, { unique: true });

export default mongoose.model('User', userSchema);
