// Palier 3 — Le bestiaire

import type { De } from "./de"

// --- Constantes et types : à écrire ---


export const NIVEAUX = [1, 2, 3] as const;

export type Niveau = (typeof NIVEAUX)[number];

export type ModeleMonstre = {
    readonly nom: string;
    readonly niveau: Niveau;
    readonly pvMax: number;
    readonly attaque: number;
    readonly defense: number;
    readonly butin: number;
};

export type Monstre = ModeleMonstre & {
    pv: number;
};

export const BESTIAIRE: readonly ModeleMonstre[] = [
    { nom: "Rat géant", niveau: 1, pvMax: 18, attaque: 5, defense: 0, butin: 3 },
    { nom: "Gobelin", niveau: 1, pvMax: 25, attaque: 7, defense: 1, butin: 5 },
    { nom: "Chauve-souris", niveau: 1, pvMax: 14, attaque: 6, defense: 0, butin: 2 },
    { nom: "Squelette", niveau: 2, pvMax: 40, attaque: 10, defense: 3, butin: 10 },
    { nom: "Loup-garou", niveau: 2, pvMax: 50, attaque: 12, defense: 2, butin: 12 },
    { nom: "Araignée géante", niveau: 2, pvMax: 35, attaque: 11, defense: 2, butin: 9 },
    { nom: "Troll", niveau: 3, pvMax: 70, attaque: 14, defense: 4, butin: 25 },
    { nom: "Spectre", niveau: 3, pvMax: 55, attaque: 16, defense: 2, butin: 22 },
];



export const BOSS: ModeleMonstre = {
    nom: "Dragon",
    niveau: 3,
    pvMax: 100,
    attaque: 17,
    defense: 4,
    butin: 100
}

// --- Fonctions : décommenter, puis écrire le corps ---

export function creerMonstre(modele: ModeleMonstre): Monstre {
    return { ...modele, pv: modele.pvMax };
}

export function trouverModele(nom: string): ModeleMonstre | undefined {
    return BESTIAIRE.find(modele => modele.nom === nom);
}

export function modelesDeNiveau(niveau: Niveau): ModeleMonstre[] {
    return BESTIAIRE.filter(modele => modele.niveau === niveau);
}

export function monstreAuHasard(niveau: Niveau, de: De): Monstre {
    const modeles = modelesDeNiveau(niveau);
    const resultat = de(modeles.length)-1;

    return creerMonstre(modeles[resultat]);
}
