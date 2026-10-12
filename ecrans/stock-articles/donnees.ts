// donnée fictive : catalogue d'un distributeur d'outillage pour professionnels du bâtiment

export type Statut = 'disponible' | 'bas' | 'rupture'

export type Article = {
  ref: string
  nom: string
  categorie: string
  fournisseur: string
  entrepots: { nom: string; quantite: number }[]
  seuil: number
  prixAchat: number
  ventes30j: number
  dernierMouvement: string
  commandeEnCours?: { numero: string; quantite: number; livraison: string }
}

export const CATEGORIES = ['Électroportatif', 'Consommables', 'Fixation', 'Électricité', 'Protection', 'Mesure']
export const ENTREPOTS = ['Lille-Lesquin', 'Lyon-Corbas', 'Nantes-Carquefou']

const a = (
  ref: string, nom: string, categorie: string, fournisseur: string, q: [number, number, number], seuil: number,
  prixAchat: number, ventes30j: number, dernierMouvement: string, commandeEnCours?: Article['commandeEnCours'],
): Article => ({
  ref, nom, categorie, fournisseur, seuil, prixAchat, ventes30j, dernierMouvement, commandeEnCours,
  entrepots: ENTREPOTS.map((nom, i) => ({ nom, quantite: q[i] })),
})

export const ARTICLES: Article[] = [
  a('OUT-18V-0412', 'Perceuse-visseuse 18 V, 2 batteries 4 Ah', 'Électroportatif', 'Makoto France', [14, 3, 0], 30, 142.6, 61, '12 oct. 2026', { numero: 'CF-2026-0871', quantite: 40, livraison: '16 oct. 2026' }),
  a('CON-DT125-25', 'Disque à tronçonner métal 125 mm, lot de 25', 'Consommables', 'Abrasifs du Nord', [212, 148, 96], 120, 18.4, 388, '12 oct. 2026'),
  a('FIX-CHN8-100', 'Cheville nylon 8 mm, boîte de 100', 'Fixation', 'Fixtech', [0, 0, 0], 80, 4.9, 214, '9 oct. 2026', { numero: 'CF-2026-0864', quantite: 600, livraison: '14 oct. 2026' }),
  a('PRO-GT9-MAN', 'Gants de manutention enduits nitrile, taille 9', 'Protection', 'Sécurité Plus', [46, 12, 8], 90, 2.1, 172, '11 oct. 2026'),
  a('MES-RUB5-PRO', 'Mètre ruban 5 m, boîtier bi-matière', 'Mesure', 'Lambert Mesure', [63, 41, 37], 40, 6.8, 54, '8 oct. 2026'),
  a('MES-NIV60-ALU', 'Niveau à bulle aluminium 60 cm', 'Mesure', 'Lambert Mesure', [18, 9, 22], 20, 14.2, 19, '5 oct. 2026'),
  a('CON-FB10-160', 'Foret béton SDS-plus 10 x 160 mm', 'Consommables', 'Makoto France', [5, 0, 2], 60, 3.3, 143, '12 oct. 2026'),
  a('ELE-H07-25-100', 'Câble H07V-U 2,5 mm², couronne de 100 m, bleu', 'Électricité', 'Câbleries Réunies', [31, 24, 19], 25, 38.9, 47, '10 oct. 2026'),
  a('ELE-DJ16-PH', 'Disjoncteur phase + neutre 16 A, courbe C', 'Électricité', 'Volt Industrie', [0, 7, 4], 50, 7.6, 96, '11 oct. 2026', { numero: 'CF-2026-0879', quantite: 200, livraison: '21 oct. 2026' }),
  a('CON-SIL-TR310', 'Mastic silicone sanitaire translucide 310 ml', 'Consommables', 'Colles et Joints SA', [154, 88, 120], 60, 3.9, 201, '12 oct. 2026'),
  a('OUT-MEU125-1200', 'Meuleuse d’angle 125 mm, 1 200 W', 'Électroportatif', 'Makoto France', [9, 11, 6], 15, 67.5, 22, '7 oct. 2026'),
  a('FIX-VAG4-40', 'Vis agglo tête fraisée 4 x 40 mm, boîte de 500', 'Fixation', 'Fixtech', [88, 62, 0], 70, 8.2, 165, '12 oct. 2026'),
  a('PRO-LUN-ANTI', 'Lunettes de protection antibuée, branches réglables', 'Protection', 'Sécurité Plus', [27, 33, 15], 25, 3.4, 38, '6 oct. 2026'),
  a('ELE-GAI-ICTA20', 'Gaine ICTA 20 mm, couronne de 50 m', 'Électricité', 'Câbleries Réunies', [12, 4, 3], 30, 21.7, 41, '10 oct. 2026'),
  a('OUT-PERF-SDS', 'Perforateur SDS-plus 800 W, coffret', 'Électroportatif', 'Volt Industrie', [6, 2, 5], 8, 118.0, 11, '2 oct. 2026'),
  a('CON-LAME-SAB5', 'Lames de scie sabre bois et métal, lot de 5', 'Consommables', 'Abrasifs du Nord', [0, 3, 1], 40, 9.6, 77, '11 oct. 2026'),
  a('MES-LAS-CROIX', 'Niveau laser lignes croisées, portée 20 m', 'Mesure', 'Lambert Mesure', [4, 5, 3], 6, 89.0, 9, '30 sept. 2026'),
  a('FIX-TIG-M8', 'Tige filetée acier zingué M8, longueur 1 m', 'Fixation', 'Fixtech', [140, 97, 85], 100, 1.3, 126, '9 oct. 2026'),
  a('PRO-CAS-CHA', 'Casque de chantier ventilé, jugulaire', 'Protection', 'Sécurité Plus', [21, 18, 26], 20, 11.9, 17, '4 oct. 2026'),
  a('ELE-PRI-2P', 'Prise de courant 2P+T encastrable, blanc', 'Électricité', 'Volt Industrie', [230, 175, 160], 150, 2.8, 312, '12 oct. 2026'),
  a('OUT-SCIE-CIRC', 'Scie circulaire 190 mm, 1 400 W, guide parallèle inclus', 'Électroportatif', 'Makoto France', [3, 0, 1], 10, 104.9, 14, '8 oct. 2026', { numero: 'CF-2026-0873', quantite: 12, livraison: '18 oct. 2026' }),
  a('CON-ABR-P120', 'Abrasif auto-agrippant 125 mm grain 120, lot de 50', 'Consommables', 'Abrasifs du Nord', [64, 70, 58], 50, 12.7, 88, '10 oct. 2026'),
]

