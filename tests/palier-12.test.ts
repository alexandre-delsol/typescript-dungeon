import { describe, expect, it } from "vitest"
import type { ClasseHeros } from "../src/heros"
import { lireClasse, lireNom } from "../src/saisie"

describe("Palier 12 — lire ce que le joueur a saisi", () => {
  it("lireNom accepte un nom de 2 à 20 caractères", () => {
    expect(lireNom("Aria")).toBe("Aria")
    expect(lireNom("Bo")).toBe("Bo")
  })

  it("lireNom retire les espaces autour du nom", () => {
    expect(lireNom("  Aria  ")).toBe("Aria")
  })

  it("lireNom refuse un nom trop court, vide ou fait d'espaces", () => {
    expect(lireNom("A")).toBeNull()
    expect(lireNom("")).toBeNull()
    expect(lireNom("     ")).toBeNull()
  })

  it("lireNom refuse un nom de plus de 20 caractères", () => {
    expect(lireNom("Aria la très très grande mage")).toBeNull()
  })

  it("lireNom refuse tout ce qui n'est pas du texte", () => {
    expect(lireNom(undefined)).toBeNull()
    expect(lireNom(42)).toBeNull()
    expect(lireNom(["Aria"])).toBeNull()
    expect(lireNom(null)).toBeNull()
  })

  it("lireClasse reconnaît les trois classes", () => {
    expect(lireClasse("guerrier")).toBe("guerrier")
    expect(lireClasse("mage")).toBe("mage")
    expect(lireClasse("voleur")).toBe("voleur")
  })

  it("lireClasse refuse tout le reste", () => {
    expect(lireClasse("dragon")).toBeNull()
    expect(lireClasse("Mage")).toBeNull()
    expect(lireClasse("")).toBeNull()
    expect(lireClasse(undefined)).toBeNull()
    expect(lireClasse(3)).toBeNull()
  })

  it("lireClasse rend une ClasseHeros ou null, pas un string quelconque", () => {
    // Si cette ligne ne compile pas : le type de retour de lireClasse est trop large.
    const classe: ClasseHeros | null = lireClasse("mage")
    expect(classe).toBe("mage")
  })
})
