import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { RefreshCw } from 'lucide-react'; // Opcional: ícone de loading

function PrivateRoute() {
  // 1. Extraímos 'loading' além do 'user'
  const { user, loading } = useContext(AuthContext);

  // 2. Se o Firebase ainda está verificando o token, mostramos um Loading Spinner
  // em vez de redirecionar imediatamente.
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-indigo-600 gap-4">
         <RefreshCw className="animate-spin" size={32} />
         <span className="font-medium">Verificando acesso...</span>
      </div>
    );
  }

  // 3. Só depois do loading ser false, decidimos:
  return user ? <Outlet /> : <Navigate to='/login' />;
}

export default PrivateRoute;