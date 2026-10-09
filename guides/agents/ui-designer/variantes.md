# Variantes

Annexe de `agent-ui-designer`. Lue quand le designer demande plusieurs
propositions d'un même écran (« fais-moi trois variantes », souvent en
avant-vente). Trois vraies directions valent mieux que trois nuances.

## 1. Avant de construire

Écrire les directions en une ligne chacune, avec un nom :

> A. « Liste d'abord » : la liste des dossiers occupe l'écran, le détail
> s'ouvre en panneau latéral.
> B. « Tableau de bord » : les indicateurs en tête, la liste en dessous.
> C. « File de travail » : un dossier à la fois, avec le suivant en attente.

Puis construire les trois sans attendre de validation (le designer peut
interrompre s'il voit une direction qui ne lui va pas).

## 2. Ce qui varie, ce qui ne varie pas

- **Avec une charte ou un design system imposé** : typo, couleurs,
  composants et ton restent ceux de la charte. Ce qui varie, c'est la
  composition : modèle de navigation (barre latérale, barre haute,
  recherche d'abord), découpage de l'écran, donnée mise en tête, densité,
  façon de traiter l'action principale.
- **Sans charte** : on garde le socle (neutres, accent `blue-600`, Roboto,
  shadcn) et on fait varier la composition de la même façon. Un changement
  de couleur seul n'est pas une variante.
- Les trois variantes respectent toutes les règles : une variante n'est pas
  une permission de les enfreindre.

## 3. Le test de distinction

Si on peut échanger les titres de deux variantes sans que personne ne le
remarque, elles sont trop proches : retravailler la plus faible avec une
direction franchement différente. Vues en vignette, les trois doivent se
distinguer au premier coup d'œil.

## 4. Livraison

- Un dossier par variante : `design/<ecran>/variante-a/index.html`, `-b`, `-c`.
- Les trois liens localhost, avec la ligne de direction de chacune.
- Le script de contrôle passe sur chacune (une seule passe, comme pour un écran).

## 5. Garder la mémoire des choix

Quand le designer en retient une (ou mélange : « la navigation de A avec la
densité de C »), noter dans `design/decisions.md` :

- la variante retenue et ce qui l'a fait choisir ;
- ce qui a été écarté et pourquoi, s'il l'a dit.

Ces lignes orientent les écrans suivants du projet : on ne repropose pas une
direction déjà rejetée sans raison nouvelle.
