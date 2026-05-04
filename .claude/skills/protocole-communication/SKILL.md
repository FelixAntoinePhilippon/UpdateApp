---
name: protocole-communication
description: Règles et formats pour la communication entre agents et entre équipes. Définit comment passer un brief, remonter une alerte, faire un compte-rendu, demander un arbitrage. À utiliser par tout agent qui orchestre ou délègue à d'autres agents.
---

# SKILL : Protocole de Communication

Ce skill est le "manuel du savoir-vivre" de notre entreprise d'agents. Il garantit que l'information circule sans pertes, sans ping-pong inutiles, et sans confusion de rôles.

## Quand utiliser ce skill

- Passer un brief à un autre agent
- Remonter une info au chef (alerte, synthèse)
- Demander un arbitrage entre équipes
- Faire un handoff (une équipe passe à la suivante)
- Clore un projet (retro, archivage)

## Principes fondamentaux

1. **Un sujet = un canal.** Ne pas mélanger plusieurs décisions dans une même communication.
2. **Contexte en premier.** Le destinataire n'a pas suivi l'historique, pose les bases.
3. **Demande claire.** Action + délai + critère de succès.
4. **Asynchrone par défaut.** Ne pas bloquer l'autre agent "en attente de réponse" si un défaut d'action est possible.
5. **Remontées rapides, détail sur demande.** TL;DR en haut, détails en dessous.

## Format : BRIEF (passer un mandat à un autre agent)

Utilisé par un chef (ex : `direction-ceo`) vers un subordonné (ex : `marketing-lead`).

```
# BRIEF : [titre courte action]

## Contexte
[2-3 phrases : pourquoi maintenant, quel objectif plus large]

## Demande
[Ce que tu attends — verbe d'action + livrable précis]

## Contraintes
- Délai : [date]
- Budget : [heures virtuelles / ressources]
- Dépendances : [autres équipes à consulter]

## Critères de succès
[Comment on saura que c'est fait correctement]

## Ressources
- PRD : [chemin]
- Research : [chemin]
- Personnes à consulter : [liste d'agents]

## Autonomie
Tu peux décider seul sur : [...]
Remonte-moi avant de : [...]
```

## Format : REMONTÉE (subordonné → chef)

```
# REMONTÉE : [titre en 6 mots max]
Priorité : [P0 bloquant / P1 urgent / P2 informatif]
Type : [alerte / décision / info]

## TL;DR
[En 1-2 phrases : ce que tu dois savoir]

## Contexte
[Ce qui s'est passé — facts, pas opinions]

## Ce que je propose
[Option(s) avec recommandation]

## Ce que j'ai besoin de toi
- [ ] Décision sur [X] avant [date]
- [ ] ou juste : lecture pour info
```

## Format : HANDOFF (équipe A termine, équipe B prend le relai)

Exemple : `design-ux-ui` → `dev-frontend`.

```
# HANDOFF : [feature] — [équipe A] → [équipe B]

## État actuel
- Ce qui est fait
- Ce qui est testé
- Ce qui est validé par [qui]

## Livrables transmis
- [Chemin] — description
- [Chemin] — description

## Points d'attention
- Edge case [X] à vérifier en implémentation
- Contrainte technique [Y] découverte en cours

## Questions ouvertes
- [Question à résoudre ensemble avant de commencer]

## Contact
Je reste dispo pour [X jours] pour répondre aux questions.
```

## Format : ARBITRAGE (demande de décision entre options)

Utilisé quand un désaccord bloque (ex : `dev-lead` et `design-lead` pas d'accord).

```
# ARBITRAGE DEMANDÉ : [sujet]
Pour : [agent qui tranche — souvent CEO ou directeur]

## Contexte
[Ce qu'on doit décider et pourquoi ça bloque]

## Options
### Option A : [nom]
- Proposée par : [agent]
- Pour : [avantages]
- Contre : [inconvénients]
- Coût : [estimation]

### Option B : [nom]
[Idem]

### Option C : [éventuelle]
[Idem]

## Recommandation
[Ce que le demandeur recommanderait, avec justification en 1 paragraphe]

## Délai de décision
[Date — qu'est-ce qui devient critique après cette date]
```

## Format : RÉTRO (clôture de projet / sprint)

```
# RÉTROSPECTIVE : [projet / sprint]
Date : [date]
Participants : [agents impliqués]

## Livrés
- [Feature / livrable] — statut

## Non livrés (et pourquoi)
- [...]

## Ce qui a bien marché
- [...]

## Ce qui n'a pas marché
- [...]

## Ce qu'on change la prochaine fois
- [Action concrète + owner]
```

## Règles de priorité entre communications

Quand un agent reçoit plusieurs communications simultanées :

1. **P0 bloquant** — traiter immédiatement, interrompre tout.
2. **Arbitrage CEO / CPO / CTO** — traiter dans la session.
3. **Brief avec délai court** — traiter dans le créneau.
4. **Remontée info** — traiter en fin de session.
5. **Rétro / archivage** — en fin de cycle.

## Règles de nommage des communications

Fichiers dans `docs/communications/[date]-[type]-[sujet].md` :
- `2026-04-23-BRIEF-marketing-lancement-mvp.md`
- `2026-04-24-REMONTEE-bug-paiement-p0.md`
- `2026-04-25-HANDOFF-feature-auth-design-to-dev.md`
- `2026-04-26-ARBITRAGE-techno-framework.md`

## Ce qu'il ne faut JAMAIS faire

- Remonter au CEO ce qui peut se régler entre chefs d'équipe (= bypass hiérarchique).
- Ouvrir une communication sans action attendue claire.
- Répondre par "ok" à un brief sans confirmer la compréhension ou pointer une ambiguïté.
- Laisser une décision en suspens > 48h sans relance.
- Répondre de manière défensive à une remontée critique — séparer constat et personne.

## Rituel quotidien (si le projet dure plusieurs jours)

Chaque matin :
- Chef d'équipe : poste un statut court (3 bullets : hier / aujourd'hui / bloquants) dans `docs/standup/[date].md`.
- Direction : lit les standups et met à jour `docs/jalons-[projet].md`.

## Rituel hebdo

Vendredi :
- Rétro de 1 page par équipe → chefs d'équipe la produisent.
- Synthèse exécutive par le CEO → 1 page pour l'utilisateur humain.
