import { Link as RouterLink } from 'react-router-dom';
import image from '../assets/img-1.png';

function Dashboard() {
  return (
    <div className="bg-white min-h-screen">
      {/* Seção de Texto de Boas-Vindas */}
      <section className="container mx-auto px-4 py-12 md:py-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-9 text-darkslateblue">
          Bem-vindo(a), Aluno(a)!
        </h1>
        <p className="text-lg md:text-xl font-medium text-gray-600">
          Sua jornada para o aprendizado em tecnologia começa aqui.
        </p>
      </section>

      {/* Seção da Imagem Centralizada */}
      <section className="container mx-auto px-4 my-8 md:my-10 flex justify-center">
        <div className="w-full max-w-xl rounded-lg overflow-hidden shadow-lg">
          <img src={image} alt="Banner do site" className="w-full h-auto object-cover" />
        </div>
      </section>

      {/* Seção de Cards de Acesso */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card de Materiais de Estudo */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-teal-700">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              Material de Estudo
            </h2>
            <p className="text-gray-600 mb-4">
              Acesse o conteúdo completo e videoaulas sobre lógica e desenvolvimento.
            </p>
            <RouterLink
              to="/courses"
              className="inline-block px-4 py-2 font-medium text-white bg-teal-700 rounded-md hover:bg-teal-600 transition-colors"
            >
              Explorar Cursos
            </RouterLink>
          </div>

          {/* Card de Bloco de Anotações */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-teal-700">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              Bloco de Anotações
            </h2>
            <p className="text-gray-600 mb-4">
              Um espaço interativo para organizar suas ideias e códigos.
            </p>
            <RouterLink
              to="/notes"
              className="inline-block px-4 py-2 font-medium text-white bg-teal-700 rounded-md hover:bg-teal-600 transition-colors"
            >
              Ir para Anotações
            </RouterLink>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;