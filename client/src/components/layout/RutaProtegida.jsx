import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function RutaProtegida({ children, roles }) {
  const { user, cargando } = useAuth();

  if (cargando) {
    return <p className="texto-centro">Cargando…</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
