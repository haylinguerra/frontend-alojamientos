import { createAlojamiento } from '../api/alojamientos.api.js';
import { AlojamientoForm } from '../components/alojamientos/AlojamientoForm.js';

export function CrearAlojamientoPage() {
  return `
    <section class="container py-5" style="max-width: 760px;">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="mb-0">Nuevo alojamiento</h1>
        <a class="btn btn-outline-secondary" href="#" data-view="home">Volver</a>
      </div>
      ${AlojamientoForm({ submitLabel: 'Crear' })}
    </section>
  `;
}

export function mountCrearAlojamientoPage({ navigate } = {}) {
  document.querySelector('#alojamientoForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const titulo = document.querySelector('#titulo').value.trim();
    const descripcion = document.querySelector('#descripcion').value.trim();
    const precio_noche = Number(document.querySelector('#precio_noche').value);
    const ciudad = document.querySelector('#ciudad').value.trim();
    const mensaje = document.querySelector('#alojamientoMensaje');

    try {
      mensaje.textContent = 'Creando alojamiento...';
      await createAlojamiento({ titulo, descripcion, precio_noche, ciudad });
      mensaje.textContent = 'Alojamiento creado correctamente.';
      mensaje.classList.remove('text-muted');
      mensaje.classList.add('text-success');
    } catch (error) {
      mensaje.classList.remove('text-muted', 'text-success');
      mensaje.classList.add('text-danger');
      if (error.status === 401) {
        mensaje.textContent = 'Tu sesión no es válida. Inicia sesión nuevamente.';
      } else if (error.status === 400) {
        mensaje.textContent = 'Revisa los datos enviados.';
      } else {
        mensaje.textContent = error.message ?? 'No fue posible crear el alojamiento.';
      }
    }
  });
}
