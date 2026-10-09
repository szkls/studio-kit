# Marque — direction artistique "plateforme vidéo" (inspirée de YouTube)

Fichier consommé par les agents UI, motion et illustrateur. Il surcharge les
défauts marque blanche uniquement sur les points listés. Tout le reste suit
les règles des agents.

## Thème
Clair par défaut, variante sombre disponible. Fond blanc pur, texte noir,
une seule couleur : le rouge.

## Palette par rôle
| Rôle | Clair | Sombre | Usage |
|---|---|---|---|
| surface | #FFFFFF | #0F0F0F | fond de page |
| surface-alt | #F2F2F2 | #272727 | fonds alternés, chips, cartes |
| surface-sunken | #E5E5E5 | #3F3F3F | fonds enfoncés, pistes |
| border | rgba(0,0,0,.10) | rgba(255,255,255,.12) | filets |
| text-heading | #0F0F0F | #FFFFFF | titres |
| text-body | #0F0F0F | #F1F1F1 | corps |
| text-muted | #606060 | #AAAAAA | secondaire |
| action-primary | #CC0000 | #FF4E45 | boutons primaires avec texte (contraste ≥ 4,5:1) |
| action-primary-hover | #A80000 | #FF6B63 | survol |
| action-primary-fg | #FFFFFF | #0F0F0F | texte sur bouton |
| brand-red | #FF0000 | #FF0000 | rouge signature : aplats décoratifs, grands éléments, jamais sous du texte de moins de 24 px |
| selected-bg | #0F0F0F | #FFFFFF | chip ou onglet actif : inversion noir/blanc |
| selected-fg | #FFFFFF | #0F0F0F | |
| hover-bg | #E5E5E5 | #3F3F3F | |
| focus-ring | #065FD4 | #3EA6FF | anneau de focus (bleu, pour ne pas se confondre avec le rouge) |
| success | #2BA640 | #2BA640 | |

Note contraste : le rouge signature (#FF0000) ne passe pas le contraste 4,5:1
avec du texte blanc. Il est réservé aux aplats sans texte et aux éléments
graphiques. Les boutons utilisent action-primary.

## Typographie
- Roboto (Google Fonts), 400 / 500 / 700. Fallback système.
- Titres en 700, sans resserrage particulier.
- Boutons et chips en 500.
- Échelle et interlignages : ceux de l'agent UI.

## Formes
- Boutons et champs : pilule (rayon 500 px).
- Chips de filtre : pilule, fond surface-alt, actif en inversion noir/blanc.
- Cartes et vignettes : rayon 12 px, sans bordure ; la couleur de fond ou
  l'image fait la séparation.
- Icônes : trait 1,5 px ou pleines, noires ; jamais rouges sauf un seul
  symbole d'accent par écran.

## Ton
Direct, tutoiement, phrases courtes. Parle aux créateurs comme à des pairs.

## Mouvement (lu par l'agent motion)
- Caractère : vif mais posé. Durées de l'agent, plutôt dans la partie basse
  des fourchettes.
- Courbes douces (ease-out standard), pas de rebond.
- Révélation au scroll autorisée sur les blocs de fonctionnalités et les
  chiffres, pas sur le texte courant.
- Un seul élément peut bouger en boucle : la barre de progression du lecteur
  dans le héros, très lente, pour dire "ça joue".

## Illustration (lu par l'agent illustrateur)
- Degré d'abstraction : le produit lui-même (lecteur, vignettes, commentaires,
  courbes d'audience) simplifié en formes.
- Trait 1,5 px, extrémités arrondies, noir ou text-muted.
- Fonds en surface-alt et surface-sunken, une seule touche de rouge signature
  par illustration (la barre de progression, un point, une barre du graphe).
- Pas d'ombre, pas de perspective, pas de personnage.
- Pas de texte lisible : lignes grises pour suggérer les titres et
  commentaires.

## Ce que la marque ne change pas
Échelle typo, espacements, une seule action primaire par zone, contrastes,
focus visible, cibles, structure des composants, règles de mouvement et
d'illustration des agents.

## Assets
Logo et nom fournis par le client à l'intégration. Placeholder "Nom du
produit". Aucun logo, symbole ou marque existants ne sont reproduits.
