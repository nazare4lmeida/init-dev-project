const mongoose = require('mongoose');

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    language: { // Novo campo para a linguagem de programacao
      type: String,
      required: true,
    },
    slots: { // Campo para o numero de vagas
      type: Number,
      required: true,
      default: 50,
    },
    availableSlots: { // Campo para vagas disponiveis
      type: Number,
      default: 50,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Course', courseSchema);