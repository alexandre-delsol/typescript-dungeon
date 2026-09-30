// Palier 3 — Le dé

// --- Types : à écrire ---

export type De = (faces: number) => number;

// --- Constantes : décommenter, puis compléter ---

export const lancerDe: De = (faces) => {
    return Math.floor(Math.random() * faces) + 1;
};