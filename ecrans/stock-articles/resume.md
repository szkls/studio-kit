# Résumé - Stock, articles (+ fiche article)

Je lis ça comme : tableau de bord de travail pour un gestionnaire de stock, densité compacte, socle studio, mode opérer.

- Références : aucune fournie par le designer. Fiches du corpus utilisées : exemples shadcn (liste filtrable, pagination), Carbon (barre d'actions groupées, tri, une hauteur de ligne), Stripe (liste puis fiche, alertes en tête), Tremor (chiffres avec contexte).
- Layout : navigation latérale + en-tête fixe ; titre et actions de page ; trois indicateurs de formes différentes ; liste en carte unique (outils, filtres actifs, sélection, tableau, pagination).
- Indicateurs : « À réapprovisionner » (décompte et raccourci de filtre), « Valeur du stock » (courbe 12 semaines), « Taux de service » (barre et repère d'objectif). Pas de rangée de cartes identiques.
- Liste : recherche, 3 filtres, filtres actifs retirables un à un, nombre de résultats, tri sur article / stock / couverture, sélection avec barre d'actions groupées, menu par ligne, pagination.
- Panneau latéral au clic sur une ligne (ou sur le nom, au clavier) : chiffres clés, commande en cours, stock par entrepôt, derniers mouvements, « Ouvrir la fiche » et « Commander ».
- Fiche article : fil d'Ariane, statut, actions, bandeau de commande en cours, onglets Vue d'ensemble / Mouvements / Fournisseur, courbe avec seuil annoté.
- Composants : tous du catalogue. Aucun manque.
- États prévus : chargement, aucun résultat (faits) ; erreur de chargement, droits insuffisants (à faire).
- Décidé sans règle : la couverture (jours de stock au rythme des ventes) est le tri par défaut, pour faire remonter l'urgent.
- P2 restants : aucun.
