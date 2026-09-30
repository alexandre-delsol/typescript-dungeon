import { describe, expect, it } from "vitest"
import { couleurBarre, pourcentage } from "../src/affichage"

describe("Palier 2 — La carte du héros", () => {
  it("pourcentage(35, 70) vaut 50", () => {
    expect(pourcentage(35, 70)).toBe(50)
  })

  it("pourcentage rend un entier arrondi : 1 sur 3 donne 33", () => {
    expect(pourcentage(1, 3)).toBe(33)
    expect(pourcentage(2, 3)).toBe(67)
  })

  it("pourcentage reste entre 0 et 100, même avec des valeurs aberrantes", () => {
    expect(pourcentage(0, 70)).toBe(0)
    expect(pourcentage(70, 70)).toBe(100)
    expect(pourcentage(80, 70)).toBe(100)
    expect(pourcentage(-5, 70)).toBe(0)
  })

  it("pourcentage vaut 0 quand le maximum est 0 (pas de division par zéro)", () => {
    expect(pourcentage(10, 0)).toBe(0)
  })

  it("couleurBarre : vert au-dessus de 50 %", () => {
    expect(couleurBarre(100)).toBe("bg-emerald-500")
    expect(couleurBarre(51)).toBe("bg-emerald-500")
  })

  it("couleurBarre : orange de 21 à 50 %", () => {
    expect(couleurBarre(50)).toBe("bg-amber-500")
    expect(couleurBarre(21)).toBe("bg-amber-500")
  })

  it("couleurBarre : rouge à 20 % et en dessous", () => {
    expect(couleurBarre(20)).toBe("bg-red-500")
    expect(couleurBarre(0)).toBe("bg-red-500")
  })

  it("couleurBarre rend l'une des trois classes exactes, pas un string quelconque", () => {
    // Si cette ligne ne compile pas : le type de retour de couleurBarre est trop large (string).
    const couleur: "bg-emerald-500" | "bg-amber-500" | "bg-red-500" = couleurBarre(10)
    expect(couleur).toBe("bg-red-500")
  })
})
