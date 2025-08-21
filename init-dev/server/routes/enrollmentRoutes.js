const express = require('express');
const router = express.Router();
const { enrollCourse } = require('../controllers/enrollmentController');

router.post('/', enrollCourse);

module.exports = router;