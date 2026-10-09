# Règles d'interface

Annexe de `agent-ui-designer`. Lue en entier à la première utilisation dans
une conversation, pour tout type d'écran. Ces règles s'appliquent pendant la
génération, pas en relecture.

Les valeurs par défaut (couleurs, police, rayons) sont celles du socle décrit
dans le fichier principal. Une charte (`DESIGN.md`) ou un design system
imposé les remplace ; les règles de structure, elles, restent.

## 1. Typographie

- Tailles autorisées, sans exception : **12, 14, 16, 18, 20, 24, 28, 32, 40,
  48 px**. Toute autre valeur (13, 15, 17, 22, 30, 36…) est interdite. Une
  charte peut ajouter des tailles (un titre vitrine à 64 px) : elles sont
  alors déclarées dans son échelle.
- En Tailwind, `text-3xl` (30 px) et `text-4xl` (36 px) sont hors échelle :
  utiliser `text-[28px]`, `text-[32px]` ou `text-[40px]`.
- Usage par défaut :
  - 12 : légendes, annotations, badges, texte d'aide
  - 14 : corps en interface dense (tableaux, listes compactes, panneau latéral)
  - 16 : corps de texte standard
  - 18 à 20 : sous-titres, titres de section, titres de carte
  - 24 à 32 : titre de page (H1)
  - 40 à 48 : pages d'accueil ou vitrine uniquement, jamais dans une interface de travail
- 3 à 4 niveaux de hiérarchie par écran.
- La hiérarchie se fait par la **taille et la graisse**, jamais par la couleur.
- 2 ou 3 graisses au maximum (400, 500, 600).
- Interlignage : 1,2 pour les titres, 1,5 pour le corps.
- Largeur de ligne du texte courant : 45 à 75 caractères ; 40 à 60 dans un formulaire.
- Les niveaux de titres se suivent (`h1` puis `h2`, jamais `h1` puis `h3`) et
  il n'y a qu'un `h1` par écran.

### Contenu sous contrainte d'espace

- Une information est une unité insécable : un nombre et son unité ou son
  signe, une icône et son libellé, une date, une référence, un nom. Ces
  unités ne se coupent jamais (espace insécable, `white-space: nowrap`).
- Une ligne porte une idée. Une valeur, sa variation et son contexte ne se
  concatènent pas sur une même ligne : chaque niveau a sa ligne et sa taille.
- Tout contenu a un comportement décidé quand la place manque : retour à la
  ligne à un endroit choisi, troncature avec ellipse (et un moyen de lire le
  texte complet), ou passage sur la ligne suivante. Rien n'est laissé au
  navigateur. Dans un conteneur flex ou grid, l'élément texte a `min-width: 0`.
- Chaque composant est généré avec son contenu le plus long et sa largeur la
  plus petite, pas avec le cas confortable.
- Chiffres tabulaires (`tabular-nums`) partout où des valeurs s'alignent ;
  nombres alignés à droite dans les tableaux.
- Quand un même élément se répète (cartes, badges, lignes), tous les
  exemplaires ont la même structure, cas neutre ou vide compris.
- **Les emplacements sont réservés.** Dans une cellule ou une carte répétée,
  chaque information a une place fixe, qu'elle soit présente ou non : un
  marqueur absent laisse un espace vide, il ne fait pas remonter ce qui est
  en dessous. Ce qui se lit en colonne est à la même hauteur d'une cellule à
  l'autre.
- **Largeur minimale d'une cellule répétée** = son contenu le plus large + 8 px
  de chaque côté. On réduit le contenu ou on fait défiler, on ne resserre pas.
- Une collection d'étiquettes qui ne tient pas passe à la ligne ou se termine
  par un « +3 » qui ouvre la liste complète.

## 2. Couleurs par rôle

Trois familles qui ne se mélangent jamais, plus deux familles à part.

### Contenu (texte, titres, filets, surfaces)

- Neutres **sans teinte** : blanc pur pour la surface, gris à composantes
  égales (Tailwind `neutral`) pour les fonds alternés, les filets et les
  textes secondaires. Jamais de gris bleutés (`slate`, `gray`, `zinc`) ni de
  noir bleu-nuit, sauf si la charte les impose.
- Filets et ombres : transparences de noir pur (`rgba(0,0,0,.08)` environ).
- Un titre est toujours en couleur de contenu. Jamais dans la couleur
  d'action ni de sélection.

### Action

- Réservée à ce qui déclenche quelque chose : bouton primaire, lien.
- C'est la couleur la plus forte de l'écran, en aplat plein. Socle : `blue-600`,
  survol `blue-700`, texte blanc.
