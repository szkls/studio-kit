# Guideline de génération d'un écran (kit studio)

## Pour le designer

Ce fichier s'adresse à l'IA. Ce que tu as à faire :

1. Mets `context.md` et `charte-graphique.md` à la racine du projet. Si la marque a un thème, remplace `src/theme.css` par celui produit par le projet Charte (ou règle-le dans le panneau Thème de l'app et exporte-le).
2. Si tu as des références visuelles pour un écran, mets-les dans `ecrans/<nom-de-l-ecran>/references/`.
3. Demande un écran comme à l'oral : « génère-moi l'écran de connexion ». Pour modifier : « nouvelle version de la connexion, le client veut… ». Pour une petite retouche : « sur la connexion, agrandis le titre ».
4. L'IA cadre l'écran en quelques lignes, l'assemble avec les composants du kit, le contrôle, et te donne son lien. Puis elle te propose d'ajouter les états.
5. La page d'accueil de l'app liste tous tes écrans ; tu peux en supprimer depuis là.

Le reste décrit à l'IA comment travailler. Il est le même dans tous les projets du studio.

---

## Principe

- **On assemble, on ne dessine pas.** Un écran est fait des composants de `CATALOGUE.md` (shadcn, déjà stylés par le thème, avec tous leurs états). L'IA ne redessine jamais un bouton, un champ, une carte, un menu, un tableau.
- **Une seule session, deux temps.** Cadrage avec l'expertise UX, puis construction avec l'expertise UI, dans la même session, en lisant les fichiers d'expertise. Aucun sous-agent.
- **L'état normal d'abord.** Les autres états sont listés au cadrage et proposés à la fin.
- **Aucun arrêt.** Le cadrage s'affiche, la construction enchaîne. Une information manquante devient une hypothèse marquée et une question dans `ecrans/questions-porteur.md`. Si le designer veut valider avant la construction, il le dit dans sa demande.
- **Les références, c'est le designer.** Section « Direction de maquettage » de la charte, et `ecrans/<ecran>/references/`. Pas de recherche web pendant une génération.
- **Un dossier par écran** : `ecrans/<ecran>/`, nom en kebab-case, qui devient l'adresse de l'écran dans l'app.

---

## Déclenchement

Toute demande d'écran déclenche la génération, quelle que soit la formulation. L'IA classe la demande seule :

| Demande | Ce que c'est | Ce qui se fait |
|---|---|---|
| Un écran dont le dossier n'existe pas | **Nouvel écran** | Temps 0, 1, 2 |
| Des retours sur le fond : contenu, actions, parcours, règles | **Nouvelle version** | Archive dans `ecrans/<ecran>/v<n>/` (sauf `references/`), puis temps 0, 1, 2 |
| Des retours sur la forme seule : taille, espacement, ordre visuel, libellé, couleur d'un élément | **Retouche** | Temps 2 seulement, sur l'écran existant, sans archive ni cadrage |
| « Ajoute les états » ou une réponse à la proposition d'états | **Ajout d'états** | Fin du temps 2 |

L'IA dit en une ligne comment elle a classé la demande. Si le dossier existe et que la demande ne dit pas quoi changer, une seule question. Un écran dans `ecrans/_corbeille/` n'existe plus.

---

## Ce qui apparaît dans la conversation

| Moment | Dans la conversation |
|---|---|
| Fin du cadrage | Wireframe en texte (bloc de code, une lettre par zone, légende), 3 à 5 décisions structurantes, hypothèses, questions pour le porteur de projet. Puis tu enchaînes. |
| Fin de la construction | Le lien `http://localhost:<port>/<ecran>`, le bloc de départ utilisé s'il y en a un, les composants créés ou manques notés, le résultat de `npm run verifier`, et la proposition : « États prévus : <liste>. Je les ajoute ? » |
| Retouche | Une ligne : ce qui a changé, le lien. |
| Ajout d'états | Une ligne : les états ajoutés. |

Jamais : le contenu d'un fichier recopié, un document non prévu, un fichier hors de `ecrans/` (sauf `MANQUES.md` et `src/theme.css` si le designer le demande).

---

## Temps 0 - Lecture (une fois par écran)

`context.md`, `charte-graphique.md` (dont la direction de maquettage), `CATALOGUE.md`, `MANQUES.md`, `ecrans/decisions.md` s'il existe, `ecrans/<ecran>/references/` s'il existe, les dernières lignes de `ecrans/journal.md`. Tu ne relis rien de tout ça pendant la génération.

Vérifie que l'app tourne : si `npm run dev` n'est pas lancé, lance-le en arrière-plan (après `npm install` si `node_modules/` n'existe pas) et relève le port dans sa sortie. Ce port est propre au projet et reste le même d'une session à l'autre.

---

## Temps 1 - Cadrage (`guides/agents/agent-ux-designer.md`)

Lis l'expertise UX et applique-la. Elle produit `ecrans/<ecran>/conception.md` (objectif, utilisateur, flux, contenu par ordre d'importance, action primaire, actions secondaires, états à prévoir, règles métier, textes d'interface, hypothèses, questions) et le cadrage dans la conversation.

Pour un écran simple (connexion, formulaire court, liste), la fiche est courte et le cadrage tient en cinq lignes et un wireframe.

---

## Temps 2 - Construction (`guides/agents/agent-ui-designer.md`)

Lis l'expertise UI (sa section « Avec le kit studio » prime sur le reste du fichier) et applique-la.

1. **Part du bloc le plus proche.** Si un bloc de `src/components/blocs/` correspond (connexion, inscription, tableau de bord, navigation latérale), inspire-toi de sa composition ou copie-le dans l'écran puis adapte-le : contenu en français, données réelles du contexte, textes de la fiche. Ne modifie jamais les fichiers de `src/components/`.
2. **Écris `ecrans/<ecran>/ecran.tsx`** : un composant par défaut et un `meta` (`titre`, `description`, `etats`). Uniquement des composants du catalogue, des icônes `lucide-react`, et les classes du thème : couleurs d'usage (`bg-primary`, `text-muted-foreground`, `bg-success`…), arrondis `rounded-control` / `rounded-surface`, tailles `text-xs` à `text-6xl`, espacements de l'échelle Tailwind.
3. **Navigation de prototype** : un bouton qui mène à un autre écran du projet utilise `<Link to="/<autre-ecran>">`. Si l'écran cible n'existe pas encore, le lien pointe quand même dessus : la page « écran introuvable » le signale.
4. **Ce qui manque** au catalogue se construit à partir des composants existants, avec `// manque: <raison>` au-dessus, et une ligne dans `MANQUES.md`.
5. **Contrôle** : `npm run verifier` (compilation et contrôle des règles). Corrige ce qu'il signale, relance, jusqu'à « RIEN À SIGNALER ». Deux passes au plus ; ce qui reste est déclaré dans `resume.md`.
6. **Regarde l'écran** : ouvre le lien dans le navigateur invisible (ou fais une capture) et vérifie qu'il s'affiche sans erreur.
7. **Écris `ecrans/<ecran>/resume.md`** (5 à 10 lignes : bloc de départ, composants utilisés, manques, écarts assumés, résultat du contrôle, ce qui a été décidé sans règle, états non construits).
8. **Propose les états.** Si le designer accepte, ajoute-les dans `meta.etats` et dans le composant avec `const etat = useEtat()` (import depuis `@/studio`). Ils s'affichent avec le sélecteur de la barre d'outils. Relance `npm run verifier`.

L'écran est `TERMINÉ` quand le contrôle est propre et que le lien s'affiche.

---

## Fin de génération

- `ecrans/journal.md` : une ligne par temps (`<date> | <ecran> | <temps> | <type de demande> | <durée> | <remarque>`).
- `ecrans/decisions.md` : ce qui devient une règle du projet (navigation, densité, composants créés, conventions de textes), quinze lignes au plus.
- `ecrans/questions-porteur.md` : les questions du cadrage, datées, avec l'hypothèse appliquée.
- `npm run catalogue` si un composant a été ajouté à `src/components/`.

---

## Sur demande seulement

- **Veille** (`guides/agents/agent-benchmark-designer.md`) : pour un design system imposé, sur demande.
- **Review complète** (`guides/agents/agent-ui-reviewer.md`) : avant une livraison.
- **Figma** (`guides/agents/agent-figma-reviewer.md`) : envoyer un écran dans Figma (capture de `http://localhost:<port>/<ecran>`) ou reprendre une maquette Figma dans `ecran.tsx`.
- **Lien client** : `npm run build` produit une version publiable dans `dist/`. Les outils du studio (barre, thème) n'y apparaissent qu'avec `?outils` dans l'adresse.

---

## Interdits

- Redessiner un composant du catalogue, ou écrire un élément HTML brut (`button`, `input`, `select`, `table`…) à la place.
- Écrire une couleur en dur, une couleur de palette (`bg-blue-600`), une valeur arbitraire (`p-[13px]`), un arrondi hors thème (`rounded-lg`), du style en ligne, une variante `dark:`.
- Modifier `src/components/`, `src/studio/` ou `src/theme.css` pendant une génération.
- Rendre un écran sans `npm run verifier` propre ou déclaré.
- Construire les états avant que le designer les demande.
- S'arrêter pour une question qui n'est pas bloquante, ou deviner en silence.

---

## Arborescence

```
AGENTS.md                 ← instructions pour l'IA (lu en premier)
CATALOGUE.md              ← ce que l'IA a le droit d'utiliser (généré)
MANQUES.md                ← ce qui manque au catalogue
context.md                ← le projet (projet Contexte)
charte-graphique.md       ← la marque (projet Charte)
guides/
  guideline-projet.md
  guideline-generation.md ← ce fichier
  agents/                 ← les cinq expertises
src/
  theme.css               ← LA marque : couleurs, arrondis, police
  components/ui/          ← les composants shadcn (ne pas modifier)
  components/blocs/       ← les blocs de départ
  studio/                 ← accueil, barre d'outils, panneau Thème
ecrans/
  journal.md, decisions.md, questions-porteur.md
  _corbeille/             ← écrans supprimés depuis l'accueil
  <ecran>/
    ecran.tsx             ← l'écran
    conception.md         ← cadrage
    resume.md             ← construction
    references/           ← captures du designer (facultatif)
    v1/                   ← version précédente (après une nouvelle version)
```
