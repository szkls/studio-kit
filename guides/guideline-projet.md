# Guideline de projet

## Pour le designer

Ce fichier s'adresse à l'IA. Il fixe les règles générales du projet, quelle que soit la demande. Il est le même dans tous les projets du studio et fait partie du kit : tu n'as rien à installer.

Si tu veux changer une règle, fais-le pour tout le monde. Ce qui est propre à ton projet va dans `context.md`, pas ici.

---

## Installation

Dans un projet créé à partir du kit studio, l'installation est déjà faite : `CLAUDE.md` importe `AGENTS.md`, `.github/copilot-instructions.md` y renvoie, et les expertises sont dans `guides/agents/`. Si l'un de ces fichiers manque, recrée-le à l'identique et dis-le au designer en une ligne.

---

## Les fichiers du projet et ce qu'ils valent

Trois fichiers portent la connaissance du projet. Ils n'ont pas le même poids et ne se traitent pas de la même façon.

### `context.md` - la source de vérité fonctionnelle

Ce qu'il contient : le client, le produit, les utilisateurs, le périmètre, les flux, les règles métier, les décisions prises avec le client. Il est produit par les analyses du designer à partir des entrants (transcriptions, présentations, captures, échanges) et régénéré quand les entrants changent.

Comment tu le traites :
- Tu le lis **en entier** au début de chaque session, même si tu crois le connaître. Il a pu changer.
- Ce qu'il dit fait loi sur le fond. Tu ne le contredis pas, tu ne le complètes pas de mémoire, tu ne devines pas ce qu'il ne dit pas. Une information absente est une question au designer, pas une supposition.
- Tu ne modifies jamais son corps. La seule zone où tu écris est la section « Propositions de mise à jour (à valider) » en fin de fichier (voir plus bas).
- S'il se contredit, ou s'il contredit ce que le designer te dit dans la conversation, tu ne t'arrêtes pas : tu retiens la version la plus récente (ce que le designer vient de dire, sinon l'entrant le plus récent), tu le dis en une ligne, tu le notes en proposition de mise à jour, et tu continues. Tu ne t'arrêtes pas, même si les deux versions changent la structure de ce que tu produis : tu choisis, tu le dis, et la question va au porteur de projet.

### `DESIGN.md` - la source de vérité visuelle

Ce qu'il contient : la marque, le design system ou UI kit imposé, ses composants, ses tokens, sa typographie, ses couleurs par rôle, son ton, et ce qu'il autorise ou interdit. Il est produit par le designer à partir d'une url, d'un fichier Figma, d'un dépôt ou d'une documentation de design system.

Comment tu le traites :
- Tu le lis en entier au début de chaque session où tu produis quelque chose de visuel.
- Ce qu'il dit fait loi sur la forme. Un design system imposé se respecte à 100 % : composants natifs, tokens exacts, variantes prévues. Rien n'est inventé « dans l'esprit de ».
- S'il ne fixe pas quelque chose (un composant absent, un token manquant), tu appliques les règles de l'agent UI, tu le dis dans ton résumé, et tu le notes en proposition de mise à jour pour que la charte s'enrichisse.
- **Sans charte, tu appliques les défauts marque blanche de l'agent UI** et tu n'inventes aucune couleur.
- Tu ne modifies jamais son corps. Même règle que pour le contexte : section « Propositions de mise à jour (à valider) » uniquement.

### `guides/guideline-generation.md` - la chaîne de conception

Ce qu'il contient : qui fait quoi, dans quel ordre, pour produire un écran. Il ne se lit et ne s'applique que quand le designer demande un écran ou une nouvelle version d'un écran. Pour tout le reste, c'est le présent fichier qui s'applique.

### Ce qui fait autorité quand deux sources se contredisent

Dans l'ordre : ce que le designer dit dans la conversation (à noter en proposition de mise à jour) ; `context.md` pour le fond ; `DESIGN.md` pour la forme ; les guidelines et les expertises pour la méthode ; tes connaissances générales en dernier, et jamais contre les quatre premiers.

---

## Ne jamais bloquer

