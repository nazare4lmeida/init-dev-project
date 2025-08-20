import { Link as RouterLink } from 'react-router-dom';
import React from 'react';
import courseImage from '../assets/img-curso.png';

function CoursePage() {
  const courses = [
    { id: 1, title: 'Lógica de Programação', description: 'Fundamentos essenciais para começar a programar.' },
    { id: 2, title: 'HTML e CSS para Iniciantes', description: 'Crie a estrutura e o visual de suas primeiras páginas web.' },
    { id: 3, title: 'JavaScript Moderno', description: 'Aprenda a interatividade no front-end com JavaScript.' },
    { id: 4, title: 'Introdução ao React', description: 'Comece a construir interfaces dinâmicas com a biblioteca React.' },
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-4">

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-darkslateblue">
            Cursos e Materiais
          </h1>
          <p className="text-lg md:text-xl font-medium text-gray-600">
            Explore nosso conteúdo completo em diversas áreas da tecnologia.
          </p>
        </div>

        {/* Lista de Cursos em Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between border-t-4 border-teal-700">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                  {course.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {course.description}
                </p>
              </div>
              <RouterLink
                to={`/courses/${course.id}`}
                className="inline-block px-4 py-2 mt-4 font-medium text-white bg-teal-700 rounded-md hover:bg-teal-600 transition-colors text-center"
              >
                Acessar Curso
              </RouterLink>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CoursePage;