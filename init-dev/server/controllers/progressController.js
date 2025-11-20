// server/controllers/progressController.js
const asyncHandler = require('express-async-handler');
const UserProgress = require('../models/UserProgress');
const Course = require('../models/Course'); // Necessário para calcular o total de lições
const Lesson = require('../models/Lesson'); // Necessário para verificar a lição

// =======================================================
// @desc   Marcar uma lição como concluída
// @route  POST /api/progress/complete
// @access Private (Usuários logados)
// =======================================================
const markLessonCompleted = asyncHandler(async (req, res) => {
    const { courseId, lessonId } = req.body;
    const userId = req.user.id; // ID do usuário autenticado (do middleware 'protect')

    if (!courseId || !lessonId) {
        res.status(400);
        throw new Error('Por favor, forneça o ID do curso e o ID da lição.');
    }

    // 1. Verificar se a lição existe e pertence ao curso
    const lessonExists = await Lesson.findOne({ _id: lessonId, course: courseId });
    if (!lessonExists) {
        res.status(404);
        throw new Error('Lição não encontrada ou não pertence ao curso especificado.');
    }

    // 2. Encontrar ou criar o documento de progresso
    let userProgress = await UserProgress.findOne({ user: userId, course: courseId });

    if (!userProgress) {
        // Se não houver progresso, cria um novo
        userProgress = await UserProgress.create({
            user: userId,
            course: courseId,
            completedLessons: [],
        });
    }

    // 3. Adicionar a lição ao array, se ainda não estiver lá
    const lessonObjectId = new mongoose.Types.ObjectId(lessonId);
    if (!userProgress.completedLessons.includes(lessonObjectId)) {
        userProgress.completedLessons.push(lessonObjectId);
    }
    
    // 4. Recalcular a percentagem de conclusão
    // Nota: O cálculo da percentagem de progresso é complexo, pois requer saber o TOTAL de lições.
    // Para simplificar, vamos deixar o cálculo da percentagem como um TODO avançado, focando no rastreio.
    // Para calcular a percentagem:
    // a. Buscar o curso por ID.
    // b. Obter todos os módulos e lições do curso (pode ser complexo se não for populado).
    // c. Contar o total de lições.
    // d. userProgress.completionPercentage = (userProgress.completedLessons.length / totalLessons) * 100;

    await userProgress.save();

    res.status(200).json({
        message: 'Progresso da lição atualizado com sucesso!',
        progress: userProgress,
    });
});

// =======================================================
// @desc   Obter o progresso de um curso específico para o usuário logado
// @route  GET /api/progress/:courseId
// @access Private (Usuários logados)
// =======================================================
const getCourseProgress = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user.id;

    if (!courseId) {
        res.status(400);
        throw new Error('Por favor, forneça o ID do curso.');
    }

    const userProgress = await UserProgress.findOne({ user: userId, course: courseId });

    if (!userProgress) {
        // Retorna um objeto de progresso inicial se não for encontrado
        return res.status(200).json({
            user: userId,
            course: courseId,
            completedLessons: [],
            completionPercentage: 0,
        });
    }

    res.status(200).json(userProgress);
});

module.exports = {
    markLessonCompleted,
    getCourseProgress,
};