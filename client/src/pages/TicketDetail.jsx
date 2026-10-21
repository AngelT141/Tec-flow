import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  obtenerTicket,
  obtenerHistorial,
  comentar,
  asignar,
  resolver,
  cerrar,
  reabrir,
  cancelar,
} from '../api/tickets.js';
import { StatusBadge, PriorityBadge, TypeBadge, ETIQUETAS_ESTADO } from '../components/tickets/Badges.jsx';

const ACCIONES_HISTORIAL = {
  ticket_created: 'Ticket creado',
  assigned: 'Asignación',
  status_changed: 'Cambio de estado',
  comment_added: 'Comentario agregado',
  auto_closed: 'Cierre automático por inactividad',
};

export default function TicketDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const esAgenteOAdmin = user.role === 'AGENT' || user.role === 'ADMIN';

  const [ticket, setTicket] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [nuevoComentario, setNuevoComentario] = useState('');
  const [notaResolucion, setNotaResolucion] = useState('');
  const [mostrarFormResolver, setMostrarFormResolver] = useState(false);

  const cargarTodo = useCallback(async () => {
    setError('');
    try {
      const [t, h] = await Promise.all([obtenerTicket(id), obtenerHistorial(id)]);
      setTicket(t);
      setHistorial(h);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  async function ejecutar(accion) {
    setMensaje('');
    setError('');
    try {
      await accion();
      await cargarTodo();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  if (cargando) return <p className="texto-centro">Cargando ticket…</p>;
  if (!ticket) return <p className="error">{error || 'Ticket no encontrado'}</p>;

  const esCreador = ticket.creatorId === user.id;
  const puedeComentar = ticket.status !== 'CLOSED' && ticket.status !== 'CANCELLED';
  const puedeCancelar = esCreador && ticket.status === 'OPEN' && !ticket.assigneeId;
  const puedeCerrar = (esCreador || user.role === 'ADMIN') && ticket.status === 'RESOLVED';
  const puedeReabrir = (esCreador || user.role === 'ADMIN') && ticket.status === 'RESOLVED';
  const puedeAsignar = esAgenteOAdmin && ['OPEN', 'IN_PROGRESS'].includes(ticket.status);
  const puedeResolver = esAgenteOAdmin && ticket.status === 'IN_PROGRESS';

  return (
    <div>
      <p>
        <Link to="/">← Volver a la lista</Link>
      </p>

      <div className="fila-encabezado">
        <h1>
          {ticket.code} · {ticket.title}
        </h1>
        <StatusBadge status={ticket.status} />
      </div>

      {mensaje && <p className="exito">{mensaje}</p>}
      {error && <p className="error">{error}</p>}

      <div className="detalle-info">
        <div>
          <strong>Tipo:</strong> <TypeBadge type={ticket.type} />
        </div>
        <div>
          <strong>Prioridad:</strong> <PriorityBadge priority={ticket.priority} />
        </div>
        <div>
          <strong>Categoría:</strong> {ticket.category?.name || '—'}
        </div>
        <div>
          <strong>Creado por:</strong> {ticket.creator?.name}
        </div>
        <div>
          <strong>Asignado a:</strong> {ticket.assignee?.name || 'Sin asignar'}
        </div>
        <div>
          <strong>Creado:</strong> {new Date(ticket.createdAt).toLocaleString('es-MX')}
        </div>
        {ticket.closedAt && (
          <div>
            <strong>Cerrado:</strong> {new Date(ticket.closedAt).toLocaleString('es-MX')}
          </div>
        )}
      </div>

      <section className="seccion-detalle">
        <h2>Descripción</h2>
        <p className="descripcion-ticket">{ticket.description}</p>
      </section>

      {ticket.resolutionNote && (
        <section className="seccion-detalle">
          <h2>Nota de resolución</h2>
          <p className="descripcion-ticket">{ticket.resolutionNote}</p>
        </section>
      )}

      <section className="seccion-detalle">
        <h2>Acciones</h2>
        <div className="fila-botones">
          {puedeAsignar && (
            <button
              type="button"
              className="btn btn-primario"
              onClick={() => ejecutar(() => asignar(ticket.id))}
            >
              Asignarme
            </button>
          )}
          {puedeResolver && (
            <button
              type="button"
              className="btn btn-primario"
              onClick={() => setMostrarFormResolver((v) => !v)}
            >
              Marcar resuelto
            </button>
          )}
          {puedeCerrar && (
            <button
              type="button"
              className="btn btn-primario"
              onClick={() => window.confirm('¿Cerrar este ticket como resuelto?') && ejecutar(() => cerrar(ticket.id))}
            >
              Cerrar ticket
            </button>
          )}
          {puedeReabrir && (
            <button
              type="button"
              className="btn btn-secundario"
              onClick={() => window.confirm('¿Reabrir este ticket?') && ejecutar(() => reabrir(ticket.id))}
            >
              Reabrir
            </button>
          )}
          {puedeCancelar && (
            <button
              type="button"
              className="btn btn-peligro"
              onClick={() => window.confirm('¿Cancelar este ticket? Esta acción no se puede deshacer.') && ejecutar(() => cancelar(ticket.id))}
            >
              Cancelar ticket
            </button>
          )}
          {!puedeAsignar && !puedeResolver && !puedeCerrar && !puedeReabrir && !puedeCancelar && (
            <p className="texto-secundario">Sin acciones disponibles en el estado actual.</p>
          )}
        </div>

        {mostrarFormResolver && (
          <form
            className="form-resolver"
            onSubmit={async (e) => {
              e.preventDefault();
              const ok = await ejecutar(() => resolver(ticket.id, notaResolucion.trim()));
              if (ok) setMostrarFormResolver(false);
            }}
          >
            <label>
              Nota de resolución
              <textarea
                value={notaResolucion}
                onChange={(e) => setNotaResolucion(e.target.value)}
                required
                minLength={5}
                rows={3}
                placeholder="Describe cómo se resolvió el ticket"
              />
            </label>
            <button type="submit" className="btn btn-primario" disabled={notaResolucion.trim().length < 5}>
              Confirmar resolución
            </button>
          </form>
        )}
      </section>

      <section className="seccion-detalle">
        <h2>Comentarios ({ticket.comments.length})</h2>
        {ticket.comments.length === 0 && <p className="texto-secundario">Aún no hay comentarios.</p>}
        <ul className="lista-comentarios">
          {ticket.comments.map((c) => (
            <li key={c.id} className="comentario">
              <div className="comentario-cabecera">
                <strong>{c.author?.name}</strong>
                <span>{new Date(c.createdAt).toLocaleString('es-MX')}</span>
              </div>
              <p>{c.content}</p>
            </li>
          ))}
        </ul>

        {puedeComentar && (
          <form
            className="form-comentario"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!nuevoComentario.trim()) return;
              setMensaje('');
              setError('');
              try {
                await comentar(ticket.id, nuevoComentario.trim());
                setNuevoComentario('');
                await cargarTodo();
              } catch (err) {
                setError(err.message);
              }
            }}
          >
            <textarea
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              rows={3}
              placeholder="Escribe un comentario…"
              maxLength={2000}
            />
            <button type="submit" className="btn btn-primario" disabled={!nuevoComentario.trim()}>
              Comentar
            </button>
          </form>
        )}
      </section>

      <section className="seccion-detalle">
        <h2>Historial</h2>
        <ul className="lista-historial">
          {historial.map((h) => (
            <li key={h.id}>
              <span className="historial-fecha">{new Date(h.createdAt).toLocaleString('es-MX')}</span>
              <strong>{h.actor?.name || 'Sistema'}</strong> — {ACCIONES_HISTORIAL[h.action] || h.action}
              {h.oldValue && h.newValue && (
                <span className="historial-detalle">
                  {' '}
                  ({h.oldValue} → {h.newValue})
                </span>
              )}
              {h.action === 'ticket_created' && h.newValue && (
                <span className="historial-detalle"> ({ETIQUETAS_ESTADO[h.newValue] || h.newValue})</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
