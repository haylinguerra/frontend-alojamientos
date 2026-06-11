import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/main.css';

import { clearSession } from './auth/session.service.js';
import { isAuthenticated } from './auth/permissions.js';
import { Navbar } from './components/layout/Navbar.js';
import { routes } from './router/routes.js';
import { requireAdmin, requireAuth } from './router/guards.js';
import { AlojamientosPage, cargarAlojamientos } from './pages/AlojamientosPage.js';

const app = document.querySelector('#app');
let currentView = 'home';

function renderForbiddenPage() {
  return `
    <section class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4 p-md-5 text-center">
              <h1 class="h3 mb-3">Acceso denegado</h1>
              <p class="text-muted mb-4">
                No tienes permisos para acceder a esta sección.
              </p>
              <a class="btn btn-primary" href="#" data-view="home">Ir al inicio</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderNotFoundPage() {
  return `
    <section class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4 p-md-5 text-center">
              <h1 class="h3 mb-3">Página no encontrada</h1>
              <p class="text-muted mb-4">
                La vista solicitada no está disponible en esta SPA.
              </p>
              <a class="btn btn-primary" href="#" data-view="home">Ir al inicio</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function normalizeView(view) {
  const normalized = String(view ?? 'home')
    .trim()
    .replace(/^#/, '')
    .replace(/^\/+|\/+$/g, '');

  return normalized || 'home';
}

function matchRoute(view) {
  for (const route of routes) {
    const pattern = route.path.replace(/:(\w+)/g, '([^/]+)');
    const regex = new RegExp(`^${pattern}$`);
    const match = view.match(regex);

    if (match) {
      const paramNames = [...route.path.matchAll(/:(\w+)/g)].map((m) => m[1]);
      const params = {};
      paramNames.forEach((name, index) => {
        params[name] = match[index + 1];
      });
      return { route, params };
    }
  }

  return null;
}

function handleDeniedAccess(reason) {
  if (reason === 'login') {
    navigate('login');
    return;
  }

  if (reason === 'forbidden') {
    currentView = 'forbidden';
    app.innerHTML = `
      ${Navbar(currentView)}
      <main id="page-root">${renderForbiddenPage()}</main>
    `;
  }
}

function renderHomePage() {
  const pageHtml = AlojamientosPage();
  const addButton = isAuthenticated()
    ? '<a class="btn btn-primary mb-4" href="#" data-view="alojamientos/nuevo"><i class="bi bi-plus-lg"></i> Nuevo alojamiento</a>'
    : '';

  return `
    <section class="container py-5">
      <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 class="mb-2">Alojamientos</h1>
          <p class="text-muted mb-0">Explora los alojamientos disponibles en la plataforma.</p>
        </div>
        ${addButton}
      </div>
      <div id="alojamientosState" class="text-muted">Cargando alojamientos...</div>
    </section>
  `;
}

function render(view = currentView) {
  const normalizedView = normalizeView(view);

  if (normalizedView === 'home') {
    currentView = 'home';
    app.innerHTML = `
      ${Navbar(currentView)}
      <main id="page-root">${renderHomePage()}</main>
    `;
    cargarAlojamientos();
    return;
  }

  const matched = matchRoute(normalizedView);

  if (!matched) {
    currentView = 'not-found';
    app.innerHTML = `
      ${Navbar(currentView)}
      <main id="page-root">${renderNotFoundPage()}</main>
    `;
    return;
  }

  const { route, params } = matched;

  if (route.requiresAdmin && !requireAdmin(handleDeniedAccess)) {
    return;
  }

  if (route.requiresAuth && !requireAuth(handleDeniedAccess)) {
    return;
  }

  currentView = normalizedView;

  const pageHtml = params.id ? route.page(params.id) : route.page();

  app.innerHTML = `
    ${Navbar(currentView)}
    <main id="page-root">${pageHtml}</main>
  `;

  route.mount?.({ navigate, render, view: currentView, params });
}

function navigate(view = 'home') {
  render(normalizeView(view));
}

app.addEventListener('click', (event) => {
  const viewLink = event.target.closest('[data-view]');
  if (viewLink) {
    event.preventDefault();
    navigate(viewLink.dataset.view);
    return;
  }

  const logoutButton = event.target.closest('[data-action="logout"]');
  if (logoutButton) {
    clearSession();
    navigate('home');
  }
});

navigate(currentView);
