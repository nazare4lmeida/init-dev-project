// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Importa todas as funções de gestão de conteúdo (incluindo a nova de detalhes)
const { 
    addModuleToCourse, 
    addLessonToModule,
    getCourseDetailsForAdmin // <-- FUNÇÃO IMPORTADA
} = require('../controllers/courseController'); 

// =======================================================
// Rotas de Gestão de Usuários Existentes
// =======================================================

// @desc    Obter todos os usuários (rota de admin)
// @route   GET /api/admin/users
// @access  Private (Admin Only)
router.get('/users', protect, admin, (req, res) => {
  res.status(200).json({ message: 'Você tem acesso à rota de admin!' });
});

// @desc    Obter usuários pendentes
// @route   GET /api/admin/users/pending
// @access  Private (Admin Only)
router.get('/users/pending', protect, admin, async (req, res) => {
  try {
    const users = await User.find({ status: 'pending' });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
  }
});

// @desc    Aprovar usuário
// @route   PUT /api/admin/users/:id/approve
// @access  Private (Admin Only)
router.put('/users/:id/approve', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    user.status = 'active';
    await user.save();

    res.status(200).json({ message: 'Usuário aprovado com sucesso!', user });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao aprovar usuário.', error: error.message });
  }
});


// =======================================================
// ROTAS DE GESTÃO DE CONTEÚDO (ADMIN)
// Nota: Estas rotas são acessadas como /api/admin/...
// =======================================================

// @desc    Adicionar um novo módulo a um curso
// @route   POST /api/admin/courses/:courseId/module
// @access  Private (Admin Only)
router.post('/courses/:courseId/module', protect, admin, addModuleToCourse);


// @desc    Adicionar uma nova lição a um módulo
// @route   POST /api/admin/courses/:courseId/modules/:moduleId/lesson
// @access  Private (Admin Only)
router.post('/courses/:courseId/modules/:moduleId/lesson', protect, admin, addLessonToModule);

// @desc    Obter detalhes de um curso para edição de conteúdo (Admin)
// @route   GET /api/admin/courses/:id/details
// @access  Private (Admin Only)
router.get('/courses/:id/details', protect, admin, getCourseDetailsForAdmin); // <-- ROTA ADICIONADA


module.exports = router;