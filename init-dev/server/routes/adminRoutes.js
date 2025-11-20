const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// 1. Importa o novo Controller de Admin (Usuários + Email)
const { 
    getPendingUsers, 
    approveUser 
} = require('../controllers/adminController');

// 2. Importa as funções de Curso (Gestão de Conteúdo)
const { 
    addModuleToCourse, 
    addLessonToModule,
    getCourseDetailsForAdmin 
} = require('../controllers/courseController'); 

// =======================================================
// Configuração Global de Segurança
// =======================================================
// Aplica proteção a TODAS as rotas deste arquivo
// Apenas usuários Logados (protect) E com role 'admin' (admin) podem acessar
router.use(protect);
router.use(admin);

// =======================================================
// Gestão de Usuários (Usando adminController)
// =======================================================

// @route   GET /api/admin/users/pending
// @desc    Listar todos os usuários com status 'pending'
router.get('/users/pending', getPendingUsers);

// @route   PUT /api/admin/users/:id/approve
// @desc    Aprovar usuário, mudar status para 'active' e enviar email com token de senha
router.put('/users/:id/approve', approveUser);


// =======================================================
// Gestão de Conteúdo (Cursos/Lições - Usando courseController)
// =======================================================

// @route   POST /api/admin/courses/:courseId/module
// @desc    Adicionar um novo módulo a um curso existente
router.post('/courses/:courseId/module', addModuleToCourse);

// @route   POST /api/admin/courses/:courseId/modules/:moduleId/lesson
// @desc    Adicionar uma nova lição a um módulo específico
router.post('/courses/:courseId/modules/:moduleId/lesson', addLessonToModule);

// @route   GET /api/admin/courses/:id/details
// @desc    Obter detalhes completos de um curso para a tela de edição (Deep Edit)
router.get('/courses/:id/details', getCourseDetailsForAdmin);

module.exports = router;