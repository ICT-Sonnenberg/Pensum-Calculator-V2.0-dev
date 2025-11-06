export const COOKIE_NAME = "pensum_session";

export const APP_TITLE = process.env.VITE_APP_TITLE || "Pensum Calculator";
export const APP_LOGO = process.env.VITE_APP_LOGO || "";

export const CARE_LEVELS = [1, 2, 3, 4, 5] as const;
export type CareLevel = typeof CARE_LEVELS[number];
