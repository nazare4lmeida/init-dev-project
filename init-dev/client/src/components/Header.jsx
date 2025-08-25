import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import logo from "../assets/img-logo2.png";

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-gray-100 border-b border-gray-300 py-4">
      {/* MOBILE: empilha e centraliza (logo em cima, botões abaixo) | DESKTOP: lado a lado */}
      <div className="container mx-auto px-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        
        {/* Logo */}
        <div className="flex justify-center md:justify-start">
          <RouterLink to="/">
            <img src={logo} alt="Init.dev Logo" className="max-h-24 md:max-h-32 w-auto object-contain" />
          </RouterLink>
        </div>

        {/* Nav */}
        <nav>
          {user ? (
            <div className="flex flex-wrap justify-center md:justify-end items-center gap-2 md:gap-4">
              {user.role === "admin" && (
                <RouterLink
                  to="/admin"
                  className="px-2 py-1 font-medium text-white bg-teal-700 rounded-md text-sm hover:bg-teal-600 transition duration-150 ease-in-out"
                >
                  Admin
                </RouterLink>
              )}
              <RouterLink
                to="/courses"
                className="px-2 py-1 font-medium text-white bg-teal-700 rounded-md text-sm hover:bg-teal-600 transition duration-150 ease-in-out"
              >
                Cursos
              </RouterLink>
              <RouterLink
                to="/notes"
                className="px-2 py-1 font-medium text-white bg-teal-700 rounded-md text-sm hover:bg-teal-600 transition duration-150 ease-in-out"
              >
                Anotações
              </RouterLink>
              <button
                onClick={handleLogout}
                className="px-2 py-1 font-medium text-white bg-teal-700 rounded-md text-sm hover:bg-teal-600 transition duration-150 ease-in-out"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center md:justify-end items-center gap-2 md:gap-4">
              <RouterLink
                to="/login"
                className="px-2 py-1 font-medium text-gray-700 rounded-md border border-gray-300 text-sm hover:bg-gray-200 transition duration-150 ease-in-out"
              >
                Login
              </RouterLink>
              <RouterLink
                to="/access"
                className="px-2 py-1 font-medium text-white bg-teal-700 rounded-md text-sm hover:bg-teal-600 transition duration-150 ease-in-out"
              >
                Solicitar Acesso
              </RouterLink>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
