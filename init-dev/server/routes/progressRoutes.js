// server/routes/progressRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Middleware de proteção
const { markLessonCompleted, getCourseProgress } = require('../controllers/progressController');

// Todas as rotas de progresso são protegidas (apenas para usuários logados)

// @route POST /api/progress/complete
// Marca uma lição como concluída
router.post('/complete', protect, markLessonCompleted);

// @route GET /api/progress/:courseId
// Obtém o progresso de um curso específico
router.get('/:courseId', protect, getCourseProgress);

module.exports = router;