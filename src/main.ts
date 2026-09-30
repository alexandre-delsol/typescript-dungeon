import $ from "jquery"
import "./style.css"

// Point d'entrée : seul fichier qui utilise jQuery.
// Les règles du jeu sont dans les autres fichiers de src/.

// Imports : décommenter ceux du palier en cours (pas avant : les fonctions importées doivent exister).

// Palier 2
import { couleurBarre, pourcentage } from "./affichage"
import { attaqueTotale, creerHeros } from "./heros"
import type { Heros } from "./heros"

// Palier 5
import { blesserHeros, blesserMonstre, calculerDegats, estVivant } from "./combat"
import { lancerDe } from "./de"
import { monstreAuHasard } from "./monstres"
import type { Monstre } from "./monstres"

// Palier 9
// import { jouerTour, lireAction } from "./actions"
// import type { Combat } from "./actions"
// import { Journal } from "./journal"
// import { compterPotions } from "./objets"

// Palier 12
// import { avancer, combattre, commencer, nouvellePartie, score } from "./partie"
// import type { Etape, Partie } from "./partie"
// import { lireClasse, lireNom } from "./saisie"


// --- Palier 2 : la carte du héros ---
let heros = creerHeros("Alex", "mage");

function afficherHeros(heros: Heros): void {
    const pvPourcentage = pourcentage(heros.pv, heros.pvMax);

    $("#heros-nom").text(heros.nom);
    $("#heros-classe").text(heros.classe);

    $("#heros-pv").text(`${heros.pv}/${heros.pvMax}`);
    $("#heros-pv-barre")
        .css("width", `${pvPourcentage}%`)
        .addClass(couleurBarre(pvPourcentage));

    $("#heros-mana").text(`${heros.mana}/${heros.manaMax}`);
    $("#heros-attaque").text(heros.attaque);

    $("#heros-arme").text(heros.arme?.nom ?? "Aucune");
}

// heros = { ...creerHeros("Alex", "mage"), pv: 40 };
// heros = { ...creerHeros("Alex", "mage"), pv: 1 };


// --- Palier 5 : premier combat (ces deux variables remplacent le héros du palier 2) ---


let monstre = monstreAuHasard(1, lancerDe)

function afficherMonstre(monstre: Monstre): void {

    const pvPourcentage = pourcentage(monstre.pv, monstre.pvMax);

    $("#monstre-nom").text(monstre.nom);

    $("#monstre-pv").text(`${monstre.pv}/${monstre.pvMax}`);
    $("#monstre-pv-barre")
        .css("width", `${pvPourcentage}%`)
        .addClass(couleurBarre(pvPourcentage));

    $("#monstre-attaque").text(monstre.attaque);
    $("#monstre-defense").text(monstre.defense);
}

function afficher(): void {
    const combatFini = !estVivant(heros) || !estVivant(monstre);
    afficherHeros(heros);
    afficherMonstre(monstre);
    if (combatFini) {
        if (!estVivant(heros)) {
            $("#annonce").text("Vous avez perdu")
        } else if (!estVivant(monstre)) {
            $("#annonce").text("Vous avez gagné")
        }
    }
    $("#attaquer").prop("disabled", combatFini);
}
afficher();


$("#attaquer").on("click", () => {

    const degats = calculerDegats(
        attaqueTotale(heros),
        monstre.defense
    );

    if (estVivant(monstre)) monstre = blesserMonstre(monstre, degats);
    if (estVivant(monstre)) {
        const degatsMonstre = calculerDegats(
            monstre.attaque,
            heros.defense
        );

        heros = blesserHeros(heros, degatsMonstre);
    }

    afficher();
})

// --- Palier 9 : combat complet (remplace l'état et le clic du palier 5) ---

// let combat: Combat = { heros: creerHeros("Aria", "mage"), monstre: monstreAuHasard(2, lancerDe) }
// let termine = false
// const journal = new Journal(6)

// function afficherJournal(): void {
//
// }

// $("#actions").on("click", "[data-action]", function () {
//
// })

// --- Palier 12 : jeu complet (remplace l'état du palier 9) ---

// let partie: Partie = nouvellePartie()

// function appliquer(etape: Etape): void {
//
// }

// $("#formulaire").on("submit", (event) => {
//
// })

// $("#avancer").on("click", () => {
//
// })

// $("#rejouer").on("click", () => {
//
// })

// Dernière ligne du fichier, à partir du palier 5 :
// afficher()
