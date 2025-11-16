const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/repairController');

router.get('/', ctrl.listRepairs);
router.put('/:id', ctrl.updateRepair);
router.delete('/:id', ctrl.deleteRepair);

module.exports = router;
