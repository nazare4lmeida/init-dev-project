import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import logoFooter from "../assets/img-logo-footer2.png";

function Footer() {
  return (
    <footer className="bg-teal-900 text-white py-6">
      {" "}
      {/* aumentei py pra dar mais "respiro" no topo */}
      {/* MOBILE: coluna e centralizado | DESKTOP (md+): mantém linhas/colunas originais */}
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row flex-wrap justify-between gap-6 md:gap-16 text-center md:text-left">
        {/* Seção 1: Marca e Redes Sociais */}
        <div className="flex flex-col gap-3 items-center md:items-start mt-2 md:mt-0">
          <h3 className="text-2xl font-bold text-white">Init.dev</h3>
          <p className="text-gray-300 max-w-xs text-sm">
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
          <ul className="space-y-2 text-sm">
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
                to="/lessons"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Biblioteca de Atividades
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
          <ul className="space-y-2 text-sm">
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

        {/* Logo */}
        <div className="flex items-center justify-center md:justify-end mt-2 md:mt-0">
          <img
            src={logoFooter}
            alt="Init.dev Logo"
            className="h-28 md:h-36 object-contain"
          />
        </div>
      </div>
      {/* Barra de Direitos Autorais */}
      <div className="mt-2 pt-1.5 border-t border-teal-800 text-center text-sm text-gray-400">
        <p>&copy; 2025 Init.dev. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
