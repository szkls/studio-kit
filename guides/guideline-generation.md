# Guideline de génération d'un écran (kit studio)

## Pour le designer

Ce fichier s'adresse à l'IA. Ce que tu as à faire :

1. Mets `context.md` (projet Contexte) et `DESIGN.md` (projet Charte) à la racine. Sans `DESIGN.md` de client, le socle du studio s'applique. L'apparence de l'app suit `DESIGN.md` toute seule ; tu peux aussi la régler dans le panneau **Thème** et l'enregistrer.
2. Tes références visuelles vont dans la section « Direction de maquettage » de `DESIGN.md`, ou dans `ecrans/<nom-de-l-ecran>/references/` pour un écran précis.
3. Demande comme à l'oral : « génère-moi l'écran de connexion », « fais-moi trois variantes du tableau de bord », « sur la connexion, agrandis le titre », « nouvelle version de la connexion, le client veut… ».
4. L'IA cadre, assemble l'écran avec les composants du kit, le contrôle une fois, et te donne son lien. Puis elle te propose les états.
5. La page d'accueil de l'app liste tous tes écrans ; tu peux en supprimer depuis là.

Le reste décrit à l'IA comment travailler. Il est le même dans tous les projets du studio.

---

## Principe

- **On assemble, on ne dessine pas.** Un écran est fait des composants de `CATALOGUE.md` (shadcn, stylés par `DESIGN.md`, avec tous leurs états). L'IA ne redessine jamais un bouton, un champ, une carte, un menu, un tableau.
- **Une seule session, deux temps.** Cadrage avec l'expertise UX, construction avec l'expertise UI, dans la même session, en lisant les fichiers d'expertise. Aucun sous-agent, sauf pour une revue (contexte neuf).
- **L'état normal d'abord.** Les autres états sont listés au cadrage et proposés à la fin.
- **Une passe de contrôle, pas une boucle.** `npm run verifier`, correction groupée des P0 et P1, une relance, on rend.
- **Ne jamais bloquer.** Une information manquante devient une hypothèse appliquée, marquée, et une question dans `ecrans/questions-porteur.md`. Seul le designer arrête la chaîne ; s'il veut valider avant la construction, il le dit.
- **Les références, c'est le designer.** Pas de recherche web pendant une génération.
- **Un dossier par écran** : `ecrans/<ecran>/`, nom en kebab-case, qui devient l'adresse de l'écran.

---

## Déclenchement

Toute demande d'écran déclenche la génération. L'IA la classe seule et le dit en une ligne :

| Demande | Ce que c'est | Ce qui se fait |
|---|---|---|
| Un écran dont le dossier n'existe pas | **Nouvel écran** | Temps 0, 1, 2 |
| Des retours sur le fond : contenu, actions, parcours, règles | **Nouvelle version (refondre)** | Archive dans `ecrans/<ecran>/v<n>/` (hors `references/`), temps 0, 1, 2 |
| Des retours sur la forme seule : taille, espacement, ordre visuel, libellé | **Retouche (affiner)** | Temps 2 sur l'écran existant, sans cadrage ; on garde tout ce qui est hors de la demande |
| « Trois variantes », « propose-moi des directions » | **Variantes** | Temps 0, 1, puis temps 2 selon `ui-designer/variantes.md`, dans `ecrans/<ecran>-a/`, `-b/`, `-c/` |
| « Ajoute les états », ou oui à la proposition | **Ajout d'états** | `ui-designer/etats.md`, dans le même écran |
| « Fais la revue », avant une livraison | **Revue** | `ui-designer/revue.md`, dans un contexte neuf si possible |

Si le dossier existe et que la demande ne dit pas quoi changer, une seule question. Un écran dans `ecrans/_corbeille/` n'existe plus. Ne changent jamais sans accord explicite : libellés de navigation, nom et ordre des champs d'un formulaire, logo, mentions légales.

---

## Ce qui apparaît dans la conversation

| Moment | Dans la conversation |
|---|---|
| Fin du cadrage | Wireframe en texte (une lettre par zone, légende), 3 à 5 décisions structurantes, hypothèses, questions pour le porteur. Puis tu enchaînes. |
| Début de la construction | La ligne « Je lis ça comme : <type d'écran> pour <utilisateur>, densité <…>, socle <…>, mode <opérer, convaincre ou lire>. » |
| Fin de la construction | Le lien `http://localhost:<port>/<ecran>`, le résumé (5 à 10 lignes), les P2 restants, et la proposition : « États prévus : <liste>. Je les ajoute ? » |
| Retouche | Une ligne : ce qui a changé, le lien. |
| Variantes | Les trois liens, avec la ligne de direction de chacune. |

Jamais : le contenu d'un fichier recopié, un document non prévu, un fichier hors de `ecrans/` (sauf `MANQUES.md`).

---

## Temps 0 - Lecture (une fois par écran)

`context.md`, `DESIGN.md` (dont la direction de maquettage), `CATALOGUE.md`, `MANQUES.md`, `ecrans/decisions.md` s'il existe, `ecrans/<ecran>/references/` s'il existe, les dernières lignes de `ecrans/journal.md`.

Vérifie que l'app tourne : si besoin `npm install`, puis `npm run dev` en arrière-plan ; relève le port dans sa sortie (il est propre au projet).

---

## Temps 1 - Cadrage (`guides/agents/agent-ux-designer.md`)

