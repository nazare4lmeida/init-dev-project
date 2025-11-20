const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../src/utils/sendEmail');

// Função auxiliar para gerar o token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '365d',
  });
};

// ... (Mantenha registerUser e loginUser aqui como estavam) ...
const registerUser = async (req, res) => {
  // ... seu código de registerUser ...
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Please include all fields' });
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({ name, email, password: hashedPassword });
  if (user) {
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id), role: user.role });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

const loginUser = async (req, res) => {
    // ... seu código de loginUser ...
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id), role: user.role });
    } else {
        res.status(400).json({ message: 'Credenciais inválidas.' });
    }
};

// ============================================================
// NOVAS FUNÇÕES DE RECUPERAÇÃO
// ============================================================

// @desc    Esqueci a senha (Gera token e envia email)
// @route   POST /api/users/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).json({ message: 'Não há usuário com esse email.' });
  }

  // Obter token de reset (usa o método do Model)
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false }); // Salva o token no banco

  // Criar URL de reset (Front-end URL)
  // Ajuste a porta se seu front rodar em outra (ex: 5173)
  const resetUrl = `http://localhost:5173/resetpassword/${resetToken}`;

  const message = `Você está recebendo este email porque você (ou alguém) solicitou a redefinição de senha. Por favor, clique no link abaixo:\n\n${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Recuperação de Senha - Init.dev',
      message,
    });

    res.status(200).json({ success: true, data: 'Email enviado' });
  } catch (error) {
    console.error(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return res.status(500).json({ message: 'Email não pôde ser enviado' });
  }
};

// @desc    Redefinir Senha
// @route   PUT /api/users/resetpassword/:resetToken
// @access  Public
const resetPassword = async (req, res) => {
  // Obter token hasheado
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  // Procurar usuário com token válido e que não expirou
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Token inválido ou expirado' });
  }

  // Criptografar NOVA senha
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);

  // Limpar campos de token
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  // Logar usuário imediatamente mandando novo token JWT
  res.status(200).json({
    success: true,
    token: generateToken(user._id),
    message: "Senha alterada com sucesso!"
  });
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };