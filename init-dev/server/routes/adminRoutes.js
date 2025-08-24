// server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// @desc    Obter todos os usuários (rota de admin)
// @route   GET /api/admin/users
// @access  Private (Admin Only)
router.get('/users', protect, admin, (req, res) => {
  res.status(200).json({ message: 'Você tem acesso à rota de admin!' });
});
router.get('/users/pending', protect, admin, async (req, res) => {
  try {
    const users = await User.find({ status: 'pending' });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários', error: error.message });
  }
});

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

module.exports = router;