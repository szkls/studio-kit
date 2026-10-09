# Kit studio - maquettage avec l'IA

Une petite app prête à l'emploi pour générer des écrans avec l'IA à partir de vrais composants (shadcn), dans la marque du client.

## Créer un nouveau projet

1. Sur GitHub, bouton vert **Use this template** puis **Create a new repository**. Donne-lui le nom du projet.
2. Ouvre le nouveau dépôt dans VS Code (ou demande à Claude Code de le cloner).
3. Dis à l'IA : « lance le projet ». Elle installe et démarre l'app, et te donne son adresse.

Il faut Node.js sur ton ordinateur (installateur sur nodejs.org, version LTS). C'est tout.

## Au quotidien

- **Le projet** : mets `context.md` (projet Contexte) et `charte-graphique.md` (projet Charte) à la racine.
- **La marque** : remplace `src/theme.css` par le thème produit par le projet Charte, ou règle-le dans le panneau **Thème** de l'app (couleur d'action, arrondis, police) puis exporte-le.
- **Un écran** : demande-le comme à l'oral, « génère-moi l'écran de connexion ». L'IA te donne son lien.
- **Tes références** : des captures dans `ecrans/<nom-de-l-ecran>/references/`.
- **Les états** : sélecteur en bas de chaque écran. La barre se masque avec l'icône œil, et revient avec la touche « o ».
- **La liste des écrans** : page d'accueil de l'app. Bouton Supprimer = corbeille, restaurable.

## Ce qu'il y a dedans

| Dossier | Contenu |
|---|---|
| `ecrans/` | Tes écrans, un dossier chacun, avec leur cadrage et leur résumé |
| `src/theme.css` | La marque : le seul fichier à changer pour changer l'apparence |
| `src/components/ui/` | Les 61 composants shadcn (ne pas modifier) |
| `src/components/blocs/` | Des blocs de départ : connexion, inscription, tableau de bord, navigation |
| `guides/` | Les guidelines et les expertises UX / UI lues par l'IA |
| `CATALOGUE.md`, `MANQUES.md` | Ce que l'IA peut utiliser, et ce qui manque |

Deux écrans d'exemple (`exemple-connexion`, `exemple-tableau-de-bord`) montrent le résultat. Supprime-les depuis l'accueil quand tu démarres un projet.

## Faire évoluer le kit

Le kit est le même pour tout le studio. Une amélioration (un composant, une règle, un bloc) se fait dans le dépôt modèle, pas dans un projet, pour que tout le monde en profite.
