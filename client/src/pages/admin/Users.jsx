import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { obtenerUsuarios, crearUsuario, actualizarUsuario, alternarUsuario } from '../../api/users.js';

const ETIQUETAS_ROL = { USER: 'Usuario', AGENT: 'Agente', ADMIN: 'Administrador' };
const FORM_VACIO = { name: '', email: '', password: '', role: 'USER' };

export default function Users() {
  const { user } = useAuth();
  const [datos, setDatos] = useState({ items: [], total: 0 });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const [form, setForm] = useState(FORM_VACIO);
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formEdicion, setFormEdicion] = useState({ name: '', email: '', role: 'USER' });

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const data = await obtenerUsuarios({ pageSize: 100 });
      setDatos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  function aviso(msg) {
    setExito(msg);
    setTimeout(() => setExito(''), 3000);
  }

  async function handleCrear(e) {
    e.preventDefault();
    setError('');
    try {
      await crearUsuario(form);
      setForm(FORM_VACIO);
      setMostrarCrear(false);
      aviso('Usuario creado');
      await cargar();
    } catch (err) {
      const detalle = err.details?.email?.[0] || err.details?.password?.[0] || err.message;
      setError(detalle);
    }
  }

  function iniciarEdicion(u) {
    setEditando(u.id);
    setFormEdicion({ name: u.name, email: u.email, role: u.role });
  }

  async function guardarEdicion(e) {
    e.preventDefault();
    setError('');
    try {
      await actualizarUsuario(editando, formEdicion);
      setEditando(null);
      aviso('Usuario actualizado');
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(u) {
    setError('');
    try {
      await alternarUsuario(u.id);
      aviso(u.active ? 'Usuario desactivado' : 'Usuario activado');
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="fila-encabezado">
        <h1>Usuarios</h1>
        <button type="button" className="btn btn-primario" onClick={() => setMostrarCrear((v) => !v)}>
          {mostrarCrear ? 'Cerrar' : '+ Nuevo usuario'}
        </button>
      </div>

      {exito && <p className="exito">{exito}</p>}
      {error && <p className="error">{error}</p>}

      {mostrarCrear && (
        <form className="panel-formulario" onSubmit={handleCrear}>
          <h2>Nuevo usuario</h2>
          <div className="form-grid">
            <label>
              Nombre
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                minLength={2}
              />
            </label>
            <label>
              Correo
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </label>
            <label>
              Contraseña
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={8}
              />
            </label>
            <label>
              Rol
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="USER">Usuario</option>
                <option value="AGENT">Agente</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </label>
          </div>
          <div className="fila-botones">
            <button type="submit" className="btn btn-primario">
              Crear usuario
            </button>
          </div>
        </form>
      )}

      {editando && (
        <form className="panel-formulario" onSubmit={guardarEdicion}>
          <h2>Editar usuario</h2>
          <div className="form-grid">
            <label>
              Nombre
              <input
                type="text"
                value={formEdicion.name}
                onChange={(e) => setFormEdicion({ ...formEdicion, name: e.target.value })}
                required
                minLength={2}
              />
            </label>
            <label>
              Correo
              <input
                type="email"
                value={formEdicion.email}
                onChange={(e) => setFormEdicion({ ...formEdicion, email: e.target.value })}
                required
              />
            </label>
            <label>
              Rol
              <select
                value={formEdicion.role}
                onChange={(e) => setFormEdicion({ ...formEdicion, role: e.target.value })}
              >
                <option value="USER">Usuario</option>
                <option value="AGENT">Agente</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </label>
          </div>
          <div className="fila-botones">
            <button type="submit" className="btn btn-primario">
              Guardar cambios
            </button>
            <button type="button" className="btn btn-secundario" onClick={() => setEditando(null)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {cargando ? (
        <p className="texto-centro">Cargando usuarios…</p>
      ) : (
        <div className="tabla-contenedor">
          <table className="tabla-tickets">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datos.items.map((u) => (
                <tr key={u.id}>
                  <td>
                    {u.name}
                    {u.id === user.id && <span className="texto-secundario"> (tú)</span>}
                  </td>
                  <td>{u.email}</td>
                  <td>{ETIQUETAS_ROL[u.role]}</td>
                  <td>
                    <span className={`badge ${u.active ? 'badge-verde' : 'badge-gris'}`}>
                      {u.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <button type="button" className="btn btn-secundario btn-pequeno" onClick={() => iniciarEdicion(u)}>
                      Editar
                    </button>{' '}
                    <button
                      type="button"
                      className={`btn btn-pequeno ${u.active ? 'btn-peligro' : 'btn-primario'}`}
                      onClick={() => handleToggle(u)}
                      disabled={u.id === user.id}
                      title={u.id === user.id ? 'No puedes desactivar tu propia cuenta' : undefined}
                    >
                      {u.active ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
