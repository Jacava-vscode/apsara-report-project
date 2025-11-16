const RepairHistory = require('../models/repairHistory');

async function listRepairs(req, res) {
  try {
    // populate customer basic contact info including phone
    const repairs = await RepairHistory.find().populate('customerId', 'name email phone').sort({ repairDate: -1 });
    res.json(repairs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to list repairs' });
  }
}

async function updateRepair(req, res) {
  try {
    const updated = await RepairHistory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to update repair' });
  }
}

async function deleteRepair(req, res) {
  try {
    await RepairHistory.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unable to delete repair' });
  }
}

module.exports = { listRepairs, updateRepair, deleteRepair };
