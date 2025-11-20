import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Mail } from 'lucide-react';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); 
  const [error, setError] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      // --- CONEXÃO REAL COM O BACKEND (GMAIL) ---
      // Certifique-se que a rota no backend é '/api/users/forgotpassword'
      await axios.post('/api/users/forgotpassword', { email });
      
      setMessage(`Se um conta existir para ${email}, um link de redefinição foi enviado.`);
      setEmail(''); 
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Ocorreu um erro. Verifique o email e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-teal-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Redefinir Senha
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Digite seu email e enviaremos um link para você criar uma nova senha.
          </p>
        </div>

        {message && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <p className="text-sm text-green-700">{message}</p>
            </div>
        )}

        {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-sm text-red-700">{error}</p>
            </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                placeholder="Digite seu email cadastrado"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isLoading ? 'bg-teal-400' : 'bg-teal-600 hover:bg-teal-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors`}
            >
              {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
            <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500 flex items-center justify-center gap-2">
                <ArrowLeft size={16} /> Voltar para o Login
            </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;