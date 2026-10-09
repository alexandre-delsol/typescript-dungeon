// Palier 8 — Le journal

// --- Classe : décommenter, puis compléter ---

export class Journal {
    //  champs privés : lignes, capacite
    private lignes: string[] = [];
    private readonly capacite: number;

    constructor(capacite: number) {
        this.capacite = capacite;
    }

    get taille(): number {
        return this.lignes.length
    }

    ajouter(message: string): void {
        this.lignes.push(message)
        if (this.lignes.length > this.capacite) this.lignes.shift()
    }

    ajouterTous(messages: readonly string[]): void {
        messages.forEach((message) => {
            this.ajouter(message)
        })
    }

    lire(): readonly string[] {
        return [...this.lignes]
    }

    vider(): void {
        this.lignes.length = 0
    }

}
