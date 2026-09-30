// Palier 6 — Le sac et les objets

import { soigner } from "./combat"
import type { Arme, Heros } from "./heros"

// --- Types : à écrire ---

export type Objet =
    | { type: "potion"; soin: number }
    | { type: "arme"; arme: Arme }
    | { type: "tresor"; nom: string; valeur: number }

// --- Fonctions : décommenter, puis écrire le corps ---

export function decrireObjet(objet: Objet): string {
    switch (objet.type) {
        case "potion":
            return `Potion (+${objet.soin} PV)`;

        case "arme":
            return `${objet.arme.nom} (+${objet.arme.bonus} attaque)`;

        case "tresor":
            return `${objet.nom} (${objet.valeur} or)`;

        default:
            const impossible: never = objet;
            return impossible;
    }
}

export function compterPotions(sac: readonly Objet[]): number {
    return sac.filter(objet => objet.type === "potion").length;
}

export function valeurDuSac(sac: readonly Objet[]): number {
    return sac.reduce((total, objet) => {
        if (objet.type === "tresor") {
            return total + objet.valeur;
        } else {
            return total;
        }
    }, 0);
}

export function ramasser(heros: Heros, objet: Objet): Heros {
    const nouveauSac = [...heros.sac, objet];
    if (
        objet.type === "arme" &&
        objet.arme.bonus > (heros.arme?.bonus ?? 0)
    ) {
        return {
            ...heros,
            sac: nouveauSac,
            arme: objet.arme
        };
    }
    return {
        ...heros,
        sac: nouveauSac
    };
}

export function boirePotion(heros: Heros): Heros {
    const indexPotion = heros.sac
        .findIndex(objet => objet.type === "potion");
    if (indexPotion === -1) {
        return heros;
    }

    const potion = heros.sac[indexPotion];
    if (potion.type !== "potion") {
        return heros;
    }

    const nouveauHeros = soigner(heros, potion.soin);
    const nouveauSac = heros.sac
        .filter((_, index) => index !== indexPotion);
    return {
        ...nouveauHeros,
        sac: nouveauSac
    };
}
