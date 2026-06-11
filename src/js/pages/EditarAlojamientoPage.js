import { getAlojamientoById, updateAlojamiento } from '../api/alojamientos.api.js';
import { canManageAlojamiento } from '../auth/permissions.js';
import { AlojamientoForm } from '../components/alojamientos/AlojamientoForm.js';

export function EditarAlojamientoPage(id) {
  return `
    <section class="container py-5" style="max-width: 760px;">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="mb-0">Editar alojamiento</h1>
        <a class="btn btn-outline-secondary" href="#" data-view="alojamientos/${id}">Volver</a>
      </div>
      <div id="editarAlojamientoState" class="text-muted">Cargando datos...</div>
    </section>
  `;
}

export function mountEditarAlojamientoPage({ navigate, params } = {}) {
  const id = params?.id;
  if (!id) return;

  cargarAlojamientoParaEditar(id, navigate);
}

async function cargarAlojamientoParaEditar(id, navigate) {
  const state = document.querySelector('#editarAlojamientoState');

  try {
    const response = await getAlojamientoById(id);
    const alojamiento = response.data;

    if (!canManageAlojamiento(alojamiento)) {
      state.innerHTML = '<div class="alert alert-danger">No tienes permisos para editar este alojamiento.</div>';
      return;
    }

    state.innerHTML = AlojamientoForm({
      values: alojamiento,
      submitLabel: 'Actualizar',
    });

    document.querySelector('#alojamientoForm').addEventListener('submit', async (event) => {
      event.preventDefault();

      const titulo = document.querySelector('#titulo').value.trim();
      const descripcion = document.querySelector('#descripcion').value.trim();
      const precio_noche = Number(document.querySelector('#precio_noche').value);
      const ciudad = document.querySelector('#ciudad').value.trim();
      const mensaje = document.querySelector('#alojamientoMensaje');

      try {
        mensaje.textContent = 'Actualizando alojamiento...';
        await updateAlojamiento(id, { titulo, descripcion, precio_noche, ciudad });
        mensaje.textContent = 'Alojamiento actualizado correctamente.';
        mensaje.classList.remove('text-muted');
        mensaje.classList.add('text-success');
      } catch (error) {
        mensaje.classList.remove('text-muted', 'text-success');
        mensaje.classList.add('text-danger');
        if (error.status === 401) {
          mensaje.textContent = 'Tu sesión no es válida. Inicia sesión nuevamente.';
        } else if (error.status === 403) {
          mensaje.textContent = 'No tienes permisos para editar este alojamiento.';
        } else {
          mensaje.textContent = error.message ?? 'No fue posible actualizar el alojamiento.';
        }
      }
    });
  } catch (error) {
    if (error.status === 403) {
      state.innerHTML = '<div class="alert alert-danger">No tienes permisos para editar este alojamiento.</div>';
      return;
    }

    state.innerHTML = `<div class="alert alert-danger">${error.message ?? 'No fue posible cargar el alojamiento.'}</div>`;
  }
}
