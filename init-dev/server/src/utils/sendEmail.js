const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Configuração do transportador para GMAIL
  const transporter = nodemailer.createTransport({
    service: 'gmail', // O Nodemailer configura host/port automaticamente para o Gmail
    auth: {
      user: process.env.EMAIL_USER, // init.dev.gerenciamento@gmail.com
      pass: process.env.EMAIL_PASS, // Sua Senha de App (NÃO a senha de login)
    },
  });

  // Definição da mensagem
  const message = {
    from: `Equipe Init.dev <${process.env.EMAIL_USER}>`, // Remetente
    to: options.email, // Destinatário
    subject: options.subject, // Assunto
    text: options.message, // Corpo do email
    // html: options.html // Descomente se quiser enviar HTML no futuro
  };

  // Envia o email
  const info = await transporter.sendMail(message);

  console.log('Email enviado com sucesso via Gmail. ID: %s', info.messageId);
};

module.exports = sendEmail;