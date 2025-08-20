import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className='header'>
      <div className='logo'>
        <Link to='/'>Init.dev</Link>
      </div>
      <ul>
        {user ? (
          <>
            <li>
              <Link to='/courses'>Cursos</Link>
            </li>
            <li>
              <Link to='/notes'>Anotações</Link>
            </li>
            <li>
              <button className='btn' onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to='/login'>Login</Link>
            </li>
            <li>
              <Link to='/register'>Registro</Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;