La règle qui prime sur toutes les autres de ce fichier : **une information manquante ou une contradiction n'arrête pas le travail.** Tu avances avec l'option la plus raisonnable, tu la marques comme proposition (dans ta réponse, et dans la section « Propositions de mise à jour » du fichier concerné), et tu continues. Le designer tranche quand il revient ; s'il change ta proposition, tu ajustes ce qui en dépend, pas tout.

Tu ne t'arrêtes jamais de toi-même pendant une génération ; le seul arrêt possible est une validation que le designer a demandée explicitement avant la construction. Il n'existe pas de question bloquante. Ce studio travaille souvent en avant-vente, sur des cahiers des charges presque vides : les réponses n'existent pas encore, et le travail doit avancer quand même. Toute question va dans `ecrans/questions-porteur.md`, avec l'hypothèse que tu as appliquée, pour que le designer la pose au porteur de projet à son prochain point.

Ajouter est toujours permis ; modifier ne l'est pas. Tu peux compléter un fichier source par une proposition datée, jamais réécrire ce qu'il dit.

**Les sources d'abord, la proposition ensuite.** Tu te bases au maximum sur `context.md` et `DESIGN.md` : ce qu'ils disent, tu l'appliques, même si tu aurais fait autrement. Tu ne t'en écartes, ou tu n'ajoutes ce qu'ils ne disent pas, que s'il y a un vrai enjeu : un parcours qui bloque, une règle qui contredit l'usage réel, une accessibilité qui ne passe pas, une information dont dépend l'écran. Et chaque fois, tu le signales de la même façon, dans ta réponse et dans le fichier que tu produis, avec trois choses :
- ce que la source dit, ou ne dit pas (« le contexte ne précise pas… », « le contexte demande X ») ;
- ce que tu proposes à la place ou en plus ;
- pourquoi, en une phrase : l'enjeu, et le principe ou la source qui le justifie.

Le format est toujours le même : `Proposition hors contexte - <ce que dit la source> - <ce que je propose> - <pourquoi>`. Une proposition sans ces trois éléments n'est pas une proposition, c'est une invention. Et si un même travail en accumule plus de quelques-unes, c'est le contexte qui a besoin d'être mis à jour : tu le dis au designer.

## Proposer une mise à jour sans réécrire le fichier

Le contexte et la charte doivent rester à jour, mais ce n'est pas toi qui les réécris : ils sont régénérés par les outils du designer, et une modification directe serait perdue ou créerait deux versions.

Quand tu apprends quelque chose qui devrait y figurer (une décision prise dans la conversation, une règle métier précisée, une contradiction levée, un composant qui manque à la charte), tu l'ajoutes à la fin du fichier concerné, dans une section qui existe ou que tu crées :

```
## Propositions de mise à jour (à valider)
- <date> - <ce qui devrait changer, en une phrase> - origine : <conversation du <date> / écran <nom> / …>
```

Règles :
- Une ligne par proposition, datée, avec son origine, pour que le designer puisse la vérifier.
- Tu n'écris que dans cette section. Jamais au-dessus.
- Tu ne réécris pas une proposition existante ; si elle est dépassée, tu en ajoutes une nouvelle qui le dit.
- Tu ne tiens pas compte d'une proposition comme si elle était validée : tant qu'elle est dans cette section, c'est le corps du fichier qui fait loi, sauf si le designer a tranché dans la conversation.
- Le designer valide en remontant la ligne dans le corps du fichier (ou dans ses entrants) et en la supprimant de la section. Tu ne le fais jamais à sa place.

Quand une session se termine et que la section a gagné des lignes, tu le dis en une phrase : « J'ai noté N propositions de mise à jour dans `context.md` ». Rien de plus.

---

## Au début de chaque session

Dans cet ordre, sans le narrer au designer :
1. Ce fichier.
2. `context.md` en entier.
3. `DESIGN.md` en entier si la session touche à quelque chose de visuel.
4. `ecrans/decisions.md` s'il existe : les règles déjà fixées pour le projet.
5. Les dernières lignes de `ecrans/journal.md` s'il existe, pour savoir où en est le projet et reprendre un écran en cours plutôt que d'en commencer un autre.

Ensuite seulement, tu réponds à la demande. Si elle porte sur un écran, `guides/guideline-generation.md` prend le relais.

---

## Comment tu te comportes sur ce projet

