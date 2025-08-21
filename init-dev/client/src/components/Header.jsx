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
    <header className="bg-gray-100 border-b border-gray-300 py-0">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="h-40">
          <RouterLink to="/">
            <img src={logo} alt="Init.dev Logo" className="h-full" />
          </RouterLink>
        </div>
        <nav>
          {user ? (
            <div className="flex items-center space-x-4">
              <RouterLink
                to="/courses"
                className="text-gray-700 hover:text-teal-700 transition duration-150 ease-in-out"
              >
                Cursos
              </RouterLink>
              <RouterLink
                to="/notes"
                className="text-gray-700 hover:text-teal-700 transition duration-150 ease-in-out"
              >
                Anotações
              </RouterLink>
              <button
                onClick={handleLogout}
                className="px-3 py-2 font-medium text-white bg-teal-700 rounded-md hover:bg-teal-600 transition duration-150 ease-in-out"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <RouterLink
                to="/login"
                className="px-3 py-2 font-medium text-gray-700 rounded-md border border-gray-300 hover:bg-gray-200 transition duration-150 ease-in-out"
              >
                Login
              </RouterLink>
              <RouterLink
                to="/access"
                className="px-3 py-2 font-medium text-white bg-teal-700 rounded-md hover:bg-teal-600 transition duration-150 ease-in-out"
              >
                Inscrição
              </RouterLink>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
