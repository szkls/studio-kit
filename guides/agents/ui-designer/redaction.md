# Rédaction d'interface

Annexe de `agent-ui-designer`. Lue pour tout écran. Un écran avec des
libellés vagues ou des données de remplissage a l'air d'une maquette, même
quand le reste est juste.

Le ton (vouvoiement ou tutoiement, registre) vient de la charte. Sans
indication : vouvoiement, phrases courtes, vocabulaire du métier de
l'utilisateur.

## 1. Actions et navigation

- Un bouton dit **verbe + objet** quand le résultat n'est pas évident :
  « Enregistrer le dossier », « Envoyer la demande ». Pas « Valider »,
  « OK », « Continuer » seuls.
- Le libellé décrit ce qui va se passer, pas le geste (« Ajouter un
  participant », pas « Cliquez ici »).
- Une action qui ouvre une suite avant d'agir finit par des points de
  suspension : « Renommer… », « Exporter… ».
- Une confirmation nomme l'action et l'objet, dans le message comme dans le
  bouton : « Supprimer le dossier 2026-0412 ? » avec « Supprimer le
  dossier » et « Annuler ». Jamais « Oui » / « Non ».
- Un lien a un sens hors contexte : « Voir le rapport d'avril », pas « En
  savoir plus ».

## 2. Un mot par concept

- Le même mot désigne la même chose sur tout le produit : un « dossier »
  ne devient pas une « demande » deux écrans plus loin.
- Les termes du métier sont gardés quand l'utilisateur les connaît ; le
  jargon interne de l'équipe projet ne l'est jamais.
- Quand le produit compte plus de cinq termes métier, les lister dans
  `design/decisions.md` (glossaire) et s'y tenir.

## 3. Formulaires

- Le label est un nom court (« Date de naissance »), pas une question
  rédigée.
- Le placeholder montre un exemple de valeur (« 06 12 34 56 78 »,
  « jean.martin@exemple.fr »), jamais une consigne.
- Le format attendu et les conditions sont dits avant la saisie, dans le
  texte d'aide.
- On n'explique pourquoi une information est demandée que si ce n'est pas
  évident.

## 4. Messages d'erreur

Trois temps, dans cet ordre :

1. ce qui a échoué ;
2. pourquoi, quand c'est connu et utile ;
3. comment s'en sortir.

« Le fichier n'a pas été importé : il dépasse 10 Mo. Compressez-le ou
découpez-le en deux. »

- Jamais de code technique comme message principal.
- Jamais de reproche : « Le numéro doit comporter 10 chiffres », pas
  « Numéro invalide ».
- La saisie de l'utilisateur est conservée.

## 5. États vides, chargement, succès

- Un état vide dit ce qui se passe et propose la suite. Il distingue
  première utilisation, aucun résultat, filtre trop strict, droits
  insuffisants, panne (le détail est dans `etats.md`).
- Un chargement nomme l'opération réelle : « Chargement des dossiers… ».
- Un succès confirme ce qui est fait, en une ligne : « Dossier envoyé à
  l'instructeur. »

## 6. Données vraisemblables

L'écran est rempli avec un contenu crédible, cohérent d'une zone à l'autre.

- Noms français réalistes et variés (Camille Lefèvre, Karim Benali, Inès
  Moreau, Thomas Nguyen), jamais « Jean Dupont », « John Doe », « Utilisateur 1 ».
- Organisations crédibles et propres au contexte du projet, jamais « Acme »,
  « Société X », « Lorem ».
- Chiffres ni trop ronds (100 %, 1 000 000) ni faussement précis
  (99,99 %). Des valeurs comme 1 284, 37,6 %, 12 h 40.
- Dates proches de la date du jour, au format français (12 oct. 2026,
  12/10/2026).
- Les mêmes personnes, objets et montants se retrouvent d'une zone à l'autre.
- Une valeur illustrative qui pourrait passer pour un vrai chiffre du client
  est marquée dans le code (`<!-- donnée fictive -->`).
- Jamais de « Lorem ipsum » ni de barre grise à la place d'un texte.

## 7. Typographie française

- Guillemets français avec espaces insécables : « texte ».
- Espace insécable avant `: ; ! ?` et entre un nombre et son unité
  (12 Mo, 35 %, 1 284 €).
- Séparateur de milliers : espace insécable fine ; décimale : virgule.
- Points de suspension en un caractère (…) pour les états en cours :
  « Enregistrement… ».
- Ni tiret long (—) ni demi-tiret (–) comme séparateur ; ni point médian (·)
  en série entre des mots. Un tiret court (-), une virgule, deux-points ou
  un retour à la ligne font le travail.
- Majuscule au premier mot seulement dans les titres et les boutons
  (« Nouveau dossier », pas « Nouveau Dossier »).

## 8. Ce qui trahit un texte généré

À réécrire à la relecture :

- les formules creuses (« en toute simplicité », « une expérience fluide »,
  « boostez », « de nouvelle génération ») ;
- les phrases qui sonnent bien mais ne disent rien de vérifiable ;
- une petite étiquette en capitales au-dessus de chaque titre ;
- un texte d'introduction qui répète le titre ;
- les numéros de section décoratifs (01, 02, 03).

Une phrase banale et juste vaut mieux qu'une phrase brillante et vague.
