// Palier 7 — Les actions

import { blesserHeros, blesserMonstre, calculerDegats, estVivant, soigner } from "./combat"
import type { De } from "./de"
import { attaqueTotale } from "./heros"
import type { Heros } from "./heros"
import type { Monstre } from "./monstres"
import { boirePotion, compterPotions } from "./objets"

// --- Types : à écrire ---

export type Sort = "boule de feu" | "soin"

export type Action =
    | { type: "attaquer" }
    | { type: "sort"; sort: Sort; }
    | { type: "potion" }
    | { type: "fuir" }

export type Combat = {
    heros: Heros;
    monstre: Monstre;
}

export type Tour = {
    heros: Heros;
    monstre: Monstre;
    fuite: boolean;
    messages: string[];
}

// --- Fonctions : décommenter, puis écrire le corps ---
export function agir(combat: Combat, action: Action, de: De): Tour {
    const { heros, monstre } = combat;

    const rien: Tour = {
        heros,
        monstre,
        fuite: false,
        messages: ["Aucune action effectuée."]
    };

    switch (action.type) {
        case "attaquer": {
            const resultat = de(6);
            const critique = resultat === 6;

            const degats = calculerDegats(
                attaqueTotale(heros),
                monstre.defense,
                critique
            );

            const nouveauMonstre = blesserMonstre(monstre, degats);

            return {
                heros,
                monstre: nouveauMonstre,
                fuite: false,
                messages: [critique
                    ? `Critique ! Vous infligez ${degats} dégâts.`
                    : `Vous infligez ${degats} dégâts.`]
            };
        }


        case "sort": {
            switch (action.sort) {
                case "boule de feu": {
                    if (heros.mana < 10) {
                        return {
                            ...rien,
                            messages: ["Vous n'avez pas assez de mana !"]
                        };
                    }

                    const nouveauHeros = {
                        ...heros,
                        mana: heros.mana - 10
                    };

                    const nouveauMonstre = blesserMonstre(monstre, 25);

                    return {
                        heros: nouveauHeros,
                        monstre: nouveauMonstre,
                        fuite: false,
                        messages: [
                            "Vous lancez une boule de feu et infligez 25 dégâts !"
                        ]
                    };
                }

                case "soin": {
                    if (heros.mana < 8) {
                        return {
                            ...rien,
                            messages: ["Vous n'avez pas assez de mana !"]
                        };
                    }

                    const herosSoigne = soigner(heros, 30);

                    const nouveauHeros = {
                        ...herosSoigne,
                        mana: heros.mana - 8
                    };

                    return {
                        heros: nouveauHeros,
                        monstre,
                        fuite: false,
                        messages: ["Vous récupérez jusqu'à 30 PV !"]
                    };
                }
            }
        }

        case "potion": {
            if (compterPotions(heros.sac) === 0) {
                return {
                    ...rien,
                    messages: ["Vous n'avez pas de potion !"]
                };
            }

            const nouveauHeros = boirePotion(heros);

            return {
                heros: nouveauHeros,
                monstre,
                fuite: false,
                messages: ["Vous avez bu une potion !"]
            };
        }

        case "fuir": {
            const resultat = de(6);
            const fuite = resultat >= 4;

            return {
                heros,
                monstre,
                fuite,
                messages: [
                    fuite
                        ? "Vous avez réussi à fuir !"
                        : "Vous n'avez pas réussi à fuir."
                ]
            };
        }

        default:
            const impossible: never = action;
            return impossible;
    }
}

export function jouerTour(combat: Combat, action: Action, de: De): Tour {
    const tour = agir(combat, action, de);

    if (tour.fuite || !estVivant(tour.monstre)) {
        return tour;
    }

    const degats = calculerDegats(
        tour.monstre.attaque,
        tour.heros.defense
    );

    const nouveauHeros = blesserHeros(
        tour.heros,
        degats
    );

    return {
        heros: nouveauHeros,
        monstre: tour.monstre,
        fuite: tour.fuite,
        messages: [
            ...tour.messages,
            `Le ${tour.monstre.nom} vous inflige ${degats} dégâts.`
        ]
    };
}

export function lireAction(texte: string | undefined): Action | null {
    switch (texte) {
        case "attaquer":
            return { type: "attaquer" };

        case "boule de feu":
            return { type: "sort", sort: "boule de feu" };

        case "soin":
            return { type: "sort", sort: "soin" };

        case "potion":
            return { type: "potion" };

        case "fuir":
            return { type: "fuir" };

        default:
            return null;
    }
}
