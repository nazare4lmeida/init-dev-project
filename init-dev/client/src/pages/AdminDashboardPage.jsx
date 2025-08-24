import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminDashboardPage() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [courseFormData, setCourseFormData] = useState({
    title: '',
    description: '',
    language: '',
    slots: 50,
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users/pending', config);
      setPendingUsers(response.data);
    } catch (error) {
      setMessage('Erro ao carregar usuários pendentes.');
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/messages/admin', config);
      setMessages(response.data);
    } catch (error) {
      setMessage('Erro ao carregar mensagens.');
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses/admin', config);
      setCourses(response.data);
    } catch (error) {
      setMessage('Erro ao carregar cursos.');
    }
  };

  const handleApprove = async (userId) => {
    try {
      await axios.put(`/api/admin/users/${userId}/approve`, {}, config);
      setMessage('Usuário aprovado com sucesso!');
      fetchPendingUsers();
    } catch (error) {
      setMessage('Erro ao aprovar usuário.');
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(courseFormData).forEach(key => formData.append(key, courseFormData[key]));
      selectedFiles.forEach(file => formData.append('courseImages', file));

      if (isEditing) {
        await axios.put(`/api/courses/admin/${editingCourseId}`, formData, config);
        setMessage('Curso atualizado com sucesso!');
      } else {
        await axios.post('/api/courses/admin', formData, config);
        setMessage('Curso criado com sucesso!');
      }
      setCourseFormData({ title: '', description: '', language: '', slots: 50 });
      setSelectedFiles([]);
      setIsEditing(false);
      setEditingCourseId(null);
      fetchCourses();
    } catch (error) {
      setMessage('Erro ao salvar curso.');
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
    setActiveTab('courses');
  };

  const handleCourseDelete = async (courseId) => {
    try {
      await axios.delete(`/api/courses/admin/${courseId}`, config);
      setMessage('Curso removido com sucesso!');
      fetchCourses();
    } catch (error) {
      setMessage('Erro ao remover curso.');
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      logout();
      navigate('/login');
    }
  }, [user, navigate, logout]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchPendingUsers();
      fetchMessages();
      fetchCourses();
    }
  }, [user, activeTab]);

  const onCourseFormChange = (e) => {
    setCourseFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const onFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-5xl mx-auto my-10">
      <h1 className="text-4xl font-extrabold text-teal-700 text-center mb-6">
        Painel do Administrador
      </h1>
      <p className="mt-2 text-center text-sm text-gray-600 mb-8">
        Gerencie as solicitações e a plataforma.
      </p>

      {message && <p className="text-center text-sm text-gray-600 mb-4">{message}</p>}

      <div className="flex justify-center mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-medium text-lg ${activeTab === 'users' ? 'text-teal-700 border-b-2 border-teal-700' : 'text-gray-500'}`}
        >
          Usuários Pendentes
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`ml-4 px-4 py-2 font-medium text-lg ${activeTab === 'messages' ? 'text-teal-700 border-b-2 border-teal-700' : 'text-gray-500'}`}
        >
          Mensagens de Contato
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`ml-4 px-4 py-2 font-medium text-lg ${activeTab === 'courses' ? 'text-teal-700 border-b-2 border-teal-700' : 'text-gray-500'}`}
        >
          Gerenciar Cursos
        </button>
      </div>

      {activeTab === 'users' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Solicitações de Acesso</h2>
          {pendingUsers.length === 0 ? (
            <p className="text-center text-gray-500">Nenhuma solicitação pendente.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {pendingUsers.map((pendingUser) => (
                <li key={pendingUser._id} className="py-4 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{pendingUser.name}</p>
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

      {activeTab === 'messages' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Mensagens de Contato</h2>
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">Nenhuma mensagem encontrada.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {messages.map((msg) => (
                <li key={msg._id} className="py-4">
                  <p className="text-lg font-semibold text-gray-900">{msg.name} - {msg.email}</p>
                  <p className="mt-1 text-gray-600">{msg.message}</p>
                  <p className={`mt-2 text-sm font-medium ${msg.isResponded ? 'text-green-600' : 'text-red-600'}`}>
                    Status: {msg.isResponded ? 'Respondida' : 'Pendente'}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === 'courses' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Gerenciamento de Cursos</h2>
          
          <form onSubmit={handleCourseSubmit} className="mb-8 space-y-4">
            <h3 className="text-xl font-medium mb-2">{isEditing ? 'Editar Curso' : 'Adicionar Novo Curso'}</h3>
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
              {isEditing ? 'Salvar Edição' : 'Adicionar Novo Curso'}
            </button>
          </form>

          {courses.length === 0 ? (
            <p className="text-center text-gray-500">Nenhum curso cadastrado.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {courses.map((course) => (
                <li key={course._id} className="py-4 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{course.title}</p>
                    <p className="text-sm text-gray-500">{course.language} - {course.availableSlots} vagas</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleCourseEdit(course)}
                      className="px-4 py-2 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleCourseDelete(course._id)}
                      className="px-4 py-2 font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                    >
                      Deletar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;