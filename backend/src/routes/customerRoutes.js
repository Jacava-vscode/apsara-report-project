const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/customerController');

router.get('/', ctrl.listCustomers);
router.post('/', ctrl.createCustomer);
router.get('/:id', ctrl.getCustomer);
router.put('/:id', ctrl.updateCustomer);
router.delete('/:id', ctrl.deleteCustomer);
router.post('/:id/repairs', ctrl.addRepair);

module.exports = router;
