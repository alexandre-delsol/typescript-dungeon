
import { jouerTour } from "./actions";
import type { Action } from "./actions";
import { estVivant, reposer } from "./combat";
import type { De } from "./de";
import { decrireSalle, genererDonjon } from "./donjon";
import type { Salle } from "./donjon";
import { creerHeros } from "./heros";
import type { ClasseHeros, Heros } from "./heros";
import type { Monstre } from "./monstres";
import { ramasser, valeurDuSac } from "./objets";

// --- Types et constantes ---

type ContexteDonjon = {
    heros: Heros;
    donjon: readonly Salle[];
    position: number;
};

export type Partie =
    | { etat: "accueil" }
    | ({ etat: "exploration" } & ContexteDonjon)
    | ({ etat: "combat"; monstre: Monstre } & ContexteDonjon)
    | { etat: "victoire"; heros: Heros }
    | { etat: "defaite"; heros: Heros; position: number };

export type Etape = {
    partie: Partie;
    messages: string[];
};

export const TAILLE_DONJON = 8;

// --- Fonctions ---

export function nouvellePartie(): Partie {
    return { etat: "accueil" };
}

export function commencer(
    nom: string,
    classe: ClasseHeros,
    de: De
): Partie {
    return {
        etat: "exploration",
        heros: creerHeros(nom, classe),
        donjon: genererDonjon(TAILLE_DONJON, de),
        position: 0
    };
}

export function avancer(partie: Partie): Etape {
    if (partie.etat !== "exploration") {
        return {
            partie,
            messages: []
        };
    }

    const salle = partie.donjon[partie.position];
    const message = decrireSalle(salle);

    switch (salle.type) {
        case "vide":
            return {
                partie: {
                    ...partie,
                    heros: reposer(partie.heros),
                    position: partie.position + 1
                },
                messages: [message]
            };

        case "coffre":
            return {
                partie: {
                    ...partie,
                    heros: ramasser(partie.heros, salle.objet),
                    position: partie.position + 1
                },
                messages: [message]
            };

        case "monstre":
        case "boss":
            return {
                partie: {
                    ...partie,
                    etat: "combat",
                    monstre: salle.monstre
                },
                messages: [message]
            };
    }
}

export function combattre(
    partie: Partie,
    action: Action,
    de: De
): Etape {
    if (partie.etat !== "combat") {
        return {
            partie,
            messages: []
        };
    }

    const resultat = jouerTour(partie, action, de);

    if (!estVivant(resultat.heros)) {
        return {
            partie: {
                etat: "defaite",
                heros: resultat.heros,
                position: partie.position
            },
            messages: resultat.messages
        };
    }

    if (resultat.fuite) {
        return {
            partie: {
                etat: "exploration",
                heros: resultat.heros,
                donjon: partie.donjon,
                position: partie.position
            },
            messages: resultat.messages
        };
    }

    if (estVivant(resultat.monstre)) {
        return {
            partie: {
                etat: "combat",
                heros: resultat.heros,
                monstre: resultat.monstre,
                donjon: partie.donjon,
                position: partie.position
            },
            messages: resultat.messages
        };
    }

    const herosAvecButin: Heros = {
        ...resultat.heros,
        or: resultat.heros.or + resultat.monstre.butin
    };

    if (partie.position === partie.donjon.length - 1) {
        return {
            partie: {
                etat: "victoire",
                heros: herosAvecButin
            },
            messages: resultat.messages
        };
    }

    return {
        partie: {
            etat: "exploration",
            heros: herosAvecButin,
            donjon: partie.donjon,
            position: partie.position + 1
        },
        messages: resultat.messages
    };
}

export function score(heros: Heros): number {
    return heros.or + valeurDuSac(heros.sac);
}
