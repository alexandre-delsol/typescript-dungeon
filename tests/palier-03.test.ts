import { describe, expect, it } from "vitest"
import { lancerDe } from "../src/de"
import type { De } from "../src/de"
import { BESTIAIRE, BOSS, NIVEAUX, creerMonstre, modelesDeNiveau, monstreAuHasard, trouverModele } from "../src/monstres"
import type { Monstre, Niveau } from "../src/monstres"
import { deTruque } from "./outils"

describe("Palier 3 — Le bestiaire", () => {
  it("lancerDe(6) rend un entier entre 1 et 6", () => {
    const tirages = Array.from({ length: 300 }, () => lancerDe(6))
    expect(tirages.every((tirage) => Number.isInteger(tirage))).toBe(true)
    expect(Math.min(...tirages)).toBe(1)
    expect(Math.max(...tirages)).toBe(6)
  })

  it("lancerDe(1) rend toujours 1", () => {
    expect(lancerDe(1)).toBe(1)
  })

  it("il y a trois niveaux : 1, 2 et 3", () => {
    expect(NIVEAUX).toEqual([1, 2, 3])
  })

  it("le bestiaire contient les 8 monstres du sujet, et le dragon est à part", () => {
    expect(BESTIAIRE).toHaveLength(8)
    expect(BESTIAIRE.map((modele) => modele.nom)).not.toContain("Dragon")
    expect(BOSS.nom).toBe("Dragon")
    expect(BOSS.pvMax).toBe(100)
  })

  it("modelesDeNiveau(1) rend les 3 monstres de niveau 1, dans l'ordre du bestiaire", () => {
    expect(modelesDeNiveau(1).map((modele) => modele.nom)).toEqual(["Rat géant", "Gobelin", "Chauve-souris"])
  })

  it("modelesDeNiveau(3) rend les 2 monstres de niveau 3", () => {
    expect(modelesDeNiveau(3).map((modele) => modele.nom)).toEqual(["Troll", "Spectre"])
  })

  it("trouverModele trouve un monstre par son nom", () => {
    expect(trouverModele("Gobelin")?.pvMax).toBe(25)
  })

  it("trouverModele rend undefined quand le monstre n'existe pas", () => {
    expect(trouverModele("Licorne")).toBeUndefined()
  })

  it("creerMonstre donne au monstre tous ses PV, et garde le reste du modèle", () => {
    const gobelin: Monstre = creerMonstre(BESTIAIRE[1])
    expect(gobelin.nom).toBe("Gobelin")
    expect(gobelin.pv).toBe(25)
    expect(gobelin.pvMax).toBe(25)
    expect(gobelin.attaque).toBe(7)
    expect(gobelin.defense).toBe(1)
    expect(gobelin.butin).toBe(5)
  })

  it("monstreAuHasard lance un dé qui a autant de faces que de monstres du niveau", () => {
    const facesDemandees: number[] = []
    const deEspion: De = (faces) => {
      facesDemandees.push(faces)
      return 1
    }
    monstreAuHasard(1, deEspion)
    expect(facesDemandees).toEqual([3])
  })

  it("monstreAuHasard : le dé donne 1 → premier monstre du niveau, le dé donne 3 → troisième", () => {
    expect(monstreAuHasard(1, deTruque(1)).nom).toBe("Rat géant")
    expect(monstreAuHasard(1, deTruque(3)).nom).toBe("Chauve-souris")
    expect(monstreAuHasard(2, deTruque(2)).nom).toBe("Loup-garou")
  })

  it("monstreAuHasard rend un monstre prêt à combattre (PV au maximum)", () => {
    const monstre = monstreAuHasard(2, deTruque(1))
    expect(monstre.pv).toBe(monstre.pvMax)
  })

  it("les types refusent ce qui n'a pas de sens", () => {
    const niveau: Niveau = 2
    expect(niveau).toBe(2)

    // @ts-expect-error — le niveau 4 n'existe pas : Niveau doit être dérivé de NIVEAUX (as const)
    modelesDeNiveau(4)

    const gobelin = creerMonstre(BESTIAIRE[1])
    // @ts-expect-error — le nom d'un monstre ne change jamais : le champ doit être readonly
    gobelin.nom = "Autre"
  })
})
