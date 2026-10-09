---
version: alpha
name: socle-studio
description: "Socle par défaut du studio quand aucune charte n'est fournie. Neutres sans teinte (Tailwind neutral), un accent bleu (blue-600) réservé à l'action et à la sélection, couleurs sémantiques et palette de données distinctes, Roboto, composants shadcn/ui et icônes Lucide. Thème clair uniquement."

colors:
  surface: "#ffffff"
  surface-alt: "#fafafa"
  surface-sunken: "#f5f5f5"
  hover: "#f5f5f5"
  border-strong: "#d4d4d4"
  border: "#e5e5e5"
  text-heading: "#171717"
  text-body: "#171717"
  text-secondary: "#525252"
  text-muted: "#737373"
  neutral-50: "#fafafa"
  neutral-100: "#f5f5f5"
  neutral-200: "#e5e5e5"
  neutral-300: "#d4d4d4"
  neutral-400: "#a3a3a3"
  neutral-500: "#737373"
  neutral-600: "#525252"
  neutral-700: "#404040"
  neutral-800: "#262626"
  neutral-900: "#171717"
  neutral-950: "#0a0a0a"
  action-primary: "#2563eb"
  action-primary-hover: "#1d4ed8"
  on-action: "#ffffff"
  selected-bg: "#eff6ff"
  selected-fg: "#1d4ed8"
  focus-ring: "#2563eb"
  selection-text: "#dbeafe"
  blue-200: "#bfdbfe"
  success: "#16a34a"
  success-fg: "#15803d"
  success-bg: "#f0fdf4"
  warning: "#d97706"
  warning-strong: "#f59e0b"
  warning-fg: "#b45309"
  warning-bg: "#fffbeb"
  error: "#dc2626"
  error-fg: "#b91c1c"
  error-bg: "#fef2f2"
  data-1: "#0d9488"
  data-2: "#7c3aed"
  data-3: "#ea580c"
  data-4: "#c026d3"
  data-5: "#4d7c0f"
  data-other: "#737373"
  data-scale-50: "#f0fdfa"
  data-scale-100: "#ccfbf1"
  data-scale-200: "#99f6e4"
  data-scale-300: "#5eead4"
  data-scale-400: "#2dd4bf"
  data-scale-500: "#14b8a6"
  data-scale-700: "#0f766e"

typography:
  scale:
    xs: 12px
    sm: 14px
    base: 16px
    lg: 18px
    xl: 20px
    2xl: 24px
    3xl: 28px
    4xl: 32px
    5xl: 40px
    6xl: 48px
  caption:
    fontFamily: Roboto
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
  body-dense:
    fontFamily: Roboto
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: Roboto
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  title-card:
    fontFamily: Roboto
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.3
  title-section:
    fontFamily: Roboto
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
  title-page:
    fontFamily: Roboto
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.2
  display:
    fontFamily: Roboto
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.2

rounded:
  none: 0
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  full: 9999px
  # Rôles lus par le kit studio : control = boutons, champs, onglets ;
  # surface = cartes, panneaux, menus, fenêtres ; badge = badges de statut.
  control: 6px
  surface: 12px
  badge: 9999px

spacing:
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  6: 24px
  8: 32px
  12: 48px
  16: 64px
---

# Socle du studio

Ce fichier décrit l'identité par défaut, utilisée quand le projet n'a pas de
charte. Dans le kit studio, `src/theme.css` est généré à partir de son
en-tête (`npm run theme`, automatique quand l'app tourne) : on ne modifie
jamais `src/theme.css` à la main. Le projet Claude « Charte graphique » produit un fichier au même
format pour chaque client : il remplace celui-ci à la racine du projet.
L'en-tête (entre les deux lignes `---`) est lu par les outils de contrôle ;
le texte ci-dessous est lu par l'agent.

## 1. Identité

### Vue d'ensemble

Interface de travail claire et sobre. Le blanc et les gris sans teinte
portent la structure ; une seule couleur d'accent signale ce qui agit et ce
qui est sélectionné ; les couleurs vives sont réservées aux états et aux
données.

### Couleurs

- Surfaces et textes : échelle `neutral`, gris à composantes égales.
- Action : `action-primary` (bouton primaire, liens), texte blanc dessus.
- Sélection : `selected-bg` + `selected-fg`, graisse 500. Jamais l'aplat de l'action.
- États : `success`, `warning`, `error`, avec leurs variantes texte (`-fg`)
  et fond (`-bg`).
- Données : `data-1` à `data-5` dans cet ordre, `data-other` pour le reste ;
  `data-scale-*` pour une échelle continue.
- Filets et ombres : transparences de noir (`rgba(0,0,0,.08)`).
- Toute couleur absente de cette liste se prend dans Tailwind et s'ajoute ici.

### Typographie

Roboto (Google Fonts), repli `system-ui, sans-serif`. Graisses 400, 500,
600. Échelle : 12, 14, 16, 18, 20, 24, 28, 32, 40, 48 px. Chiffres
tabulaires partout où des valeurs s'alignent.

### Formes

- Boutons, champs, éléments de navigation : rayon `md` (6 px).
- Cartes et panneaux : rayon `xl` (12 px).
- Badges de statut : rayon `full`.
- Élévation : les cartes se distinguent par une bordure `border`, les
  éléments flottants par une ombre légère, les modales par une ombre nette
  et un voile.

### Logo

Aucun logo fourni : monogramme sur l'initiale du produit, carré arrondi en
`action-primary`, lettre blanche, `data-logo-slot`.

### Ton

Vouvoiement, phrases courtes, vocabulaire du métier de l'utilisateur.

## 2. Design system imposé

Aucun. Composants shadcn/ui, icônes Lucide (trait 2 px).

Quand un design system est imposé (DSFR, design system client), cette
section donne : le paquet et sa version, les composants à utiliser, leurs
règles d'usage et les gabarits de pages officiels. Ses composants passent
alors avant shadcn.

## 3. Direction de maquettage

Aucune référence fournie. L'agent s'appuie sur ses fiches de références.

Quand le designer fournit des écrans de référence (Mobbin, autres
applications), ils sont listés ici avec ce qu'il faut en retenir :
densité, organisation, traitement d'un composant. Ce sont des directions de
maquettage, pas une charte : on n'en reprend ni les couleurs ni les logos.

## 4. À faire, à éviter

À faire :
- une action primaire par zone, en `action-primary` ;
- des écrans remplis de données vraisemblables ;
- la sélection toujours plus discrète que l'action.

À éviter :
- les gris bleutés (`slate`, `gray`, `zinc`) ;
- le thème sombre ;
- la couleur d'accent sur un titre ou un élément non cliquable.

## 5. Consignes pour l'agent

Lire ce fichier avant chaque écran. Ne jamais modifier son contenu ; une
proposition d'évolution s'ajoute, datée, en fin de fichier dans une section
« Propositions de mise à jour (à valider) ».