export const total = (x: Article) => x.entrepots.reduce((s, e) => s + e.quantite, 0)

export const statut = (x: Article): Statut => {
  const t = total(x)
  if (t === 0) return 'rupture'
  return t < x.seuil ? 'bas' : 'disponible'
}

export const LIBELLE_STATUT: Record<Statut, string> = { disponible: 'Disponible', bas: 'Sous le seuil', rupture: 'Rupture' }
export const PASTILLE_STATUT: Record<Statut, string> = { disponible: 'bg-success', bas: 'bg-warning', rupture: 'bg-destructive' }

/** Jours de couverture : stock actuel divisé par les ventes moyennes par jour. */
export const couverture = (x: Article) => (x.ventes30j ? Math.floor(total(x) / (x.ventes30j / 30)) : null)

export const euros = (n: number) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
export const nombre = (n: number) => n.toLocaleString('fr-FR')

/** Derniers mouvements d'un article, déduits de sa référence pour rester cohérents d'une zone à l'autre. */
export const mouvements = (x: Article) => [
  { date: x.dernierMouvement, type: 'Sortie', detail: 'Commande client BTP Delmas', entrepot: x.entrepots[0].nom, quantite: -Math.max(2, Math.round(x.ventes30j / 12)) },
  { date: '10 oct. 2026', type: 'Sortie', detail: 'Commande client Rénov’Habitat', entrepot: x.entrepots[1].nom, quantite: -Math.max(1, Math.round(x.ventes30j / 20)) },
  { date: '7 oct. 2026', type: 'Entrée', detail: `Réception fournisseur ${x.fournisseur}`, entrepot: x.entrepots[0].nom, quantite: Math.max(10, x.seuil) },
  { date: '3 oct. 2026', type: 'Transfert', detail: 'Rééquilibrage entre entrepôts', entrepot: x.entrepots[2].nom, quantite: Math.max(2, Math.round(x.seuil / 6)) },
]

/** Stock total en fin de semaine sur 12 semaines. */
export const historique = (x: Article) => {
  const t = total(x)
  const semaines = ['28 juil.', '4 août', '11 août', '18 août', '25 août', '1 sept.', '8 sept.', '15 sept.', '22 sept.', '29 sept.', '6 oct.', '13 oct.']
  const pas = Math.max(1, Math.round(x.ventes30j / 4))
  return semaines.map((s, i) => {
    const cycle = (11 - i) % 4
    return { semaine: s, stock: Math.max(0, t + cycle * pas - (i === 11 ? 0 : Math.round(pas / 3))) }
  })
}
