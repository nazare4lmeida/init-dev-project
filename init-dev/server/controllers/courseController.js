const Course = require('../models/Course');

// @desc    Adicionar um novo curso
// @route   POST /api/courses
// @access  Public
const addCourse = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const course = await Course.create({
      title,
      description,
      category,
    });

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

module.exports = { addCourse };