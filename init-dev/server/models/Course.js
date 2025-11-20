const mongoose = require('mongoose');

// =======================================================
// SUB-SCHEMA: Module
// Define a estrutura para cada módulo dentro do curso.
// =======================================================
const moduleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    // Opcional: Para controlar a ordem dos módulos
    order: { 
        type: Number,
        required: true,
    },
    // Referência para as Lições: Guardamos os IDs das Lições que pertencem a este módulo.
    // As Lições (Lesson) serão armazenadas na sua própria coleção separada.
    lessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson' // Referência à coleção 'Lesson'
    }]
});

// =======================================================
// PRINCIPAL SCHEMA: Course
// =======================================================
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
        // CAMPO MANTIDO: Lógica de Limite de Alunos
        slots: { 
            type: Number,
            required: true,
            default: 50,
        },
        // CAMPO MANTIDO: Slots Disponíveis
        availableSlots: { 
            type: Number,
            default: 50,
        },
        imagePaths: { 
            type: [String],
        },
        
        // NOVO CAMPO: Array de Módulos (Sub-documentos)
        modules: [moduleSchema], 
        
        // NOVO CAMPO: Slug para URLs amigáveis (Ex: /cursos/logica-de-programacao)
        slug: { 
            type: String,
            unique: true,
            required: true // Deve ser gerado no backend ao criar o curso
        } 
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Course', courseSchema);