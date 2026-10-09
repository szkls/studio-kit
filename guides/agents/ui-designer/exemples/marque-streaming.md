# Marque — direction artistique "streaming musical" (inspirée de Spotify)

Fichier consommé par l'agent UI. Il surcharge les défauts marque blanche
uniquement sur les points listés ici. Tout ce qui n'est pas mentionné garde
la règle de l'agent (échelle typo, espacements, états, accessibilité).

## Ce que la marque impose

**Thème** — sombre uniquement. Pas de version claire.

**Palette par rôle**
| Rôle | Valeur | Usage |
|---|---|---|
| surface-base | #121212 | fond de page |
| surface-nav | #000000 | navigation latérale |
| surface-card | #181818 | cartes, tuiles, panneau |
| surface-card-hover | #282828 | survol des cartes et lignes |
| surface-input | #242424 | champs de saisie |
| border | #2A2A2A | séparateurs, discrets |
| text-heading | #FFFFFF | titres |
| text-body | #FFFFFF | texte courant |
| text-muted | #B3B3B3 | texte secondaire, dates, descriptions |
| text-disabled | #6A6A6A | désactivé |
| action-primary | #1ED760 | bouton primaire, une seule par zone |
| action-primary-hover | #3BE477 | survol du bouton primaire |
| action-primary-fg | #000000 | texte sur le bouton primaire |
| selected-bg | #282828 | entrée de navigation active |
| selected-fg | #FFFFFF | texte de l'élément actif (le reste de la nav est en text-muted) |
| focus-ring | #FFFFFF | anneau de focus |
| error | #F15E6C | erreurs, retards critiques |
| warning | #FFA42B | alertes, échéances |
| success | #1ED760 | succès (même vert que l'action, en texte ou pastille uniquement) |

**Typographie**
- Famille : géométrique, large, sans empattement. La police officielle n'étant
  pas libre, utiliser Figtree (Google Fonts) avec fallback système.
- Titres en 700 (gras), corps en 400, labels et boutons en 700.
- Les titres de page peuvent monter à 32 px.
- L'échelle de l'agent (12/14/16/18/20/24/28/32…) reste la règle.

**Formes**
- Boutons : pilule (rayon 500 px), texte en gras.
- Cartes et tuiles : rayon 8 px, sans bordure visible, la couleur de fond fait
  la séparation.
- Champs : pilule, fond surface-input, sans bordure au repos, bordure blanche
  au focus.
- Icônes : trait 1,5 px, blanches ou text-muted, jamais colorées.

**Navigation**
- L'élément actif se distingue par le passage de text-muted à blanc et par
  le fond selected-bg. Jamais par la couleur d'action.

**Liens texte**
- Blancs, soulignés en permanence. Le vert est réservé au bouton primaire
  et aux indicateurs de succès.

**Ton des textes**
- Direct, tutoiement possible, phrases courtes. Pas de jargon administratif.

## Ce que la marque ne change pas
- Échelle typo et interlignages.
- Espacements en multiples de 4 et rythme vertical.
- Une seule action primaire par zone.
- Contrastes minimum (4,5:1 texte, 3:1 composants), focus visible, cibles.
- Structure des composants et leurs états.

## Assets
- Logo et nom : fournis par le client au moment de l'intégration.
  Placeholder "Nom du produit" en attendant.
