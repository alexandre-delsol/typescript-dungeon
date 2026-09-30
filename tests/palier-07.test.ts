import { describe, expect, it } from "vitest"
import { agir, jouerTour, lireAction } from "../src/actions"
import type { Action, Combat } from "../src/actions"
import { blesserHeros } from "../src/combat"
import type { De } from "../src/de"
import { creerHeros } from "../src/heros"
import { BESTIAIRE, creerMonstre } from "../src/monstres"
import { boirePotion, compterPotions } from "../src/objets"
import { deTruque } from "./outils"

// Aria la mage (80 PV, 80 mana, 8 d'attaque, 3 de défense) contre un Gobelin (25 PV, 7 d'attaque, 1 de défense).
const face = (): Combat => ({ heros: creerHeros("Aria", "mage"), monstre: creerMonstre(BESTIAIRE[1]) })

describe("Palier 7 — agir : le héros joue son action", () => {
  it("attaquer : le monstre perd attaque − défense, soit 7 PV", () => {
    const tour = agir(face(), { type: "attaquer" }, deTruque(1))
    expect(tour.monstre.pv).toBe(18)
    expect(tour.heros.pv).toBe(80)
    expect(tour.fuite).toBe(false)
    expect(tour.messages.length).toBeGreaterThanOrEqual(1)
  })

  it("attaquer : on lance un dé à 6 faces, et un 6 est un coup critique (dégâts doublés)", () => {
    const facesDemandees: number[] = []
    const deEspion: De = (faces) => {
      facesDemandees.push(faces)
      return 6
    }
    const tour = agir(face(), { type: "attaquer" }, deEspion)
    expect(facesDemandees).toEqual([6])
    expect(tour.monstre.pv).toBe(11)
  })

  it("attaquer : un 5 n'est pas un coup critique", () => {
    expect(agir(face(), { type: "attaquer" }, deTruque(5)).monstre.pv).toBe(18)
  })

  it("boule de feu : coûte 10 de mana et retire 25 PV, sans tenir compte de la défense", () => {
    const tour = agir(face(), { type: "sort", sort: "boule de feu" }, deTruque(1))
    expect(tour.monstre.pv).toBe(0)
    expect(tour.heros.mana).toBe(70)
  })

  it("boule de feu sans assez de mana : rien ne change, un message l'explique", () => {
    const guerrier = creerHeros("Bjorn", "guerrier")
    const apresUnSort = agir({ heros: guerrier, monstre: creerMonstre(BESTIAIRE[6]) }, { type: "sort", sort: "boule de feu" }, deTruque(1))
    expect(apresUnSort.heros.mana).toBe(0)
    expect(apresUnSort.monstre.pv).toBe(45)

    const sansMana = agir(apresUnSort, { type: "sort", sort: "boule de feu" }, deTruque(1))
    expect(sansMana.heros.mana).toBe(0)
    expect(sansMana.monstre.pv).toBe(45)
    expect(sansMana.messages.length).toBeGreaterThanOrEqual(1)
  })

  it("soin : coûte 8 de mana et rend 30 PV, sans dépasser le maximum", () => {
    const combat = face()
    const blesse = { ...combat, heros: blesserHeros(combat.heros, 40) }
    const tour = agir(blesse, { type: "sort", sort: "soin" }, deTruque(1))
    expect(tour.heros.pv).toBe(70)
    expect(tour.heros.mana).toBe(72)

    const presqueIntact = { ...combat, heros: blesserHeros(combat.heros, 5) }
    expect(agir(presqueIntact, { type: "sort", sort: "soin" }, deTruque(1)).heros.pv).toBe(80)
  })

  it("potion : le héros boit une potion de son sac", () => {
    const combat = face()
    const blesse = { ...combat, heros: blesserHeros(combat.heros, 50) }
    const tour = agir(blesse, { type: "potion" }, deTruque(1))
    expect(tour.heros.pv).toBe(60)
    expect(compterPotions(tour.heros.sac)).toBe(1)
  })

  it("potion sans potion : rien ne change, un message l'explique", () => {
    const combat = face()
    const sansPotion = { ...combat, heros: boirePotion(boirePotion(blesserHeros(combat.heros, 79))) }
    const tour = agir(sansPotion, { type: "potion" }, deTruque(1))
    expect(tour.heros.pv).toBe(sansPotion.heros.pv)
    expect(tour.messages.length).toBeGreaterThanOrEqual(1)
  })

  it("fuir : réussit sur 4, 5 ou 6", () => {
    expect(agir(face(), { type: "fuir" }, deTruque(4)).fuite).toBe(true)
    expect(agir(face(), { type: "fuir" }, deTruque(6)).fuite).toBe(true)
  })

  it("fuir : échoue sur 1, 2 ou 3", () => {
    expect(agir(face(), { type: "fuir" }, deTruque(3)).fuite).toBe(false)
    expect(agir(face(), { type: "fuir" }, deTruque(1)).fuite).toBe(false)
  })

  it("agir ne modifie jamais le combat reçu", () => {
    const combat = face()
    agir(combat, { type: "attaquer" }, deTruque(6))
    agir(combat, { type: "sort", sort: "boule de feu" }, deTruque(1))
    expect(combat.monstre.pv).toBe(25)
    expect(combat.heros.mana).toBe(80)
  })
})

