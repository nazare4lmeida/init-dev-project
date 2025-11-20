import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import courseService from "../api/courseService"; 

function AdminDashboardPage() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [courses, setCourses] = useState([]);
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState("users");
    const [isEditing, setIsEditing] = useState(false);
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [courseFormData, setCourseFormData] = useState({
        title: "",
        description: "",
        language: "",
        slots: 50,
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // NOVOS ESTADOS PARA GESTÃO DE CONTEÚDO
    const [selectedCourseForContent, setSelectedCourseForContent] = useState(null);
    const [moduleFormData, setModuleFormData] = useState({ title: "", order: 1 });
    const [lessonFormData, setLessonFormData] = useState({ 
        title: "", 
        content: "", 
        type: "text", 
        order: 1, 
        moduleId: null 
    });

    const config = {
        headers: {
            Authorization: `Bearer ${user?.token}`,
        },
    };

    const fetchPendingUsers = async () => {
        try {
            const response = await axios.get("/api/admin/users/pending", config);
            setPendingUsers(response.data);
        } catch (error) {
            setMessage("Erro ao carregar usuários pendentes.");
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await axios.get("/api/messages/admin", config);
            setMessages(response.data);
        } catch (error) {
            setMessage("Erro ao carregar mensagens.");
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await axios.get("/api/courses/admin", config); 
            setCourses(response.data);
        } catch (error) {
            setMessage("Erro ao carregar cursos.");
        }
    };

    const handleApprove = async (userId) => {
        try {
            await axios.put(`/api/admin/users/${userId}/approve`, {}, config);
            setMessage("Usuário aprovado com sucesso!");
            fetchPendingUsers();
        } catch (error) {
            setMessage("Erro ao aprovar usuário.");
        }
    };

    const handleCourseSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(courseFormData).forEach((key) =>
                formData.append(key, courseFormData[key])
            );
            selectedFiles.forEach((file) => formData.append("courseImages", file));

            if (isEditing) {
                await axios.put(
                    `/api/courses/admin/${editingCourseId}`,
                    formData,
                    config
                );
                setMessage("Curso atualizado com sucesso!");
            } else {
                await axios.post("/api/courses/admin", formData, config);
                setMessage("Curso criado com sucesso!");
            }
            setCourseFormData({
                title: "",
                description: "",
                language: "",
                slots: 50,
            });
            setSelectedFiles([]);
            setIsEditing(false);
            setEditingCourseId(null);
            fetchCourses();
        } catch (error) {
            setMessage("Erro ao salvar curso.");
        }
    };

    const handleCourseEdit = (course) => {
        setCourseFormData({
            title: course.title,
            description: course.description,
            language: course.language,
            slots: course.slots,
        });
        setIsEditing(true);
        setEditingCourseId(course._id);
        setActiveTab("courses");
        setSelectedCourseForContent(null); 
    };

    const handleCourseDelete = async (courseId) => {
        try {
            await axios.delete(`/api/courses/admin/${courseId}`, config); 
            setMessage("Curso removido com sucesso!");
            fetchCourses();
        } catch (error) {
            setMessage("Erro ao remover curso.");
        }
    };

    // =======================================================
    // NOVAS FUNÇÕES DE GESTÃO DE CONTEÚDO
    // =======================================================

    const handleSelectCourseForContent = async (course) => {
        setMessage(`Carregando conteúdo de ${course.title}...`);
        try {
            // Chama o novo serviço de API
            const detailedCourse = await courseService.getCourseDetails(course._id);
            setSelectedCourseForContent(detailedCourse);
            setMessage(`Gerenciando conteúdo do curso: ${detailedCourse.title}`);
        } catch (error) {
            setMessage("Erro ao carregar detalhes do curso para edição de conteúdo.");
            console.error("Erro ao carregar detalhes do curso:", error.response?.data || error);
        }
    };

    const handleAddModule = async (e) => {
        e.preventDefault();
        if (!selectedCourseForContent) return;

        try {
            const response = await courseService.addModuleToCourse(
                selectedCourseForContent._id,
                moduleFormData
            );
            setMessage(`Módulo "${response.module.title}" adicionado com sucesso!`);
            
            setModuleFormData((prev) => ({ title: "", order: parseInt(prev.order) + 1 }));

            // ATUALIZAÇÃO LOCAL
            setSelectedCourseForContent((prev) => ({
                ...prev,
                modules: [...prev.modules, response.module].sort((a, b) => a.order - b.order),
            }));

        } catch (error) {
            setMessage(`Erro ao adicionar módulo: ${error.response?.data?.message || error.message}`);
            console.error("Erro ao adicionar módulo:", error);
        }
    };

    const handleAddLesson = async (e) => {
        e.preventDefault();
        if (!selectedCourseForContent || !lessonFormData.moduleId) return;
        
        // Esta função garante que o valor `content` no estado do React é usado
        const currentModuleId = lessonFormData.moduleId; 
        
        try {
            const response = await courseService.addLessonToModule(
                selectedCourseForContent._id,
                currentModuleId,
                {
                    title: lessonFormData.title,
                    content: lessonFormData.content,
                    type: lessonFormData.type,
                    order: parseInt(lessonFormData.order),
                }
            );
            setMessage(`Lição "${response.lesson.title}" adicionada com sucesso!`);
            
            // Incrementa a ordem e limpa os campos da lição
            setLessonFormData((prev) => ({ 
                ...prev, 
                title: "", 
                content: "", 
                order: parseInt(prev.order) + 1,
            }));
            
            // ATUALIZAÇÃO LOCAL
            setSelectedCourseForContent((prev) => ({
                ...prev,
                modules: prev.modules.map(mod => 
                    mod._id === currentModuleId
                        // Adiciona o novo objeto lesson (populado parcialmente)
                        ? { ...mod, lessons: [...mod.lessons, response.lesson].sort((a, b) => a.order - b.order) } 
                        : mod
                ).sort((a, b) => a.order - b.order),
            }));
            
        } catch (error) {
            setMessage(`Erro ao adicionar lição: ${error.response?.data?.message || error.message}`);
            console.error("Erro ao adicionar lição:", error);
        }
    };
    
    // Funções de alteração de estado para o formulário de lição
    const onLessonFormChange = (e, moduleId) => {
        // Esta lógica garante que o formulário só preenche os campos do módulo atualmente clicado
        if (lessonFormData.moduleId !== moduleId) {
             setLessonFormData({
                title: "",
                content: "",
                type: "text",
                order: 1,
                moduleId: moduleId
            });
        }
        
        setLessonFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
            moduleId: moduleId // Garante que o ID do módulo está sempre no estado correto
        }));
    };
    
    // EFEITOS (inalterados)
    useEffect(() => {
        if (!user || user.role !== "admin") {
            logout();
            navigate("/login");
        }
    }, [user, navigate, logout]);

    useEffect(() => {
        // Se a tab de curso for ativada e não houver um curso em edição, recarrega a lista
        if (user && user.role === "admin") {
            fetchPendingUsers();
            fetchMessages();
            
            // A lista de cursos é recarregada para mostrar os módulos recém-adicionados
            if (!selectedCourseForContent || activeTab === "courses") {
                fetchCourses();
            }
        }
    }, [user, activeTab, selectedCourseForContent]);


    const onCourseFormChange = (e) => {
        setCourseFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const onFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    if (!user || user.role !== "admin") {
        return null;
    }

    // =======================================================
    // RENDERIZAÇÃO
    // =======================================================

    return (
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-5xl mx-auto my-10">
            <h1 className="text-4xl font-extrabold text-teal-700 text-center mb-6">
                Painel do Administrador
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600 mb-8">
                Gerencie as solicitações e a plataforma.
            </p>

            {message && (
                <p className="text-center text-sm text-gray-600 mb-4">{message}</p>
            )}

            <div className="flex justify-center mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("users")}
                    className={`px-4 py-2 font-medium text-lg ${
                        activeTab === "users"
                            ? "text-teal-700 border-b-2 border-teal-700"
                            : "text-gray-500"
                    }`}
                >
                    Usuários Pendentes
                </button>
                <button
                    onClick={() => setActiveTab("messages")}
                    className={`ml-4 px-4 py-2 font-medium text-lg ${
                        activeTab === "messages"
                            ? "text-teal-700 border-b-2 border-teal-700"
                            : "text-gray-500"
                    }`}
                >
                    Mensagens de Contato
                </button>
                <button
                    onClick={() => setActiveTab("courses")}
                    className={`ml-4 px-4 py-2 font-medium text-lg ${
                        activeTab === "courses"
                            ? "text-teal-700 border-b-2 border-teal-700"
                            : "text-gray-500"
                    }`}
                >
                    Gerenciar Cursos
                </button>
            </div>

            {activeTab === "users" && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Solicitações de Acesso</h2>
                    {pendingUsers.length === 0 ? (
                        <p className="text-center text-gray-500">
                            Nenhuma solicitação pendente.
                        </p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {pendingUsers.map((pendingUser) => (
                                <li
                                    key={pendingUser._id}
                                    className="py-4 flex items-center justify-between"
                                >
                                    <div>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {pendingUser.name}
                                        </p>
                                        <p className="text-sm text-gray-500">{pendingUser.email}</p>
                                    </div>
                                    <button
                                        onClick={() => handleApprove(pendingUser._id)}
                                        className="px-4 py-2 font-medium text-white bg-teal-700 rounded-md hover:bg-teal-600"
                                    >
                                        Aprovar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {activeTab === "messages" && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Mensagens de Contato</h2>
                    {messages.length === 0 ? (
                        <p className="text-center text-gray-500">
                            Nenhuma mensagem encontrada.
                        </p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {messages.map((msg) => (
                                <li key={msg._id} className="py-4">
                                    <p className="text-lg font-semibold text-gray-900">
                                        {msg.name} - {msg.email}
                                    </p>
                                    <p className="mt-1 text-gray-600">{msg.message}</p>
                                    <p
                                        className={`mt-2 text-sm font-medium ${
                                            msg.isResponded ? "text-green-600" : "text-red-600"
                                        }`}
                                    >
                                        Status: {msg.isResponded ? "Respondida" : "Pendente"}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {activeTab === "courses" && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Gerenciamento de Cursos</h2>
                    
                    {/* ======================================= */}
                    {/* 1. INTERFACE DE ADIÇÃO/EDIÇÃO DE CURSO BÁSICO E LISTA GERAL */}
                    {/* ======================================= */}
                    {!selectedCourseForContent && (
                        <>
                            <form onSubmit={handleCourseSubmit} className="mb-8 space-y-4 border p-4 rounded-md bg-gray-50">
                                <h3 className="text-xl font-medium mb-2 text-teal-700">
                                    {isEditing ? "Editar Curso Básico" : "Adicionar Novo Curso"}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="title"
                                        value={courseFormData.title}
                                        onChange={onCourseFormChange}
                                        placeholder="Título do Curso"
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="description"
                                        value={courseFormData.description}
                                        onChange={onCourseFormChange}
                                        placeholder="Descrição"
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="language"
                                        value={courseFormData.language}
                                        onChange={onCourseFormChange}
                                        placeholder="Linguagem (ex: JavaScript)"
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                    <input
                                        type="number"
                                        name="slots"
                                        value={courseFormData.slots}
                                        onChange={onCourseFormChange}
                                        placeholder="Número de Vagas"
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                    <input
                                        type="file"
                                        name="courseImages"
                                        onChange={onFileChange}
                                        multiple
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 font-medium text-white bg-teal-700 rounded-md hover:bg-teal-600"
                                >
                                    {isEditing ? "Salvar Edição" : "Adicionar Novo Curso"}
                                </button>
                            </form>

                            {/* Lista de Cursos Cadastrados */}
                            <h3 className="text-xl font-bold mb-4 mt-8">Cursos Cadastrados</h3>
                            {courses.length === 0 ? (
                                <p className="text-center text-gray-500">Nenhum curso cadastrado.</p>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {courses.map((course) => (
                                        <li
                                            key={course._id}
                                            className="py-4 flex items-center justify-between"
                                        >
                                            <div>
                                                <p className="text-lg font-semibold text-gray-900">{course.title}</p>
                                                <p className="text-sm text-gray-500">
                                                    {course.language} - {course.availableSlots} vagas
                                                </p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleSelectCourseForContent(course)}
                                                    className="px-3 py-1 font-medium text-sm text-white bg-blue-600 rounded-md hover:bg-blue-500"
                                                >
                                                    Conteúdo ({course.modules?.length || 0} Módulos)
                                                </button>
                                                <button
                                                    onClick={() => handleCourseEdit(course)}
                                                    className="px-3 py-1 font-medium text-sm text-white bg-gray-700 rounded-md hover:bg-gray-600"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleCourseDelete(course._id)}
                                                    className="px-3 py-1 font-medium text-sm text-white bg-red-600 rounded-md hover:bg-red-500"
                                                >
                                                    Deletar
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}

                    {/* ======================================= */}
                    {/* 2. INTERFACE DE GESTÃO DE MÓDULOS E LIÇÕES */}
                    {/* ======================================= */}
                    {selectedCourseForContent && (
                        <div className="mt-8 border-t pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-2xl font-bold text-teal-700">
                                    Módulos de: {selectedCourseForContent.title}
                                </h3>
                                <button
                                    onClick={() => setSelectedCourseForContent(null)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-md hover:bg-gray-400"
                                >
                                    Voltar para Cursos
                                </button>
                            </div>

                            {/* Adicionar Novo Módulo */}
                            <form onSubmit={handleAddModule} className="mb-6 p-4 border rounded-md bg-white shadow-sm">
                                <h4 className="text-lg font-semibold mb-3">Adicionar Novo Módulo</h4>
                                <div className="flex space-x-3">
                                    <input
                                        type="text"
                                        name="title"
                                        value={moduleFormData.title}
                                        onChange={(e) => setModuleFormData({ ...moduleFormData, title: e.target.value })}
                                        placeholder="Título do Módulo"
                                        className="flex-grow px-3 py-2 border rounded-md"
                                        required
                                    />
                                    <input
                                        type="number"
                                        name="order"
                                        value={moduleFormData.order}
                                        onChange={(e) => setModuleFormData({ ...moduleFormData, order: parseInt(e.target.value) || 1 })}
                                        placeholder="Ordem"
                                        className="w-20 px-3 py-2 border rounded-md"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-500"
                                    >
                                        + Adicionar Módulo
                                    </button>
                                </div>
                            </form>

                            {/* Lista de Módulos e Lições */}
                            <div className="space-y-6">
                                {selectedCourseForContent.modules.length === 0 ? (
                                    <p className="text-gray-500">Este curso ainda não tem módulos.</p>
                                ) : (
                                    selectedCourseForContent.modules.map((module) => (
                                        <div key={module._id} className="p-4 border rounded-md bg-gray-100 shadow-sm">
                                            <h5 className="text-xl font-bold text-gray-800 mb-3">
                                                {module.order}. {module.title}
                                            </h5>

                                            {/* Formulário para Adicionar Lição a este Módulo */}
                                            <form onSubmit={handleAddLesson} className="mb-4 p-3 border border-dashed rounded-md bg-white">
                                                <h6 className="text-md font-semibold mb-2">Adicionar Lição ao Módulo "{module.title}"</h6>
                                                
                                                <input type="hidden" value={module._id} /> 

                                                <div className="space-y-2">
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        // Mostra o valor do formulário apenas se este módulo estiver selecionado
                                                        value={lessonFormData.moduleId === module._id ? lessonFormData.title : ''}
                                                        onChange={(e) => onLessonFormChange(e, module._id)} 
                                                        placeholder="Título da Lição"
                                                        className="w-full px-3 py-2 border rounded-md"
                                                        required
                                                    />
                                                    <textarea
                                                        name="content"
                                                        value={lessonFormData.moduleId === module._id ? lessonFormData.content : ''}
                                                        onChange={(e) => onLessonFormChange(e, module._id)}
                                                        placeholder="Conteúdo (HTML/Markdown)"
                                                        className="w-full px-3 py-2 border rounded-md h-20"
                                                        required
                                                    />
                                                    <div className="flex space-x-2">
                                                        <select
                                                            name="type"
                                                            value={lessonFormData.moduleId === module._id ? lessonFormData.type : 'text'}
                                                            onChange={(e) => onLessonFormChange(e, module._id)}
                                                            className="w-1/3 px-3 py-2 border rounded-md"
                                                        >
                                                            <option value="text">Texto/Teoria</option>
                                                            <option value="video">Vídeo</option>
                                                            <option value="quiz">Quiz</option>
                                                            <option value="code-challenge">Desafio de Código</option>
                                                        </select>
                                                        <input
                                                            type="number"
                                                            name="order"
                                                            value={lessonFormData.moduleId === module._id ? lessonFormData.order : ''}
                                                            onChange={(e) => onLessonFormChange(e, module._id)}
                                                            placeholder="Ordem"
                                                            className="w-1/6 px-3 py-2 border rounded-md"
                                                            required
                                                        />
                                                        <button
                                                            type="submit"
                                                            onClick={() => setLessonFormData((prev) => ({...prev, moduleId: module._id}))}
                                                            className="w-2/3 px-4 py-2 font-medium text-white bg-teal-600 rounded-md hover:bg-teal-500"
                                                        >
                                                            + Adicionar Lição
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>

                                            {/* Lista de Lições (Populadas com título) */}
                                            <div className="mt-4">
                                                <h6 className="text-md font-bold mb-2">Lições Cadastradas ({module.lessons.length})</h6>
                                                {module.lessons.length === 0 ? (
                                                    <p className="text-sm text-gray-500 italic">Nenhuma lição neste módulo.</p>
                                                ) : (
                                                    <ul className="pl-4 list-disc space-y-1">
                                                        {module.lessons.map(lesson => (
                                                            <li key={lesson._id} className="text-sm text-gray-700">
                                                                **{lesson.order}**. {lesson.title} ({lesson.type})
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AdminDashboardPage;