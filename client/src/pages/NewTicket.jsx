import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearTicket, obtenerCategorias } from '../api/tickets.js';

export default function NewTicket() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    type: 'SUPPORT',
    title: '',
    description: '',
    categoryId: '',
    priority: 'MEDIUM',
  });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    obtenerCategorias()
      .then((items) => setCategorias(items.filter((c) => c.active)))
      .catch((err) => setError(err.message));
  }, []);

  function cambiar(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      const ticket = await crearTicket({
        ...form,
        categoryId: Number(form.categoryId),
      });
      navigate(`/tickets/${ticket.id}`);
    } catch (err) {
      const detalle =
        err.details?.title?.[0] ||
        err.details?.description?.[0] ||
        err.details?.categoryId?.[0] ||
        err.message;
      setError(detalle);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="tarjeta-formulario ancho-medio">
      <h1>Nuevo ticket</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Tipo
          <select value={form.type} onChange={(e) => cambiar('type', e.target.value)}>
            <option value="SUPPORT">Soporte técnico</option>
            <option value="INCIDENT">Incidente / Bug</option>
            <option value="MAINTENANCE">Mantenimiento</option>
          </select>
        </label>
        <label>
          Asunto
          <input
            type="text"
            value={form.title}
            onChange={(e) => cambiar('title', e.target.value)}
            required
            minLength={4}
            maxLength={120}
            placeholder="Breve resumen del problema o solicitud"
          />
        </label>
        <label>
          Descripción
          <textarea
            value={form.description}
            onChange={(e) => cambiar('description', e.target.value)}
            required
            minLength={10}
            maxLength={5000}
            rows={6}
            placeholder="Describe el detalle: qué ocurre, desde cuándo, pasos para reproducirlo…"
          />
        </label>
        <label>
          Categoría
          <select
            value={form.categoryId}
            onChange={(e) => cambiar('categoryId', e.target.value)}
            required
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Prioridad
          <select value={form.priority} onChange={(e) => cambiar('priority', e.target.value)}>
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
            <option value="CRITICAL">Crítica</option>
          </select>
        </label>
        <div className="fila-botones">
          <button type="button" className="btn btn-secundario" onClick={() => navigate('/')}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primario" disabled={enviando}>
            {enviando ? 'Creando…' : 'Crear ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}
