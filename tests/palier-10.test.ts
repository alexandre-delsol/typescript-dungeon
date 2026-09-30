import { describe, expect, it } from "vitest"
import { COFFRES, decrireSalle, genererDonjon, genererSalle, niveauDeLaSalle, objetAuHasard } from "../src/donjon"
import type { Salle } from "../src/donjon"
import type { Niveau } from "../src/monstres"
import { deTruque } from "./outils"

describe("Palier 10 — Le donjon", () => {
  it("niveauDeLaSalle : salles 1 à 3 → niveau 1, salles 4 à 6 → niveau 2, ensuite → niveau 3", () => {
    expect(niveauDeLaSalle(1)).toBe(1)
    expect(niveauDeLaSalle(3)).toBe(1)
    expect(niveauDeLaSalle(4)).toBe(2)
    expect(niveauDeLaSalle(6)).toBe(2)
    expect(niveauDeLaSalle(7)).toBe(3)
    expect(niveauDeLaSalle(20)).toBe(3)
  })

  it("les coffres peuvent contenir les 8 objets du sujet", () => {
    expect(COFFRES).toHaveLength(8)
  })

  it("objetAuHasard lance un dé qui a autant de faces que d'objets possibles", () => {
    expect(objetAuHasard(deTruque(1))).toEqual(COFFRES[0])
    expect(objetAuHasard(deTruque(99))).toEqual(COFFRES[7])
  })

  it("genererSalle : le dé donne 1 → salle vide", () => {
    expect(genererSalle(1, deTruque(1))).toEqual({ type: "vide" })
  })

  it("genererSalle : le dé donne 2 → coffre, avec un objet tiré au hasard", () => {
    expect(genererSalle(1, deTruque(2))).toEqual({ type: "coffre", objet: COFFRES[1] })
  })

  it("genererSalle : le dé donne 3 ou plus → monstre, du niveau de la salle", () => {
    const salle = genererSalle(5, deTruque(3))
    if (salle.type !== "monstre") throw new Error(`salle attendue : monstre, salle reçue : ${salle.type}`)
    expect(salle.monstre.niveau).toBe(2)
    expect(salle.monstre.nom).toBe("Araignée géante")
    expect(salle.monstre.pv).toBe(salle.monstre.pvMax)
  })

  it("genererDonjon rend le nombre de salles demandé", () => {
    expect(genererDonjon(8, deTruque(1))).toHaveLength(8)
    expect(genererDonjon(3, deTruque(1))).toHaveLength(3)
  })

  it("la dernière salle est toujours le boss : le Dragon, avec tous ses PV", () => {
    const donjon = genererDonjon(8, deTruque(1))
    const derniere = donjon[7]
    if (derniere.type !== "boss") throw new Error(`salle attendue : boss, salle reçue : ${derniere.type}`)
    expect(derniere.monstre.nom).toBe("Dragon")
    expect(derniere.monstre.pv).toBe(derniere.monstre.pvMax)
  })

  it("les autres salles sont tirées au dé : ici, toutes vides", () => {
    const donjon = genererDonjon(8, deTruque(1))
    expect(donjon.slice(0, 7).every((salle) => salle.type === "vide")).toBe(true)
  })

  it("les monstres montent en niveau au fil des salles", () => {
    const donjon = genererDonjon(8, deTruque(6))
    const niveaux = donjon.slice(0, 7).map((salle) => (salle.type === "monstre" ? salle.monstre.niveau : 0))
    expect(niveaux).toEqual([1, 1, 1, 2, 2, 2, 3])
  })

  it("un donjon d'une seule salle ne contient que le boss", () => {
    const donjon = genererDonjon(1, deTruque(6))
    expect(donjon).toHaveLength(1)
    expect(donjon[0].type).toBe("boss")
  })

  it("decrireSalle rend une phrase pour chaque type de salle", () => {
    const donjon = genererDonjon(2, deTruque(6))
    const salles: Salle[] = [{ type: "vide" }, { type: "coffre", objet: COFFRES[0] }, ...donjon]
    salles.forEach((salle) => expect(decrireSalle(salle).length).toBeGreaterThan(0))
    expect(decrireSalle(donjon[1])).toContain("Dragon")
  })

  it("les types refusent ce qui n'a pas de sens", () => {
    const niveau: Niveau = niveauDeLaSalle(2)
    expect(niveau).toBe(1)

    // @ts-expect-error — un coffre sans objet n'existe pas
    const coffreVide: Salle = { type: "coffre" }
    // @ts-expect-error — une salle vide ne contient pas de monstre
    const videHabitee: Salle = { type: "vide", monstre: genererDonjon(1, deTruque(1))[0] }
    expect([coffreVide, videHabitee]).toHaveLength(2)
  })
})
