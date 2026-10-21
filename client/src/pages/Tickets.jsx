import { useAuth } from '../context/AuthContext.jsx';

export default function Tickets() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Mis tickets</h1>
      <p className="texto-secundario">
        Bienvenido, {user.name}. El módulo de tickets se implementará en esta fase.
      </p>
    </div>
  );
}
