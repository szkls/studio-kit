# Instructions pour l'IA - kit studio

Ce projet est un kit de maquettage du studio design : une petite app React avec tous les composants shadcn, un thème de marque dans un seul fichier, et des écrans dans `ecrans/`. Ce fichier est la source unique des instructions, quel que soit l'outil (Claude Code, Copilot, Cursor).

## Au début de chaque session

1. Lis `guides/guideline-projet.md` et applique-le : règles générales, sources de vérité, comportement.
2. Pour toute demande d'écran (nouvel écran, nouvelle version, retouche, ajout d'états), lis `guides/guideline-generation.md` et suis-le. Les expertises sont dans `guides/agents/` : tu les lis et tu les appliques dans la session, tu ne les lances pas comme sous-agents.

## Sources de vérité

- `context.md` : le projet, les utilisateurs, le périmètre, les règles métier.
- `DESIGN.md` : la marque, le design system, la direction de maquettage.
- `DESIGN.md` porte aussi l'apparence (couleurs par usage, arrondis, police) dans son en-tête : `src/theme.css` en est généré automatiquement. On ne touche jamais `src/theme.css` à la main.
- `CATALOGUE.md` : les composants et blocs disponibles. Rien d'autre ne s'utilise sans être signalé dans `MANQUES.md`.

Tu ne modifies jamais le corps de `context.md` ni de `DESIGN.md` (seulement leur section « Propositions de mise à jour »), ni `src/components/`, ni `src/studio/`.

## Les trois questions avant d'écrire un écran

1. **Qu'est-ce que j'utilise ?** Ce qui est dans `CATALOGUE.md`. Tu pars du bloc le plus proche quand il y en a un.
2. **Qu'ai-je le droit de faire ?** Assembler des composants, avec les classes du thème, en respectant les règles et interdits de l'agent UI. `npm run verifier` classe les écarts en P0, P1, P2 et dit comment corriger.
3. **Et si ça n'existe pas ?** Tu le construis à partir des composants existants, tu écris `// manque: <raison>` au-dessus, et tu ajoutes une ligne dans `MANQUES.md`. Tu continues : en avant-vente, on ne s'arrête pas.

## Commandes

- `npm install` : une fois, au premier lancement.
- `npm run dev` : lance l'app (en arrière-plan). Le port est propre au projet ; la page d'accueil liste les écrans.
- `npm run verifier` : compilation + contrôle des règles. Obligatoire avant de rendre un écran.
- `npm run catalogue` : régénère `CATALOGUE.md` après l'ajout d'un composant.
- `npm run theme` : régénère `src/theme.css` depuis `DESIGN.md` (automatique quand l'app tourne).
- `npm run build` : version publiable dans `dist/`.

## Le designer n'est pas développeur

Tu ne lui demandes jamais de taper une commande : tu les lances toi-même. Tu parles d'écrans, de composants et de thème, pas de React, de routes ou de props. Tu lui donnes toujours le lien de l'écran.
