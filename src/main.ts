import $ from "jquery"
import "./style.css"

// Palier 2
import { couleurBarre, pourcentage } from "./affichage"
import { creerHeros } from "./heros"
import type { Heros } from "./heros"

// Palier 5
import { lancerDe } from "./de"
import { monstreAuHasard } from "./monstres"
import type { Monstre } from "./monstres"

// Palier 9
import { jouerTour, lireAction } from "./actions"
import type { Combat } from "./actions"
import { Journal } from "./journal"
import { compterPotions } from "./objets"
import { estVivant } from "./combat"

// Palier 12 
// 
// import { avancer, combattre, commencer, nouvellePartie, score } from "./partie" 
// 
// import type { Etape, Partie } from "./partie" 
// 
// import { lireClasse, lireNom } from "./saisie"

// --- Affichage du héros ---

function afficherHeros(heros: Heros): void {
    const pvPourcentage = pourcentage(heros.pv, heros.pvMax)

    $("#heros-nom").text(heros.nom)
    $("#heros-classe").text(heros.classe)

    $("#heros-pv").text(`${heros.pv}/${heros.pvMax}`)
    $("#heros-pv-barre")
        .css("width", `${pvPourcentage}%`)
        .addClass(couleurBarre(pvPourcentage))

    $("#heros-mana").text(`${heros.mana}/${heros.manaMax}`)
    $("#heros-attaque").text(heros.attaque)
    $("#heros-arme").text(heros.arme?.nom ?? "Aucune")
}

// --- Affichage du monstre ---

function afficherMonstre(monstre: Monstre): void {
    const pvPourcentage = pourcentage(monstre.pv, monstre.pvMax)

    $("#monstre-nom").text(monstre.nom)

    $("#monstre-pv").text(`${monstre.pv}/${monstre.pvMax}`)
    $("#monstre-pv-barre")
        .css("width", `${pvPourcentage}%`)
        .addClass(couleurBarre(pvPourcentage))

    $("#monstre-attaque").text(monstre.attaque)
    $("#monstre-defense").text(monstre.defense)
}

// --- Palier 9 : combat complet ---

let combat: Combat = {
    heros: creerHeros("Aria", "mage"),
    monstre: monstreAuHasard(2, lancerDe)
}

let termine = false
const journal = new Journal(6)


function afficherJournal(): void {
    $("#journal").empty()

    journal.lire().forEach((message) => {
        $("<li>")
            .text(message)
            .appendTo("#journal")
    })
}




function afficher(): void {
    afficherHeros(combat.heros)
    afficherMonstre(combat.monstre)

    $("#heros-potions").text(
        compterPotions(combat.heros.sac)
    )

    afficherJournal()

    $("[data-action]").prop("disabled", termine)

}



$("#actions").on("click", "[data-action]", function () {
    const action = lireAction($(this).attr("data-action"))

    if (action === null) return


    const tour = jouerTour(combat, action, lancerDe)

    combat = {
        heros: tour.heros,
        monstre: tour.monstre
    }

    if (tour.fuite || !estVivant(combat.heros) || !estVivant(combat.monstre)) {
        termine = true
    }


    journal.ajouterTous(tour.messages)

    afficher()
})




// let partie: Partie = nouvellePartie()
// --- Palier 12 : jeu complet (remplace l'état du palier 9) --- 
// 
// let partie: Partie = nouvellePartie() 
// 
// function appliquer(etape: Etape): void { // // } 
// 
// $("#formulaire").on("submit", (event) => { // // }) 
// 
// $("#avancer").on("click", () => { // // }) 
// 
// $("#rejouer").on("click", () => { // // }) 
// 
// Dernière ligne du fichier, à partir du palier 5 : 
afficher()