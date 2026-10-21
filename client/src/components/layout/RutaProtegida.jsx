import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function RutaProtegida({ children }) {
  const { user, cargando } = useAuth();

  if (cargando) {
    return <p className="texto-centro">Cargando…</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
