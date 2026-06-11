import { getUser, hasSession } from '../../auth/session.service.js';

function isActive(view, currentView) {
  return currentView === view ? 'active fw-semibold' : '';
}

function navLink(view, label, currentView) {
  return `
    <li class="nav-item">
      <a class="nav-link ${isActive(view, currentView)}" href="#" data-view="${view}">
        ${label}
      </a>
    </li>
  `;
}

function navDropdown(user, currentView) {
  const label = user?.correo?.trim() || 'Mi cuenta';

  return `
    <li class="nav-item dropdown">
      <button
        class="btn btn-outline-light dropdown-toggle ${isActive('perfil', currentView)}"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        ${label}
      </button>
      <ul class="dropdown-menu dropdown-menu-end">
        <li>
          <a class="dropdown-item ${isActive('perfil', currentView)}" href="#" data-view="perfil">
            Perfil
          </a>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li>
          <button class="dropdown-item" type="button" data-action="logout">
            Cerrar sesión
          </button>
        </li>
      </ul>
    </li>
  `;
}

export function Navbar(currentView = 'home') {
  const user = getUser();
  const loggedIn = hasSession();

  return `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-semibold" href="#" data-view="home">Alojamientos</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Alternar navegación"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNavbar">
          <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            ${navLink('home', 'Inicio', currentView)}
            ${
              loggedIn
                ? `
                  ${navDropdown(user, currentView)}
                `
                : `
                  ${navLink('login', 'Login', currentView)}
                  ${navLink('registro', 'Registro', currentView)}
                `
            }
          </ul>
        </div>
      </div>
    </nav>
  `;
}
