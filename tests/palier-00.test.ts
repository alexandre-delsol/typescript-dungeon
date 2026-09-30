import { describe, expect, it } from "vitest"

describe("Palier 0 — Démarrage", () => {
  it("les tests savent exécuter du TypeScript", () => {
    const additionner = (a: number, b: number): number => a + b
    expect(additionner(2, 3)).toBe(5)
  })

  it("le compilateur est en mode strict : il refuse null dans un number", () => {
    // @ts-expect-error — en mode strict, null n'est pas un number
    const nombre: number = null
    expect(nombre).toBeNull()
  })
})
