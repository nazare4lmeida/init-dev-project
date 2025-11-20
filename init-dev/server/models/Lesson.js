const mongoose = require('mongoose');

// =======================================================
// SUB-SCHEMA: Quiz
// Armazena perguntas de múltipla escolha.
// =======================================================
const quizSchema = mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    options: [{
        text: { type: String, required: true },
        isCorrect: { type: Boolean, default: false },
    }],
    explanation: {
        type: String, // Explicação mostrada se o usuário acertar/errar
    },
});

// =======================================================
// SUB-SCHEMA: Code Challenge (O Code Playground)
// Armazena o código inicial e a estrutura de verificação.
// =======================================================
const codeChallengeSchema = mongoose.Schema({
    // Instruções visíveis ao usuário
    instructions: {
        type: String,
        required: true,
    },
    // Código inicial que aparece no editor (ex: a função vazia)
    starterCode: {
        type: String,
        required: true,
    },
    // Tipo de linguagem do desafio (usado para sintaxe destacada no editor)
    language: {
        type: String,
        enum: ['javascript', 'html', 'css', 'python'], // Expanda conforme necessário
        default: 'javascript',
    },
    // Casos de teste que o backend irá executar (Ex: [{input: '5', expectedOutput: '10'}])
    // NOTA: Para HTML/CSS, a validação é visual ou baseada em DOM, o que é mais complexo e não será feito aqui.
    testCases: [{
        input: { type: String }, // Ex: argumento para uma função
        expectedOutput: { type: String }, // Ex: resultado esperado
    }],
});


// =======================================================
// PRINCIPAL SCHEMA: Lesson (com campos opcionais para Quiz/Code)
// =======================================================
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
            ref: 'Course.modules', 
            required: true,
        },
        order: { // Para garantir a ordem correta das lições
            type: Number,
            required: true,
        },
        
        // NOVO CAMPO: Dados específicos para Quizzes
        quiz: quizSchema,
        
        // NOVO CAMPO: Dados específicos para Code Challenges
        codeChallenge: codeChallengeSchema,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Lesson', lessonSchema);