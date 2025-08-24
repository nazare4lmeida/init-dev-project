// server/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, respondToMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.post('/', sendMessage);
router.get('/admin', protect, admin, getMessages);
router.put('/:id/respond', protect, admin, respondToMessage);

module.exports = router;