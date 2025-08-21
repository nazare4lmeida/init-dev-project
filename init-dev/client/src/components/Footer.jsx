import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { FaGithub, FaLinkedin } from 'react-icons/fa'; // Importando ícones relevantes

function Footer() {
  return (
    <footer className="bg-darkslategray text-gray-600 py-4">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Seção 1: Marca e Redes Sociais */}
        <div>
          <h3 className="text-2xl font-bold mb-2">Init.dev</h3>
          <p className="text-gray-500 mb-4">Sua plataforma para o futuro da tecnologia.</p>
          <div className="flex space-x-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500 transition-colors">
              <FaGithub size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500 transition-colors">
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>

        {/* Seção 2: Navegação */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-600">Navegação</h3>
          <ul className="space-y-2">
            <li>
              <RouterLink to="/" className="hover:text-gray-500 transition-colors">Home</RouterLink>
            </li>
            <li>
              <RouterLink to="/courses" className="hover:text-gray-500 transition-colors">Cursos</RouterLink>
            </li>
            <li>
              <RouterLink to="/notes" className="hover:text-gray-500 transition-colors">Anotações</RouterLink>
            </li>
            <li>
              <RouterLink to="/login" className="hover:text-gray-500 transition-colors">Login / Solicitar Acesso</RouterLink>
            </li>
          </ul>
        </div>

        {/* Seção 3: Sobre */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-600">Sobre</h3>
          <ul className="space-y-2">
            <li>
              <RouterLink to="/about" className="hover:text-gray-500 transition-colors">O Init.dev</RouterLink>
            </li>
            <li>
              <RouterLink to="/contact" className="hover:text-gray-500 transition-colors">Fale Conosco</RouterLink>
            </li>
            {/* Você pode adicionar mais links aqui */}
          </ul>
        </div>
      </div>

      {/* Barra de Direitos Autorais */}
      <div className="mt-8 pt-4 border-t border-gray-700 text-center text-sm text-gray-500">
        <p>&copy; 2025 Init.dev. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;