import { describe, expect, it } from "vitest"
import { blesserHeros } from "../src/combat"
import { attaqueTotale, creerHeros } from "../src/heros"
import { boirePotion, compterPotions, decrireObjet, ramasser, valeurDuSac } from "../src/objets"
import type { Objet } from "../src/objets"

const potion: Objet = { type: "potion", soin: 30 }
const dague: Objet = { type: "arme", arme: { nom: "Dague", bonus: 1 } }
const epee: Objet = { type: "arme", arme: { nom: "Épée longue", bonus: 4 } }
const rubis: Objet = { type: "tresor", nom: "Rubis", valeur: 40 }
const couronne: Objet = { type: "tresor", nom: "Couronne", valeur: 80 }

describe("Palier 6 — Le sac et les objets", () => {
  it("chaque héros démarre avec 2 potions de 30 PV dans son sac", () => {
    const mage = creerHeros("Aria", "mage")
    expect(mage.sac).toEqual([
      { type: "potion", soin: 30 },
      { type: "potion", soin: 30 },
    ])
  })

  it("decrireObjet cite le soin d'une potion, le nom d'une arme, le nom d'un trésor", () => {
    expect(decrireObjet(potion)).toContain("30")
    expect(decrireObjet(epee)).toContain("Épée longue")
    expect(decrireObjet(rubis)).toContain("Rubis")
  })

  it("compterPotions compte seulement les potions", () => {
    expect(compterPotions([potion, rubis, potion, epee])).toBe(2)
    expect(compterPotions([rubis])).toBe(0)
    expect(compterPotions([])).toBe(0)
  })

  it("valeurDuSac additionne seulement la valeur des trésors", () => {
    expect(valeurDuSac([rubis, potion, couronne, epee])).toBe(120)
    expect(valeurDuSac([potion, epee])).toBe(0)
    expect(valeurDuSac([])).toBe(0)
  })

  it("ramasser ajoute l'objet à la fin du sac, sans modifier l'ancien héros", () => {
    const mage = creerHeros("Aria", "mage")
    const plusRiche = ramasser(mage, rubis)
    expect(plusRiche.sac).toHaveLength(3)
    expect(plusRiche.sac[2]).toEqual(rubis)
    expect(mage.sac).toHaveLength(2)
  })

  it("ramasser une arme quand on n'en a pas : elle est équipée", () => {
    const mage = ramasser(creerHeros("Aria", "mage"), epee)
    expect(mage.arme).toEqual({ nom: "Épée longue", bonus: 4 })
    expect(attaqueTotale(mage)).toBe(12)
  })

  it("ramasser une arme meilleure que la sienne : elle est équipée", () => {
    const guerrier = ramasser(creerHeros("Bjorn", "guerrier"), epee)
    expect(guerrier.arme?.nom).toBe("Épée longue")
  })

  it("ramasser une arme moins bonne : on garde la sienne, mais l'objet va dans le sac", () => {
    const guerrier = ramasser(creerHeros("Bjorn", "guerrier"), dague)
    expect(guerrier.arme?.nom).toBe("Épée courte")
    expect(guerrier.sac).toHaveLength(3)
  })

  it("boirePotion rend les PV de la potion et retire UNE potion du sac", () => {
    const blesse = blesserHeros(creerHeros("Aria", "mage"), 50)
    const soigne = boirePotion(blesse)
    expect(soigne.pv).toBe(60)
    expect(compterPotions(soigne.sac)).toBe(1)
    expect(compterPotions(blesse.sac)).toBe(2)
  })

  it("boirePotion ne dépasse pas les PV maximum", () => {
    const presqueIntact = blesserHeros(creerHeros("Aria", "mage"), 5)
    expect(boirePotion(presqueIntact).pv).toBe(80)
  })

  it("boirePotion ne retire que la potion, pas les autres objets", () => {
    const charge = ramasser(ramasser(creerHeros("Aria", "mage"), rubis), epee)
    const apres = boirePotion(charge)
    expect(apres.sac).toHaveLength(3)
    expect(valeurDuSac(apres.sac)).toBe(40)
  })

  it("boirePotion sans potion : le héros ne change pas", () => {
    const sansPotion = boirePotion(boirePotion(blesserHeros(creerHeros("Aria", "mage"), 75)))
    expect(compterPotions(sansPotion.sac)).toBe(0)
    expect(boirePotion(sansPotion).pv).toBe(sansPotion.pv)
  })

  it("les types refusent ce qui n'a pas de sens", () => {
    // @ts-expect-error — une potion sans « soin » n'existe pas
    const potionVide: Objet = { type: "potion" }
    // @ts-expect-error — « bouclier » n'est pas un type d'objet
    const bouclier: Objet = { type: "bouclier" }
    // @ts-expect-error — un trésor n'a pas de champ « soin »
    const tresorQuiSoigne: Objet = { type: "tresor", nom: "Rubis", valeur: 40, soin: 10 }
    expect([potionVide, bouclier, tresorQuiSoigne]).toHaveLength(3)
  })
})