- Une seule action primaire par zone.

### Sélection (« vous êtes ici »)

- Onglet ouvert, entrée de menu courante, ligne sélectionnée, filtre actif.
- Toujours **plus discrète** que l'action : socle `blue-50` en fond,
  `blue-700` en texte, graisse 500. Jamais l'aplat plein du bouton primaire :
  une navigation active en aplat se lit comme un appel à cliquer.

### Gradation, du plus fort au plus faible

1. Bouton primaire
2. Élément actif (sélection)
3. Survol (`neutral-100`)
4. Texte et titres

### Sémantique et données

- Les couleurs sémantiques (succès `green-600`, alerte `amber-600`, erreur
  `red-600`, information) qualifient un état ou un message, jamais une
  action ; seule l'action destructive peut porter la couleur d'erreur.
- Les graphiques utilisent une palette de données distincte de l'action
  (voir `donnees.md`). Un graphique n'est pas cliquable : il n'a pas droit à
  la couleur d'action.

### Règles d'usage

- Un élément qui ne réagit pas au clic n'a pas droit à une couleur interactive.
- Deux éléments visibles en même temps avec la même couleur ont le même rôle.
- Les couleurs s'appellent par rôle (`action-primary`, `selected-bg`,
  `text-muted`, `border`…) ou par token Tailwind, jamais par une valeur
  inventée. Toute couleur qui manque à la charte se prend dans Tailwind.
- Contraste : 4,5:1 pour le texte, 3:1 pour les grands textes, les
  composants et l'anneau de focus.
- Aucune information portée par la couleur seule.

## 3. Espacement et grille

- Espacements en multiples de 4 : **4, 8, 12, 16, 24, 32, 48, 64 px**. En
  Tailwind, pas de `p-2.5`, `gap-1.5`, `m-3.5` (10, 6, 14 px).
- Une grille par écran, marges et gouttières fixées une fois (défaut : 12
  colonnes, gouttière 24, marge 32 sur ordinateur).
- Une densité par écran, choisie au cadrage : *confortable* (16 / 24) ou
  *compacte* (8 / 12). On ne mélange pas.
- Ce qui va ensemble est rapproché, ce qui est différent est séparé par un
  espace plus grand. L'espace fait le regroupement avant les bordures.

### Padding interne

- Le texte ne touche jamais un bord : 16 px minimum en horizontal dans un
  bouton, un champ, un onglet ; 12 px pour un badge ou une chip.
- Un conteneur qui regroupe des éléments a son propre padding (4 à 8 px)
  **et** ses enfants ont le leur.
- Rayon du parent = rayon de l'enfant + padding du parent.

### Rythme vertical

- 8 entre un label et son champ, 24 entre deux champs, 32 entre deux blocs,
  48 entre deux sections.
- L'espace au-dessus d'un titre est toujours plus grand que l'espace en
  dessous.

## 4. Composants et états

- Avant de créer un composant, chercher s'il existe dans le projet, la
  charte ou shadcn/ui. Réutiliser d'abord.
- Chaque composant interactif est livré avec ses états : défaut, survol,
  focus, pressé, désactivé, et erreur ou chargement quand il en a.
- Le focus a la même apparence partout : anneau de 2 px, décalé de 2 px,
  contraste 3:1.
- Un bouton en chargement garde son libellé et ajoute un indicateur.
- Un bouton principal tient sur une ligne. On raccourcit le libellé ou on
  élargit le bouton, jamais l'inverse.
- Une intention, un libellé : pas « Contacter » et « Nous écrire » sur le
  même écran.
- **Logo** : l'emplacement n'est jamais vide ni réduit à un carré de couleur.
  Sans logo fourni, un monogramme original sur l'initiale du produit, dans
  une forme simple, en couleur d'action, en SVG, avec
  `data-logo-slot="<produit>"`. Jamais la copie d'un logo existant.
- **Thème** : un écran applicatif est livré en clair uniquement
  (`color-scheme: light`, aucune classe `dark:`), sauf si la charte demande
  un thème sombre.

### Les états d'écran (vide, chargement, erreur, succès)

Ils ne sont pas construits par défaut. Le cadrage les liste ; l'écran est
livré dans son état normal et le résumé propose de les ajouter. Quand on les
ajoute, lire `etats.md`.

## 5. Structure d'écran

- Choisir un layout parmi les familles connues : liste, fiche détail,
  formulaire, tableau de bord, assistant en étapes, page d'accueil
  applicative.
- Une action primaire par zone ; les secondaires en retrait (bouton
  secondaire, lien, icône).
