const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Seu middleware de proteção
const { issueCertificate, getMyCertificates } = require('../controllers/certificateController');

// Rota para baixar/gerar o certificado de um curso específico
// Ex: GET /api/certificates/issue/65a9f... (ID do curso)
router.get('/issue/:courseId', protect, issueCertificate);

// Rota para ver todos os meus certificados
router.get('/my-certificates', protect, getMyCertificates);

module.exports = router;