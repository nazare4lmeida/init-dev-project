const User = require('../models/User');
const sendEmail = require('../src/utils/sendEmail'); // 1. Importe o utilitário

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
    return res.status(400).json({ message: 'Email ou nome de usuário já existem' });
  }

  // Crie um usuário com status 'pending' e sem senha real
  const user = await User.create({
    name,
    email,
    username,
    password: 'password-pending', 
    status: 'pending',
  });

  if (user) {
    // --- 2. ENVIO DO EMAIL DE CONFIRMAÇÃO ---
    try {
        await sendEmail({
            email: user.email,
            subject: 'Solicitação de Acesso Recebida - Init.dev',
            message: `Olá ${user.name},\n\nRecebemos sua solicitação de acesso à plataforma Init.dev.\n\nNossa equipe administrativa irá analisar seu pedido. Assim que for aprovado, você receberá um novo e-mail com instruções para definir sua senha.\n\nAtenciosamente,\nEquipe Init.dev`
        });
    } catch (error) {
        console.error("Erro ao enviar email de boas-vindas:", error);
        // Não vamos travar o cadastro se o email falhar, apenas logar o erro
    }

    res.status(201).json({ message: 'Request submitted successfully. Please wait for approval.' });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

module.exports = { requestAccess };