- Les actions destructives sont séparées des autres. Une annulation
  possible après coup vaut mieux qu'une confirmation ; si une confirmation
  est nécessaire, elle nomme l'action et l'objet (voir `redaction.md`).
- Une modale seulement quand la tâche exige d'interrompre (confirmation
  destructive, saisie qui bloque la suite). Sinon : panneau latéral, ligne
  dépliée ou page.
- Toute action donne un retour visible.
- Navigation, titres et actions principales restent au même endroit d'un
  écran à l'autre. La navigation dit toujours où l'on est : en cachant tout
  sauf elle, on doit savoir quel produit, quelle rubrique, quel écran.

## 6. Accessibilité (RGAA, WCAG 2.2 AA)

- Cibles cliquables : 24 px minimum, 44 px recommandé sur tactile.
- Focus visible sur tout élément interactif, jamais supprimé, et jamais
  masqué par un en-tête ou un pied de page fixe (`scroll-padding`).
- Chaque champ a un label visible ; le placeholder n'est pas un label.
- Ordre de tabulation logique ; pas de `tabindex` positif.
- Images porteuses de sens : texte alternatif ; décoratives : `alt=""`.
- Bouton qui n'a qu'une icône : nom accessible (`aria-label`).
- Ce qui navigue est un lien (`<a>`), ce qui agit est un bouton
  (`<button>`). Jamais une `div` cliquable.
- Toute action par glisser-déposer a une alternative au clic et au clavier.
- Toasts et messages de validation annoncés (`aria-live="polite"`).
- Connexion : collage autorisé, gestionnaire de mots de passe compatible,
  aucun test de mémoire.
- Une modale ou un tiroir retient le focus et le rend à l'élément d'origine
  à la fermeture.

## 7. Cohérence avec l'existant

- Avant chaque écran, relire les écrans déjà produits et `design/decisions.md`
  et reprendre hiérarchie typo, densité, grille, composants, position des
  actions et de la navigation.
- Pas de variante d'un composant existant sans raison fonctionnelle, écrite
  dans le résumé.
- Conflit entre l'existant et une règle : le signaler dans le résumé plutôt
  que trancher seul.

## 8. Iconographie

- Un seul jeu d'icônes par produit (socle : Lucide), même épaisseur, même grille.
- Taille calée sur le texte, jamais sous 14 px : texte 16 → icône 16 ; texte
  14 → 14 ; texte 12 → 14 ; titres 20 et plus → 20 ou 24.
- Une icône seule n'est admise que pour les symboles universels (fermer,
  rechercher, menu, précédent, suivant). Sinon libellé visible, ou au moins
  nom accessible et infobulle.
- Les icônes prennent la couleur du texte qu'elles accompagnent.
- Jamais d'emoji ni de caractère Unicode à la place d'une icône.

## 9. Élévation et surfaces

Le rendu vient de la charte. Le système d'empilement, lui, est fixe.

- Plans, du plus bas au plus haut : fond de page → conteneur (carte,
  panneau) → élément flottant (menu, infobulle) → superposition (modale,
  tiroir) → notification.
- En code, ces plans ont une échelle de superposition fixe : contenu 0,
  en-tête fixe 10, élément flottant 20, superposition 30, notification 40.
  Aucune autre valeur.
- Chaque plan se distingue du précédent par **un seul moyen** : teinte de
  fond, bordure ou ombre, choisi une fois pour tout le produit. Pas de filet
  fin sous une large ombre.
- Plus un plan est haut, plus il est détaché.
- Une carte dans une carte ne crée pas de plan : espace ou filet.
- **Un filet par jonction.** Dans une grille ou un tableau, chaque cellule ne
  porte de filet que sur deux côtés ; la bordure du conteneur remplace les
  filets qui la touchent. Un double filet est toujours une erreur.
- **Les angles appartiennent au conteneur** (`overflow: hidden`), et les
  quatre angles ont la même valeur.
- **Un seul niveau de cadre par zone.** Dans un conteneur bordé, chips,
  filtres et boutons secondaires sont sans cadre, séparés par l'espace.
- Filets légers par défaut (`rgba(0,0,0,.08)`) ; plus marqués (.16) pour les
  champs et boutons secondaires.
- Une superposition assombrit ce qui est dessous et retient le focus.

## 10. Formulaires

- La largeur d'un champ dit ce qu'on y saisit : code postal, date, montant
  courts ; nom, adresse longs ; commentaire multiligne.
- Champs groupés par sujet, titre de groupe au-delà de deux groupes. Une
  colonne par défaut ; deux seulement pour des champs liés et courts.
