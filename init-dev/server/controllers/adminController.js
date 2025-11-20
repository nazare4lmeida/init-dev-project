const User = require('../models/User');
const sendEmail = require('../src/utils/sendEmail');

// @desc    Listar usuários com status 'pending'
const getPendingUsers = async (req, res) => {
  try {
    // Busca apenas usuários pendentes
    const users = await User.find({ status: 'pending' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários pendentes' });
  }
};

// @desc    Aprovar usuário e enviar email de definição de senha
const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // 1. Ativar usuário
    user.status = 'active';

    // 2. Gerar token de senha (usando o método do seu Model User)
    const resetToken = user.getResetPasswordToken();
    
    // 3. Salvar (Status + Token)
    await user.save({ validateBeforeSave: false });

    // 4. Link para o Frontend (Reset Page)
    // Ajuste a porta se necessário (ex: 5173 é o padrão do Vite)
    const resetUrl = `http://localhost:5173/resetpassword/${resetToken}`;

    // 5. Email
    const message = `Parabéns ${user.name}! 🎉\n\nSua conta foi APROVADA!\n\nClique abaixo para criar sua senha:\n\n${resetUrl}\n\nEste link expira em 10 minutos.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Acesso Aprovado - Init.dev',
            message
        });
        res.json({ message: `Usuário ${user.name} aprovado e convite enviado!` });
    } catch (emailError) {
        console.error("Erro email:", emailError);
        // Se o email falhar, limpamos o token mas mantemos o usuário aprovado
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ message: 'Aprovado, mas erro ao enviar email.' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno' });
  }
};

module.exports = { getPendingUsers, approveUser };