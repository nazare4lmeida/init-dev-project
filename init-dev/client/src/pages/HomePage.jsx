import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import image from '../assets/img-1.png';
import AuthContext from '../context/AuthContext'; // 1. Importe o contexto

function HomePage() {
  // 2. Pegamos o usuário para saber qual botão mostrar
  const { user } = useContext(AuthContext);

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
            Você terá direito a um certificado de conclusão, caso complete todos os requisitos do curso.
          </p>
        </div>
        
        {/* 3. BOTÕES DINÂMICOS DO HERO */}
        <div className="mt-8 flex gap-4 justify-center">
          {user ? (
             <RouterLink
               to="/dashboard"
               className="px-8 py-3 text-lg font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
             >
               Ir para meu Dashboard
             </RouterLink>
          ) : (
             <>
                <RouterLink
                  to="/access"
                  className="px-8 py-3 text-lg font-medium text-white bg-teal-700 rounded-md hover:bg-teal-600 transition-colors"
                >
                  Solicitar Acesso
                </RouterLink>
                <RouterLink
                  to="/login"
                  className="px-8 py-3 text-lg font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-md hover:bg-teal-100 transition-colors"
                >
                  Já tenho conta
                </RouterLink>
             </>
          )}
        </div>
      </section>

      {/* Seção de Ementa dos Cursos */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-darkslateblue">
            Cursos Disponíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course._id} className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between border-t-4 border-teal-700 hover:shadow-xl transition-shadow">
                <div>
                  <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">{course.language}</span>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm">
                    {course.description}
                  </p>
                  <div className="mb-4 text-xs font-medium text-gray-500">
                    <span className="font-semibold text-gray-700">Tópicos:</span> {course.topics.join(', ')}
                  </div>
                </div>

                {/* 4. BOTÃO DE AÇÃO NO CARD */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    {user ? (
                        // Se logado, vai para a página interna de cursos (ou direto pra aula se quiser ajustar o link)
                        <RouterLink 
                            to="/courses" 
                            className="block w-full text-center bg-indigo-50 text-indigo-700 py-2 rounded-md font-bold hover:bg-indigo-100 transition-colors"
                        >
                            Acessar Conteúdo
                        </RouterLink>
                    ) : (
                        // Se deslogado, manda para login
                        <RouterLink 
                            to="/login" 
                            className="block w-full text-center bg-gray-50 text-gray-600 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors border border-gray-200"
                        >
                            Faça login para acessar
                        </RouterLink>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Funcionalidades (Mantive igual) */}
      <section className="py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-teal-700">
            <h2 className="text-3xl font-bold mb-4 text-darkslateblue">
              Quizzes e Projetos Práticos
            </h2>
            <p className="text-gray-600">
              Teste seus conhecimentos com quizzes interativos e desenvolva pequenos projetos de código para fixar o aprendizado.
            </p>
          </div>
          
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