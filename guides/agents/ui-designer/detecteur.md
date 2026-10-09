# Détecteur Impeccable (optionnel)

Annexe de `agent-ui-designer`. Le détecteur d'Impeccable vérifie 61 défauts
d'interface sans IA (contrastes, débordements de texte, longueur de ligne,
tics d'IA, valeurs hors `DESIGN.md`). Il complète `controle.py` sur ce que
celui-ci ne voit pas, notamment les contrastes calculés sur le rendu.

**Il est désactivé par défaut.** Il demande Node (`npx`) et télécharge un
petit programme au premier lancement : à faire valider par la sécurité avant
de l'utiliser sur un projet sensible.

## Activer (le designer, une fois par projet)

1. Vérifier que Node est installé : `npx --version`.
2. Copier `impeccable-config.json` (dans ce dossier d'annexes) vers
   `.impeccable/config.json` à la racine du projet. Ce réglage autorise
   Roboto et désactive les déclenchements automatiques.
3. Ne pas lancer `npx impeccable install` : il installerait le skill
   Impeccable et ses déclencheurs automatiques, dont on n'a pas besoin.

## Utiliser (l'agent)

Le détecteur est actif si `.impeccable/config.json` existe à la racine du
projet. Sinon, l'agent n'en parle pas et passe à la suite.

Au moment du contrôle, après `controle.py` :

```bash
npx impeccable detect --json design/<ecran>/index.html
```

- Code de sortie 0 : rien à signaler ; 2 : des constats ; 1 : le fichier n'a
  pas pu être lu.
- Le détecteur trouve tout seul `design/DESIGN.md` et signale les tailles,
  couleurs et rayons qui n'y sont pas déclarés.
- Les constats sont fusionnés avec ceux de `controle.py` (un même défaut
  n'est compté qu'une fois) et classés : contrastes insuffisants, texte qui
  déborde ou est masqué, titres sautés, tics d'IA → P1 ; le reste → P2.
- Il tourne une seule fois par écran, dans la passe de contrôle. Jamais en
  boucle.

## Si ça ne marche pas

Commande introuvable, réseau bloqué, refus d'exécution : l'agent le dit en
une ligne dans le résumé et continue avec `controle.py` seul.
