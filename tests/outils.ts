// Un dé truqué pour les tests : il rend toujours la même valeur, sans jamais dépasser le nombre de faces.
// Le vrai jeu utilise lancerDe ; les tests, eux, ont besoin de savoir d'avance ce qui va sortir.
export const deTruque =
  (valeur: number) =>
  (faces: number): number =>
    Math.min(valeur, faces)
