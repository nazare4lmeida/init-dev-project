import axios from 'axios';

// URL base do seu backend Node.js
const API_URL = '/api/'; // Se estiver a usar proxy no Vite, ou a URL completa se o backend estiver noutro domínio.

// Função auxiliar para configurar o cabeçalho de Autorização (JWT)
// Assume-se que o token está guardado no localStorage (como é comum)
const getConfig = () => {
    // 1. Obter o token do usuário logado (Admin)
    // O token geralmente é guardado como 'user' ou 'token'
    const user = JSON.parse(localStorage.getItem('user')); 
    const token = user && user.token ? user.token : null;

    if (!token) {
        // Lidar com o caso de falta de token (opcional: redirecionar para login)
        console.error('Nenhum token de autenticação encontrado.');
        return {};
    }

    return {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    };
};

// =======================================================
// FUNÇÕES DE UTILIZADOR
// =======================================================

// @desc Obter todos os cursos disponíveis
const getCourses = async () => {
    // A rota GET /api/courses é pública ou apenas para usuários ativos.
    const response = await axios.get(`${API_URL}courses`);
    return response.data;
};

// =======================================================
// FUNÇÕES DE ADMIN
// =======================================================

// @desc Cria um novo curso
// @route POST /api/courses
// Nota: Esta rota DEVE ser protegida no backend para garantir que apenas Admins a podem usar.
const createCourse = async (courseData, token) => {
    // Para criar um curso que pode incluir upload de imagem, geralmente usa-se FormData
    // Se o seu frontend estiver a lidar com a imagem separadamente, ajuste o cabeçalho.
    const config = getConfig(); // Se a rota estiver em /api/admin/courses, mude para /api/admin/courses

    const response = await axios.post(`${API_URL}courses`, courseData, config); 
    return response.data;
};

/**
 * @desc Adiciona um novo módulo a um curso existente (Admin)
 * @route POST /api/admin/courses/:courseId/module
 */
const addModuleToCourse = async (courseId, moduleData) => {
    const config = getConfig();
    const response = await axios.post(
        `${API_URL}admin/courses/${courseId}/module`,
        moduleData,
        config
    );
    return response.data;
};

/**
 * @desc Adiciona uma nova lição a um módulo (Admin)
 * @route POST /api/admin/courses/:courseId/modules/:moduleId/lesson
 */
const addLessonToModule = async (courseId, moduleId, lessonData) => {
    const config = getConfig();
    const response = await axios.post(
        `${API_URL}admin/courses/${courseId}/modules/${moduleId}/lesson`,
        lessonData,
        config
    );
    return response.data;
};


// @desc Obtém detalhes de um curso por slug para exibição do usuário
const getCourseDetailsBySlug = async (slug) => {
    // Nota: Esta rota é pública, não precisa do token
    const response = await axios.get(`${API_URL}${slug}`);
    return response.data;
};

const courseService = {
    getCourses,
    createCourse,
    addModuleToCourse,
    getCourseDetailsBySlug,
    addLessonToModule,
};

export default courseService;