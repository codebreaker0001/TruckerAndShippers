// models/Claim.js
import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  truckerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  benefitType: { type: String, required: true }, // e.g. "Insurance", "Tires", etc.
  description: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Claim', claimSchema);
