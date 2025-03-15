// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['shipper', 'trucker'], required: true },

  // Eligibility fields (for truckers only)
  accidents: { type: Number, default: 0 },  // Number of accidents
  theftComplaints: { type: Number, default: 0 },  // Number of theft complaints
  truckAge: { type: Number, required: function() { return this.role === 'trucker'; } },  // Age of the truck
  licenseIssueDate: { type: Date, required: function() { return this.role === 'trucker'; } },  // Date when license was issued
});

export default mongoose.model('User', userSchema);
