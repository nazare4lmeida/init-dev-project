// server/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const { 
    getCourses, 
    getCoursesAdmin, // Certifique-se que esta função existe no controller, senão use getCourses
    createCourse, 
    updateCourse, 
    deleteCourse, 
    getCourseDetailsPublic 
} = require('../controllers/courseController');

const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

// ==============================================================================
// 1. ROTAS ESPECÍFICAS (ADMIN)
// ELAS PRECISAM VIR PRIMEIRO!
// Senão o Express acha que a palavra "admin" é um :slug ou um :id
// ==============================================================================

// Listar cursos para o admin
router.get('/admin', protect, admin, getCoursesAdmin);

// Criar curso (com upload de imagens)
router.post('/admin', protect, admin, upload.array('courseImages', 20), createCourse);

// Atualizar curso
router.put('/admin/:id', protect, admin, upload.array('courseImages', 20), updateCourse);

// Deletar curso
router.delete('/admin/:id', protect, admin, deleteCourse);


// ==============================================================================
// 2. ROTAS GERAIS E DINÂMICAS (PÚBLICAS/USUÁRIO)
// Deixe estas por último para não "engolirem" as rotas de cima
// ==============================================================================

// Listar todos os cursos (visão geral)
router.get('/', getCourses);

// Detalhes do curso pelo SLUG (Ex: /api/courses/react-basico)
// O :slug é um "coringa", por isso fica no final
router.get('/:slug', protect, getCourseDetailsPublic);

module.exports = router;