- **Tu écris en français**, dans un français naturel et professionnel, sans style télégraphique. Les libellés d'interface suivent le ton de la charte.
- **Tu n'inventes rien sur le métier en silence.** Une règle de gestion, un utilisateur, une contrainte que le contexte ne donne pas : tu proposes l'hypothèse la plus raisonnable, tu la nommes comme telle, tu la notes en proposition de mise à jour, et tu continues. C'est l'hypothèse muette qui est interdite, pas l'hypothèse.
- **Tu regroupes tes questions à la fin**, en une seule fois, avec ta réponse par défaut déjà appliquée pour chacune, et tu les ajoutes à `ecrans/questions-porteur.md` (question, hypothèse appliquée, écran concerné, date). Aucune question ne passe avant le travail.
- **Tu ne produis aucun fichier qui ne t'a pas été demandé** ou que les guidelines ne prévoient pas. Pas de synthèse, de compte rendu, de plan ou de note « pour mémoire » en plus. Ce qui doit être gardé va dans les fichiers prévus (dossier de l'écran, `ecrans/decisions.md`, section de propositions).
- **Tu gardes la conversation courte.** Tu ne recopies jamais le contenu d'un fichier du projet dans la conversation. Tu dis ce que tu as fait, ce qui reste à décider, et où sont les fichiers.
- **Tu travailles sur une chose à la fois.** Un écran, une question, une correction. Tu ne commences pas la suivante avant que la précédente soit terminée ou tranchée.
- **Tu ne touches pas à ce qui n'est pas dans la demande.** Corriger un écart, c'est corriger cet écart, pas retoucher l'écran autour.
- **Tu respectes la structure du projet** : `ecrans/<ecran>/` pour tout ce qui concerne un écran, `ecrans/decisions.md` pour les règles du projet, `ecrans/journal.md` pour la trace. Rien à la racine en dehors des fichiers listés dans ce document.
- **Tu ne fais pas de veille et tu ne cites pas de source sans l'avoir consultée.** Une référence de mémoire n'en est pas une.
- **Tu navigues sans déranger.** Pour consulter un site ou prendre une capture, tu utilises d'abord un navigateur invisible (Playwright ou équivalent en mode headless) ; le navigateur visible du designer (Claude in Chrome) n'est qu'un dernier recours, quand un site bloque le mode invisible, et tu le dis. Dans tous les cas : un onglet à la fois, fermé dès la capture prise, et aucune navigation pour ce qui se lit sans navigateur (documentation, pages statiques, fichiers du projet). Le designer ne doit pas voir des fenêtres s'ouvrir pendant qu'il travaille.
- **Quand la demande elle-même est ambiguë** (pas une information qui manque, mais ce qu'on te demande de faire), tu reformules en une phrase ce que tu as compris et tu produis dans la foulée. Le designer corrige s'il faut ; tu n'attends pas.

---

## Ce que tu ne fais jamais sur ce projet

- Modifier le corps de `context.md`, de `DESIGN.md`, de ce fichier ou de `guides/guideline-generation.md`. Y ajouter une proposition datée, oui ; réécrire ce qu'ils disent, non : ça, c'est le designer.
- Générer un écran sans passer par `guides/guideline-generation.md`.
- Choisir entre deux sources qui se contredisent sans le dire, ou s'arrêter pour poser une question.
- Inventer une couleur, un composant, une police ou un ton quand la charte les définit, ou un accent quand elle n'existe pas.
- Créer un fichier hors de la structure prévue, ou un document que personne n'a demandé.
- Considérer une proposition de mise à jour comme validée.

---

## Arborescence de référence

```
AGENTS.md                        ← instructions pour l'IA, source unique (CLAUDE.md et Copilot y renvoient)
CATALOGUE.md / MANQUES.md        ← ce qui est disponible, ce qui manque
context.md                       ← source de vérité fonctionnelle, produite par le designer
DESIGN.md                        ← source de vérité visuelle, produite par le designer ; son en-tête pilote l'apparence
src/theme.css                    ← généré depuis DESIGN.md (ne pas modifier)
guides/                          ← les deux guidelines, les expertises et les annexes de l'agent UI
ecrans/                          ← tout ce que l'IA produit (un dossier par écran, journal, décisions, questions)
```
