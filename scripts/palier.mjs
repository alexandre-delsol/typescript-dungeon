// Vérifie un palier du TP : d'abord le compilateur (tsc), ensuite les tests (Vitest).
//   npm run palier 3   → vérifie le palier 3
//   npm run bilan      → vérifie tous les paliers et affiche un tableau
import { spawnSync } from "node:child_process"
import { existsSync, writeFileSync } from "node:fs"

const PALIERS = [
  { numero: 0, titre: "Démarrage", ecran: [] },
  { numero: 1, titre: "Le héros", ecran: [] },
  {
    numero: 2,
    titre: "La carte du héros",
    ecran: [
      "La carte affiche le nom, la classe, les PV, le mana et l'arme du héros",
      "Changer les PV du héros dans main.ts change la longueur et la couleur de la barre",
    ],
  },
  { numero: 3, titre: "Le bestiaire", ecran: [] },
  { numero: 4, titre: "Les dégâts", ecran: [] },
  {
    numero: 5,
    titre: "Premier combat à l'écran",
    ecran: [
      "Un monstre tiré au hasard s'affiche à côté du héros, avec sa barre de vie",
      "Le bouton « Attaquer » fait baisser les PV du monstre, puis le monstre riposte",
      "Quand l'un des deux tombe à 0 PV, un message l'annonce et le bouton est désactivé",
    ],
  },
  { numero: 6, titre: "Le sac et les objets", ecran: [] },
  { numero: 7, titre: "Les actions", ecran: [] },
  { numero: 8, titre: "Le journal", ecran: [] },
  {
    numero: 9,
    titre: "Le combat complet à l'écran",
    ecran: [
      "Cinq boutons : Attaquer, Boule de feu, Soin, Potion, Fuir",
      "Un seul écouteur de clic pour les cinq boutons (délégation)",
      "Le journal affiche les derniers messages du combat",
      "Le nombre de potions et le mana se mettent à jour après chaque action",
    ],
  },
  { numero: 10, titre: "Le donjon", ecran: [] },
  { numero: 11, titre: "La partie", ecran: [] },
  {
    numero: 12,
    titre: "Le jeu complet à l'écran",
    ecran: [
      "L'accueil demande un nom et une classe, et refuse un nom vide",
      "On avance de salle en salle : salle vide, coffre ou monstre",
      "Battre le dragon affiche l'écran de victoire avec le score",
      "Mourir affiche l'écran de défaite ; « Rejouer » ramène à l'accueil",
    ],
  },
  { numero: 13, titre: "Bonus : générique", ecran: [] },
  { numero: 14, titre: "Bonus : scores", ecran: [] },
]

const CONSEILS = [
  {
    code: "TS2307",
    texte:
      "Fichier attendu absent de src/ : voir la première consigne du palier (nom exact du fichier).",
  },
  {
    code: "TS2305",
    texte: "Type ou fonction du palier pas encore écrit (ou encore en commentaire) dans src/. Vérifier aussi l'orthographe et le mot-clé export.",
  },
  {
    code: "TS2459",
    texte: "Nom présent dans le fichier mais non exporté : ajouter export.",
  },
  {
    code: "TS2578",
    texte:
      "Une ligne marquée @ts-expect-error devrait être refusée par le compilateur et ne l'est pas : un type est trop large (string au lieu d'une union, readonly oublié, champ obligatoire manquant). Voir le commentaire sur la ligne.",
  },
  {
    code: "TS1484",
    texte: "Un type s'importe avec import type { … }.",
  },
  { code: "TS7006", texte: "Paramètre sans type." },
  { code: "TS6133", texte: "Variable ou import inutile : à supprimer." },
]

const CODES_BLOQUANTS = ["TS2307", "TS2305", "TS2459"]

const deuxChiffres = (numero) => String(numero).padStart(2, "0")
const fichierDeTest = (numero) => `tests/palier-${deuxChiffres(numero)}.test.ts`
const aDesTests = (numero) => existsSync(fichierDeTest(numero))

function lancer(commande, silencieux) {
  const resultat = spawnSync(commande, { shell: true, encoding: "utf8", stdio: silencieux ? "pipe" : "inherit" })
  return { ok: resultat.status === 0, sortie: `${resultat.stdout ?? ""}${resultat.stderr ?? ""}` }
}

function compiler(numero) {
  const fichiers = aDesTests(numero) ? ["src", fichierDeTest(numero)] : ["src"]
  writeFileSync("tsconfig.palier.json", JSON.stringify({ extends: "./tsconfig.json", include: fichiers }, null, 2))
  return lancer("npx tsc --noEmit --pretty -p tsconfig.palier.json", true)
}

function tester(numero, silencieux) {
  return lancer(`npx vitest run ${fichierDeTest(numero)}${silencieux ? " --reporter=dot" : ""}`, silencieux)
}

// Tant qu'un fichier ou un export manque, les autres erreurs n'en sont que la conséquence : on ne donne que ce conseil-là.
function conseilsPour(sortie) {
  const utiles = CONSEILS.filter((conseil) => sortie.includes(conseil.code))
  const bloquant = utiles.find((conseil) => CODES_BLOQUANTS.includes(conseil.code))
  return bloquant === undefined ? utiles : [bloquant]
}

function verifierUnPalier(palier) {
  console.log(`\n━━ Palier ${palier.numero} — ${palier.titre} ━━\n`)

  console.log("1. Le compilateur (tsc)")
  const compilation = compiler(palier.numero)
  if (!compilation.ok) {
    console.log(compilation.sortie)
    conseilsPour(compilation.sortie).forEach((conseil) => console.log(`   → ${conseil.texte}`))
    console.log("\nÉCHEC : erreurs de compilation à corriger.\n")
    return false
  }
  console.log("   OK, aucune erreur de type\n")

  if (aDesTests(palier.numero)) {
    console.log("2. Les tests")
    if (!tester(palier.numero, false).ok) {
      console.log("\nÉCHEC : un test ne passe pas. Son nom donne la règle attendue.\n")
      return false
    }
  }

  if (palier.ecran.length > 0) {
    console.log("À vérifier à l'écran (npm run dev) :")
    palier.ecran.forEach((point) => console.log(`   [ ] ${point}`))
    console.log("")
  }

  console.log(`Palier ${palier.numero} validé.\n`)
  return true
}

function etatDuPalier(palier) {
  if (!compiler(palier.numero).ok) return "À FAIRE (erreur de compilation)"
  if (aDesTests(palier.numero) && !tester(palier.numero, true).ok) return "À FAIRE (un test ne passe pas)"
  return palier.ecran.length > 0 ? "OK (+ écran à vérifier)" : "OK"
}

function bilan() {
  console.log("\n━━ Bilan des paliers ━━\n")
  PALIERS.forEach((palier) => {
    console.log(`Palier ${String(palier.numero).padStart(2, " ")}  ${palier.titre.padEnd(32, " ")} ${etatDuPalier(palier)}`)
  })
  console.log("")
}

function aide() {
  console.log("\nUsage : npm run palier <numéro>     ou     npm run bilan\n")
  PALIERS.forEach((palier) => console.log(`  ${String(palier.numero).padStart(2, " ")}  ${palier.titre}`))
  console.log("")
}

const argument = process.argv[2]
const palier = PALIERS.find((candidat) => String(candidat.numero) === argument)

if (argument === "bilan") {
  bilan()
} else if (palier === undefined) {
  aide()
  process.exitCode = 1
} else {
  process.exitCode = verifierUnPalier(palier) ? 0 : 1
}
