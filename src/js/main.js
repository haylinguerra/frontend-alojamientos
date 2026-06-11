import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/main.css';

import { clearSession, getUser, hasSession } from './auth/session.service.js';
import { Navbar } from './components/layout/Navbar.js';
import { LoginPage, mountLoginPage } from './pages/LoginPage.js';
import { PerfilPage, mountPerfilPage } from './pages/PerfilPage.js';
import { RegistroPage, mountRegistroPage } from './pages/RegistroPage.js';

const app = document.querySelector('#app');
let currentView = 'home';

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

function renderHomePage() {
  const user = getUser();

  return `
    <section class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-9 py-4">
          <p class="text-uppercase text-primary fw-semibold mb-2">Frontend Alojamientos</p>
          <h1 class="display-6 mb-3">Base SPA lista para comenzar</h1>
          <p class="text-muted mb-4">
            Este arranque deja lista la autenticación y la navegación principal.
          </p>
          <div class="d-flex flex-wrap gap-2">
            ${
              hasSession()
                ? '<a class="btn btn-primary" href="#" data-view="perfil">Ir a mi perfil</a>'
                : '<a class="btn btn-primary" href="#" data-view="login">Iniciar sesión</a><a class="btn btn-outline-secondary" href="#" data-view="registro">Crear cuenta</a>'
            }
          </div>
          ${
            user?.correo
              ? `
                <p class="text-muted mt-4 mb-0">
                  Has iniciado sesión como <strong>${user.correo}</strong>.
                </p>
              `
              : ''
          }
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

const views = {
  home: {
    page: renderHomePage,
  },
  login: {
    page: LoginPage,
    mount: mountLoginPage,
  },
  registro: {
    page: RegistroPage,
    mount: mountRegistroPage,
  },
  perfil: {
    requiresAuth: true,
    page: PerfilPage,
    mount: mountPerfilPage,
  },
};

function render(view = currentView) {
  const normalizedView = normalizeView(view);
  const selectedView = views[normalizedView];

  if (!selectedView) {
    currentView = 'not-found';
    app.innerHTML = `
      ${Navbar(currentView)}
      <main id="page-root">${renderNotFoundPage()}</main>
    `;
    return;
  }

  if (selectedView.requiresAuth && !hasSession()) {
    navigate('login');
    return;
  }

  currentView = normalizedView;

  const pageHtml = selectedView.page() ?? '';

  app.innerHTML = `
    ${Navbar(currentView)}
    <main id="page-root">${pageHtml}</main>
  `;

  selectedView.mount?.({ navigate, render, view: currentView });
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
