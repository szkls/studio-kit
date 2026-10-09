# Données : graphiques, indicateurs, tableaux

Annexe de `agent-ui-designer`. Lue pour un tableau de bord ou tout écran qui
montre des chiffres. Un graphique se choisit d'après la question que
l'utilisateur se pose, pas d'après ce qui fait joli.

## 1. Choisir le graphique

| Question de l'utilisateur | Graphique | À éviter |
| --- | --- | --- |
| Comment ça évolue dans le temps ? | Courbe (barres si moins de 8 périodes) | Camembert, aire empilée illisible |
| Qui est devant, qui est derrière ? | Barres horizontales, triées | Barres verticales avec des libellés longs |
| Quelle part de l'ensemble ? (5 parts max) | Barre empilée à 100 %, ou anneau | Camembert à plus de 5 parts, 3D |
| Où en est-on par rapport à l'objectif ? | Barre de progression avec repère d'objectif (bullet chart) | Jauge circulaire décorative |
| Comment se répartissent les valeurs ? | Histogramme, boîte à moustaches | Moyenne seule |
| Deux mesures sont-elles liées ? | Nuage de points | Deux courbes sur deux axes |
| Par où passe le flux ? Où perd-on du monde ? | Entonnoir, ou diagramme de Sankey | Suite de cartes chiffrées |
| Qu'est-ce qui a fait passer le total de A à B ? | Cascade (waterfall) | Barres groupées |
| Où et quand ça se concentre ? | Carte de chaleur (calendrier, matrice) | Tableau coloré sans légende |
| Une seule valeur et sa tendance | Indicateur : chiffre + variation + courbe miniature | Grand chiffre isolé sans contexte |

Règles communes :

- Pas de 3D, pas d'ombre, pas de dégradé sur les données.
- L'axe des valeurs d'un graphique en barres part de zéro.
- Les unités sont dans le titre de l'axe ou dans les valeurs (12 k€, 37 %).
- Libellés directs sur les séries quand c'est possible, plutôt qu'une légende
  lointaine.
- Une valeur mise en avant (dépassement, anomalie) est signalée par une
  annotation, pas seulement par une couleur.
- Chaque graphique a une alternative accessible : un tableau des valeurs,
  affichable ou relié par `aria-describedby`.

## 2. Palette de données (socle)

Distincte de la couleur d'action (`blue-600`) et des couleurs sémantiques.
Dans l'ordre d'attribution :

| Série | Token Tailwind | Valeur |
| --- | --- | --- |
| 1 | `teal-600` | #0d9488 |
| 2 | `violet-600` | #7c3aed |
| 3 | `orange-600` | #ea580c |
| 4 | `fuchsia-600` | #c026d3 |
| 5 | `lime-700` | #4d7c0f |
| Autres | `neutral-500` | #737373 |

- Toutes ont au moins 3:1 de contraste sur blanc.
- Au-delà de 5 séries, regrouper le reste en « Autres » ou découper le graphique.
- Une série garde sa couleur sur tous les graphiques du produit.
- Une échelle continue (carte de chaleur) utilise une seule teinte du clair
  au foncé (`teal-50` à `teal-700`), jamais un arc-en-ciel.
- Une charte qui définit une palette de données la remplace.

## 3. Indicateurs chiffrés

- Un indicateur dit : la valeur, sa période, sa variation et le point de
  comparaison (« 1 284 dossiers en septembre, +6,2 % sur août »).
- La variation porte un signe et une icône (flèche), pas seulement une couleur.
- Hausse ne veut pas dire « bien » : la couleur suit le sens métier (une hausse
  des retards est une alerte).
- Pas de rangée de cartes identiques avec un grand chiffre, un petit libellé
  et une icône dans un carré : chaque indicateur a la place que mérite son
  importance.

## 4. Tableaux

- Les colonnes de texte sont alignées à gauche, les nombres à droite en
  chiffres tabulaires, avec la même précision dans toute la colonne.
- L'en-tête d'une colonne triable montre le sens du tri.
- Une ligne de 40 px en densité compacte, 48 px en confortable.
- Les valeurs manquantes s'écrivent « - » (ou « Non renseigné » quand le sens
  compte), jamais une cellule vide.
- Au-delà de 50 lignes : pagination ou défilement avec en-tête fixe, et le
  total de lignes affiché.
- Une ligne de total est séparée par un filet plus marqué et en graisse 600.
