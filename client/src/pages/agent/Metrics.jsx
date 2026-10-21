import { useEffect, useState } from 'react';
import { obtenerMisMetricas } from '../../api/reports.js';

export default function Metrics() {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerMisMetricas()
      .then(setDatos)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div>
      <h1>Mis métricas</h1>

      {error && <p className="error">{error}</p>}

      {cargando || !datos ? (
        <p className="texto-centro">Cargando métricas…</p>
      ) : (
        <>
          <div className="tarjetas-metricas">
            <div className="tarjeta-metrica">
              <span className="metrica-valor">{datos.asignados}</span>
              <span className="metrica-etiqueta">Tickets asignados</span>
            </div>
            <div className="tarjeta-metrica">
              <span className="metrica-valor">{datos.pendientes}</span>
              <span className="metrica-etiqueta">Pendientes</span>
            </div>
            <div className="tarjeta-metrica">
              <span className="metrica-valor">{datos.resueltos}</span>
              <span className="metrica-etiqueta">Resueltos y cerrados</span>
            </div>
            <div className="tarjeta-metrica">
              <span className="metrica-valor">{datos.tiempoPromedioResolucionHoras} h</span>
              <span className="metrica-etiqueta">Tiempo promedio de resolución</span>
            </div>
          </div>

          <div className="tabla-contenedor">
            <table className="tabla-tickets">
              <thead>
                <tr>
                  <th>Estado</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Abierto</td>
                  <td>{datos.porEstado.OPEN}</td>
                </tr>
                <tr>
                  <td>En proceso</td>
                  <td>{datos.porEstado.IN_PROGRESS}</td>
                </tr>
                <tr>
                  <td>Resuelto</td>
                  <td>{datos.porEstado.RESOLVED}</td>
                </tr>
                <tr>
                  <td>Cerrado</td>
                  <td>{datos.porEstado.CLOSED}</td>
                </tr>
                <tr>
                  <td>Cancelado</td>
                  <td>{datos.porEstado.CANCELLED}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
