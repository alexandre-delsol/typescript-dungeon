import { describe, expect, it } from "vitest"
import { blesserHeros, blesserMonstre, calculerDegats, estVivant, reposer, soigner } from "../src/combat"
import { creerHeros } from "../src/heros"
import { BESTIAIRE, creerMonstre } from "../src/monstres"

describe("Palier 4 — Les dégâts", () => {
  it("calculerDegats = attaque − défense", () => {
    expect(calculerDegats(14, 6)).toBe(8)
  })

  it("calculerDegats inflige toujours au moins 1 dégât", () => {
    expect(calculerDegats(3, 10)).toBe(1)
    expect(calculerDegats(5, 5)).toBe(1)
  })

  it("un coup critique double les dégâts", () => {
    expect(calculerDegats(14, 6, true)).toBe(16)
    expect(calculerDegats(3, 10, true)).toBe(2)
  })

  it("critique à false revient à ne rien passer", () => {
    expect(calculerDegats(14, 6, false)).toBe(8)
  })

  it("blesserHeros retire des PV sans toucher au reste", () => {
    const mage = creerHeros("Aria", "mage")
    const blesse = blesserHeros(mage, 25)
    expect(blesse.pv).toBe(55)
    expect(blesse.nom).toBe("Aria")
    expect(blesse.mana).toBe(80)
  })

  it("blesserHeros rend un NOUVEAU héros : l'ancien garde ses PV", () => {
    const mage = creerHeros("Aria", "mage")
    const blesse = blesserHeros(mage, 25)
    expect(mage.pv).toBe(80)
    expect(blesse).not.toBe(mage)
  })

  it("les PV du héros ne descendent jamais sous 0", () => {
    expect(blesserHeros(creerHeros("Aria", "mage"), 500).pv).toBe(0)
  })

  it("blesserMonstre suit les mêmes règles", () => {
    const gobelin = creerMonstre(BESTIAIRE[1])
    const blesse = blesserMonstre(gobelin, 10)
    expect(blesse.pv).toBe(15)
    expect(blesse.nom).toBe("Gobelin")
    expect(gobelin.pv).toBe(25)
    expect(blesserMonstre(gobelin, 500).pv).toBe(0)
  })

  it("soigner rend des PV sans dépasser le maximum", () => {
    const blesse = blesserHeros(creerHeros("Aria", "mage"), 50)
    expect(soigner(blesse, 30).pv).toBe(60)
    expect(soigner(blesse, 500).pv).toBe(80)
    expect(blesse.pv).toBe(30)
  })

  it("reposer rend 20 PV et 10 de mana", () => {
    const fatigue = { ...blesserHeros(creerHeros("Aria", "mage"), 50), mana: 5 }
    const repose = reposer(fatigue)
    expect(repose.pv).toBe(50)
    expect(repose.mana).toBe(15)
    expect(fatigue.pv).toBe(30)
    expect(fatigue.mana).toBe(5)
  })

  it("reposer ne dépasse ni les PV maximum ni le mana maximum", () => {
    const presqueFrais = { ...blesserHeros(creerHeros("Aria", "mage"), 5), mana: 75 }
    const repose = reposer(presqueFrais)
    expect(repose.pv).toBe(80)
    expect(repose.mana).toBe(80)
  })

  it("estVivant accepte un héros comme un monstre : il ne regarde que les PV", () => {
    const mage = creerHeros("Aria", "mage")
    const gobelin = creerMonstre(BESTIAIRE[1])
    expect(estVivant(mage)).toBe(true)
    expect(estVivant(gobelin)).toBe(true)
    expect(estVivant(blesserHeros(mage, 500))).toBe(false)
    expect(estVivant(blesserMonstre(gobelin, 500))).toBe(false)
  })
})
