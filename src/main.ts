import $ from "jquery"
import "./style.css"

// Point d'entrée : seul fichier qui utilise jQuery.
// Les règles du jeu sont dans les autres fichiers de src/.

// Imports : décommenter ceux du palier en cours (pas avant : les fonctions importées doivent exister).

// Palier 2
// import { couleurBarre, pourcentage } from "./affichage"
// import { attaqueTotale, creerHeros } from "./heros"
// import type { Heros } from "./heros"

// Palier 5
// import { blesserHeros, blesserMonstre, calculerDegats, estVivant } from "./combat"
// import { lancerDe } from "./de"
// import { monstreAuHasard } from "./monstres"
// import type { Monstre } from "./monstres"

// Palier 9
// import { jouerTour, lireAction } from "./actions"
// import type { Combat } from "./actions"
// import { Journal } from "./journal"
// import { compterPotions } from "./objets"

// Palier 12
// import { avancer, combattre, commencer, nouvellePartie, score } from "./partie"
// import type { Etape, Partie } from "./partie"
// import { lireClasse, lireNom } from "./saisie"

// Palier 0 : à supprimer au palier 2
$("#message").text(`Le poste est prêt : jQuery ${$.fn.jquery} répond, Tailwind met en forme.`)

// --- Palier 2 : la carte du héros ---

// function afficherHeros(heros: Heros): void {
//
// }

// --- Palier 5 : premier combat (ces deux variables remplacent le héros du palier 2) ---

// let heros = creerHeros("Aria", "mage")
// let monstre = monstreAuHasard(1, lancerDe)

// function afficherMonstre(monstre: Monstre): void {
//
// }

// function afficher(): void {
//
// }

// $("#attaquer").on("click", () => {
//
// })

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
