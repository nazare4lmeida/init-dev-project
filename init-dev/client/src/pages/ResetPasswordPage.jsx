import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Pega o token da URL (ex: /resetpassword/a1b2c3d4...)
  const { resetToken } = useParams(); 
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Chama a rota PUT que criamos no backend
      const res = await axios.put(`/api/users/resetpassword/${resetToken}`, { password });

      setMessage('Senha alterada com sucesso! Redirecionando para o login...');
      
      // Espera 3 segundos para o usuário ler e manda pro login
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao redefinir senha. O link pode ter expirado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Nova Senha
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Crie uma nova senha segura para sua conta.
          </p>
        </div>

        {message && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 flex items-center gap-2">
                <CheckCircle className="text-green-600" size={20}/>
                <p className="text-sm text-green-700 font-medium">{message}</p>
            </div>
        )}

        {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <p className="text-sm text-red-700">{error}</p>
            </div>
        )}

        {!message && (
            <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            <div className="space-y-4">
                {/* Nova Senha */}
                <div className="relative">
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nova Senha</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="******"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                </div>

                {/* Confirmar Senha */}
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Confirmar Senha</label>
                    <input
                        type="password"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="******"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        minLength={6}
                    />
                </div>
            </div>

            <div>
                <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} transition-colors shadow-md`}
                >
                {isLoading ? 'Salvando...' : 'Redefinir Minha Senha'}
                </button>
            </div>
            </form>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;