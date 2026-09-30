// Palier 2 — La carte du héros (partie calculs)

// --- Types : à écrire ---

export type CouleurBarre = "bg-emerald-500" | "bg-amber-500" | "bg-red-500"

// --- Fonctions : décommenter, puis écrire le corps ---

export function pourcentage(valeur: number, max: number): number {
    if (max <= 0) return 0;
    const result = Math.round((valeur / max) * 100);
    return Math.min(100, Math.max(0, result))
}

export function couleurBarre(pourcent: number): CouleurBarre {
    if (pourcent > 50) return "bg-emerald-500"
    if (pourcent > 20) return "bg-amber-500"
    return "bg-red-500"
}
