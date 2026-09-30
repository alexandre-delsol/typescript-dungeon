// Palier 4 — Les dégâts

import type { Heros } from "./heros"
import type { Monstre } from "./monstres"

// --- Fonctions : décommenter, puis écrire le corps ---

export function calculerDegats(
    attaque: number,
    defense: number,
    critique?: boolean
): number {
    const degats = Math.max(attaque - defense, 1)
    return critique ? degats * 2 : degats;
}

export function blesserHeros(heros: Heros, degats: number): Heros {
    return {
        ...heros,
        pv: Math.max(0, heros.pv - degats)
    };
}

export function blesserMonstre(monstre: Monstre, degats: number): Monstre {
    return {
        ...monstre,
        pv: Math.max(0, monstre.pv - degats)
    };
}

export function soigner(heros: Heros, points: number): Heros {
return {
        ...heros,
        pv: Math.min(heros.pvMax, heros.pv + points)
    };
}

export function reposer(heros: Heros): Heros {
    const nouveauHeros = soigner(heros, 20);

    return {
        ...nouveauHeros,
        mana: Math.min(nouveauHeros.manaMax, nouveauHeros.mana + 10)
    };
}

// Type du paramètre : à écrire (un objet qui a un champ pv de type nombre)
export function estVivant(combattant: { pv: number }): boolean {
    return combattant.pv > 0;
}
