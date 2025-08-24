// server/controllers/messageController.js
const Message = require('../models/Message');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// @desc    Enviar uma nova mensagem de contato
// @route   POST /api/messages
// @access  Public
const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Please include all fields' });
  }

  const newMessage = await Message.create({ name, email, message });
  res.status(201).json({ message: 'Mensagem enviada com sucesso!', data: newMessage });
};

// @desc    Obter todas as mensagens (apenas para admin)
// @route   GET /api/messages/admin
// @access  Private (Admin only)
const getMessages = async (req, res) => {
  const messages = await Message.find({});
  res.status(200).json(messages);
};

// @desc    Responder a uma mensagem (apenas para admin)
// @route   PUT /api/messages/:id/respond
// @access  Private (Admin only)
const respondToMessage = async (req, res) => {
  const { responseText } = req.body;
  const messageToRespond = await Message.findById(req.params.id);

  if (!messageToRespond) {
    return res.status(404).json({ message: 'Mensagem não encontrada.' });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: messageToRespond.email,
    subject: `Resposta à sua mensagem - Init.dev`,
    text: responseText,
  };

  await transporter.sendMail(mailOptions);

  messageToRespond.isResponded = true;
  await messageToRespond.save();

  res.status(200).json({ message: 'Resposta enviada e mensagem atualizada.' });
};

module.exports = { sendMessage, getMessages, respondToMessage };