import { getUser, hasSession } from './session.service.js';

export function getCurrentUser() {
  return getUser();
}

export function getCurrentRole() {
  return getCurrentUser()?.rol ?? null;
}

export function isAuthenticated() {
  return hasSession() && Boolean(getCurrentUser());
}

export function isAdmin() {
  return getCurrentRole() === 'admin';
}

export function canManageAlojamiento(alojamiento) {
  const currentUser = getCurrentUser();
  if (!currentUser || !alojamiento) return false;

  return currentUser.rol === 'admin' || alojamiento.usuario_id === currentUser.id;
}
