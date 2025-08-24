// src/pages/CourseManagementPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

function CourseManagementPage() {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = useContext(AuthContext);

  const fetchCourses = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get('/api/courses/admin', config);
      setCourses(response.data);
    } catch (error) {
      setMessage('Erro ao carregar cursos.');
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchCourses();
    }
  }, [user]);

  // Funções de CRUD (serão implementadas nas próximas etapas)
  const handleCreate = () => { /* lógica de criação */ };
  const handleUpdate = () => { /* lógica de edição */ };
  const handleDelete = () => { /* lógica de exclusão */ };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-5xl mx-auto my-10">
      <h1 className="text-4xl font-extrabold text-teal-700 text-center mb-6">
        Gerenciamento de Cursos
      </h1>
      <p className="mt-2 text-center text-sm text-gray-600 mb-8">
        Adicione, edite e remova cursos da plataforma.
      </p>

      {message && <p className="text-center text-sm text-gray-600 mb-4">{message}</p>}

      <div className="flex justify-end mb-4">
        <button
          onClick={handleCreate}
          className="px-4 py-2 font-medium text-white bg-teal-700 rounded-md hover:bg-teal-600"
        >
          Adicionar Novo Curso
        </button>
      </div>

      {courses.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum curso cadastrado.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {courses.map((course) => (
            <li key={course._id} className="py-4 flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-900">{course.title}</p>
                <p className="text-sm text-gray-500">{course.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdate(course)}
                  className="px-4 py-2 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(course._id)}
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
  );
}

export default CourseManagementPage;