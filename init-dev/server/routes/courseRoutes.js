const express = require('express');
const router = express.Router();
const { addCourse } = require('../controllers/courseController');

router.route('/').post(addCourse);

module.exports = router;