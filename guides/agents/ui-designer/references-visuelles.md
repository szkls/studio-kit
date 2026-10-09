# Références visuelles — corpus de sites et de composants

Fichier compagnon de `references-landings.md`. Celui-ci est un corpus en
deux parties : des **sites** (une fiche par site, pour les pages et leur
traitement) et des **composants** (une fiche par bibliothèque, pour
l'anatomie, les variantes et les états). L'autre fichier est la synthèse :
les principes communs qui en ressortent, mis à jour quand le corpus change.

Chaque fiche couple une lecture (ce qu'on retient) et un visuel (l'url à
ouvrir) : l'un ne va pas sans l'autre.

Les agents ne lisent pas tout : avant une page, ils filtrent les fiches par
`type` et par `tags`, et ne s'appuient que sur celles qui correspondent
(une landing produit ne s'inspire pas d'un site de studio, et inversement).

Rien n'est copié. Une fiche décrit une structure, un traitement, un
rythme ; elle ne reprend ni les textes ni les visuels du site.

## Lecture + visuel : comment les agents utilisent ce fichier

Une fiche seule ne suffit pas : le texte dit *quoi* regarder, seule la page
montre *comment* c'est fait (échelle réelle des titres, épaisseur des
filets, rythme du scroll, qualité des fragments). Avant de concevoir une
page, l'agent :

1. filtre les fiches par `type` et `tags` pour ne garder que celles qui
   correspondent (2 à 4 fiches, pas tout le corpus) ;
2. pour chacune, **ouvre l'`url` dans le navigateur invisible** et parcourt la page
   en entier, en prenant une capture du héros, d'une section de
   fonctionnalités et du pied ; si le site n'est pas accessible (mur de
   connexion, page trop animée), il utilise la capture locale indiquée dans
   `captures/<nom-du-site>/` quand elle existe ;
3. compare ce qu'il voit à la fiche, et note dans son résumé final les
   deux ou trois traitements qu'il a retenus de chaque référence, en
   précisant ce qu'il a transposé (une structure, un rythme) et non copié ;
4. si la fiche et la page ne concordent plus (site refondu), il le signale
   et met la fiche à jour avec la date du jour.

Le dossier `captures/` est optionnel : il sert de mémoire visuelle quand un
site change ou devient inaccessible. Une capture par vue clé, nommée
`<site>-<section>-<AAAA-MM-JJ>.png`.

## Partie 1 — Sites

### Format d'une fiche site

```
### <nom du site> — <url>
- type : landing produit | site vitrine | app | documentation | studio | e-commerce | autre
- relevé le : <date>
- secteur : <ex. SaaS B2B, vidéo, finance, secteur public>
- tags : <3 à 6 mots-clés : sombre, produit-en-héros, bento, typo-serif, sobre, dense…>
- ce qu'on retient :
  - structure : <ordre des sections, ce qui est en héros, longueur>
  - typographie : <échelle, graisses, interlettrage, une ou deux familles>
  - couleur et surfaces : <thème, nombre de couleurs, comment les blocs se séparent>
  - visuels : <fragments de produit, photos, illustrations, 3D… et leur traitement>
  - mouvement : <ce qui bouge, comment, et ce qui ne bouge pas>
  - écriture : <ton, longueur des titres, personne>
- à ne pas reprendre : <ce qui est propre à cette marque et n'est pas transposable>
- note : <pourquoi ce site est dans le corpus, en une phrase>
```

### Fiches sites

