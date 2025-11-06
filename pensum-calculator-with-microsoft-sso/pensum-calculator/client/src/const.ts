export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "Pensum Calculator";
export const APP_LOGO = import.meta.env.VITE_APP_LOGO || "";

export function getLoginUrl() {
  return import.meta.env.VITE_OAUTH_PORTAL_URL || '/api/auth/microsoft';
}

export function getMicrosoftLoginUrl() {
  return '/api/auth/microsoft';
}
