import { useCallback, useEffect, useState } from 'react';
import { obtenerResumen } from '../../api/reports.js';
import { ETIQUETAS_ESTADO, ETIQUETAS_PRIORIDAD, ETIQUETAS_TIPO } from '../../components/tickets/Badges.jsx';

const ESTADOS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED'];
const TIPOS = ['SUPPORT', 'INCIDENT', 'MAINTENANCE'];
const PRIORIDADES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

function TablaConteos({ titulo, etiquetas, orden, conteos }) {
  return (
    <div className="tabla-contenedor">
      <table className="tabla-tickets">
        <thead>
          <tr>
            <th>{titulo}</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orden.map((clave) => (
            <tr key={clave}>
              <td>{etiquetas[clave] || clave}</td>
              <td>{conteos[clave] || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Reports() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const resumen = await obtenerResumen({
        from: desde ? new Date(`${desde}T00:00:00`).toISOString() : undefined,
        to: hasta ? new Date(`${hasta}T23:59:59`).toISOString() : undefined,
      });
      setDatos(resumen);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, [desde, hasta]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <div>
      <h1>Reportes</h1>

      <div className="filtros">
        <label>
          Desde
          <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        </label>
        <label>
          Hasta
          <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        </label>
        <button
          type="button"
          className="btn btn-secundario"
          onClick={() => {
            setDesde('');
            setHasta('');
          }}
        >
          Limpiar fechas
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {cargando || !datos ? (
        <p className="texto-centro">Cargando métricas…</p>
      ) : (
        <>
          <div className="tarjetas-metricas">
            <div className="tarjeta-metrica">
              <span className="metrica-valor">{datos.total}</span>
              <span className="metrica-etiqueta">Tickets creados</span>
            </div>
            <div className="tarjeta-metrica">
              <span className="metrica-valor">{datos.resueltosEnPeriodo}</span>
              <span className="metrica-etiqueta">Cerrados en el periodo</span>
            </div>
            <div className="tarjeta-metrica">
              <span className="metrica-valor">{datos.tiempoPromedioResolucionHoras} h</span>
              <span className="metrica-etiqueta">Tiempo promedio de resolución</span>
            </div>
          </div>

          <div className="rejilla-reportes">
            <div>
              <h2>Por estado</h2>
              <TablaConteos
                titulo="Estado"
                etiquetas={ETIQUETAS_ESTADO}
                orden={ESTADOS}
                conteos={datos.porEstado}
              />
            </div>
            <div>
              <h2>Por tipo</h2>
              <TablaConteos titulo="Tipo" etiquetas={ETIQUETAS_TIPO} orden={TIPOS} conteos={datos.porTipo} />
            </div>
            <div>
              <h2>Por prioridad</h2>
              <TablaConteos
                titulo="Prioridad"
                etiquetas={ETIQUETAS_PRIORIDAD}
                orden={PRIORIDADES}
                conteos={datos.porPrioridad}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