### Attio — https://attio.com
- url : https://attio.com
- visuel : ouvrir l'url dans le navigateur invisible (ou la capture dans `captures/`) et regarder la page avant de concevoir ; la fiche dit quoi regarder, l'écran montre comment c'est fait
- type : landing produit
- relevé le : 2026-09-16
- secteur : SaaS B2B (CRM)
- tags : produit-en-héros, fragments-haute-fidélité, clair, sobre, long-scroll, narration-par-onglets
- ce qu'on retient :
  - structure : titre court + une phrase + deux actions, puis immédiatement un grand fragment de produit vivant (conversation, transcription) ; logos clients ; une très longue section de narration découpée en 5 temps navigables, chacun illustré par un ou deux fragments d'interface ; différenciateur en liste de 5 bénéfices ; écosystème ; chiffres d'échelle ; témoignage ; histoires clients ; changelog daté ; appel final qui reprend le titre.
  - typographie : une seule famille sans-serif, titres grands et gras, sous-titres en une phrase, beaucoup de titres de 3 à 6 mots au-dessus des fragments.
  - couleur et surfaces : fond blanc, quasi aucune couleur de page ; la couleur vient des fragments de produit ; blocs séparés par l'espace et des fonds gris très légers.
  - visuels : zéro illustration abstraite ; uniquement des fragments d'interface recadrés, avec noms, montants, dates, avatars, statuts, horodatages ; logos réels d'intégrations.
  - mouvement : les fragments sont animés comme s'ils étaient utilisés (conversation qui se déroule, commandes qui s'exécutent) ; révélations discrètes ; rien sur le texte.
  - écriture : direct, verbes d'action, titres qui décrivent ce que fait le produit à un instant précis ; ton légèrement tranchant.
- à ne pas reprendre : le vocabulaire "agentic", les noms de clients, la mise en scène spécifique des conversations.
- note : la référence pour "le produit réel comme seul visuel".

