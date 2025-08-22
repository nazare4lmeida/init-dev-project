import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import logoFooter from "../assets/img-logo.png";

function Footer() {
  return (
    <footer className="bg-teal-900 text-gray-300 py-4">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start">
        
        {/* Seções de Texto */}
        <div className="flex flex-col md:flex-row gap-32">
          {/* Seção 1: Marca e Redes Sociais */}
          <div>
            <h3 className="text-2xl font-bold mb-2 text-white">Init.dev</h3>
            <p className="text-gray-300 mb-4">
              Sua plataforma para o futuro da tecnologia.
            </p>
            <div className="flex space-x-3 text-gray-300">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>

          {/* Seção 2: Navegação */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <RouterLink
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/courses"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Cursos
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/notes"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Anotações
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Login / Solicitar Acesso
                </RouterLink>
              </li>
            </ul>
          </div>

          {/* Seção 3: Sobre */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-white">Sobre</h3>
            <ul className="space-y-2">
              <li>
                <RouterLink
                  to="/about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  O Init.dev
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  to="/contact"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Fale Conosco
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center md:justify-start mt-4 md:-mt-12">
          <img
            src={logoFooter}
            alt="Init.dev Logo"
            className="h-56 object-contain"
          />
        </div>
      </div>

      {/* Barra de Direitos Autorais */}
      <div className="mt-6 pt-4 border-t border-gray-400 text-center text-sm text-gray-400">
        <p>&copy; 2025 Init.dev. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
