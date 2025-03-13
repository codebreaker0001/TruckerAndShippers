// models/Load.js
import mongoose from 'mongoose';

const loadSchema = new mongoose.Schema({
  shipperId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  details: { type: String, required: true },
  route: { type: String, required: true },
  status: { type: String, enum: ['open', 'in-progress', 'completed'], default: 'open' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Load', loadSchema);
