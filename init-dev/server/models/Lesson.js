const mongoose = require('mongoose');

const lessonSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a lesson title'],
        },
        // Conteúdo da Lição (pode ser HTML, Markdown, etc.)
        content: { 
            type: String,
            required: true,
        },
        // Tipo de Lição: para sabermos se é só leitura, tem quiz, ou é prática.
        type: { 
            type: String,
            enum: ['text', 'video', 'quiz', 'code-challenge'],
            default: 'text',
        },
        // Referência de volta ao Módulo e Curso
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        module: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course.modules', // Pode não ser estritamente necessário no Mongoose, mas ajuda na clareza.
            required: true,
        },
        order: { // Para garantir a ordem correta das lições
            type: Number,
            required: true,
        },
        // Se for do tipo 'code-challenge', pode ter campos adicionais aqui (Ex: starterCode, testCases)
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Lesson', lessonSchema);