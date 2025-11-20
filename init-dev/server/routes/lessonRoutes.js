// server/routes/lessonRoutes.js
const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson'); // Importe o modelo que criamos antes

// GET: Buscar uma aula por ID
router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ msg: 'Aula não encontrada' });
    res.json(lesson);
  } catch (err) {
    res.status(500).send('Erro no servidor');
  }
});

// POST: Criar uma nova aula (Usado pelo Admin)
router.post('/', async (req, res) => {
  try {
    const newLesson = new Lesson(req.body);
    const savedLesson = await newLesson.save();
    res.json(savedLesson);
  } catch (err) {
    res.status(500).send('Erro ao salvar aula');
  }
});

module.exports = router;