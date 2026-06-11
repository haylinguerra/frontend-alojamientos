import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../css/main.css';

const app = document.querySelector('#app');

if (app) {
  app.innerHTML = `
    <main class="welcome-shell">
      <section class="container py-5">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-8">
            <div class="card border-0 shadow-sm welcome-card">
              <div class="card-body p-4 p-md-5 text-center">
                <i class="bi bi-house-heart fs-1 text-primary mb-3"></i>
                <h1 class="h3 mb-3">Frontend de alojamientos listo</h1>
                <p class="text-muted mb-0">
                  Esta es la pantalla base temporal del Tutorial 1.
                  En los siguientes tutoriales se reemplazará por navegación, sesión y páginas reales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;
}
