// Palier 1 — Le héros
// Palier 6 : ajouter le champ sac au type Heros

// Palier 6 :
// import type { Objet } from "./objets"

// --- Types : à écrire ---

export type ClasseHeros = "guerrier" | "mage" | "voleur"

export type Arme = {
    readonly nom: string;
    readonly bonus: number;
}

export type Heros = {
    readonly nom: string;
    readonly classe: ClasseHeros;
    readonly pvMax: number;
    readonly manaMax: number;
    pv: number;
    mana: number;
    attaque: number;
    defense: number;
    or: number;
    arme?: Arme;
}

// --- Fonctions : décommenter, puis écrire le corps ---

export function creerHeros(nom: string, classe: ClasseHeros): Heros {
    switch (classe) {
        case "guerrier":
            return {
                nom: nom,
                classe: "guerrier",
                pvMax: 100,
                manaMax: 10,
                pv: 100,
                mana: 10,
                attaque: 13,
                defense: 5,
                or: 0,
                arme: {
                    nom: "Épée courte",
                    bonus: 2
                },
            }
        case "mage":
            return {
                nom: nom,
                classe: "mage",
                pvMax: 80,
                manaMax: 80,
                pv: 80,
                mana: 80,
                attaque: 8,
                defense: 3,
                or: 0,
            }
        case "voleur":
            return {
                nom: nom,
                classe: "voleur",
                pvMax: 100,
                manaMax: 30,
                pv: 100,
                mana: 30,
                attaque: 14,
                defense: 4,
                or: 0,
            }
    }
}

// export function attaqueTotale(heros: Heros): number {
//
// }

// export function equiper(heros: Heros, arme: Arme): Heros {
//
// }

// export function decrireHeros(heros: Heros): string {
//
// }