### Linear — https://linear.app
- url : https://linear.app
- visuel : ouvrir l'url dans le navigateur invisible (ou la capture dans `captures/`) et regarder la page avant de concevoir ; la fiche dit quoi regarder, l'écran montre comment c'est fait
- type : landing produit
- relevé le : 2026-09-16
- secteur : SaaS B2B (gestion de produit)
- tags : sombre, produit-en-héros, fragments-haute-fidélité, long-scroll, narration-par-capacités, dense
- ce qu'on retient :
  - structure : titre en une ligne + une phrase, un bandeau "nouveauté" en pilule, puis une fenêtre produit complète (la vue d'un ticket avec son activité, ses propriétés, ses avatars). Logos clients. Une section de positionnement en trois points numérotés "Fig 0.1 / 0.2 / 0.3". Puis quatre grandes capacités (intake, planification, IA, build), chacune avec un titre de deux mots, une phrase, un lien "en savoir plus", un ou plusieurs fragments d'interface (tableau kanban, fil de discussion, frise de planning, session d'agent, revue de code) et une liste de fonctionnalités en chips "+". Changelog daté, trois citations clients courtes, chiffre de clients, appel final sobre.
  - typographie : une seule sans-serif, titres moyens plutôt que gigantesques, phrases courtes, chips de 14 px partout. Beaucoup de texte d'interface (identifiants ENG-2085, statuts, dates) qui fait la texture de la page.
  - couleur et surfaces : thème sombre quasi monochrome ; les surfaces se distinguent par de très légers écarts de gris ; couleur uniquement dans les étiquettes de statut et les avatars ; pas d'accent de page.
  - visuels : uniquement des fragments d'interface, extrêmement détaillés (colonnes de kanban avec compteurs, diffs de code, calendrier de projet, conversations agent). Les fragments sont larges, souvent en pleine largeur de colonne.
  - mouvement : fragments animés comme en usage (issue créée "il y a 2 min", agent qui "travaille", PR qui se crée) ; révélations discrètes ; pas d'effet sur le texte.
  - écriture : très sobre, verbes à l'infinitif ou substantifs, titres de sections de 2 à 4 mots, une phrase de description ; ton d'outil pour experts.
- à ne pas reprendre : le thème sombre (choix de marque), le vocabulaire produit, les identifiants de tickets.
- note : la référence "densité et texture par le contenu d'interface", en sombre.

### AlignUI — https://www.alignui.com
- url : https://www.alignui.com
- visuel : ouvrir l'url dans le navigateur invisible (ou la capture dans `captures/`) et regarder la page avant de concevoir ; la fiche dit quoi regarder, l'écran montre comment c'est fait
- type : landing produit
- relevé le : 2026-09-16
- secteur : design system / bibliothèque de composants
- tags : clair, produit-en-héros, éditeur-live, grille-visible, sections-séparées-par-ornements
- ce qu'on retient :
  - structure : bandeau d'annonce, titre de deux lignes avec un mot en italique ou différencié, avatars + "utilisé par 2 000+", deux badges techniques (React, Tailwind), un CTA. Héros = éditeur de code en direct avec aperçu du composant. Puis : "construire plus vite" démontré par un formulaire de connexion qui se modifie sous des instructions ; grille de 9 bénéfices en icône + titre + phrase ; configurateur (couleur, thème, rayon) qui met à jour un fragment ; templates sectoriels en cartes ; blocs premium en liste ; FAQ en accordéons par catégorie ; communauté ; newsletter ; pied.
  - typographie : sans-serif, titres de taille moyenne, beaucoup de petits libellés de catégorie au-dessus des titres (le "eyebrow"), chiffres en préfixe ("180+ Components").
  - couleur et surfaces : fond blanc, gris très clairs, une seule couleur primaire ; règle et repères de grille visibles en fond (les graduations 0 / 50 / 100…) comme motif décoratif ; séparateurs de sections ornés (points, icône centrée).
  - visuels : le composant réel dans son éditeur, avec le code à côté ; captures de templates ; icônes en carrés pour les bénéfices.
  - mouvement : éditeur qui réagit aux instructions (le formulaire qui change), configurateur en direct.
  - écriture : courte, orientée bénéfice ("Make your customer happy by building faster"), beaucoup de compteurs.
- à ne pas reprendre : la grille graduée décorative, les séparateurs ornés, les icônes en carrés (c'est précisément le pattern que la synthèse déconseille).
- note : bon exemple de "le produit se démontre lui-même" (éditeur + configurateur), mais habillage plus template que les deux précédents.

### Airform — https://airform.space
- url : https://airform.space
- visuel : ouvrir l'url dans le navigateur invisible (ou la capture dans `captures/`) et regarder la page avant de concevoir ; la fiche dit quoi regarder, l'écran montre comment c'est fait
- type : site vitrine (produit physique)
- relevé le : 2026-09-16
- secteur : hardware / domotique (pompe à chaleur)
- tags : produit-physique, photo-et-vidéo, clair, éditorial, très-grands-titres, configurateur, specs
- ce qu'on retient :
  - structure : nom du produit en titre gigantesque, une ligne de promesse, un CTA "Order", un rendu vidéo du produit. Puis un paragraphe manifeste. "One system, two parts" avec galerie horizontale de photos en situation (café, intérieur bois, extérieur). Trois arguments numérotés 01 / 02 / 03 avec titre + paragraphe. Sections courtes alternant grand titre et sous-titre, chacune portée par une image ou une vidéo. Comparaison de prix en deux chiffres face à face. Configurateur (couleur, panneau, forme). Liste de six caractéristiques en mots-clés gras. Tableau de specs techniques. "Designed in Hawaii. Built in America." Liste d'attente avec un seul champ e-mail.
  - typographie : très grands titres (probablement 64 à 96 px), sous-titres en H4 longs, paragraphes courts ; deux niveaux seulement par section.
  - couleur et surfaces : blanc, noir, gris ; la couleur vient exclusivement des photos et rendus ; pas de cartes, pas de bordures : les sections se séparent par de très grands espaces.
  - visuels : rendus 3D et photographie de haute qualité, vidéos en boucle (texture d'eau, articulation d'un panneau, capteur) ; aucune icône ; aucune illustration vectorielle.
  - mouvement : vidéos en boucle silencieuses comme fond ou comme démonstration ; galerie à faire défiler ; probablement révélations au scroll discrètes.
  - écriture : phrases très courtes, presque des slogans ("Just add water."), ton premium et calme.
- à ne pas reprendre : les vidéos (assets propres), l'échelle des titres (choix de DA), le ton.
- note : la référence pour un produit physique : photo, vidéo, specs, grands silences.

### Moto Card — https://www.moto-card.com
- url : https://www.moto-card.com
- visuel : ouvrir l'url dans le navigateur invisible (ou la capture dans `captures/`) et regarder la page avant de concevoir ; la fiche dit quoi regarder, l'écran montre comment c'est fait
- type : site vitrine (fintech premium)
- relevé le : 2026-09-16
- secteur : finance / carte de paiement haut de gamme
- tags : sombre, luxe, plein-écran, vidéo-héros, majuscules, photographie, défilement-horizontal
- ce qu'on retient :
  - structure : horloges de quatre fuseaux dans l'en-tête (motif "mondial"), titre en majuscules sur vidéo plein écran, CTA "Apply for Access" répété à chaque section. Sections : positionnement, bandeau de devises qui défilent, concierge avec photos, cinq univers numérotés 01 à 05 (hôtels, dining, travel…), galerie photo, FAQ très longue par catégories, appel final, fenêtre modale de tarif d'adhésion.
  - typographie : titres en capitales, larges et espacées ; petits textes en minuscules ; contraste fort entre les deux.
  - couleur et surfaces : noir et blanc, photographie sombre ; pas de couleur d'accent ; les images font tout.
  - visuels : vidéo en héros, photographies d'architecture et de lieux, aucun fragment d'interface (le produit est une carte et une expérience, pas un écran).
  - mouvement : défilement horizontal de devises (marquee), horloges en temps réel, vidéo de fond ; ambiance plus que fonction.
  - écriture : slogans courts en majuscules, listes de trois mots, ton exclusif.
- à ne pas reprendre : le marquee, les capitales, le noir intégral, le ton luxe : c'est une DA de marque de bout en bout.
- note : exemple de landing "d'atmosphère" où le visuel remplace la démonstration ; à réserver aux produits dont la valeur est l'accès, pas l'usage.

### Hill — https://hill.com
- url : https://hill.com
- visuel : ouvrir l'url dans le navigateur invisible (ou la capture dans `captures/`) et regarder la page avant de concevoir ; la fiche dit quoi regarder, l'écran montre comment c'est fait
- type : landing produit (fintech)
- relevé le : 2026-09-16
- secteur : investissement (actions pré-IPO)
- tags : clair, sobre, preuve-par-la-presse, données-sourcées, capture-produit, court
- ce qu'on retient :
  - structure : titre en une ligne, une phrase, un CTA. "As seen on" : liste de titres d'articles de presse avec source et date (au lieu de logos). Capture de la plateforme. Logos des sociétés accessibles. Puis une section argumentaire en chiffres : comparaisons S&P vs marchés privés, frise "6 ans → 12 ans", "7 229 → 3 802", "453 M → 2,4 Md", chacune avec une note de bas de page numérotée renvoyant à une source. Positionnement en deux mots-clés, appel final, photo d'équipe et contact humain avec deux visages. Pied de page avec un long bloc légal et les sources détaillées.
  - typographie : sans-serif sobre, très grands chiffres, petit texte de source en exposant.
  - couleur et surfaces : blanc, très peu de couleur ; les grands nombres portent la hiérarchie.
  - visuels : une capture produit, des logos, des graphiques de données minimalistes, une photo d'équipe.
  - mouvement : probablement compteurs et frises qui se tracent ; sobre.
  - écriture : affirmations factuelles courtes, chaque chiffre sourcé.
- à ne pas reprendre : les données et sources elles-mêmes.
- note : la référence pour "la preuve par les chiffres sourcés" et pour une page courte qui va à l'essentiel.

### Parabol — https://parabol.fi
- url : https://parabol.fi
- visuel : ouvrir l'url dans le navigateur invisible (ou la capture dans `captures/`) et regarder la page avant de concevoir ; la fiche dit quoi regarder, l'écran montre comment c'est fait
- type : site vitrine (une page)
- relevé le : 2026-09-16
- secteur : fintech / protocole
- tags : très-court, vidéo, manifeste, minimal
- ce qu'on retient :
  - structure : titre, une phrase de positionnement, une phrase produit, un seul CTA "Contact us", une vidéo, logos d'investisseurs, pied. C'est tout.
  - typographie : un grand titre répété (probablement animé), corps court.
  - couleur et surfaces : la vidéo fait l'ambiance ; le reste est neutre.
  - visuels : une vidéo, des logos.
  - mouvement : le titre semble se répéter ou se transformer ; vidéo.
  - écriture : minimale.
- à ne pas reprendre : rien de transposable au-delà du principe.
- note : exemple limite de landing "carte de visite" : pour un produit qui n'a rien à démontrer publiquement.

### Apple Store (FR) — https://www.apple.com/fr/store
- url : https://www.apple.com/fr/store
- visuel : ouvrir l'url dans le navigateur invisible (ou la capture dans `captures/`) et regarder la page avant de concevoir ; la fiche dit quoi regarder, l'écran montre comment c'est fait
- type : e-commerce
- relevé le : 2026-09-16 (relevé de mémoire, page non lue ce jour : à vérifier dans le navigateur)
- secteur : e-commerce hardware
- tags : clair, tuiles, carrousels-horizontaux, photographie-produit, grand-blanc, cartes-arrondies
- ce qu'on retient :
  - structure : titre de bienvenue avec un lien de contact humain à côté, puis une succession de carrousels horizontaux : familles de produits (icônes + nom), nouveautés (grandes cartes avec image et titre), offres, "l'essentiel", accessoires, services. Chaque carrousel a un titre de deux parties (une en noir, une en gris) et des cartes de même hauteur.
  - typographie : une seule famille, titres de carrousel de taille moyenne, texte de carte court ; la seconde moitié du titre en gris pour créer la hiérarchie sans changer de taille.
  - couleur et surfaces : fond gris très clair, cartes blanches à grands rayons, la couleur vient des produits photographiés.
  - visuels : photographie produit sur fond uni ; aucune illustration ; icônes produit très simples dans le premier carrousel.
  - mouvement : défilement horizontal au trackpad ou aux flèches ; pas d'animation d'entrée.
  - écriture : très courte, orientée service ("Livraison gratuite", "Reprise").
- à ne pas reprendre : le catalogue lui-même ; l'échelle des rayons et des ombres est propre à la marque.
- note : la référence pour un hub e-commerce à carrousels : une grille de cartes homogènes, la photo comme seule couleur.

### X (profil @keviduk) — https://x.com/keviduk
- url : https://x.com/keviduk
- visuel : ouvrir l'url dans le navigateur invisible (ou la capture dans `captures/`) et regarder la page avant de concevoir ; la fiche dit quoi regarder, l'écran montre comment c'est fait
- type : autre (compte social)
- relevé le : non lisible (mur de connexion) — à consulter dans le navigateur (page derrière une connexion : Claude in Chrome)
- note : à documenter : sans doute un designer dont les publications servent de référence ; noter quelles publications, pas le profil.

### Atos Group — https://www.atosgroup.com/fr
- url : https://www.atosgroup.com/fr
- visuel : ouvrir l'url dans le navigateur invisible (ou la capture dans `captures/`) et regarder la page avant de concevoir ; la fiche dit quoi regarder, l'écran montre comment c'est fait
- type : site vitrine (corporate, services)
- relevé le : 2026-09-16 (page presse lue ; page d'accueil à relever visuellement)
- secteur : ESN / services numériques
- tags : corporate, clair, institutionnel, navigation-par-univers, chiffres-sourcés, presse
- ce qu'on retient :
  - structure : navigation en six univers (Groupe, Portfolio, Industries, Investisseurs, Presse, Carrières) ; le portfolio est découpé par marque (services Atos / produits Eviden) puis par offre ; les industries en six secteurs ; une presse datée et catégorisée ; un bloc "nos marques" en pied ; mentions légales et accessibilité en pied.
  - typographie : sans-serif corporate, titres moyens, communiqués très structurés en gras et listes.
  - couleur et surfaces : bleu signature et blanc ; sections institutionnelles sobres.
  - visuels : peu lisibles dans le texte ; photographie corporate à vérifier visuellement.
  - écriture : institutionnelle, vouvoiement, chiffres datés et sourcés, trois piliers technologiques répétés (cyber, IA agentique, souveraineté).
- à ne pas reprendre : le logo et la tagline sans accord de la communication ; les chiffres sans leur date.
- note : référence de structure pour un site de services (portfolio × industries × preuve), famille "corporate" absente du reste du corpus.

<!-- Ajouter les fiches sites suivantes ici, une par URL -->

## Partie 2 — Composants

### Lecture + visuel (composants)

Avant de concevoir ou de vérifier un composant, l'agent UI ouvre l'`url`
de la fiche dans le navigateur invisible sur la page du composant concerné (par
exemple la page "Input group" ou "Button"), regarde les variantes et les
états rendus, puis compare son propre composant à ce qu'il a vu :
anatomie, états présents, espacements internes. La fiche liste ce qu'il
faut chercher ; le rendu montre la référence.

### Format d'une fiche composant

```
### <nom> — <url>
- relevé le : <date>
- nature : bibliothèque de code | kit Figma | les deux | documentation d'un système
- stack : <React, Tailwind, Base UI…>
- ce qu'on retient :
  - anatomie : <comment un composant est découpé, nommé, composé>
  - variantes et tailles : <axes de variation et leurs noms>
  - états : <les états prévus, la façon de les rendre>
  - tokens : <ce qui est paramétrable et comment>
  - documentation : <comment un composant est présenté : aperçu, code, API, personnalisation>
- à ne pas reprendre : <ce qui est propre à la bibliothèque>
- note : <pourquoi c'est dans le corpus>
```

### Fiches composants


### Fluid Functionalism — https://www.fluidfunctionalism.com/docs/input-group
- url : https://www.fluidfunctionalism.com/docs/input-group
- visuel : ouvrir l'url dans le navigateur invisible (ou la capture dans `captures/`) et regarder la page avant de concevoir ; la fiche dit quoi regarder, l'écran montre comment c'est fait
- relevé le : 2026-09-16
- nature : bibliothèque de code documentée (par @micka_design)
- stack : React ; icônes au choix (Untitled UI ou primitives Base UI)
- ce qu'on retient :
  - anatomie : un composant conteneur + un composant élément (InputGroup / InputField). Le champ porte label, icône, placeholder, message d'erreur, état désactivé, et un index de position dans le groupe. Le label peut être masqué visuellement mais conservé pour l'accessibilité (`labelHidden`) pour les cas où le placeholder porte le sens (recherche de barre d'outils).
  - variantes et tailles : la documentation sépare un "système" (Fluid Hover, Motion, Scrollbars, Sizes, Surfaces) des composants. Le survol "fluide" est un effet global partagé : un fond qui glisse d'un élément à l'autre plutôt qu'un survol par élément. Tailles et surfaces définies une fois pour tout le système.
  - états : basique, plusieurs champs groupés, état d'erreur avec message sous le champ. Le message d'erreur est une prop, pas un composant séparé.
  - tokens : thème (système / clair / sombre), rayon (arrondi ou non), taille, jeu d'icônes : quatre axes de personnalisation présentés comme des commutateurs en bas de chaque page.
  - documentation : chaque exemple a trois vues (aperçu, code, inspection), puis un tableau d'API par composant (prop, type, défaut, description). Recherche ⌘K. Composants orientés interfaces conversationnelles (ChatMessage, ThinkingIndicator, ThinkingSteps, AskUserQuestions) à côté des classiques.
- à ne pas reprendre : l'effet de survol fluide comme défaut (c'est une signature), la liste des composants IA telle quelle.
- note : bon modèle pour "un système d'abord (motion, surfaces, tailles), des composants ensuite", et pour l'anatomie label / champ / message.

### AlignUI — https://www.alignui.com
- url : https://www.alignui.com
- visuel : ouvrir l'url dans le navigateur invisible (ou la capture dans `captures/`) et regarder la page avant de concevoir ; la fiche dit quoi regarder, l'écran montre comment c'est fait
- relevé le : 2026-09-16
- nature : bibliothèque de code + kit Figma synchronisés (base open source, blocs et templates payants)
- stack : React, Tailwind CSS, Remix Icon
- ce qu'on retient :
  - anatomie : composants composés par sous-parties nommées (`Button.Root`, `Button.Icon` ; `Input.Root`, `Input.Wrapper`, `Input.Input`, `Input.Icon` ; `Label.Root`). Le bouton existe en plusieurs familles distinctes : button, compact-button, fancy-button (mise en avant), link-button, social-button, button-group. Les composants sont rangés en catégories : form-elements, indicators, pickers, overlay, data-display, navigation, feedback, panel.
  - variantes et tailles : sur le bouton, deux axes : `variant` (primary, gray…) et `mode` (filled, stroke, lighter, ghost). Le "mode" décrit l'intensité, ce qui correspond exactement à la gradation action / sélection / survol de l'agent UI.
  - états : pas détaillés sur la page ; le formulaire de connexion montre label, champ, lien "Forgot?" aligné à droite du label, bouton "fancy" pour l'action principale, lien texte pour l'action secondaire.
  - tokens : couleur primaire (5 choix), thème clair/sombre, rayon (3 tailles) ; les variables CSS de la primaire sont déclinées en `base`, `dark`, `darker` et en alphas 10 / 16 / 24 pour les fonds teintés (survol, sélection).
  - documentation : éditeur de code en direct avec aperçu, configurateur visible qui régénère le code, blocs par famille (auth-card, checkbox, command-menu, dropdown, file-upload, modal, profile-card…), templates sectoriels multi-pages.
- à ne pas reprendre : le composant "fancy button" (effet de relief) comme défaut ; les noms de classes Tailwind propres à la bibliothèque.
- note : la référence pour nommer l'intensité d'un composant (`mode`) et pour les alphas de la couleur primaire comme fonds de sélection et de survol.

### Untitled UI — https://www.untitledui.com
- url : https://www.untitledui.com
- visuel : ouvrir l'url dans le navigateur invisible (ou la capture dans `captures/`) et regarder la page avant de concevoir ; la fiche dit quoi regarder, l'écran montre comment c'est fait
- relevé le : 2026-09-16
- nature : kit Figma (le plus complet du marché) + bibliothèque React + jeu d'icônes
- stack : React 19, Tailwind CSS 4, TypeScript, React Aria (accessibilité)
- ce qu'on retient :
  - anatomie : une taxonomie très complète, utile comme liste de contrôle. Fondations : couleurs, typographie, logos, icônes, ombres et flous, grilles et espacements, icônes de fichiers, drapeaux, paiements, curseurs. Composants partagés : avatars, badges, boutons et groupes, cases à cocher, menus contextuels, listes déroulantes, champs, multi-sélection, indicateurs de progression, boutons radio, select, curseurs, tags, interrupteurs, infobulles. Composants d'application : fils d'activité, jauges, alertes, en-têtes d'application, fils d'Ariane, calendriers, en-têtes de carte, carrousels, extraits de code, sélecteurs de couleur, menus de commande ⌘K, séparateurs, sélecteurs de date, tiroirs, états vides, téléversement de fichiers, filtres, onglets horizontaux et verticaux, graphiques (lignes, barres, camemberts, radars), indicateurs de chargement, messagerie, métriques, modales, notifications, en-têtes de page, pagination, cercles de progression, étapes, en-têtes et pieds de section, navigation latérale, tableaux, arborescences. Sections marketing : en-têtes, fonctionnalités, métriques, preuve sociale, tarifs, témoignages, FAQ, CTA, newsletter, équipe, carrières, contact, blog, presse, pieds de page. Exemples de pages : tableaux de bord, réglages, pages d'information, et côté marketing : landing, tarifs, connexion, inscription, à propos, équipe, contact, FAQ, 404, légal.
  - variantes et tailles : les compteurs donnent l'ordre de grandeur d'un système mature : 5 composants bouton × 940 variantes, 3 badges × 666 variantes, 4 tableaux × 204 variantes, 3 modales × 252 variantes. Les variantes croisent taille, couleur, icône, état.
  - états : gérés par propriétés de composant Figma et par variables ; mode sombre par variables, pas par styles dupliqués.
  - tokens : variables de couleur, espacement, rayon, largeur, typographie et effets ; version "styles" sans variables pour les équipes qui n'en veulent pas ; les composants React utilisent des variables CSS et non des valeurs codées en dur.
  - documentation : pages par composant avec exemples, blog de méthode (tableaux de données dans Figma, palettes, typographie), avatars et logos de remplissage gratuits pour les maquettes.
- à ne pas reprendre : le style visuel Untitled (rayons, ombres, palette) : c'est un kit générique, ce que l'agent doit éviter de produire tel quel.
- note : la référence pour l'inventaire : quand l'agent doit vérifier qu'il n'oublie pas un composant ou un état, cette taxonomie sert de liste.

<!-- Ajouter les fiches composants suivantes ici -->

