import { describe, expect, it } from "vitest"
import { blesserHeros, blesserMonstre } from "../src/combat"
import type { Salle } from "../src/donjon"
import { creerHeros } from "../src/heros"
import { BESTIAIRE, BOSS, creerMonstre } from "../src/monstres"
import type { Objet } from "../src/objets"
import { TAILLE_DONJON, avancer, combattre, commencer, nouvellePartie, score } from "../src/partie"
import type { Partie } from "../src/partie"
import { deTruque } from "./outils"

const rubis: Objet = { type: "tresor", nom: "Rubis", valeur: 40 }
const gobelin = creerMonstre(BESTIAIRE[1])
const dragon = creerMonstre(BOSS)

// Un petit donjon écrit à la main : salle vide, coffre, gobelin, puis le dragon.
const donjon: readonly Salle[] = [
  { type: "vide" },
  { type: "coffre", objet: rubis },
  { type: "monstre", monstre: gobelin },
  { type: "boss", monstre: dragon },
]

const enExploration = (position: number): Partie => ({
  etat: "exploration",
  heros: creerHeros("Aria", "mage"),
  donjon,
  position,
})

function exigerExploration(partie: Partie) {
  if (partie.etat !== "exploration") throw new Error(`état attendu : exploration, état reçu : ${partie.etat}`)
  return partie
}

function exigerCombat(partie: Partie) {
  if (partie.etat !== "combat") throw new Error(`état attendu : combat, état reçu : ${partie.etat}`)
  return partie
}

describe("Palier 11 — démarrer une partie", () => {
  it("nouvellePartie rend l'écran d'accueil", () => {
    expect(nouvellePartie()).toEqual({ etat: "accueil" })
  })

  it("commencer crée le héros, génère le donjon et place le héros devant la première salle", () => {
    const partie = exigerExploration(commencer("Aria", "mage", deTruque(1)))
    expect(partie.heros.nom).toBe("Aria")
    expect(partie.heros.classe).toBe("mage")
    expect(partie.donjon).toHaveLength(TAILLE_DONJON)
    expect(partie.position).toBe(0)
  })
})

describe("Palier 11 — avancer : entrer dans la salle suivante", () => {
  it("salle vide : on passe à la salle suivante", () => {
    const etape = avancer(enExploration(0))
    const partie = exigerExploration(etape.partie)
    expect(partie.position).toBe(1)
    expect(etape.messages.length).toBeGreaterThanOrEqual(1)
  })

  it("salle vide : le héros se repose (+20 PV, +10 de mana)", () => {
    const fatigue = { ...blesserHeros(creerHeros("Aria", "mage"), 50), mana: 5 }
    const partie = exigerExploration(avancer({ etat: "exploration", heros: fatigue, donjon, position: 0 }).partie)
    expect(partie.heros.pv).toBe(50)
    expect(partie.heros.mana).toBe(15)
  })

  it("coffre : le héros ramasse l'objet, puis on passe à la salle suivante", () => {
    const partie = exigerExploration(avancer(enExploration(1)).partie)
    expect(partie.position).toBe(2)
    expect(partie.heros.sac).toHaveLength(3)
    expect(partie.heros.sac[2]).toEqual(rubis)
  })

  it("monstre : le combat commence, dans la même salle", () => {
    const partie = exigerCombat(avancer(enExploration(2)).partie)
    expect(partie.monstre.nom).toBe("Gobelin")
    expect(partie.position).toBe(2)
  })

  it("boss : le combat commence contre le dragon", () => {
    const partie = exigerCombat(avancer(enExploration(3)).partie)
    expect(partie.monstre.nom).toBe("Dragon")
  })

  it("avancer hors de l'exploration ne change rien et ne dit rien", () => {
    const accueil = nouvellePartie()
    expect(avancer(accueil)).toEqual({ partie: accueil, messages: [] })
  })
})

describe("Palier 11 — combattre : jouer un tour de combat", () => {
  const enCombat = (position: number): Partie => avancer(enExploration(position)).partie

  it("le combat continue tant que les deux sont vivants", () => {
    const etape = combattre(enCombat(2), { type: "attaquer" }, deTruque(1))
    const partie = exigerCombat(etape.partie)
    expect(partie.monstre.pv).toBe(18)
    expect(partie.heros.pv).toBe(76)
    expect(etape.messages.length).toBeGreaterThanOrEqual(2)
  })

  it("monstre vaincu : le héros gagne son butin en or et passe à la salle suivante", () => {
    const partie = exigerExploration(combattre(enCombat(2), { type: "sort", sort: "boule de feu" }, deTruque(1)).partie)
    expect(partie.position).toBe(3)
    expect(partie.heros.or).toBe(5)
  })

  it("boss vaincu : c'est la victoire", () => {
    const presqueMort: Partie = { ...exigerCombat(enCombat(3)), monstre: blesserMonstre(dragon, dragon.pvMax - 1) }
    const partie = combattre(presqueMort, { type: "attaquer" }, deTruque(1)).partie
    if (partie.etat !== "victoire") throw new Error(`état attendu : victoire, état reçu : ${partie.etat}`)
    expect(partie.heros.or).toBe(dragon.butin)
  })

  it("héros à 0 PV : c'est la défaite, et on retient la salle", () => {
    const combat = exigerCombat(enCombat(3))
    const mourant: Partie = { ...combat, heros: blesserHeros(combat.heros, 79) }
    const partie = combattre(mourant, { type: "attaquer" }, deTruque(1)).partie
    if (partie.etat !== "defaite") throw new Error(`état attendu : défaite, état reçu : ${partie.etat}`)
    expect(partie.heros.pv).toBe(0)
    expect(partie.position).toBe(3)
  })

  it("fuite réussie : retour en exploration, devant la même salle", () => {
    const partie = exigerExploration(combattre(enCombat(2), { type: "fuir" }, deTruque(6)).partie)
    expect(partie.position).toBe(2)
  })

  it("après une fuite, le monstre a retrouvé tous ses PV quand on revient", () => {
    const entame = exigerCombat(combattre(enCombat(2), { type: "attaquer" }, deTruque(1)).partie)
    expect(entame.monstre.pv).toBe(18)
    const enFuite = combattre(entame, { type: "fuir" }, deTruque(6)).partie
    const retour = exigerCombat(avancer(enFuite).partie)
    expect(retour.monstre.pv).toBe(25)
  })

  it("combattre hors d'un combat ne change rien et ne dit rien", () => {
    const exploration = enExploration(0)
    expect(combattre(exploration, { type: "attaquer" }, deTruque(1))).toEqual({ partie: exploration, messages: [] })
  })
})

describe("Palier 11 — le score", () => {
  it("score = or du héros + valeur des trésors du sac", () => {
    const partie = exigerExploration(avancer(enExploration(1)).partie)
    expect(score(partie.heros)).toBe(40)
    expect(score({ ...partie.heros, or: 12 })).toBe(52)
  })
})

describe("Palier 11 — les états impossibles ne compilent pas", () => {
  it("les types refusent ce qui n'a pas de sens", () => {
    // @ts-expect-error — à l'accueil, il n'y a pas encore de héros
    const accueilAvecHeros: Partie = { etat: "accueil", heros: creerHeros("Aria", "mage") }
    // @ts-expect-error — un combat sans monstre n'existe pas
    const combatSansMonstre: Partie = { etat: "combat", heros: creerHeros("Aria", "mage"), donjon, position: 0 }
    // @ts-expect-error — l'état « pause » n'existe pas
    const pause: Partie = { etat: "pause" }
    expect([accueilAvecHeros, combatSansMonstre, pause]).toHaveLength(3)
  })
})