Lis l'expertise UX et applique-la : `ecrans/<ecran>/conception.md` (objectif, utilisateur, flux, contenu par ordre d'importance, action primaire, actions secondaires, états à prévoir, règles métier, textes, hypothèses, questions) et le cadrage dans la conversation. Pour un écran simple, la fiche est courte et le cadrage tient en cinq lignes et un wireframe.

---

## Temps 2 - Construction (`guides/agents/agent-ui-designer.md`)

Lis l'expertise UI : sa section « Dans le kit studio » d'abord, puis le reste, et les annexes de `guides/agents/ui-designer/` qui correspondent à l'écran :

| Écran | Annexes |
|---|---|
| Applicatif (liste, fiche, formulaire) | `regles-ui.md`, `redaction.md` |
| Tableau de bord, écran chiffré | les deux + `donnees.md` |
| Page vitrine | `regles-ui.md`, `redaction.md`, `references-landings.md`, `references-visuelles.md`, `regles-motion.md`, `regles-illustration.md` |

1. **Écris la ligne « Je lis ça comme… »**, puis pars du bloc de `src/components/blocs/` le plus proche s'il y en a un.
2. **Écris `ecrans/<ecran>/ecran.tsx`** : composant par défaut + `meta` (`titre`, `description`, `etats`). Uniquement des composants du catalogue, des icônes `lucide-react`, les classes du thème, des données vraisemblables (`redaction.md`).
3. **Navigation de prototype** : `<Link to="/<autre-ecran>">` vers les autres écrans du projet.
4. **Ce qui manque** au catalogue : construit à partir des composants existants, `// manque: <raison>` au-dessus, une ligne dans `MANQUES.md`.
5. **Contrôle, une seule fois** : `npm run verifier`. Corrige **tous** les P0 et P1 en un lot, relance une fois. Les P2 restants vont dans le résumé. Puis vérifie mentalement le jeu extrême (un nom de 60 caractères, un montant à 7 chiffres, une liste vide, un libellé allongé de 30 %).
6. **Regarde l'écran** dans le navigateur invisible, à 1440 px : il s'affiche, rien ne déborde.
7. **Écris `ecrans/<ecran>/resume.md`** : layout et densité, hiérarchie typo, bloc de départ, composants utilisés et créés, manques, écarts, P2 restants, et ce qui a été décidé sans règle.
8. **Propose les états.** Si le designer accepte : `ui-designer/etats.md`, états dans `meta.etats` et `const etat = useEtat()` (de `@/studio`), une relance de `npm run verifier`.

L'écran est `TERMINÉ` quand il n'y a plus de P0 ni de P1 et que le lien s'affiche.

---

## Fin de génération

- `ecrans/journal.md` : une ligne par temps (`<date> | <ecran> | <temps> | <type de demande> | <durée> | <remarque>`).
- `ecrans/decisions.md` : ce qui devient une règle du projet (navigation, densité, composants créés, glossaire, variante retenue), quinze lignes au plus.
- `ecrans/questions-porteur.md` : les questions du cadrage, datées, avec l'hypothèse appliquée et ce qui changerait selon la réponse.
- `npm run catalogue` si un composant a été ajouté à `src/components/`.

---

## Sur demande seulement

- **Veille** (`guides/agents/agent-benchmark-designer.md`) : pour un design system imposé.
- **Figma** (`guides/agents/agent-figma-reviewer.md`) : envoyer un écran dans Figma (capture de `http://localhost:<port>/<ecran>`) ou reprendre une maquette Figma dans `ecran.tsx`.
- **Lien client** : `npm run build` produit une version publiable dans `dist/`. Les outils du studio n'y apparaissent qu'avec `?outils` dans l'adresse.

---

## Interdits

- Redessiner un composant du catalogue, ou écrire un élément HTML brut (`button`, `input`, `select`, `table`…) à la place.
- Écrire une couleur en dur, une couleur de palette (`bg-blue-600`), une valeur arbitraire (`p-[13px]`), un arrondi hors thème (`rounded-lg`), du style en ligne pour une couleur ou un espacement, une variante `dark:`.
- Les interdits et tics d'IA de l'agent UI (titre en couleur, étiquette en capitales, rangée de cartes identiques à grand chiffre, données de remplissage, tirets longs…).
- Modifier `src/components/`, `src/studio/` ou `src/theme.css`.
- Rendre un écran avec un P0 ou un P1, ou boucler sur le contrôle au-delà d'une relance.
- Construire les états avant que le designer les demande.
- S'arrêter pour une question, ou deviner en silence.

---

## Arborescence

```
AGENTS.md                 ← instructions pour l'IA (lu en premier)
DESIGN.md                 ← la charte : identité, design system, direction de maquettage ; son en-tête pilote l'apparence
context.md                ← le projet
CATALOGUE.md / MANQUES.md ← ce qui est disponible, ce qui manque
guides/
  guideline-projet.md
  guideline-generation.md ← ce fichier
  agents/
    agent-ux-designer.md
    agent-ui-designer.md
    ui-designer/          ← annexes de l'agent UI (règles, rédaction, données, états, variantes, revue, références)
    agent-benchmark-designer.md, agent-figma-reviewer.md
src/
  theme.css               ← généré depuis DESIGN.md (ne pas modifier)
  components/ui/          ← composants shadcn (ne pas modifier)
  components/blocs/       ← blocs de départ
  studio/                 ← accueil, barre d'outils, panneau Thème
ecrans/
  journal.md, decisions.md, questions-porteur.md
  _corbeille/
  <ecran>/
    ecran.tsx, conception.md, resume.md
    references/           ← captures du designer (facultatif)
    v1/                   ← version précédente (après une nouvelle version)
```
