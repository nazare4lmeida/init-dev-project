// server/controllers/courseController.js
const Course = require('../models/Course');

const getCourses = async (req, res) => {
  const courses = await Course.find();
  res.status(200).json(courses);
};

const getCoursesAdmin = async (req, res) => {
  const courses = await Course.find();
  res.status(200).json(courses);
};

const createCourse = async (req, res) => {
  const { title, description, language, slots } = req.body;
  const images = req.files.map(file => `/uploads/${file.filename}`); // Lida com múltiplos arquivos

  if (!title || !description || !language || !slots) {
    return res.status(400).json({ message: 'Please include all fields' });
  }

  const course = await Course.create({
    title,
    description,
    language,
    slots,
    availableSlots: slots,
    imagePaths: images, // Salvando um array de caminhos de imagens
  });

  res.status(201).json(course);
};

const updateCourse = async (req, res) => {
  const { title, description, language, slots } = req.body;
  const images = req.files.map(file => `/uploads/${file.filename}`);
  
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: 'Curso não encontrado.' });
  }

  const updatedCourse = await Course.findByIdAndUpdate(req.params.id, {
    title,
    description,
    language,
    slots,
    availableSlots: slots,
    imagePaths: images.length > 0 ? images : course.imagePaths, // Atualiza se novos arquivos forem enviados
  }, { new: true });

  res.status(200).json(updatedCourse);
};

const deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: 'Curso não encontrado.' });
  }

  await course.remove();

  res.status(200).json({ message: 'Curso removido com sucesso.' });
};

module.exports = {
  getCourses,
  getCoursesAdmin,
  createCourse,
  updateCourse,
  deleteCourse,
};