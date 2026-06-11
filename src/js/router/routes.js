import { AdminUsuariosPage, mountAdminUsuariosPage } from '../pages/AdminUsuariosPage.js';
import { AlojamientoDetallePage, mountAlojamientoDetallePage } from '../pages/AlojamientoDetallePage.js';
import { AlojamientosPage, cargarAlojamientos } from '../pages/AlojamientosPage.js';
import { CrearAlojamientoPage, mountCrearAlojamientoPage } from '../pages/CrearAlojamientoPage.js';
import { EditarAlojamientoPage, mountEditarAlojamientoPage } from '../pages/EditarAlojamientoPage.js';
import { LoginPage, mountLoginPage } from '../pages/LoginPage.js';
import { PerfilPage, mountPerfilPage } from '../pages/PerfilPage.js';
import { RegistroPage, mountRegistroPage } from '../pages/RegistroPage.js';

export const routes = [
  {
    path: 'login',
    page: LoginPage,
    mount: mountLoginPage,
    public: true,
  },
  {
    path: 'registro',
    page: RegistroPage,
    mount: mountRegistroPage,
    public: true,
  },
  {
    path: 'perfil',
    page: PerfilPage,
    mount: mountPerfilPage,
    requiresAuth: true,
  },
  {
    path: 'admin',
    page: AdminUsuariosPage,
    mount: mountAdminUsuariosPage,
    requiresAuth: true,
    requiresAdmin: true,
  },
  {
    path: 'alojamientos',
    page: AlojamientosPage,
    mount: cargarAlojamientos,
    public: true,
  },
  {
    path: 'alojamientos/nuevo',
    page: CrearAlojamientoPage,
    mount: mountCrearAlojamientoPage,
    requiresAuth: true,
  },
  {
    path: 'alojamientos/:id',
    page: AlojamientoDetallePage,
    mount: mountAlojamientoDetallePage,
    public: true,
  },
  {
    path: 'alojamientos/:id/editar',
    page: (id) => EditarAlojamientoPage(id),
    mount: mountEditarAlojamientoPage,
    requiresAuth: true,
  },
];