describe("Palier 7 — jouerTour : l'action du héros, puis la riposte du monstre", () => {
  it("après l'attaque du héros, le monstre vivant riposte : 7 − 3 = 4 PV en moins", () => {
    const tour = jouerTour(face(), { type: "attaquer" }, deTruque(1))
    expect(tour.monstre.pv).toBe(18)
    expect(tour.heros.pv).toBe(76)
    expect(tour.messages.length).toBeGreaterThanOrEqual(2)
  })

  it("un monstre mort ne riposte pas", () => {
    const tour = jouerTour(face(), { type: "sort", sort: "boule de feu" }, deTruque(1))
    expect(tour.monstre.pv).toBe(0)
    expect(tour.heros.pv).toBe(80)
  })

  it("une fuite réussie évite la riposte", () => {
    const tour = jouerTour(face(), { type: "fuir" }, deTruque(6))
    expect(tour.fuite).toBe(true)
    expect(tour.heros.pv).toBe(80)
  })

  it("une fuite ratée coûte une riposte", () => {
    const tour = jouerTour(face(), { type: "fuir" }, deTruque(1))
    expect(tour.fuite).toBe(false)
    expect(tour.heros.pv).toBe(76)
  })
})

describe("Palier 7 — lireAction : du texte d'un bouton à une Action", () => {
  it("reconnaît les cinq textes prévus", () => {
    expect(lireAction("attaquer")).toEqual({ type: "attaquer" })
    expect(lireAction("boule de feu")).toEqual({ type: "sort", sort: "boule de feu" })
    expect(lireAction("soin")).toEqual({ type: "sort", sort: "soin" })
    expect(lireAction("potion")).toEqual({ type: "potion" })
    expect(lireAction("fuir")).toEqual({ type: "fuir" })
  })

  it("rend null pour tout le reste", () => {
    expect(lireAction("danser")).toBeNull()
    expect(lireAction("")).toBeNull()
    expect(lireAction(undefined)).toBeNull()
  })

  it("les types refusent ce qui n'a pas de sens", () => {
    // @ts-expect-error — lancer un sort sans dire lequel n'a pas de sens
    const sortSansNom: Action = { type: "sort" }
    // @ts-expect-error — le sort « éclair » n'existe pas
    const sortInconnu: Action = { type: "sort", sort: "éclair" }
    // @ts-expect-error — l'action « danser » n'existe pas
    const danse: Action = { type: "danser" }
    expect([sortSansNom, sortInconnu, danse]).toHaveLength(3)
  })
})
