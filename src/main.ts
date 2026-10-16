
import $ from "jquery";
import "./style.css";

import { couleurBarre, pourcentage } from "./affichage";
import { lancerDe } from "./de";
import type { Heros } from "./heros";
import type { Monstre } from "./monstres";
import { lireAction } from "./actions";
import { Journal } from "./journal";
import { compterPotions } from "./objets";
import {
    avancer,
    combattre,
    commencer,
    nouvellePartie,
    score,
} from "./partie";
import type { Etape, Partie } from "./partie";
import { lireClasse, lireNom } from "./saisie";

// --- État du jeu ---

let partie: Partie = nouvellePartie();
const journal = new Journal(6);

// --- Affichage du héros ---

function afficherHeros(heros: Heros): void {
    const pvPourcentage = pourcentage(heros.pv, heros.pvMax);

    $("#heros-nom").text(heros.nom);
    $("#heros-classe").text(heros.classe);

    $("#heros-pv").text(`${heros.pv}/${heros.pvMax}`);
    $("#heros-pv-barre")
        .css("width", `${pvPourcentage}%`)
        .removeClass("bg-red-500 bg-yellow-500 bg-green-500")
        .addClass(couleurBarre(pvPourcentage));

    $("#heros-mana").text(`${heros.mana}/${heros.manaMax}`);
    $("#heros-mana-barre").css(
        "width",
        `${pourcentage(heros.mana, heros.manaMax)}%`,
    );
    $("#heros-attaque").text(heros.attaque);
    $("#heros-arme").text(heros.arme?.nom ?? "Aucune");
    $("#heros-potions").text(compterPotions(heros.sac));
}

// --- Affichage du monstre ---

function afficherMonstre(monstre: Monstre): void {
    const pvPourcentage = pourcentage(monstre.pv, monstre.pvMax);

    $("#monstre-nom").text(monstre.nom);

    $("#monstre-pv").text(`${monstre.pv}/${monstre.pvMax}`);
    $("#monstre-pv-barre")
        .css("width", `${pvPourcentage}%`)
        .removeClass("bg-red-500 bg-yellow-500 bg-green-500")
        .addClass(couleurBarre(pvPourcentage));

    $("#monstre-attaque").text(monstre.attaque);
    $("#monstre-defense").text(monstre.defense);
}

function secouer(selecteur: string): void {
    const element = $(selecteur);

    // Relance l'animation même si elle vient de se terminer.
    element.removeClass("shake");

    const node = element.get(0);
    if (node) {
        void node.offsetWidth;
    }

    element.addClass("shake");

    window.setTimeout(() => {
        element.removeClass("shake");
    }, 450);
}

// --- Affichage du journal ---

function afficherJournal(): void {
    $("#journal").empty();

    journal.lire().forEach((message) => {
        $("<li>")
            .text(message)
            .appendTo("#journal");
    });
}

// --- Application d'une étape ---

function appliquer(etape: Etape): void {
    partie = etape.partie;
    journal.ajouterTous(etape.messages);
    afficher();
}

// --- Affichage selon l'état de la partie ---

function verifierEtatInconnu(etat: never): never {
    throw new Error(`État inconnu : ${etat}`);
}

function afficher(): void {
    switch (partie.etat) {
        case "accueil":
            $("#ecran-accueil").removeClass("hidden");
            $("#ecran-partie").addClass("hidden");
            $("#ecran-fin").addClass("hidden");
            break;

        case "exploration":
            $("#ecran-accueil").addClass("hidden");
            $("#ecran-partie").removeClass("hidden");
            $("#ecran-fin").addClass("hidden");
            $("#avancer").removeClass("hidden");

            afficherHeros(partie.heros);
            afficherJournal();

            $("#progression").text(
                `Salle ${partie.position + 1} sur ${partie.donjon.length}`,
            );

            $("#avancer").removeClass("hidden");
            $("#actions").addClass("hidden");
            $("#monstre").addClass("hidden");
            break;

        case "combat":
            $("#ecran-accueil").addClass("hidden");
            $("#avancer").addClass("hidden");
            $("#ecran-partie").removeClass("hidden");
            $("#ecran-fin").addClass("hidden");

            afficherHeros(partie.heros);
            afficherMonstre(partie.monstre);
            afficherJournal();

            $("#avancer").addClass("hidden");
            $("#actions").removeClass("hidden");
            $("#monstre").removeClass("hidden");
            break;

        case "victoire":
            $("#ecran-accueil").addClass("hidden");
            $("#ecran-partie").addClass("hidden");
            $("#ecran-fin").removeClass("hidden");

            $("#resultat").text(
                `${partie.heros.nom} : vous avez gagné avec un score de ${score(partie.heros)}.`,
            );
            break;

        case "defaite":
            $("#ecran-accueil").addClass("hidden");
            $("#ecran-partie").addClass("hidden");
            $("#ecran-fin").removeClass("hidden");

            $("#resultat").text(
                `${partie.heros.nom} : vous avez perdu à la salle ${partie.position + 1}, avec un score de ${score(partie.heros)}.`,
            );
            break;

        default:
            return verifierEtatInconnu(partie);
    }
}

// --- Événements du formulaire ---

$("#formulaire").on("submit", (event) => {
    event.preventDefault();

    const nomSaisi = $("#nom").val();
    const classeSaisie = $("#classe").val();

    const nom = lireNom(nomSaisi);
    const classe = lireClasse(classeSaisie);

    if (nom === null || classe === null) {
        $("#erreur").text(
            "Vérifie le nom : il doit contenir entre 2 et 20 caractères, et sélectionne une classe valide.",
        );
        return;
    }

    $("#erreur").text("");
    journal.vider();

    partie = commencer(nom, classe, lancerDe);
    afficher();
});

// --- Événements des actions de combat ---


$("#actions").on("click", "[data-action]", function () {
    const action = lireAction($(this).attr("data-action"));

    if (action === null || partie.etat !== "combat") {
        return;
    }

    const pvHerosAvant = partie.heros.pv;
    const pvMonstreAvant = partie.monstre.pv;

    const etape = combattre(partie, action, lancerDe);

    const pvHerosApres =
        etape.partie.etat !== "accueil"
            ? etape.partie.heros.pv
            : null;

    const pvMonstreApres =
        etape.partie.etat === "combat"
            ? etape.partie.monstre.pv
            : null;

    appliquer(etape);

    if (
        pvHerosApres !== null &&
        pvHerosApres < pvHerosAvant
    ) {
        secouer("#heros");
    }

    if (
        pvMonstreApres !== null &&
        pvMonstreApres < pvMonstreAvant
    ) {
        secouer("#monstre");
    }
});


// --- Événement d'exploration ---

$("#avancer").on("click", () => {
    appliquer(avancer(partie));
});

// --- Recommencer une partie ---

$("#rejouer").on("click", () => {
    partie = nouvellePartie();
    journal.vider();
    $("#erreur").text("");
    afficher();
});

// --- Initialisation ---

afficher();
