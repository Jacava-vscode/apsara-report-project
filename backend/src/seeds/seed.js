require('dotenv').config();
const mongoose = require('mongoose');
const Customer = require('../models/customer');
const RepairHistory = require('../models/repairHistory');
const { generateQRCodeForCustomer } = require('../utils/qrcode');

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/apsara_report';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to Mongo for seeding');

  await RepairHistory.deleteMany({});
  await Customer.deleteMany({});

  const c1 = new Customer({ name: 'John Doe', email: 'john@example.com', phone: '1234567890', address: '123 Main St' });
  c1.qrCode = await generateQRCodeForCustomer(c1._id.toString());
  await c1.save();

  const c2 = new Customer({ name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', address: '456 Side Ave' });
  c2.qrCode = await generateQRCodeForCustomer(c2._id.toString());
  await c2.save();

  await new RepairHistory({ customerId: c1._id, deviceType: 'Computer', repairDetails: 'Replaced HDD', status: 'Completed' }).save();
  await new RepairHistory({ customerId: c2._id, deviceType: 'Printer', repairDetails: 'Cleaned drum', status: 'In Progress' }).save();

  console.log('Seeding complete');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
