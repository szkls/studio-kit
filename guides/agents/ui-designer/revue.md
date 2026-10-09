# Revue d'écran

Annexe de `agent-ui-designer`. Lue seulement sur demande (« fais la revue de
cet écran », avant une livraison client). La revue ne corrige rien : elle
évalue, classe et propose. Le designer décide ensuite ce qui est corrigé.

Si un outil de sous-agent est disponible, la revue tourne dans un contexte
neuf, qui n'a pas vu l'écran se construire : on juge mal ce qu'on vient de
produire.

## 1. Les mesures d'abord

1. `python3 <annexes>/controle.py design/<ecran>/index.html`
2. Le détecteur Impeccable s'il est activé (`detecteur.md`).
3. L'écran ouvert dans le navigateur invisible, à 1440 px et à 1024 px de
   large : on regarde le rendu, pas seulement le code.

## 2. Les trois tests rapides

- **Navigation seule** : en cachant tout sauf la navigation, sait-on quel
  produit, quelle rubrique, quel écran ? Sinon, la navigation a échoué.
- **Spécificité** : un autre produit pourrait-il réutiliser cet écran tel
  quel en changeant le logo ? Si oui, il manque le métier (vocabulaire,
  données, actions propres au domaine).
- **Cinq secondes** : en cinq secondes, comprend-on à quoi sert l'écran et
  quelle est l'action principale ?

## 3. Les dix heuristiques, notées de 0 à 4

0 = absent ou bloquant, 4 = exemplaire. Une heuristique qui ne s'applique
pas à l'écran est notée « sans objet ».

| Heuristique | Question |
| --- | --- |
| Visibilité de l'état | L'utilisateur sait-il toujours ce qui se passe ? |
| Langage du monde réel | Les mots sont-ils ceux du métier, pas ceux du système ? |
| Contrôle et liberté | Peut-on annuler, revenir, sortir ? |
| Cohérence | Mêmes mots, mêmes composants, mêmes places qu'ailleurs ? |
| Prévention des erreurs | L'écran empêche-t-il l'erreur avant de la signaler ? |
| Reconnaissance plutôt que rappel | Tout ce qu'il faut est-il visible au bon moment ? |
| Efficacité | L'usage fréquent est-il rapide (raccourcis, actions en masse) ? |
| Sobriété | Chaque élément mérite-t-il sa place ? |
| Reprise après erreur | Les messages disent-ils comment s'en sortir ? |
| Aide | L'aide est-elle là où on en a besoin, sans encombrer ? |

## 4. Charge mentale

- Plus de quatre options au même niveau de décision : à regrouper.
- Une information à retenir d'un écran à l'autre : à afficher.
- Deux tâches demandées en même temps : à séparer.

## 5. Trois regards

- **L'expert pressé**, cent fois par jour sur l'écran : trop de clics ?
  Pas de raccourci ? Des confirmations inutiles ?
- **Le nouveau venu**, première fois : comprend-il les termes ? Sait-il
  par où commencer ?
- **L'utilisateur au clavier ou au lecteur d'écran** : peut-il tout faire
  sans souris ? Les titres, libellés et annonces sont-ils là ?

## 6. Gravité

| Niveau | Sens | Exemple |
| --- | --- | --- |
| P0 | Bloquant : tâche impossible, accessibilité cassée | Champ sans label, focus supprimé |
| P1 | Grave : erreur probable, règle de la charte violée | Deux actions primaires, taille hors échelle |
| P2 | Gênant : friction, incohérence | Libellé vague, filet en double |
| P3 | Finition | Alignement optique, guillemets droits |

## 7. Le rapport

Écrit dans `design/<ecran>/revue.md` :

1. Verdict en une phrase et score global (moyenne des heuristiques notées).
2. Ce qui fonctionne (deux ou trois points).
3. Les problèmes P0 et P1, chacun avec la règle ou le principe en cause et
   la correction proposée.
4. Les P2 et P3 en liste courte.
5. Une ou deux questions de fond pour le designer.

Jamais « ça ne va pas » sans le principe qui l'explique.
