const mongoose = require('mongoose');

const repairHistorySchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  deviceType: { type: String, required: true },
  repairDetails: { type: String },
  repairDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['In Progress', 'Completed', 'Pending'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('RepairHistory', repairHistorySchema);
