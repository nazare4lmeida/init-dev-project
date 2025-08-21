const User = require('../models/User');
const Course = require('../models/Course');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateRandomPassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// @desc    Inscrever-se em um curso
// @route   POST /api/enroll
// @access  Public
const enrollCourse = async (req, res) => {
  const { email, courseId } = req.body;

  if (!email || !courseId) {
    return res.status(400).json({ message: 'Please include all fields' });
  }

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  if (course.availableSlots <= 0) {
    return res.status(400).json({ message: 'No available slots for this course' });
  }

  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: 'User already enrolled' });
  }

  // Lógica para criar um novo usuário e enviar a senha por email
  const randomPassword = generateRandomPassword();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(randomPassword, salt);

  user = await User.create({
    email,
    password: hashedPassword,
    name: 'Novo Aluno', // O nome pode ser preenchido depois
  });

  // Atualiza as vagas do curso
  course.availableSlots -= 1;
  await course.save();

  // Envia a senha por email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Sua Senha de Acesso ao Init.dev',
    text: `Olá!\nVocê foi inscrito no curso de ${course.title}. Sua senha de acesso temporária é: ${randomPassword}. Recomendamos que você a altere após o primeiro login.\n\nBem-vindo à nossa plataforma!`,
  };

  await transporter.sendMail(mailOptions);

  res.status(201).json({ message: 'User created and enrolled successfully. Password sent to email.' });
};

module.exports = { enrollCourse };