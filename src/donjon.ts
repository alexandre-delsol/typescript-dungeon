// Palier 10 — Le donjon

import type { De } from "./de"
import { BOSS, creerMonstre, monstreAuHasard, NIVEAUX } from "./monstres"
import type { Monstre, Niveau } from "./monstres"
import { decrireObjet, type Objet } from "./objets"

// --- Types et constantes : à écrire ---


export type Salle =
    | { type: "vide" }
    | { type: "coffre"; objet: Objet }
    | { type: "monstre"; monstre: Monstre }
    | { type: "boss"; monstre: Monstre };

export const COFFRES: readonly Objet[] = [
    { type: "potion", soin: 30 },
    { type: "potion", soin: 50 },
    { type: "arme", arme: { nom: "Dague", bonus: 1 } },
    { type: "arme", arme: { nom: "Épée longue", bonus: 4 } },
    { type: "arme", arme: { nom: "Bâton runique", bonus: 6 } },
    { type: "tresor", nom: "Bourse de pièces", valeur: 15 },
    { type: "tresor", nom: "Rubis", valeur: 40 },
    { type: "tresor", nom: "Couronne", valeur: 80 },
]

// --- Fonctions : décommenter, puis écrire le corps ---


export function niveauDeLaSalle(numero: number): Niveau {
    if (numero >= 1 && numero <= 3) return NIVEAUX[0]

    if (numero >= 4 && numero <= 6) return NIVEAUX[1]

    return NIVEAUX[2]
}


export function objetAuHasard(de: De): Objet {
    return COFFRES[de(COFFRES.length) - 1]
}

export function genererSalle(numero: number, de: De): Salle {
    const deResultat = de(6)

    if (deResultat === 1) return { type: "vide" }

    if (deResultat === 2) return { type: "coffre", objet: objetAuHasard(de) }

    const niveau = niveauDeLaSalle(numero)
    const monstre = monstreAuHasard(niveau, de)

    return { type: "monstre", monstre }
}


export function genererDonjon(taille: number, de: De): Salle[] {
    const salles: Salle[] = [];

    for (let i = 1; i < taille; i++) {
        salles.push(genererSalle(i, de));
    }

    salles.push({
        type: "boss",
        monstre: creerMonstre(BOSS)
    });

    return salles;
}

export function decrireSalle(salle: Salle): string {
    switch (salle.type) {
        case "vide":
            return "Cette salle est vide. Aucun danger ni trésor à l'horizon."

        case "coffre":
            return `Tu découvres un coffre ! À l'intérieur : ${decrireObjet(salle.objet)}.`

        case "monstre":
            return `Attention ! Un ${salle.monstre.nom} apparaît devant toi. Prépare-toi au combat !`

        case "boss":
            return `⚠️ ALERTE : le boss ${salle.monstre.nom} bloque le passage ! Le combat final commence !`
    }
}
