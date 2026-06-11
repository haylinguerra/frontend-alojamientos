import { getAlojamientos } from '../api/alojamientos.api.js';
import { AlojamientoCard } from '../components/alojamientos/AlojamientoCard.js';

export function AlojamientosPage() {
  return `
    <section class="container py-5">
      <h1 class="mb-4">Alojamientos</h1>
      <div id="alojamientosState" class="text-muted">Cargando alojamientos...</div>
    </section>
  `;
}

export async function cargarAlojamientos() {
  const state = document.querySelector('#alojamientosState');

  try {
    state.textContent = 'Cargando alojamientos...';
    const response = await getAlojamientos();
    const alojamientos = response.data ?? [];

    if (!Array.isArray(alojamientos) || alojamientos.length === 0) {
      state.innerHTML = '<div class="alert alert-info">No hay alojamientos para mostrar.</div>';
      return;
    }

    state.innerHTML = `
      <div class="row g-4">
        ${alojamientos
          .map((alojamiento) => `
            <div class="col-md-6 col-lg-4">
              ${AlojamientoCard(alojamiento)}
            </div>
          `)
          .join('')}
      </div>
    `;
  } catch (error) {
    state.innerHTML = `<div class="alert alert-danger">${error.message ?? 'No fue posible cargar los alojamientos.'}</div>`;
  }
}
