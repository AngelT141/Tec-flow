import { useCallback, useEffect, useState } from 'react';
import { listarCategorias, crearCategoria, renombrarCategoria, alternarCategoria } from '../../api/categories.js';

export default function Categories() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [nueva, setNueva] = useState('');
  const [editando, setEditando] = useState(null);
  const [nombreEdicion, setNombreEdicion] = useState('');

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      setCategorias(await listarCategorias());
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
      await crearCategoria(nueva.trim());
      setNueva('');
      aviso('Categoría creada');
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleRenombrar(id) {
    setError('');
    try {
      await renombrarCategoria(id, nombreEdicion.trim());
      setEditando(null);
      aviso('Categoría actualizada');
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(c) {
    setError('');
    try {
      await alternarCategoria(c.id);
      aviso(c.active ? 'Categoría desactivada' : 'Categoría activada');
      await cargar();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1>Categorías</h1>

      <form className="fila-filtros" onSubmit={handleCrear}>
        <input
          type="text"
          placeholder="Nombre de la nueva categoría"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
          minLength={2}
          maxLength={60}
          required
        />
        <button type="submit" className="btn btn-primario">
          + Agregar
        </button>
      </form>

      {exito && <p className="exito">{exito}</p>}
      {error && <p className="error">{error}</p>}

      {cargando ? (
        <p className="texto-centro">Cargando categorías…</p>
      ) : (
        <div className="tabla-contenedor">
          <table className="tabla-tickets">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((c) => (
                <tr key={c.id}>
                  <td>
                    {editando === c.id ? (
                      <input
                        type="text"
                        value={nombreEdicion}
                        onChange={(e) => setNombreEdicion(e.target.value)}
                        minLength={2}
                        maxLength={60}
                      />
                    ) : (
                      c.name
                    )}
                  </td>
                  <td>
                    <span className={`badge ${c.active ? 'badge-verde' : 'badge-gris'}`}>
                      {c.active ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td>
                    {editando === c.id ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-primario btn-pequeno"
                          onClick={() => handleRenombrar(c.id)}
                          disabled={nombreEdicion.trim().length < 2}
                        >
                          Guardar
                        </button>{' '}
                        <button
                          type="button"
                          className="btn btn-secundario btn-pequeno"
                          onClick={() => setEditando(null)}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn btn-secundario btn-pequeno"
                          onClick={() => {
                            setEditando(c.id);
                            setNombreEdicion(c.name);
                          }}
                        >
                          Editar
                        </button>{' '}
                        <button
                          type="button"
                          className={`btn btn-pequeno ${c.active ? 'btn-peligro' : 'btn-primario'}`}
                          onClick={() => handleToggle(c)}
                        >
                          {c.active ? 'Desactivar' : 'Activar'}
                        </button>
                      </>
                    )}
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
