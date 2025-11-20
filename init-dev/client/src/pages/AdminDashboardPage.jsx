import React, { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import courseService from "../api/courseService";
import {
  Trash2,
  Edit,
  FileText,
  Award,
  Plus,
  ChevronDown,
  ChevronUp,
  Book,
  Search,
  ArrowRight,
  Eye,
} from "lucide-react";

function AdminDashboardPage() {
  // --- ESTADOS GERAIS ---
  const [pendingUsers, setPendingUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("users");

  // --- ESTADOS DE CURSO ---
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [courseFormData, setCourseFormData] = useState({
    title: "",
    description: "",
    language: "",
    slots: 50,
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  // --- ESTADOS DE CONTEÚDO (Módulos/Lições) ---
  const [selectedCourseForContent, setSelectedCourseForContent] =
    useState(null);
  const [moduleFormData, setModuleFormData] = useState({ title: "", order: 1 });
  const [searchTerm, setSearchTerm] = useState("");

  // Estado para Lição (Criar ou Editar)
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [lessonFormData, setLessonFormData] = useState({
    title: "",
    content: "",
    type: "text",
    order: 1,
    moduleId: null,
  });

  // --- ESTADOS DE CERTIFICADO ---
  // (Futuro: Carregar isso do backend real)
  const [certificates, setCertificates] = useState([
    {
      id: 1,
      student: "Maria Silva",
      course: "React Básico",
      date: "20/10/2025",
      code: "CRT-8852",
      courseId: "691f48b447cd0df66ac6fc08",
    }, // Adicione courseId se tiver
  ]);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const config = { headers: { Authorization: `Bearer ${user?.token}` } };

  // --- MÁGICA: LISTA UNIFICADA DE LIÇÕES ---
  // Transforma a árvore Curso -> Módulos -> Lições em uma lista plana para a aba "Lições"
  const allLessons = useMemo(() => {
    if (!courses.length) return [];
    let flatList = [];
    courses.forEach((course) => {
      if (course.modules) {
        course.modules.forEach((mod) => {
          if (mod.lessons) {
            mod.lessons.forEach((les) => {
              flatList.push({
                _id: les._id,
                title: les.title,
                type: les.type,
                courseName: course.title,
                courseId: course._id,
                moduleName: mod.title,
                moduleId: mod._id,
                fullLesson: les,
              });
            });
          }
        });
      }
    });
    // Filtra se tiver algo digitado na busca
    return flatList.filter((l) =>
      l.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  // --- FETCHS ---
  const fetchPendingUsers = async () => {
    try {
      const res = await axios.get("/api/admin/users/pending", config);
      setPendingUsers(res.data);
    } catch (e) {
      console.error("Erro users", e);
    }
  };
  const fetchMessages = async () => {
    try {
      const res = await axios.get("/api/messages/admin", config);
      setMessages(res.data);
    } catch (e) {
      console.error("Erro messages", e);
    }
  };
  const fetchCourses = async () => {
    try {
      const res = await axios.get("/api/courses/admin", config);
      setCourses(res.data);
    } catch (e) {
      console.error("Erro courses", e);
    }
  };

  // --- ACTIONS GERAIS ---
  const handleApprove = async (userId) => {
    try {
      await axios.put(`/api/admin/users/${userId}/approve`, {}, config);
      setMessage("Aprovado!");
      fetchPendingUsers();
    } catch (e) {
      setMessage("Erro.");
    }
  };

  // --- ACTIONS: COURSES (Manter igual) ---
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
        setMessage("Curso atualizado!");
      } else {
        await axios.post("/api/courses/admin", formData, config);
        setMessage("Curso criado!");
      }
      setCourseFormData({
        title: "",
        description: "",
        language: "",
        slots: 50,
      });
      setSelectedFiles([]);
      setIsEditing(false);
      fetchCourses();
    } catch (e) {
      setMessage("Erro ao salvar curso.");
    }
  };

  const handleCourseDelete = async (id) => {
    if (!window.confirm("Apagar curso?")) return;
    try {
      await axios.delete(`/api/courses/admin/${id}`, config);
      setMessage("Deletado.");
      fetchCourses();
    } catch (e) {
      setMessage("Erro ao deletar.");
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

  // --- ACTIONS: CONTENT (MÓDULOS E LIÇÕES) ---
  const handleSelectCourseForContent = async (courseIdOrObj) => {
    // Correção: Aceita tanto o objeto inteiro (da tabela de cursos) quanto o ID string (da tabela de lições)
    const id = typeof courseIdOrObj === 'string' ? courseIdOrObj : courseIdOrObj._id;

    try {
      const detailed = await courseService.getCourseDetails(id);
      setSelectedCourseForContent(detailed);
      // Resetar formulários ao abrir um curso novo
      setModuleFormData({ title: "", order: 1 });
      setLessonFormData({
        title: "",
        content: "",
        type: "text",
        order: 1,
        moduleId: null,
      });
      setIsEditingLesson(false);
      // Força ir para a aba de cursos onde está o editor visual
      setActiveTab("courses");
    } catch (e) {
      setMessage("Erro ao carregar detalhes.");
    }
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    if (!selectedCourseForContent) return;
    try {
      const res = await courseService.addModuleToCourse(
        selectedCourseForContent._id,
        moduleFormData
      );
      setMessage("Módulo adicionado!");
      setModuleFormData((prev) => ({
        title: "",
        order: parseInt(prev.order) + 1,
      }));
      // Atualiza lista localmente
      setSelectedCourseForContent((prev) => ({
        ...prev,
        modules: [...prev.modules, res.module].sort(
          (a, b) => a.order - b.order
        ),
      }));
      fetchCourses(); // Atualiza a lista global de lições também
    } catch (e) {
      setMessage("Erro ao adicionar módulo.");
    }
  };

  // Nova função que lida tanto com CRIAR quanto com EDITAR lição
  const handleSaveLesson = async (e) => {
    e.preventDefault();
    if (!selectedCourseForContent || !lessonFormData.moduleId) return;

    try {
      if (isEditingLesson) {
        // Lógica de EDITAR (Simulação - Backend precisa ter rota PUT /lessons/:id)
        alert(
          "Edição enviada para o backend (Simulação). Implementar rota PUT."
        );
        // ... lógica de update local ...
      } else {
        // Lógica de CRIAR (Já existe e funciona)
        const res = await courseService.addLessonToModule(
          selectedCourseForContent._id,
          lessonFormData.moduleId,
          lessonFormData
        );
        setMessage("Lição adicionada!");
        
        // Atualiza UI
        setSelectedCourseForContent((prev) => ({
          ...prev,
          modules: prev.modules
            .map((mod) =>
              mod._id === lessonFormData.moduleId
                ? {
                    ...mod,
                    lessons: [...mod.lessons, res.lesson].sort(
                      (a, b) => a.order - b.order
                    ),
                  }
                : mod
            )
            .sort((a, b) => a.order - b.order),
        }));
      }

      // Limpa o form
      setLessonFormData((prev) => ({
        ...prev,
        title: "",
        content: "",
        order: parseInt(prev.order) + 1,
      }));
      setIsEditingLesson(false);
      setEditingLessonId(null);
      fetchCourses(); // Atualiza a lista global de lições também
    } catch (e) {
      setMessage("Erro ao salvar lição.");
    }
  };

  const prepareEditLesson = (lesson, moduleId) => {
    setLessonFormData({
      title: lesson.title,
      content: lesson.content || "", // Garantir que content exista
      type: lesson.type,
      order: lesson.order,
      moduleId: moduleId,
    });
    setIsEditingLesson(true);
    setEditingLessonId(lesson._id);
    // Scroll para o form (opcional)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEditLesson = () => {
    setLessonFormData({
      title: "",
      content: "",
      type: "text",
      order: 1,
      moduleId: null,
    });
    setIsEditingLesson(false);
    setEditingLessonId(null);
  };

  const handleDeleteLesson = async (moduleId, lessonId) => {
    if (!window.confirm("Deletar esta lição?")) return;
    // Chamar API de delete aqui...

    // Atualização Visual (Só se estiver dentro do curso)
    if(selectedCourseForContent) {
        setSelectedCourseForContent((prev) => ({
        ...prev,
        modules: prev.modules.map((mod) =>
            mod._id === moduleId
            ? { ...mod, lessons: mod.lessons.filter((l) => l._id !== lessonId) }
            : mod
        ),
        }));
    }
    
    setMessage("Lição removida.");
    fetchCourses(); // Atualiza lista global
  };

  const handleDeleteModule = async (moduleId) => {
    /* Manter igual ao anterior */
  };

  // --- ACTION: CERTIFICADO (PREVIEW E DOWNLOAD) ---

  // Função para ver PDF em nova aba
  const handlePreviewCertificate = async (courseId) => {
    if (!courseId) {
      courseId = prompt("Cole o ID do curso para visualizar:");
      if (!courseId) return;
    }

    try {
      setMessage("Gerando Preview...");
      const response = await axios.get(`/api/certificates/issue/${courseId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
        responseType: "blob",
      });

      // Cria URL temporária
      const fileURL = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      // Abre em nova aba
      window.open(fileURL, "_blank");
      setMessage("Preview aberto em nova aba.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao gerar preview.");
    }
  };

  const handleDownloadTestCertificate = async () => {
      // Lógica de download
  }

  // --- EFEITOS (Manter igual) ---
  useEffect(() => {
    if (!user || user.role !== "admin") {
      logout();
      navigate("/login");
    } else {
      fetchPendingUsers();
      fetchMessages();
      fetchCourses();
    }
  }, [user, activeTab]); // eslint-disable-line

  if (!user || user.role !== "admin") return null;

  // --- HELPER (Manter igual) ---
  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-2 font-medium text-lg transition-colors ${
        activeTab === id
          ? "text-teal-700 border-b-2 border-teal-700"
          : "text-gray-500 hover:text-teal-600"
      }`}
    >
      {Icon && <Icon size={18} />} {label}
    </button>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-6xl mx-auto my-10 min-h-screen">
      <h1 className="text-4xl font-extrabold text-teal-800 text-center mb-2">
        Painel de Admin
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Gerenciamento completo da plataforma Init.dev
      </p>

      {message && (
        <div className="bg-teal-50 text-teal-800 p-3 rounded mb-4 text-center">
          {message}
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4 mb-8 border-b border-gray-200 pb-1">
        <TabButton id="users" label="Usuários" icon={null} />
        <TabButton id="messages" label="Mensagens" icon={FileText} />
        <TabButton id="courses" label="Cursos & Aulas" icon={Edit} />
        
        {/* --- AQUI: BOTÃO QUE FALTAVA --- */}
        <TabButton id="lessons" label="Lições" icon={Book} />
        
        <TabButton id="certificates" label="Certificados" icon={Award} />
      </div>

      {/* ... (Abas Users e Messages mantidas iguais ao seu código anterior) ... */}
      {activeTab === "users" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Solicitações ({pendingUsers.length})
          </h2>
          {/* ... lista de usuarios ... */}
          {pendingUsers.length === 0 ? (
            <p>Nada pendente.</p>
          ) : (
            <ul className="divide-y">
              {pendingUsers.map((u) => (
                <li key={u._id} className="py-2 flex justify-between">
                  <span>{u.name}</span>
                  <button
                    onClick={() => handleApprove(u._id)}
                    className="text-teal-600"
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
          <h2 className="text-2xl font-bold mb-4">Mensagens</h2>
          {messages.length === 0 ? (
            <p>Nada.</p>
          ) : (
            <ul className="divide-y">
              {messages.map((m) => (
                <li key={m._id} className="py-2">
                  <p>
                    {m.name}: {m.message}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* --- CONTEÚDO: CURSOS E AULAS --- */}
      {activeTab === "courses" && (
        <div>
          {!selectedCourseForContent ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Gerenciar Cursos</h2>
              </div>
              {/* Formulário de Criar Curso */}
              <form
                onSubmit={handleCourseSubmit}
                className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200"
              >
                {/* ... Inputs de Curso ... */}
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    placeholder="Título"
                    className="input-std p-2 border rounded"
                    name="title"
                    value={courseFormData.title}
                    onChange={(e) =>
                      setCourseFormData({
                        ...courseFormData,
                        title: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    placeholder="Linguagem"
                    className="input-std p-2 border rounded"
                    name="language"
                    value={courseFormData.language}
                    onChange={(e) =>
                      setCourseFormData({
                        ...courseFormData,
                        language: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    placeholder="Descrição"
                    className="input-std p-2 border rounded col-span-2"
                    name="description"
                    value={courseFormData.description}
                    onChange={(e) =>
                      setCourseFormData({
                        ...courseFormData,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="number"
                    placeholder="Vagas"
                    className="input-std p-2 border rounded"
                    name="slots"
                    value={courseFormData.slots}
                    onChange={(e) =>
                      setCourseFormData({
                        ...courseFormData,
                        slots: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="file"
                    multiple
                    onChange={(e) =>
                      setSelectedFiles(Array.from(e.target.files))
                    }
                    className="p-2"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-600 w-full font-bold"
                >
                  {isEditing ? "Salvar" : "Criar"}
                </button>
              </form>

              <div className="grid gap-4">
                {courses.map((c) => (
                  <div
                    key={c._id}
                    className="flex justify-between items-center p-4 border rounded shadow-sm bg-white"
                  >
                    <div>
                      <h4 className="font-bold text-lg">{c.title}</h4>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                        {c.language}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSelectCourseForContent(c)}
                        className="bg-blue-100 text-blue-700 p-2 rounded flex items-center gap-1 hover:bg-blue-200 font-bold text-sm"
                      >
                        <Edit size={16} /> Gerenciar Aulas
                      </button>
                      <button
                        onClick={() => handleCourseEdit(c)}
                        className="bg-gray-100 text-gray-700 p-2 rounded hover:bg-gray-200"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleCourseDelete(c._id)}
                        className="bg-red-100 text-red-700 p-2 rounded hover:bg-red-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // --- AREA DE EDIÇÃO DE CONTEÚDO ---
            <div>
              <button
                onClick={() => {
                  setSelectedCourseForContent(null);
                  handleCancelEditLesson();
                }}
                className="mb-4 text-sm text-gray-500 hover:underline"
              >
                ← Voltar para Lista de Cursos
              </button>
              <h2 className="text-3xl font-bold text-teal-800 mb-6 border-b pb-2">
                Conteúdo: {selectedCourseForContent.title}
              </h2>

              {/* Adicionar Módulo */}
              <div className="bg-indigo-50 p-4 rounded-lg mb-8 border border-indigo-100 flex gap-4 items-center">
                <h4 className="font-bold text-indigo-800 whitespace-nowrap">
                  Novo Módulo:
                </h4>
                <form
                  onSubmit={handleAddModule}
                  className="flex gap-2 flex-grow"
                >
                  <input
                    placeholder="Nome do Módulo"
                    className="flex-1 p-2 border rounded"
                    value={moduleFormData.title}
                    onChange={(e) =>
                      setModuleFormData({
                        ...moduleFormData,
                        title: e.target.value,
                      })
                    }
                    required
                  />
                  <input
                    type="number"
                    placeholder="Ord"
                    className="w-20 p-2 border rounded"
                    value={moduleFormData.order}
                    onChange={(e) =>
                      setModuleFormData({
                        ...moduleFormData,
                        order: e.target.value,
                      })
                    }
                    required
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 rounded hover:bg-indigo-700"
                  >
                    <Plus size={20} />
                  </button>
                </form>
              </div>

              {/* Lista de Módulos e Lições */}
              <div className="space-y-6">
                {selectedCourseForContent.modules.map((mod) => (
                  <div
                    key={mod._id}
                    className="border rounded-lg overflow-hidden bg-white shadow-sm"
                  >
                    <div className="bg-gray-100 p-3 flex justify-between items-center border-b">
                      <h5 className="font-bold text-gray-700 text-lg">
                        {mod.order}. {mod.title}
                      </h5>
                      <button
                        onClick={() => handleDeleteModule(mod._id)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="p-4">
                      {/* Formulário de Lição (Criar ou Editar) */}
                      <form
                        onSubmit={handleSaveLesson}
                        className={`mb-4 flex flex-wrap gap-2 items-end p-3 rounded border ${
                          lessonFormData.moduleId === mod._id
                            ? "bg-blue-50 border-blue-200"
                            : "bg-gray-50 border-dashed border-gray-300"
                        }`}
                      >
                        <div className="w-full text-xs font-bold uppercase text-gray-500 mb-1">
                          {isEditingLesson &&
                          lessonFormData.moduleId === mod._id
                            ? `Editando Lição: ${lessonFormData.title}`
                            : "Nova Lição neste Módulo"}
                        </div>

                        <div className="flex-grow min-w-[200px]">
                          <input
                            className="w-full p-2 border rounded text-sm"
                            placeholder="Título da Lição"
                            value={
                              lessonFormData.moduleId === mod._id
                                ? lessonFormData.title
                                : ""
                            }
                            onChange={(e) =>
                              setLessonFormData({
                                ...lessonFormData,
                                title: e.target.value,
                                moduleId: mod._id,
                              })
                            }
                            onFocus={() =>
                              !isEditingLesson &&
                              setLessonFormData((prev) => ({
                                ...prev,
                                moduleId: mod._id,
                              }))
                            }
                          />
                        </div>
                        <div className="w-32">
                          <select
                            className="w-full p-2 border rounded text-sm"
                            value={
                              lessonFormData.moduleId === mod._id
                                ? lessonFormData.type
                                : "text"
                            }
                            onChange={(e) =>
                              setLessonFormData({
                                ...lessonFormData,
                                ...{ type: e.target.value },
                                moduleId: mod._id,
                              })
                            }
                          >
                            <option value="text">Texto</option>
                            <option value="video">Vídeo</option>
                            <option value="quiz">Quiz</option>
                            <option value="code">Código</option>
                          </select>
                        </div>
                        <div className="w-20">
                          <input
                            type="number"
                            className="w-full p-2 border rounded text-sm"
                            placeholder="Ord"
                            value={
                              lessonFormData.moduleId === mod._id
                                ? lessonFormData.order
                                : ""
                            }
                            onChange={(e) =>
                              setLessonFormData({
                                ...lessonFormData,
                                order: e.target.value,
                                moduleId: mod._id,
                              })
                            }
                          />
                        </div>

                        <div className="flex gap-1">
                          <button
                            type="submit"
                            className={`text-white px-4 py-2 rounded text-sm font-bold ${
                              isEditingLesson &&
                              lessonFormData.moduleId === mod._id
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-teal-600 hover:bg-teal-700"
                            }`}
                          >
                            {isEditingLesson &&
                            lessonFormData.moduleId === mod._id ? (
                              <Edit size={16} />
                            ) : (
                              <Plus size={16} />
                            )}
                          </button>
                          {isEditingLesson &&
                            lessonFormData.moduleId === mod._id && (
                              <button
                                type="button"
                                onClick={handleCancelEditLesson}
                                className="bg-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-400"
                              >
                                Cancelar
                              </button>
                            )}
                        </div>

                        {/* Campo de Conteúdo (Textarea) expande se estiver focado/editando */}
                        {lessonFormData.moduleId === mod._id && (
                          <textarea
                            className="w-full mt-2 p-2 border rounded text-sm h-24"
                            placeholder="Conteúdo da aula (HTML, Markdown ou Link de vídeo)..."
                            value={lessonFormData.content}
                            onChange={(e) =>
                              setLessonFormData({
                                ...lessonFormData,
                                content: e.target.value,
                              })
                            }
                          />
                        )}
                      </form>

                      {/* Lista de Lições Existentes */}
                      <ul className="space-y-2">
                        {mod.lessons.map((les) => (
                          <li
                            key={les._id}
                            className={`flex justify-between items-center text-sm p-3 rounded border ${
                              editingLessonId === les._id
                                ? "bg-blue-100 border-blue-300"
                                : "bg-white hover:bg-gray-50 border-gray-100"
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded">
                                {les.order}
                              </span>
                              <span className="font-medium text-gray-800">
                                {les.title}
                              </span>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded uppercase">
                                {les.type}
                              </span>
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => prepareEditLesson(les, mod._id)}
                                className="text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-50 rounded"
                                title="Editar Lição"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteLesson(mod._id, les._id)
                                }
                                className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded"
                                title="Excluir Lição"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </li>
                        ))}
                        {mod.lessons.length === 0 && (
                          <li className="text-sm text-gray-400 italic p-2 text-center">
                            Nenhuma lição neste módulo. Adicione acima.
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- AQUI: CONTEÚDO DA NOVA ABA LIÇÕES --- */}
      {activeTab === "lessons" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-teal-800">
                Biblioteca de Lições
              </h2>
              <p className="text-gray-500 text-sm">
                Visão unificada de todas as aulas do sistema.
              </p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar lição..."
                className="pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:border-teal-500 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute left-2.5 top-2.5 text-gray-400"
                size={18}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-600 text-xs uppercase font-bold">
                <tr>
                  <th className="p-4">Título da Lição</th>
                  <th className="p-4">Curso</th>
                  <th className="p-4">Módulo</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4 text-right">Gerenciar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {allLessons.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      Nenhuma lição encontrada. Crie lições dentro da aba
                      "Cursos".
                    </td>
                  </tr>
                ) : (
                  allLessons.map((lesson) => (
                    <tr
                      key={lesson._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4 font-medium text-gray-800">
                        {lesson.title}
                      </td>
                      <td className="p-4 text-indigo-600 font-semibold">
                        {lesson.courseName}
                      </td>
                      <td className="p-4 text-gray-500">{lesson.moduleName}</td>
                      <td className="p-4">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs uppercase font-bold text-gray-500">
                          {lesson.type}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {/* Este botão leva para a aba de Cursos, mas já abrindo o curso certo */}
                        <button
                          onClick={() =>
                            handleSelectCourseForContent(lesson.courseId)
                          }
                          className="text-teal-600 hover:text-teal-800 font-bold flex items-center gap-1 justify-end ml-auto hover:bg-teal-50 px-3 py-1.5 rounded transition"
                          title="Ir para o editor deste curso"
                        >
                          Editar <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- CONTEÚDO: CERTIFICADOS --- */}
      {activeTab === "certificates" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-teal-800">
                Gestão de Certificados
              </h2>
              <p className="text-gray-500 text-sm">
                Visualize e gere certificados manualmente.
              </p>
            </div>
            <button
              onClick={() => handlePreviewCertificate(null)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-md"
            >
              <Award size={18} /> Gerar Manualmente
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                <tr>
                  <th className="p-4">Aluno</th>
                  <th className="p-4">Curso</th>
                  <th className="p-4">Data Emissão</th>
                  <th className="p-4">Código Validação</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium">{cert.student}</td>
                    <td className="p-4 text-gray-600">{cert.course}</td>
                    <td className="p-4 text-gray-500">{cert.date}</td>
                    <td className="p-4 font-mono text-xs bg-gray-50 rounded w-fit">
                      {cert.code}
                    </td>
                    <td className="p-4 text-right">
                      {/* BOTÃO NOVO: PREVIEW */}
                      <button
                        onClick={() =>
                          handlePreviewCertificate(
                            cert.courseId || "691f48b447cd0df66ac6fc08"
                          )
                        }
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-bold flex items-center gap-1 justify-end ml-auto hover:bg-indigo-50 px-2 py-1 rounded transition"
                      >
                        <Eye size={16} /> Ver PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;