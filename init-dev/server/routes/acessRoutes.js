const express = require('express');
const router = express.Router();
const { requestAccess } = require('../controllers/accessRequestController');

router.post('/', requestAccess);

module.exports = router;