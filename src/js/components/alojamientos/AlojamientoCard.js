import { formatCurrency, truncateText } from '../../utils/formatters.js';

export function AlojamientoCard(alojamiento) {
  return `
    <article class="card h-100 shadow-sm">
      <div class="card-body d-flex flex-column">
        <h2 class="h5 card-title">${alojamiento.titulo}</h2>
        <p class="text-muted mb-1">${alojamiento.ciudad}</p>
        <p class="fw-semibold mb-2">${formatCurrency(alojamiento.precio_noche)} / noche</p>
        <p class="card-text flex-grow-1">${truncateText(alojamiento.descripcion, 110)}</p>
        <div class="d-flex gap-2 flex-wrap">
          <a class="btn btn-outline-primary btn-sm" href="#" data-view="alojamientos/${alojamiento.id}">
            Ver detalle
          </a>
        </div>
      </div>
    </article>
  `;
}
