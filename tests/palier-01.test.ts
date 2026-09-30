import { describe, expect, it } from "vitest"
import { attaqueTotale, creerHeros, decrireHeros, equiper } from "../src/heros"
import type { Arme, ClasseHeros, Heros } from "../src/heros"

describe("Palier 1 — Le héros", () => {
  it("un mage démarre avec 80 PV, 80 de mana, 8 d'attaque, 3 de défense et sans arme", () => {
    const mage = creerHeros("Aria", "mage")
    expect(mage.nom).toBe("Aria")
    expect(mage.classe).toBe("mage")
    expect(mage.pvMax).toBe(80)
    expect(mage.pv).toBe(80)
    expect(mage.manaMax).toBe(80)
    expect(mage.mana).toBe(80)
    expect(mage.attaque).toBe(8)
    expect(mage.defense).toBe(3)
    expect(mage.or).toBe(0)
    expect(mage.arme).toBeUndefined()
  })

  it("un guerrier démarre avec 100 PV, 10 de mana, 13 d'attaque, 5 de défense et une Épée courte (+2)", () => {
    const guerrier = creerHeros("Bjorn", "guerrier")
    expect(guerrier.pvMax).toBe(100)
    expect(guerrier.pv).toBe(100)
    expect(guerrier.manaMax).toBe(10)
    expect(guerrier.mana).toBe(10)
    expect(guerrier.attaque).toBe(13)
    expect(guerrier.defense).toBe(5)
    expect(guerrier.arme).toEqual({ nom: "Épée courte", bonus: 2 })
  })

  it("un voleur démarre avec 100 PV, 30 de mana, 14 d'attaque, 4 de défense et sans arme", () => {
    const voleur = creerHeros("Lila", "voleur")
    expect(voleur.pvMax).toBe(100)
    expect(voleur.pv).toBe(100)
    expect(voleur.manaMax).toBe(30)
    expect(voleur.mana).toBe(30)
    expect(voleur.attaque).toBe(14)
    expect(voleur.defense).toBe(4)
    expect(voleur.arme).toBeUndefined()
  })

  it("attaqueTotale = attaque seule quand le héros n'a pas d'arme", () => {
    expect(attaqueTotale(creerHeros("Aria", "mage"))).toBe(8)
  })

  it("attaqueTotale = attaque + bonus de l'arme quand il en a une", () => {
    expect(attaqueTotale(creerHeros("Bjorn", "guerrier"))).toBe(15)
  })

  it("equiper rend un NOUVEAU héros armé, sans modifier l'ancien", () => {
    const mage = creerHeros("Aria", "mage")
    const baton: Arme = { nom: "Bâton runique", bonus: 5 }
    const mageArme = equiper(mage, baton)
    expect(mageArme.arme).toEqual(baton)
    expect(attaqueTotale(mageArme)).toBe(13)
    expect(mage.arme).toBeUndefined()
    expect(mageArme).not.toBe(mage)
  })

  it("decrireHeros cite le nom, la classe et les PV sous la forme 80/80", () => {
    const texte = decrireHeros(creerHeros("Aria", "mage"))
    expect(texte).toContain("Aria")
    expect(texte).toContain("mage")
    expect(texte).toContain("80/80")
  })

  it("decrireHeros cite l'arme quand le héros en a une", () => {
    expect(decrireHeros(creerHeros("Bjorn", "guerrier"))).toContain("Épée courte")
  })

  it("les types refusent ce qui n'a pas de sens", () => {
    const classes: ClasseHeros[] = ["guerrier", "mage", "voleur"]
    expect(classes).toHaveLength(3)

    // @ts-expect-error — « dragon » n'est pas une classe de héros : ClasseHeros doit être une union de 3 littéraux
    creerHeros("Zed", "dragon")

    const heros: Heros = creerHeros("Aria", "mage")
    // @ts-expect-error — le nom d'un héros ne change jamais : le champ doit être readonly
    heros.nom = "Autre"
    // @ts-expect-error — la classe d'un héros ne change jamais : le champ doit être readonly
    heros.classe = "voleur"
    // @ts-expect-error — les PV maximum ne changent jamais : le champ doit être readonly
    heros.pvMax = 999
  })
})
