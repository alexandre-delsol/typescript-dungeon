import { describe, expect, it } from "vitest"
import { Journal } from "../src/journal"

describe("Palier 8 — Le journal", () => {
  it("un journal neuf est vide", () => {
    const journal = new Journal(5)
    expect(journal.taille).toBe(0)
    expect(journal.lire()).toEqual([])
  })

  it("ajouter place le message à la fin", () => {
    const journal = new Journal(5)
    journal.ajouter("Le combat commence.")
    journal.ajouter("Aria frappe le Gobelin.")
    expect(journal.taille).toBe(2)
    expect(journal.lire()).toEqual(["Le combat commence.", "Aria frappe le Gobelin."])
  })

  it("le journal ne garde que les derniers messages, selon sa capacité", () => {
    const journal = new Journal(3)
    journal.ajouter("un")
    journal.ajouter("deux")
    journal.ajouter("trois")
    journal.ajouter("quatre")
    expect(journal.taille).toBe(3)
    expect(journal.lire()).toEqual(["deux", "trois", "quatre"])
  })

  it("ajouterTous ajoute plusieurs messages d'un coup, dans l'ordre", () => {
    const journal = new Journal(5)
    journal.ajouterTous(["un", "deux"])
    journal.ajouterTous(["trois"])
    expect(journal.lire()).toEqual(["un", "deux", "trois"])
  })

  it("ajouterTous respecte aussi la capacité", () => {
    const journal = new Journal(2)
    journal.ajouterTous(["un", "deux", "trois"])
    expect(journal.lire()).toEqual(["deux", "trois"])
  })

  it("vider efface tout", () => {
    const journal = new Journal(5)
    journal.ajouter("un")
    journal.vider()
    expect(journal.taille).toBe(0)
    expect(journal.lire()).toEqual([])
  })

  it("deux journaux ne partagent rien", () => {
    const premier = new Journal(5)
    const second = new Journal(5)
    premier.ajouter("un")
    expect(second.taille).toBe(0)
  })

  it("l'intérieur du journal est protégé", () => {
    const journal = new Journal(5)
    journal.ajouter("un")

    // @ts-expect-error — les lignes sont privées : on ne les lit que par lire()
    void journal.lignes

    expect(() => {
      // @ts-expect-error — taille est un accesseur en lecture seule (get) : on ne l'écrit pas
      journal.taille = 12
    }).toThrow()

    const lignes = journal.lire()
    // @ts-expect-error — lire() rend un tableau readonly : pas de push dessus
    void lignes.push
    expect(journal.taille).toBe(1)
  })
})
