import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      const detalle = err.details?.password?.[0] || err.details?.email?.[0] || err.details?.name?.[0];
      setError(detalle || err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="tarjeta-formulario">
      <h1>Crear cuenta</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Nombre
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
        </label>
        <label>
          Correo
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
          <small>Mínimo 8 caracteres.</small>
        </label>
        <button type="submit" className="btn btn-primario" disabled={enviando}>
          {enviando ? 'Creando…' : 'Registrarme'}
        </button>
      </form>
      <p className="texto-centro">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}
