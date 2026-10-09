// Palier 1 — Le héros
// Palier 6 : ajouter le champ sac au type Heros

// Palier 6 :
import type { Objet } from "./objets"

// --- Types : à écrire ---

export type ClasseHeros = "guerrier" | "mage" | "voleur"

type ArmeBase = {
    nom: string;
    bonus: number;
}

export type Arme = Readonly<ArmeBase>

type HerosIdentite = {
    nom: string;
    classe: ClasseHeros;
    pvMax: number;
    manaMax: number;
};

type HerosEtat = {
    pv: number;
    mana: number;
    attaque: number;
    defense: number;
    or: number;
    arme?: Arme;
    sac: readonly Objet[];
};

export type Heros = Readonly<HerosIdentite> & HerosEtat;

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
                sac: [
                    { type: "potion", soin: 30 },
                    { type: "potion", soin: 30 }
                ]
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
                sac: [
                    { type: "potion", soin: 30 },
                    { type: "potion", soin: 30 }
                ]
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
                sac: [
                    { type: "potion", soin: 30 },
                    { type: "potion", soin: 30 }
                ]
            }
    }
}

export function attaqueTotale(heros: Heros): number {
    return heros.attaque + (heros.arme?.bonus ?? 0);
}

export function equiper(heros: Heros, arme: Arme): Heros {
    return { ...heros, arme };
}

export function decrireHeros(heros: Heros): string {
    return `${heros.nom} ${heros.classe} ${heros.pv}/${heros.pvMax} ${heros.arme?.nom ?? ""}`
}
