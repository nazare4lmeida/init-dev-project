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
    language: {
      type: String,
      required: true,
    },
    slots: {
      type: Number,
      required: true,
      default: 50,
    },
    availableSlots: {
      type: Number,
      default: 50,
    },
    imagePaths: { // Novo campo para o array de caminhos de imagem
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Course', courseSchema);