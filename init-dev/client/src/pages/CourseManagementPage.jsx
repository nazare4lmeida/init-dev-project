import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom"; // <--- 1. ADICIONEI O LINK AQUI
import AuthContext from "../context/AuthContext";
import courseService from "../api/courseService";
import progressService from "../api/progressService";
import { PlayCircle, BookOpen } from "lucide-react"; // Opcional: Ícones para ficar bonito

function CourseManagementPage() {
  const { slug } = useParams();
  const { user } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModuleId, setOpenModuleId] = useState(null);

  const fetchCourseData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const courseData = await courseService.getCourseDetailsBySlug(slug);
      setCourse(courseData);

      if (user && courseData._id) {
        const progressData = await progressService.getCourseProgress(
          courseData._id
        );
        setProgress(progressData);
      }
    } catch (err) {
      setError("Falha ao carregar o curso. Verifique a conexão.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchCourseData();
  }, [slug, user]);

  const isLessonCompleted = (lessonId) => {
    if (!progress) return false;
    return progress.completedLessons.includes(lessonId);
  };

  const handleLessonComplete = async (courseId, lessonId) => {
    try {
      const updatedProgress = await progressService.markLessonCompleted(
        courseId,
        lessonId
      );
      setProgress(updatedProgress.progress);
    } catch (err) {
      alert("Erro ao salvar progresso.");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-700"></div>
      </div>
    );
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!course)
    return <p className="text-center mt-10">Curso não encontrado.</p>;

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white shadow-lg rounded-lg min-h-screen">
      {/* Cabeçalho do Curso */}
      <div className="mb-8 border-b pb-6">
        <h1 className="text-4xl font-extrabold text-teal-800 mb-2">
          {course.title}
        </h1>
        <p className="text-gray-600 text-lg">{course.description}</p>
      </div>

      {/* Barra de Progresso */}
      {user && progress && (
        <div className="mb-8 p-6 bg-teal-50 rounded-xl border border-teal-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-teal-800">Seu Progresso</h2>
            <p className="text-sm text-teal-600">Continue assim!</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-teal-600">
              {progress.completionPercentage}%
            </p>
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              Concluído
            </span>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
        <BookOpen className="text-teal-600" /> Conteúdo do Curso
      </h2>

      <div className="space-y-4">
        {course.modules.map((module) => (
          <div
            key={module._id}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
          >
            <button
              onClick={() =>
                setOpenModuleId(openModuleId === module._id ? null : module._id)
              }
              className={`w-full text-left p-4 flex justify-between items-center transition-colors ${
                openModuleId === module._id
                  ? "bg-teal-50 text-teal-800"
                  : "bg-gray-50 hover:bg-gray-100 text-gray-700"
              }`}
            >
              <span className="text-lg font-bold">
                {module.order}. {module.title}
              </span>
              <span className="text-xl text-gray-400">
                {openModuleId === module._id ? "▲" : "▼"}
              </span>
            </button>

            {openModuleId === module._id && (
              <ul className="divide-y divide-gray-100 bg-white">
                {module.lessons.map((lesson) => {
                  const completed = isLessonCompleted(lesson._id);
                  return (
                    <li
                      key={lesson._id}
                      className="p-4 flex justify-between items-center hover:bg-gray-50 group transition-colors"
                    >
                      {/* --- AQUI ESTAVA O ERRO: AGORA TEM LINK --- */}
                      <div className="flex-1 pr-4">
                        <Link
                          to={`/lesson/${lesson._id}`} // O PULO DO GATO 🐱
                          className="flex items-center space-x-3 cursor-pointer"
                        >
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              completed
                                ? "bg-green-100 text-green-600"
                                : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors"
                            }`}
                          >
                            {completed ? "✓" : <PlayCircle size={16} />}
                          </div>
                          <div>
                            <span
                              className={`font-medium block ${
                                completed
                                  ? "text-gray-500 line-through"
                                  : "text-gray-800 group-hover:text-indigo-700"
                              }`}
                            >
                              {lesson.title}
                            </span>
                            <span className="text-xs text-gray-400 uppercase">
                              {lesson.type}
                            </span>
                          </div>
                        </Link>
                      </div>

                      {/* Botão de Ação */}
                      {user && (
                        <button
                          onClick={() =>
                            handleLessonComplete(course._id, lesson._id)
                          }
                          className={`flex-shrink-0 px-3 py-1 text-xs rounded-full font-bold border transition-all ${
                            completed
                              ? "bg-green-50 border-green-200 text-green-700"
                              : "bg-white border-gray-300 text-gray-500 hover:border-teal-500 hover:text-teal-600"
                          }`}
                          disabled={completed}
                        >
                          {completed ? "Concluído" : "Marcar Visto"}
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
