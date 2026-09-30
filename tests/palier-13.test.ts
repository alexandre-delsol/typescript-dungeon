import { describe, expect, it } from "vitest"
import { tirerAuHasard } from "../src/hasard"
import { BESTIAIRE } from "../src/monstres"
import type { ModeleMonstre } from "../src/monstres"
import { deTruque } from "./outils"

describe("Palier 13 — Bonus : un premier générique", () => {
  it("tire un nombre dans un tableau de nombres", () => {
    expect(tirerAuHasard([10, 20, 30], deTruque(2))).toBe(20)
  })

  it("tire un texte dans un tableau de textes", () => {
    expect(tirerAuHasard(["pile", "face"], deTruque(1))).toBe("pile")
  })

  it("tire un monstre dans le bestiaire", () => {
    const modele: ModeleMonstre = tirerAuHasard(BESTIAIRE, deTruque(1))
    expect(modele.nom).toBe("Rat géant")
  })

  it("lance un dé qui a autant de faces que d'éléments", () => {
    expect(tirerAuHasard(["a", "b", "c"], deTruque(99))).toBe("c")
  })

  it("le type qui sort est le type qui entre", () => {
    const nombre: number = tirerAuHasard([1, 2, 3], deTruque(1))
    const texte: string = tirerAuHasard(["a", "b"], deTruque(1))
    expect([nombre, texte]).toEqual([1, "a"])

    // @ts-expect-error — on tire dans des nombres : le résultat n'est pas un string (pas de any !)
    const faux: string = tirerAuHasard([1, 2, 3], deTruque(1))
    expect(faux).toBe(1)
  })
})
