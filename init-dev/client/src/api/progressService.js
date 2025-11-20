import axios from 'axios';

// A URL base aponta para a rota que definimos no Node.js
const API_URL = '/api/progress/'; 

// Função auxiliar para configurar o cabeçalho de Autorização (JWT)
// Assume que você armazena o usuário/token no localStorage
const getConfig = () => {
    const user = JSON.parse(localStorage.getItem('user')); 
    const token = user && user.token ? user.token : null;

    if (!token) {
        // Em um projeto real, isso deve ser um redirecionamento para o login
        throw new Error("Usuário não autenticado. Token não encontrado.");
    }

    return {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };
};

/**
 * @desc Marca uma lição como concluída para o usuário logado.
 * @route POST /api/progress/complete
 * @param {string} courseId - ID do curso
 * @param {string} lessonId - ID da lição concluída
 */
const markLessonCompleted = async (courseId, lessonId) => {
    const config = getConfig();
    const response = await axios.post(
        `${API_URL}complete`,
        { courseId, lessonId },
        config
    );
    return response.data;
};

/**
 * @desc Obtém o progresso atual do curso (lições concluídas e %) para o usuário logado.
 * @route GET /api/progress/:courseId
 * @param {string} courseId - ID do curso
 */
const getCourseProgress = async (courseId) => {
    const config = getConfig();
    const response = await axios.get(`${API_URL}${courseId}`, config);
    return response.data;
};

const progressService = {
    markLessonCompleted,
    getCourseProgress,
};

export default progressService;