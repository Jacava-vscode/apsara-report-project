const Customer = require('../models/customer');
const RepairHistory = require('../models/repairHistory');
const { generateQRCodeForCustomer } = require('../utils/qrcode');

async function listCustomers(req, res) {
  const customers = await Customer.find().sort({ createdAt: -1 });
  res.json(customers);
}

async function createCustomer(req, res) {
  try {
    const { name, email, phone, address } = req.body;
    const customer = new Customer({ name, email, phone, address });
    const qrCode = await generateQRCodeForCustomer(customer._id.toString());
    customer.qrCode = qrCode;
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to create customer' });
  }
}

async function getCustomer(req, res) {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Not found' });
    const repairs = await RepairHistory.find({ customerId: customer._id }).sort({ repairDate: -1 });
    res.json({ customer, repairs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to fetch customer' });
  }
}

async function updateCustomer(req, res) {
  try {
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to update customer' });
  }
}

async function deleteCustomer(req, res) {
  try {
    await RepairHistory.deleteMany({ customerId: req.params.id });
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to delete customer' });
  }
}

async function addRepair(req, res) {
  try {
    const { deviceType, repairDetails, status } = req.body;
    const repair = new RepairHistory({ customerId: req.params.id, deviceType, repairDetails, status });
    await repair.save();
    res.status(201).json(repair);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to add repair' });
  }
}

module.exports = {
  listCustomers,
  createCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  addRepair
};
