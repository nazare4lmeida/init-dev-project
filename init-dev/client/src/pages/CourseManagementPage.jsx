import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import courseService from '../api/courseService';
import progressService from '../api/progressService'; 

function CourseManagementPage() {
    // O slug vem da URL (ex: /courses/logica-de-programacao)
    const { slug } = useParams(); 
    const { user } = useContext(AuthContext);
    
    const [course, setCourse] = useState(null);
    const [progress, setProgress] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estado para controlar qual módulo está aberto
    const [openModuleId, setOpenModuleId] = useState(null);

    // =======================================================
    // FUNÇÕES DE FETCH
    // =======================================================
    const fetchCourseData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. Carregar detalhes do curso
            const courseData = await courseService.getCourseDetailsBySlug(slug);
            setCourse(courseData);
            
            // 2. Carregar progresso do usuário (se estiver logado)
            if (user && courseData._id) {
                const progressData = await progressService.getCourseProgress(courseData._id);
                setProgress(progressData);
            }
        } catch (err) {
            setError('Falha ao carregar o curso ou o progresso. Verifique a URL.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if (slug) {
            fetchCourseData();
        }
    }, [slug, user]);

    // =======================================================
    // FUNÇÕES DE INTERAÇÃO
    // =======================================================
    const isLessonCompleted = (lessonId) => {
        if (!progress) return false;
        // Verifica se o ID da lição está na lista de concluídas
        return progress.completedLessons.includes(lessonId);
    };

    const handleLessonComplete = async (courseId, lessonId) => {
        try {
            const updatedProgress = await progressService.markLessonCompleted(courseId, lessonId);
            setProgress(updatedProgress.progress); // Atualiza o estado do progresso
            alert('Lição marcada como concluída! 🥳');
        } catch (err) {
            console.error('Erro ao atualizar progresso:', err);
            alert('Falha ao salvar o progresso.');
        }
    };

    if (isLoading) return <p className="text-center mt-10">Carregando curso...</p>;
    if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
    if (!course) return <p className="text-center mt-10">Curso não encontrado.</p>;

    // =======================================================
    // RENDERIZAÇÃO
    // =======================================================
    return (
        <div className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-4xl font-extrabold text-teal-700 mb-2">{course.title}</h1>
            <p className="text-gray-600 mb-6">{course.description}</p>
            
            {/* Barra de Progresso */}
            {user && progress && (
                <div className="mb-8 p-4 bg-teal-50 border-l-4 border-teal-500 rounded-md">
                    <h2 className="text-xl font-semibold text-teal-800">Seu Progresso</h2>
                    <p className="text-2xl font-bold text-teal-900">{progress.completionPercentage}% Concluído</p>
                    {/* Aqui entraria a barra de progresso visual (Tailwind width) */}
                </div>
            )}
            
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Conteúdo do Curso</h2>

            <div className="space-y-4">
                {course.modules.map((module) => (
                    <div key={module._id} className="border rounded-lg overflow-hidden">
                        {/* Título do Módulo Clicável (Acordeão) */}
                        <button
                            onClick={() => setOpenModuleId(openModuleId === module._id ? null : module._id)}
                            className="w-full text-left p-4 bg-gray-100 hover:bg-gray-200 flex justify-between items-center"
                        >
                            <span className="text-lg font-semibold">
                                {module.order}. {module.title}
                            </span>
                            <span className="text-xl">
                                {openModuleId === module._id ? '▲' : '▼'}
                            </span>
                        </button>

                        {/* Lições (Corpo do Acordeão) */}
                        {openModuleId === module._id && (
                            <ul className="divide-y divide-gray-200 bg-white">
                                {module.lessons.map((lesson) => {
                                    const completed = isLessonCompleted(lesson._id);
                                    return (
                                        <li key={lesson._id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                            <div className="flex items-center space-x-3">
                                                <span className={`w-3 h-3 rounded-full ${completed ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                                <span className="text-gray-800">
                                                    {lesson.order}. {lesson.title} ({lesson.type})
                                                </span>
                                            </div>
                                            
                                            {/* Ação: Botão Concluído */}
                                            {user && (
                                                <button
                                                    onClick={() => handleLessonComplete(course._id, lesson._id)}
                                                    className={`px-3 py-1 text-sm rounded-md font-medium transition-colors ${
                                                        completed 
                                                        ? 'bg-green-100 text-green-700 cursor-default' 
                                                        : 'bg-teal-600 text-white hover:bg-teal-700'
                                                    }`}
                                                    disabled={completed}
                                                >
                                                    {completed ? 'Concluído' : 'Marcar como Concluído'}
                                                </button>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CourseManagementPage;