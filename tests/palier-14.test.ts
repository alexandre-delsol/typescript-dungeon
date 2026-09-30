import { describe, expect, it } from "vitest"
import { ajouterScore, lireScores } from "../src/scores"
import type { Score } from "../src/scores"

const aria: Score = { nom: "Aria", classe: "mage", points: 120 }
const bjorn: Score = { nom: "Bjorn", classe: "guerrier", points: 80 }

describe("Palier 14 — Bonus : lire des scores venus de l'extérieur", () => {
  it("rien d'enregistré (null) : aucun score", () => {
    expect(lireScores(null)).toEqual([])
  })

  it("un texte qui n'est pas du JSON : aucun score, et pas de plantage", () => {
    expect(lireScores("pas du json {")).toEqual([])
  })

  it("du JSON qui n'est pas un tableau : aucun score", () => {
    expect(lireScores('{"nom":"Aria"}')).toEqual([])
    expect(lireScores("42")).toEqual([])
    expect(lireScores("null")).toEqual([])
  })

  it("un tableau de scores valides est rendu tel quel", () => {
    expect(lireScores(JSON.stringify([aria, bjorn]))).toEqual([aria, bjorn])
  })

  it("les entrées invalides sont écartées, les valides gardées", () => {
    const texte = JSON.stringify([
      aria,
      null,
      42,
      "Aria",
      { nom: "Sans points", classe: "mage" },
      { nom: "Classe inconnue", classe: "dragon", points: 10 },
      { nom: 12, classe: "mage", points: 10 },
      { nom: "Points en texte", classe: "voleur", points: "10" },
      bjorn,
    ])
    expect(lireScores(texte)).toEqual([aria, bjorn])
  })

  it("les champs en trop sont ignorés", () => {
    const texte = JSON.stringify([{ ...aria, triche: true }])
    expect(lireScores(texte)).toEqual([aria])
  })
})

describe("Palier 14 — Bonus : le tableau des 5 meilleurs", () => {
  it("ajouterScore classe du meilleur au moins bon", () => {
    expect(ajouterScore([bjorn], aria)).toEqual([aria, bjorn])
    expect(ajouterScore([aria], bjorn)).toEqual([aria, bjorn])
  })

  it("ajouterScore ne garde que les 5 meilleurs", () => {
    const six = [60, 50, 40, 30, 20].map((points): Score => ({ nom: "X", classe: "voleur", points }))
    const resultat = ajouterScore(six, { nom: "Y", classe: "mage", points: 45 })
    expect(resultat.map((score) => score.points)).toEqual([60, 50, 45, 40, 30])
  })

  it("ajouterScore ne modifie pas le tableau reçu", () => {
    const scores: readonly Score[] = [bjorn]
    ajouterScore(scores, aria)
    expect(scores).toEqual([bjorn])
  })
})
