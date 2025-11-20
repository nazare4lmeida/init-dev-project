// server/models/UserProgress.js
const mongoose = require('mongoose');

const UserProgressSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Referencia o modelo de Usuário
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Course', // Referencia o modelo de Curso
        },
        // Array de lições concluídas
        completedLessons: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Lesson', // Referencia o modelo de Lição
            },
        ],
        // Armazena a percentagem de conclusão (pode ser calculado no controlador)
        completionPercentage: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Adiciona um índice único composto para garantir que cada utilizador só tenha um documento de progresso por curso.
UserProgressSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', UserProgressSchema);