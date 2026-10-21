import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const ETIQUETAS_ROL = { USER: 'Usuario', AGENT: 'Agente', ADMIN: 'Administrador' };

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar-marca">
        Tec-flow
      </Link>
      <nav className="navbar-nav">
        {user ? (
          <>
            <span className="navbar-usuario">
              {user.name} · {ETIQUETAS_ROL[user.role] || user.role}
            </span>
            <button type="button" className="btn btn-secundario" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secundario">
              Iniciar sesión
            </Link>
            <Link to="/register" className="btn btn-primario">
              Registrarse
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