- Label au-dessus, aligné à gauche ; texte d'aide sous le champ, avant
  l'erreur.
- L'optionnel est indiqué ; l'obligatoire n'est pas marqué si c'est la majorité.
- Bon `type`, bon `inputmode`, attribut `autocomplete` sur les champs
  d'identité, d'adresse et de connexion.
- On ne bloque ni la frappe ni le collage : on laisse saisir et on explique.
- Validation à la sortie du champ ou à l'envoi, jamais à chaque frappe ;
  l'erreur est sous le champ, reliée par `aria-describedby`.
- Le bouton d'envoi n'est jamais désactivé d'avance. À l'envoi, le focus va
  sur la première erreur ; un formulaire long affiche en plus un récapitulatif
  des erreurs en haut, avec un lien vers chaque champ.
- Pendant l'envoi : bouton désactivé, indicateur, libellé conservé.
- Une seule validation, en bas, alignée sur les champs ; l'annulation à côté,
  en secondaire.
- Formulaire long : étapes avec indication de progression.
- Quitter un formulaire modifié demande confirmation.

## 11. Alignement optique

- Le centrage mathématique n'est pas le centrage visuel : un triangle de
  lecture, une flèche, une icône dans un bouton rond se décalent à l'œil.
- Les textes s'alignent sur leur bord visible ; une puce ou un guillemet
  débordent légèrement dans la marge.
- Une icône et son texte s'alignent sur le centre optique de la ligne.
- Un cercle ou un triangle à côté d'un carré sont légèrement agrandis.
- Quand un alignement paraît faux avec des valeurs justes, la perception a
  raison : on ajuste de 1 ou 2 px et on le note.

## 12. Densité des interfaces métier

- Travail intensif (instruction, back-office) : densité compacte, corps à 14,
  lignes de tableau à 40 ou 48 px, espacements 8 / 12 / 16.
- Tableau large : colonnes d'identification fixées à gauche, ordre du plus
  identifiant au plus secondaire.
- Filtres visibles et persistants au-dessus des données ; filtres actifs en
  étiquettes retirables une à une ; nombre de résultats toujours affiché.
- Actions de ligne regroupées à droite ; actions en masse seulement quand une
  sélection existe, dans une barre qui dit combien d'éléments sont sélectionnés.
- Statuts : pastille + libellé, jamais la couleur ou le texte seuls.
- Ce qui est consulté cent fois par jour est à un clic, sans changer de page.

## 13. Internationalisation

- Un texte traduit change de longueur : prévoir +30 % sur un paragraphe, bien
  plus sur un libellé court. Aucune largeur n'est figée sur la longueur d'un mot.
- Langues à idéogrammes : 14 px minimum, interlignage plus grand. Arabe et
  hébreu : mise en page miroitée, propriétés logiques (`margin-inline-start`).
- Pas de texte dans les images, pas de flèche qui dépend du sens de lecture,
  pas de phrase construite en recollant des morceaux.
- Dates, heures, nombres, monnaies au format de la langue de l'utilisateur.
- Le design prépare la place et les comportements ; le développement gère
  les chaînes et les formats.

## 14. Surfaces du navigateur

Ce que personne ne dessine se voit quand même. On le règle une fois, dans les
couleurs du socle ou de la charte :

- sélection de texte (`::selection`) ;
- anneau de focus (`:focus-visible`) ;
- soulignement des liens (épaisseur et décalage) ;
- barres de défilement des zones qui défilent ;
- couleur du curseur de saisie (`caret-color`).

## 15. Lois de design

Elles guident les choix qu'aucune règle ne couvre.

- **Signifiants** : ce qui est cliquable en a l'air, ce qui ne l'est pas non.
- **Gestalt** : le regroupement visuel exprime le regroupement logique.
- **Fitts** : les actions fréquentes sont grandes et proches.
- **Hick** : moins d'options visibles, décision plus rapide. Au-delà de
  quatre options au même niveau, regrouper ou masquer le secondaire.
- **Miller** : des paquets de 5 à 7 éléments.
- **Jakob** : respecter les conventions connues.
- **Von Restorff** : une seule chose différente par zone, l'action primaire.
- **Tesler** : l'interface porte la complexité, pas l'utilisateur.
- **Krug** : l'utilisateur parcourt, il ne lit pas. Retirer la moitié des
  mots, puis encore la moitié de ce qui reste.
- **Nielsen** : visibilité de l'état, langage du monde réel, contrôle et
  liberté, cohérence, prévention des erreurs, reconnaissance plutôt que
  rappel, efficacité, sobriété, aide à la reprise, aide.
