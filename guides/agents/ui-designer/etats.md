# États d'écran

Annexe de `agent-ui-designer`. Lue seulement quand le designer demande
d'ajouter les états listés au cadrage. Chaque état est une variante du même
écran (`design/<ecran>/index.html?etat=vide`, ou un fichier par état), qui
garde la structure, la navigation et la position des actions.

## 1. Vide

Cinq situations, cinq messages. Chacune dit ce qui se passe et propose la suite.

| Situation | Ce qu'on montre | Action proposée |
| --- | --- | --- |
| Première utilisation | Ce que l'écran contiendra et pourquoi c'est utile | Créer le premier élément |
| Aucun résultat de recherche | Le terme cherché, rappelé | Modifier la recherche, voir tout |
| Filtres trop stricts | Les filtres actifs, rappelés | Retirer un filtre, tout réinitialiser |
| Droits insuffisants | Qui peut voir ces données | Demander l'accès, contacter le responsable |
| Rien à faire (tâches traitées) | Une confirmation sobre | Aucune, ou retour à l'accueil |

- L'état vide occupe la zone des données, pas tout l'écran : filtres et
  navigation restent en place.
- Une illustration est facultative ; si elle existe, elle suit
  `regles-illustration.md`.

## 2. Chargement

- Affiché seulement si l'attente dépasse environ 200 ms ; une fois affiché,
  visible au moins 400 ms, pour éviter le clignotement.
- Un squelette reprend exactement la forme du contenu final (mêmes hauteurs
  de ligne, mêmes colonnes) : rien ne saute à l'arrivée des données.
- Le libellé nomme l'opération : « Chargement des dossiers… ».
- Au-delà de 10 secondes, une progression réelle (« 3 fichiers sur 12 ») ;
  jamais une progression inventée.
- Un chargement partiel ne bloque que sa zone.

## 3. Erreur

Un message par cause, en trois temps (voir `redaction.md`).

| Cause | Message type | Sortie |
| --- | --- | --- |
| Hors connexion | « Pas de connexion. Vos modifications sont gardées sur ce poste. » | Réessayer |
| Délai dépassé | « Le service met trop de temps à répondre. » | Réessayer |
| Droits insuffisants | « Vous n'avez pas accès à ce dossier. » | Demander l'accès |
| Élément introuvable | « Ce dossier n'existe plus ou a été déplacé. » | Retour à la liste, recherche |
| Trop de demandes | « Trop de demandes en peu de temps. Réessayez dans une minute. » | Réessayer plus tard |
| Erreur du service | « Le service est momentanément indisponible. » | Réessayer, contacter le support |

- Une erreur dans une zone n'éteint pas tout l'écran.
- Erreur de formulaire : sous le champ, focus sur la première, récapitulatif
  en haut pour un formulaire long (`regles-ui.md`, formulaires).
- Les messages sont annoncés aux lecteurs d'écran (`role="alert"` ou
  `aria-live`).

## 4. Succès

- Une confirmation en une ligne, près de l'action ou en notification
  (`aria-live="polite"`) qui disparaît après 5 secondes environ et peut être
  fermée.
- Une action annulable affiche « Annuler » dans la notification, plutôt
  qu'une confirmation avant.
- Le succès ne mentionne la suite que si elle change ce que l'utilisateur
  doit faire.

## 5. États liés aux droits et aux données

- Lecture seule : champs affichés comme du texte, pas comme des champs
  désactivés, avec la raison.
- Données très longues ou très nombreuses : vérifier la structure avec un
  nom de 60 caractères, un montant à 7 chiffres, 1 000 lignes.
- Action en cours chez un autre utilisateur (dossier verrouillé) : qui, depuis quand.
