// models/Bid.js
import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  loadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Load', required: true },
  truckerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bidAmount: { type: Number, required: true },
  bidTime: { type: Date, default: Date.now },
});

export default mongoose.model('Bid', bidSchema);
