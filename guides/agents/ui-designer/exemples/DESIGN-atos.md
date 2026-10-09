---
version: alpha
name: atos
description: "Charte Atos pour les interfaces, d'après les Atos Brand Guidelines du 2 mars 2026. Atos Blue pour l'action, neutres tirés de Deep Blue, aucun coin arrondi sauf avatars et pastilles, Raleway en substitut digital de Biennale."

colors:
  surface: "#ffffff"
  surface-alt: "#f3f3f7"
  surface-sunken: "#e6e6ef"
  hover: "#e6e6ef"
  border: "#ccccde"
  text-heading: "#00005c"
  text-body: "#00005c"
  text-muted: "#66669d"
  action-primary: "#0073e6"
  action-primary-hover: "#1981e9"
  on-action: "#ffffff"
  selected-bg: "#e6f1fd"
  selected-fg: "#0073e6"
  focus-ring: "#00005c"
  atos-blue: "#0073e6"
  atos-light-blue: "#3dc7ff"
  atos-deep-blue: "#00005c"
  blue-10: "#e6f1fd"
  blue-20: "#cce3fa"
  blue-40: "#99c7f5"
  blue-80: "#1981e9"
  deep-blue-10: "#e6e6ef"
  deep-blue-20: "#ccccde"
  deep-blue-40: "#9999be"
  deep-blue-60: "#66669d"
  light-blue-10: "#ecf9ff"
  light-blue-20: "#d8f4ff"
  pink: "#ef5e82"
  green: "#4aa82d"
  purple: "#663894"
  orange: "#f56a00"
  success: "#4aa82d"
  warning: "#f56a00"
  error: "#ef5e82"
  data-1: "#0073e6"
  data-2: "#3dc7ff"
  data-3: "#4aa82d"
  data-4: "#f56a00"
  data-5: "#ef5e82"
  data-6: "#663894"

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
  body-dense:
    fontFamily: Raleway
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: Raleway
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
  title-section:
    fontFamily: Raleway
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.3
  title-page:
    fontFamily: Raleway
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.2

rounded:
  none: 0
  full: 9999px
---

# Atos

Exemple de charte au format DESIGN.md, converti depuis l'ancien fichier de
marque. Les valeurs viennent de la charte fournie.

## 1. Identité

### Couleurs

- Principales : Atos Blue #0073E6, Atos Light Blue #3DC7FF, Atos Deep Blue #00005C.
- Soutien : Pink #EF5E82, Green #4AA82D, Purple #663894, Orange #F56A00.
- Les neutres sont des teintes de Deep Blue : c'est un choix de charte, il
  remplace la règle des gris sans teinte.
- Texte : Deep Blue sur blanc (18,2:1). Texte secondaire : Deep Blue 60 (5,8:1).
- Action : Atos Blue, texte blanc (4,6:1). Survol : Blue 80.
- Sélection : fond Blue 10, texte Atos Blue.
- Texte sur fond coloré : blanc sur Atos Blue ou Deep Blue ; Deep Blue sur
  Light Blue ; les couleurs de soutien ne portent du texte qu'en grande taille.

### Typographie

Biennale (propriétaire). Substitut digital autorisé : Raleway, tant que
Biennale n'est pas livrée. Titres en Bold, texte en Regular, libellés et
boutons en Medium. Raleway étant fine, le corps d'interface se compose en
14 px.

### Formes

Pas de coins arrondis sur les boîtes, boutons, champs et cartes (la charte
l'interdit pour les applications digitales). Seuls les avatars et pastilles
restent ronds. Motif de marque : les « Curves of Progress », quart de cercle
dans un carré, quatre orientations, jamais déformé ni en contour ; usage
décoratif en petit uniquement, jamais comme icône.

### Logo

Fourni par la communication, en Atos Blue sur blanc ou en blanc sur fond
coloré. L'agent ne le redessine pas : le nom « Atos » en texte Deep Blue
tient la place, avec `data-logo-slot="atos"`.

### Ton

Optimiste, précis, accueillant. Vouvoiement.

## 2. Design system imposé

Aucun : composants shadcn/ui restylés selon cette charte (rayon 0).

## 3. Direction de maquettage

À compléter par le designer.

## 4. À faire, à éviter

- À faire : Deep Blue pour tout le texte, Atos Blue pour l'action seule.
- À éviter : coins arrondis, couleurs de soutien en petit texte, Light Blue
  en texte sur blanc.

## 5. Consignes pour l'agent

Lire ce fichier avant chaque écran. Ne jamais modifier son contenu.
