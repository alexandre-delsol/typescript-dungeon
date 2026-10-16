// Palier 12 — La saisie du joueur

import type { ClasseHeros } from "./heros"

// --- Fonctions : décommenter, puis écrire le corps ---

export function lireNom(valeur: unknown): string | null {
    if (typeof valeur !== "string") {
        return null;
    }

    const nom = valeur.trim();

    if (nom.length < 2 || nom.length > 20) {
        return null;
    }

    return nom;
}

export function lireClasse(valeur: unknown): ClasseHeros | null {
    if (typeof valeur !== "string") {
        return null;
    }

    if (valeur !== "guerrier"
        && valeur !== "mage"
        && valeur !== "voleur") {
        return null;
    }

    return valeur;
}
