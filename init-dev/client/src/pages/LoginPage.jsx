import React, { useState, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(formData);
      navigate('/');
    } catch (error) {
      // Você pode adicionar uma mensagem de erro mais amigável aqui
      console.error('Login failed', error.response.data.message);
      alert('Credenciais inválidas. Por favor, tente novamente.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto my-10">
      <h2 className="text-3xl font-extrabold text-teal-700 text-center">
        Login
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        Acesse sua conta
      </p>
      <form className="mt-8 space-y-6" onSubmit={onSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              placeholder="Email"
              value={email}
              onChange={onChange}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              placeholder="Senha"
              value={password}
              onChange={onChange}
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-teal-700 hover:bg-teal-800"
          >
            Entrar
          </button>
        </div>
      </form>
      <p className="mt-4 text-sm text-center text-gray-600">
        Ainda não tem uma conta?{' '}
        <RouterLink to="/enroll" className="font-medium text-teal-700 hover:text-teal-500">
          Inscreva-se
        </RouterLink>
      </p>
    </div>
  );
}

export default LoginPage;