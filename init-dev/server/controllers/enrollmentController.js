const User = require('../models/User');
const Course = require('../models/Course');
const bcrypt = require('bcryptjs');
const sendEmail = require('../src/utils/sendEmail'); 

const generateRandomPassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// @desc    Inscrever-se em um curso (Cria usuário se não existir)
// @route   POST /api/enroll
// @access  Public
const enrollCourse = async (req, res) => {
  const { email, courseId } = req.body;

  if (!email || !courseId) {
    return res.status(400).json({ message: 'Por favor, informe email e ID do curso.' });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Curso não encontrado.' });
    }

    if (course.availableSlots <= 0) {
      return res.status(400).json({ message: 'Não há vagas disponíveis para este curso.' });
    }

    let user = await User.findOne({ email });
    
    // Nota: Se o usuário já existe, a lógica original retornava erro.
    // O ideal seria apenas inscrevê-lo no curso, mas mantive sua lógica de criar novo.
    if (user) {
      return res.status(400).json({ message: 'Usuário já cadastrado na plataforma.' });
    }

    // 1. Gerar senha e criptografar
    const randomPassword = generateRandomPassword();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    // 2. Criar usuário (Já nasce ATIVO neste fluxo, pois já tem senha)
    user = await User.create({
      email,
      password: hashedPassword,
      name: 'Novo Aluno', // Sugestão: Pedir o nome no formulário de inscrição também
      status: 'active'    // Importante: Define como ativo para ele poder logar
    });

    // 3. Atualizar vagas
    course.availableSlots -= 1;
    await course.save();

    // 4. Enviar a senha por email usando o utilitário padrão
    const message = `Olá!\n\nVocê foi inscrito no curso de "${course.title}".\n\nSua conta foi criada com sucesso.\nSua senha temporária é: ${randomPassword}\n\nRecomendamos que você altere sua senha após o primeiro login em seu perfil.\n\nBem-vindo à Init.dev!`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Sua Senha de Acesso ao Init.dev',
            message
        });
    } catch (emailError) {
        console.error("Erro ao enviar senha por email:", emailError);
        // Não vamos falhar a inscrição se o email der erro, mas é bom monitorar
    }

    res.status(201).json({ message: 'Inscrição realizada! Verifique seu e-mail para pegar a senha.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor ao processar inscrição.' });
  }
};

module.exports = { enrollCourse };