import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Code, Layout, FileJson, Coffee, Database } from 'lucide-react';

const LessonsPage = () => {
  // Mock de dados para organizar a visualização
  const categories = [
    {
      id: 'react',
      title: 'React & Frontend Moderno',
      icon: <Code size={24} className="text-blue-500" />,
      lessons: [
        { id: 'react-101', title: 'Fundamentos e Variáveis', duration: '15 min' },
        { id: 'react-102', title: 'Componentes Funcionais', duration: '20 min' },
        { id: 'react-hooks', title: 'Introdução aos Hooks', duration: '25 min' },
      ]
    },
    {
      id: 'html-css',
      title: 'HTML5 & CSS3',
      icon: <Layout size={24} className="text-orange-500" />,
      lessons: [
        { id: 'html-struct', title: 'Estrutura Semântica', duration: '10 min' },
        { id: 'css-flexbox', title: 'Dominando Flexbox', duration: '30 min' },
      ]
    },
    {
      id: 'js',
      title: 'JavaScript Essencial',
      icon: <FileJson size={24} className="text-yellow-500" />,
      lessons: [
        { id: 'js-arrays', title: 'Manipulação de Arrays', duration: '20 min' },
        { id: 'js-async', title: 'Async/Await Descomplicado', duration: '15 min' },
      ]
    },
    {
        id: 'backend',
        title: 'Backend & API',
        icon: <Database size={24} className="text-green-600" />,
        lessons: [
          { id: 'node-intro', title: 'Node.js Básico', duration: '20 min' },
        ]
      }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-darkslateblue mb-4">Biblioteca de Aulas</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Escolha uma tecnologia e comece a praticar agora mesmo. Todo o conteúdo prático em um só lugar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-indigo-600">
              <div className="p-6 border-b border-gray-100 bg-indigo-50 flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                    {category.icon}
                </div>
                <h2 className="text-xl font-bold text-slate-800">{category.title}</h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                {category.lessons.map((lesson) => (
                  <Link 
                    key={lesson.id}
                    to={`/lesson/${lesson.id}`} // Link direto para a aula
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <BookOpen size={14} />
                        </div>
                        <span className="text-gray-700 font-medium group-hover:text-indigo-700 transition-colors">
                            {lesson.title}
                        </span>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                        {lesson.duration}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonsPage;