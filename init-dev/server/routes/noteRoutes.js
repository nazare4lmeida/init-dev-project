const express = require('express');
const router = express.Router();
const {
  getNotes,
  addNote,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getNotes).post(protect, addNote);
router.route('/:id').put(protect, updateNote).delete(protect, deleteNote);

module.exports = router;