# Organigramme détaillé

## Hiérarchie

```
                          Utilisateur (toi)
                                |
                                v
                        direction-ceo
                        /            \
            direction-cto          direction-cpo       + marketing-lead (direct report CEO)
             /       \              /    |    \
        dev-lead  qa-lead    design-lead |  recherche-lead + data-lead
        /    \        \           \      |      |              |
   dev-front dev-back  qa-testeur design- | recherche-      data-analyste
                                  ux-ui   |  competiteurs
                                          |
                                          + (CPO coordonne aussi recherche et data)
```

## Matrice RACI — qui fait quoi

**R** = Réalise | **A** = Approuve | **C** = Consulté | **I** = Informé

| Activité | CEO | CTO | CPO | Mkt | Dev-L | QA-L | Des-L | Rech-L | Data-L |
|---|---|---|---|---|---|---|---|---|---|
| Cadrage mission | R/A | C | C | I | I | I | I | C | I |
| Choix stack techno | C | R/A | C | I | C | I | I | I | I |
| Priorisation features | C | C | R/A | C | I | C | C | C | C |
| Recherche marché | I | I | C | C | I | I | I | R/A | C |
| Benchmark compétiteurs | I | I | C | C | I | I | I | R/A | I |
| Design produit | I | I | C | C | C | C | R/A | C | I |
| Spécification PRD | I | C | R/A | I | C | C | C | C | C |
| Développement feature | I | C | C | I | R/A | C | C | I | I |
| Tests et QA | I | C | C | I | C | R/A | I | I | I |
| Tracking + KPIs | C | C | C | C | C | I | I | I | R/A |
| Contenu marketing | I | I | I | R/A | I | I | C | C | C |
| SEO | I | C | I | R/A | C | I | I | I | C |
| Visuels publicitaires | I | I | I | R/A | I | I | C | I | I |
| Lancement | A | C | R | R | C | C | C | C | C |

## Canaux de communication

### Ascendant (sub → chef)
- Remontée hebdo obligatoire (vendredi) via format REMONTÉE.
- Alerte P0 immédiate.
- Questions d'arbitrage : format ARBITRAGE DEMANDÉ.

### Descendant (chef → sub)
- Brief mandaté via format BRIEF.
- Revue quotidienne si projet actif.
- Rétro en fin de cycle.

### Horizontal (entre pairs)
- Sync directe si l'un dépend de l'autre (ex : dev-front ↔ dev-back pour contrat API).
- Alerter le chef commun uniquement si désaccord.

### Vers le CEO
- Les 3 cofondateurs (CTO, CPO, Mkt-Lead) ont accès direct.
- Les autres chefs passent par leur directeur (sauf alerte éthique / sécurité grave).

## Règles de succession en cas d'indisponibilité

Si un agent ne répond pas (blocage technique, limite de contexte atteinte, erreur) :

| Agent | Backup 1 | Backup 2 |
|-------|----------|----------|
| direction-ceo | direction-cto | direction-cpo |
| direction-cto | dev-lead | (humain) |
| direction-cpo | design-lead | recherche-lead |
| marketing-lead | marketing-content | (humain) |
| dev-lead | dev-backend | (humain) |
| qa-lead | qa-testeur | (humain) |
| design-lead | design-ux-ui | (humain) |
| recherche-lead | recherche-competiteurs | (humain) |
| data-lead | data-analyste | (humain) |

"(humain)" = on escalade à l'utilisateur humain.

## Fréquence attendue des rituels

| Rituel | Fréquence | Owner | Participants |
|--------|-----------|-------|--------------|
| Standup | Quotidien (si projet actif) | Chefs d'équipe | Tous |
| Weekly metrics review | Hebdomadaire | data-lead | CPO, Mkt-Lead |
| Review produit | Bi-hebdo | CPO | Design, Dev, QA, Data |
| Comité direction | Hebdomadaire | CEO | CTO, CPO, Mkt-Lead |
| Rétro | Fin de cycle (2 semaines) | Chef d'équipe concerné | Équipe |
| Business review | Mensuel | CEO | Tous les chefs |
