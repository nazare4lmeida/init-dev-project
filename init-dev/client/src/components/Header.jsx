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

  // Estilo comum para os botões de navegação (DRY)
  const navLinkClass = "px-3 py-1.5 font-medium text-white bg-teal-700 rounded-md text-sm hover:bg-teal-600 transition duration-150 ease-in-out shadow-sm";

  return (
    <header className="bg-gray-100 border-b border-gray-300 py-4 shadow-sm">
      <div className="container mx-auto px-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        
        {/* Logo */}
        <div className="flex justify-center md:justify-start">
          <RouterLink to={user ? "/dashboard" : "/"}>
            <img
              src={logo}
              alt="Init.dev Logo"
              className="max-h-16 md:max-h-20 w-auto object-contain hover:opacity-90 transition-opacity"
            />
          </RouterLink>
        </div>

        {/* Navegação */}
        <nav>
          {user ? (
            <div className="flex flex-wrap justify-center md:justify-end items-center gap-3">
              
              {user.role === "admin" && (
                <RouterLink to="/admin" className={navLinkClass}>
                  Admin
                </RouterLink>
              )}
              
              <RouterLink to="/courses" className={navLinkClass}>
                Cursos
              </RouterLink>
              
              <RouterLink to="/lessons" className={navLinkClass}>
                Lições
              </RouterLink>
              
              <RouterLink to="/notes" className={navLinkClass}>
                Anotações
              </RouterLink>
              
              {/* Separador Visual (Opcional) */}
              <div className="h-6 w-px bg-gray-300 mx-1 hidden md:block"></div>

              <button
                onClick={handleLogout}
                className="px-3 py-1.5 font-medium text-teal-700 bg-transparent border border-teal-700 rounded-md text-sm hover:bg-teal-50 transition duration-150 ease-in-out"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center md:justify-end items-center gap-3">
              <RouterLink
                to="/login"
                className="px-3 py-1.5 font-medium text-gray-700 rounded-md border border-gray-300 text-sm hover:bg-gray-200 transition duration-150 ease-in-out"
              >
                Login
              </RouterLink>
              <RouterLink
                to="/access"
                className={navLinkClass}
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