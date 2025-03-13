// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['shipper', 'trucker', 'admin'], required: true },
  truckDetails: {
    truckAge: Number,
    accidents: { type: Boolean, default: false },
    theftComplaints: { type: Boolean, default: false },
    driverLicenseYears: Number,
  },
});

export default mongoose.model('User', userSchema);
