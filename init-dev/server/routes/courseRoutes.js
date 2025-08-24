// server/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const { getCourses, getCoursesAdmin, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Rotas públicas
router.get('/', getCourses);

// Rotas de admin (protegidas)
router.get('/admin', protect, admin, getCoursesAdmin);
router.post('/admin', protect, admin, upload.array('courseImages', 20), createCourse);
router.put('/admin/:id', protect, admin, upload.array('courseImages', 20), updateCourse);
router.delete('/admin/:id', protect, admin, deleteCourse);

module.exports = router;