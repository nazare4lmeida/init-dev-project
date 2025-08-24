const User = require('../models/User');

// @desc    Solicitar acesso à plataforma
// @route   POST /api/access
// @access  Public
const requestAccess = async (req, res) => {
  const { name, email, username } = req.body;

  if (!name || !email || !username) {
    return res.status(400).json({ message: 'Please include all fields' });
  }

  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    return res.status(400).json({ message: 'Email or username already exists' });
  }

  // Crie um usuário com status 'pending' e sem senha
  const user = await User.create({
    name,
    email,
    username,
    password: 'password-pending', // Senha temporária, será gerada na aprovação
    status: 'pending',
  });

  if (user) {
    res.status(201).json({ message: 'Request submitted successfully. Please wait for approval.' });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

module.exports = { requestAccess };