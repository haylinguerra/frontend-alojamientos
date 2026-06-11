import { deleteAlojamiento, getAlojamientoById } from '../api/alojamientos.api.js';
import { canManageAlojamiento } from '../auth/permissions.js';
import { formatCurrency } from '../utils/formatters.js';

export function AlojamientoDetallePage() {
  return `
    <section class="container py-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 mb-0">Detalle de alojamiento</h1>
        <a class="btn btn-outline-secondary" href="#" data-view="home">Volver</a>
      </div>
      <div id="detalleState" class="text-muted">Cargando detalle...</div>
    </section>
  `;
}

export function mountAlojamientoDetallePage({ navigate, params } = {}) {
  const id = params?.id;
  if (!id) return;

  cargarDetalleAlojamiento(id, navigate);
}

async function cargarDetalleAlojamiento(id, navigate) {
  const state = document.querySelector('#detalleState');

  try {
    const response = await getAlojamientoById(id);
    const alojamiento = response.data;
    const canManage = canManageAlojamiento(alojamiento);
    const comodidades = alojamiento.comodidades ?? [];

    state.innerHTML = `
      <article class="card shadow-sm">
        <div class="card-body">
          <h1 class="h3">${alojamiento.titulo}</h1>
          <p class="text-muted mb-1">${alojamiento.ciudad}</p>
          <p class="fw-semibold mb-3">${formatCurrency(alojamiento.precio_noche)} / noche</p>
          <p>${alojamiento.descripcion}</p>

          ${
            comodidades.length
              ? `
                <div class="mt-4">
                  <h2 class="h5">Comodidades</h2>
                  <div class="d-flex flex-wrap gap-2">
                    ${comodidades.map((comodidad) => `<span class="badge text-bg-secondary">${comodidad.nombre}</span>`).join('')}
                  </div>
                </div>
              `
              : ''
          }

          ${
            canManage
              ? `
                <div class="mt-4 d-flex gap-2">
                  <a class="btn btn-outline-secondary" href="#" data-view="alojamientos/${alojamiento.id}/editar">Editar</a>
                  <button class="btn btn-outline-danger" data-action="delete-alojamiento" data-id="${alojamiento.id}">Eliminar</button>
                </div>
              `
              : ''
          }
        </div>
      </article>
    `;

    const deleteBtn = state.querySelector('[data-action="delete-alojamiento"]');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => eliminarAlojamiento(deleteBtn.dataset.id, navigate));
    }
  } catch (error) {
    state.innerHTML = `<div class="alert alert-danger">${error.message ?? 'No fue posible cargar el detalle.'}</div>`;
  }
}

async function eliminarAlojamiento(id, navigate) {
  const confirmar = window.confirm('¿Seguro que deseas eliminar este alojamiento?');
  if (!confirmar) return;

  try {
    await deleteAlojamiento(id);
    navigate?.('home');
  } catch (error) {
    if (error.status === 401) {
      alert('Tu sesión no es válida. Inicia sesión nuevamente.');
      navigate?.('login');
    } else if (error.status === 403) {
      alert('No tienes permisos para eliminar este alojamiento.');
    } else {
      alert(error.message ?? 'No fue posible eliminar el alojamiento.');
    }
  }
}
