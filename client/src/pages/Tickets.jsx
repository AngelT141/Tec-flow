import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { obtenerTickets } from '../api/tickets.js';
import { StatusBadge, PriorityBadge, TypeBadge } from '../components/tickets/Badges.jsx';

const VACIOS = { status: '', type: '', priority: '', q: '' };

export default function Tickets() {
  const { user } = useAuth();
  const esAgenteOAdmin = user.role === 'AGENT' || user.role === 'ADMIN';

  const [filtros, setFiltros] = useState({ ...VACIOS });
  const [pagina, setPagina] = useState(1);
  const [datos, setDatos] = useState({ items: [], total: 0, page: 1, pageSize: 20 });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const data = await obtenerTickets({ ...filtros, page: pagina });
      setDatos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [filtros, pagina]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  function cambiarFiltro(campo, valor) {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
    setPagina(1);
  }

  const totalPaginas = Math.max(1, Math.ceil(datos.total / datos.pageSize));

  return (
    <div>
      <div className="fila-encabezado">
        <h1>{esAgenteOAdmin ? 'Bandeja de tickets' : 'Mis tickets'}</h1>
        <Link to="/tickets/new" className="btn btn-primario">
          + Nuevo ticket
        </Link>
      </div>

      <div className="filtros">
        <input
          type="search"
          placeholder="Buscar por asunto…"
          value={filtros.q}
          onChange={(e) => cambiarFiltro('q', e.target.value)}
        />
        <select value={filtros.status} onChange={(e) => cambiarFiltro('status', e.target.value)}>
          <option value="">Todos los estados</option>
          <option value="OPEN">Abierto</option>
          <option value="IN_PROGRESS">En proceso</option>
          <option value="RESOLVED">Resuelto</option>
          <option value="CLOSED">Cerrado</option>
          <option value="CANCELLED">Cancelado</option>
        </select>
        <select value={filtros.type} onChange={(e) => cambiarFiltro('type', e.target.value)}>
          <option value="">Todos los tipos</option>
          <option value="SUPPORT">Soporte</option>
          <option value="INCIDENT">Incidente</option>
          <option value="MAINTENANCE">Mantenimiento</option>
        </select>
        <select value={filtros.priority} onChange={(e) => cambiarFiltro('priority', e.target.value)}>
          <option value="">Todas las prioridades</option>
          <option value="LOW">Baja</option>
          <option value="MEDIUM">Media</option>
          <option value="HIGH">Alta</option>
          <option value="CRITICAL">Crítica</option>
        </select>
        <button
          type="button"
          className="btn btn-secundario"
          onClick={() => {
            setFiltros({ ...VACIOS });
            setPagina(1);
          }}
        >
          Limpiar
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {cargando ? (
        <p className="texto-centro">Cargando tickets…</p>
      ) : datos.items.length === 0 ? (
        <p className="texto-centro vacio">No hay tickets con estos filtros.</p>
      ) : (
        <div className="tabla-contenedor">
          <table className="tabla-tickets">
            <thead>
              <tr>
                <th>Código</th>
                <th>Asunto</th>
                <th>Tipo</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Asignado a</th>
                <th>Creado</th>
              </tr>
            </thead>
            <tbody>
              {datos.items.map((ticket) => (
                <tr key={ticket.id}>
                  <td>
                    <Link to={`/tickets/${ticket.id}`} className="enlace-ticket">
                      {ticket.code}
                    </Link>
                  </td>
                  <td className="celda-asunto">{ticket.title}</td>
                  <td>
                    <TypeBadge type={ticket.type} />
                  </td>
                  <td>
                    <PriorityBadge priority={ticket.priority} />
                  </td>
                  <td>
                    <StatusBadge status={ticket.status} />
                  </td>
                  <td>{ticket.assignee ? ticket.assignee.name : '—'}</td>
                  <td>{new Date(ticket.createdAt).toLocaleDateString('es-MX')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPaginas > 1 && (
        <div className="paginacion">
          <button
            type="button"
            className="btn btn-secundario"
            disabled={pagina <= 1}
            onClick={() => setPagina((p) => p - 1)}
          >
            Anterior
          </button>
          <span>
            Página {datos.page} de {totalPaginas} ({datos.total} tickets)
          </span>
          <button
            type="button"
            className="btn btn-secundario"
            disabled={pagina >= totalPaginas}
            onClick={() => setPagina((p) => p + 1)}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
