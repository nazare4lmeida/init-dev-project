const mongoose = require('mongoose');
const crypto = require('crypto'); // Módulo nativo do Node

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    status: {
      type: String,
      enum: ['pending', 'active'],
      default: 'pending',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    // --- NOVOS CAMPOS PARA RECUPERAÇÃO ---
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Método para gerar o token de redefinição
userSchema.methods.getResetPasswordToken = function () {
  // 1. Gerar token aleatório
  const resetToken = crypto.randomBytes(20).toString('hex');

  // 2. Hash do token e setar no campo resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 3. Setar expiração (10 minutos)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken; // Retorna o token original (sem hash) para enviar no email
};

module.exports = mongoose.model('User', userSchema);