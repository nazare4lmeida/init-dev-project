import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import image from '../assets/img-1.png';

function HomePage() {
  const courses = [
    {
      _id: '1',
      title: 'Lógica de Programação',
      description: 'Fundamentos essenciais que se aplicam a todas as linguagens de programação.',
      language: 'Geral',
      topics: ['Algoritmos', 'Variáveis e tipos de dados', 'Estruturas de controle', 'Estruturas de repetição'],
    },
    {
      _id: '2',
      title: 'HTML e CSS para Iniciantes',
      description: 'Crie a estrutura e o visual de suas primeiras páginas web, essenciais para o front-end.',
      language: 'Geral',
      topics: ['Estrutura HTML', 'Tags semânticas', 'Seletores CSS', 'Flexbox e Grid'],
    },
    {
      _id: '3',
      title: 'JavaScript Essencial',
      description: 'Aprenda a interatividade no front-end com a linguagem de programação mais popular do mundo.',
      language: 'JavaScript',
      topics: ['Variáveis e funções', 'ES6+', 'Manipulação do DOM', 'Eventos e assincronismo'],
    },
    {
      _id: '4',
      title: 'React Básico',
      description: 'Comece a construir interfaces dinâmicas com a biblioteca React.',
      language: 'JavaScript',
      topics: ['Componentes', 'JSX', 'State e Props', 'Hooks'],
    },
    {
      _id: '5',
      title: 'Introdução ao Python',
      description: 'Aprenda a linguagem mais versátil do mercado, ideal para análise de dados e back-end.',
      language: 'Python',
      topics: ['Sintaxe básica', 'Estruturas de dados', 'Bibliotecas essenciais', 'Web scraping'],
    },
    {
      _id: '6',
      title: 'Fundamentos de Java',
      description: 'Domine a linguagem de programação robusta e amplamente utilizada em aplicações corporativas.',
      language: 'Java',
      topics: ['Orientação a Objetos', 'Sintaxe básica', 'Máquina virtual Java', 'Threads'],
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Seção de Destaque com Imagem */}
      <section className="container mx-auto px-4 my-8 md:my-10 flex justify-center">
        <div className="w-full max-w-xl rounded-lg overflow-hidden shadow-lg">
          <img src={image} alt="Banner do site" className="w-full h-auto object-cover" />
        </div>
      </section>

      {/* Seção de Apresentação */}
      <section className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-darkslateblue">
          Explore o Futuro da Tecnologia
        </h1>
        <div className="max-w-2xl mx-auto">
          <p className="text-lg md:text-xl font-medium text-gray-600">
            A Init.dev oferece o material completo para seus estudos em tecnologia, com cursos, quizzes e um bloco de anotações interativo.
          </p>
          <p className="mt-4 text-gray-600">
            Você terá direito a um certificado de conclusão, caso complete todos os requisitos do curso. Solicite acesso e comece sua jornada de aprendizado hoje mesmo!
          </p>
        </div>
        <RouterLink
          to="/access"
          className="inline-block px-8 py-3 mt-8 text-lg font-medium text-white bg-teal-700 rounded-md hover:bg-teal-600 transition-colors"
        >
          Solicitar Acesso
        </RouterLink>
      </section>

      {/* Seção de Ementa dos Cursos */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-darkslateblue">
            Ementa dos Cursos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course._id} className="bg-white rounded-lg shadow-lg p-6 flex flex-col border-t-4 border-teal-700">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    {course.title}
                  </h3>
                  <p className="text-gray-600">
                    {course.description}
                  </p>
                </div>
                <div className="mt-4 text-sm font-medium text-gray-500">
                  <span className="font-semibold text-gray-700">Tópicos:</span> {course.topics.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Funcionalidades */}
      <section className="py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Bloco de Quizzes */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-teal-700">
            <h2 className="text-3xl font-bold mb-4 text-darkslateblue">
              Quizzes e Projetos Práticos
            </h2>
            <p className="text-gray-600">
              Teste seus conhecimentos com quizzes interativos e desenvolva pequenos projetos de código para fixar o aprendizado. Você pode praticar o código dentro da própria plataforma.
            </p>
          </div>
          
          {/* Bloco de Anotações */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-teal-700">
            <h2 className="text-3xl font-bold mb-4 text-darkslateblue">
              Bloco de Anotações Inteligente
            </h2>
            <p className="text-gray-600">
              Anote suas ideias e receba dicas de otimização de código com o auxílio da nossa inteligência artificial.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;