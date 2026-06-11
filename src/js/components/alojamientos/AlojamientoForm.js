export function AlojamientoForm({ values = {}, submitLabel = 'Guardar' } = {}) {
  return `
    <form id="alojamientoForm" class="card card-body">
      <div class="mb-3">
        <label class="form-label" for="titulo">Título</label>
        <input class="form-control" id="titulo" name="titulo" value="${values.titulo ?? ''}" required />
      </div>
      <div class="mb-3">
        <label class="form-label" for="descripcion">Descripción</label>
        <textarea class="form-control" id="descripcion" name="descripcion" rows="4" required>${values.descripcion ?? ''}</textarea>
      </div>
      <div class="mb-3">
        <label class="form-label" for="precio_noche">Precio por noche</label>
        <input class="form-control" type="number" id="precio_noche" name="precio_noche" min="0" step="1" value="${values.precio_noche ?? ''}" required />
      </div>
      <div class="mb-3">
        <label class="form-label" for="ciudad">Ciudad</label>
        <input class="form-control" id="ciudad" name="ciudad" value="${values.ciudad ?? ''}" required />
      </div>
      <button class="btn btn-primary" type="submit">${submitLabel}</button>
      <p class="mt-3 mb-0 text-muted" id="alojamientoMensaje"></p>
    </form>
  `;
}
