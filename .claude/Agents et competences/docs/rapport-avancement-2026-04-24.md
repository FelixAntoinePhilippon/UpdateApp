# Rapport d'avancement — WealthWise
**Date** : 24 avril 2026  
**Auteur** : Tâche automatisée (direction-ceo)

---

## État actuel du projet

### Ce qui est fait

**Infrastructure d'entreprise IA (complété)** : 20 agents opérationnels (17 de base + 3 spécialisés fintech), 5 skills transversaux, documentation complète (README, organigramme, workflow, RACI).

**3 agents fintech créés** spécifiquement pour WealthWise :
- `finance-specialiste` — expert domaine (conformité AMF, fiscalité CELI/REER, calculs de performance)
- `ml-quant-analyste` — architecte IA (scoring, détection anomalies, LLM finance)
- `realtime-data-engineer` — ingénieur streaming temps réel (WebSocket, Redis, agrégation multi-providers)

**Base de code WealthWise (session précédente)** :
- Backend Node/TypeScript avec `server.ts` fonctionnel
- Auth0 configuré et vérifié (domaine, clientId, audience en place, `/api/analyze-portfolio` protégé par `checkJwt`)
- SQLite cache persistant via `better-sqlite3` (remplace l'ancien cache mémoire — survit aux redémarrages)
- Base de données Neon (PostgreSQL cloud) connectée
- Analyse de portefeuille IA via Gemini
- 0 erreur TypeScript au dernier build

**Idées backlog (Trello)** — 9 features en file "To add" :
Dividendes, Alertes de prix, FIRE/Retraite, CELI/REER, Crypto, Comparaison de titres, Fiscalité canadienne, PDF mensuel, PWA mobile

### Ce qui est en cours (bloqué)

La session principale "Build AI software development company" (112+ turns) a atteint la limite de rate-limit à deux reprises. Elle est actuellement en état "running" mais stalled ("No response requested"). Le CEO avait lancé les tâches suivantes avant l'interruption :
- Reconnaissance de la base WealthWise existante
- Création de la structure projet dans `Projets/WealthWise/`
- Création des 3 agents fintech
- Délégation en parallèle à plusieurs agents

**Problème** : Le répertoire `Projets/WealthWise/` contient les sous-dossiers (docs/adr, docs/design, docs/prd, etc.) mais **aucun fichier**. Le code source WealthWise semble résider dans une session précédente dont le workspace n'est plus monté ici.

---

## Diagnostic

1. **Code source introuvable dans le workspace actuel** — Le code (server.ts, configs Auth0, package.json, etc.) a été développé dans une autre session. Il faut que Félix pointe Claude vers le bon dossier contenant le code WealthWise existant ou le copie dans `Projets/WealthWise/`.

2. **Aucun livrable de cadrage produit** — Pas de `mission-wealthwise.md`, pas de PRD, pas d'ADR de stack, pas de personas. Le CEO a commencé le cadrage mais a été interrompu par les limites de rate.

3. **Session stalled** — La session principale ne peut pas reprendre sans intervention utilisateur.

---

## Recommandations — Prochaines étapes

### Priorité 1 : Récupérer le code existant
Félix doit copier le code WealthWise (celui avec server.ts, Auth0, SQLite cache, Neon) dans `Projets/WealthWise/` pour que tous les agents puissent y accéder.

### Priorité 2 : Cadrage formel (direction-ceo)
Reprendre le cadrage interrompu — rédiger `docs/mission-wealthwise.md` avec :
- Problème, proposition de valeur, audience
- Critères de succès 90 jours
- Contraintes et non-objectifs
- Répartition des équipes

### Priorité 3 : Spécification produit (direction-cpo)
- Personas détaillés (investisseur débutant QC, investisseur actif, planificateur retraite)
- PRD pour les features MVP : portefeuille, prix temps réel, analyse IA, objectifs
- Priorisation RICE des 9 idées du backlog Trello

### Priorité 4 : Architecture technique (direction-cto)
- ADR de stack (valider/documenter les choix existants : Node/TS, Neon, Auth0, Gemini)
- Plan d'intégration des providers de données (Finnhub, CoinGecko — voir recommandations de `finance-specialiste`)
- Architecture WebSocket pour prix temps réel (voir `realtime-data-engineer`)

### Priorité 5 : Fonctionnalités à fort impact
D'après le backlog et les agents spécialisés, les features suivantes auraient le plus d'impact :
1. **Suivi CELI/REER** — différenciateur canadien fort, aucun compétiteur ne le fait bien
2. **Alertes de prix** — engagement quotidien, retention
3. **Score de diversification** — feature IA simple (règles), haute valeur perçue
4. **Dividendes** — audience cible adore suivre les revenus passifs

### Améliorations suggérées

- **Conformité AMF** : Ajouter des disclaimers "information, pas conseil" partout (voir `finance-specialiste`)
- **PWA mobile** : Prioriser tôt — l'app finance se consulte majoritairement sur mobile
- **Tests automatisés** : Aucun plan de test visible — `qa-lead` devrait établir la stratégie QA dès maintenant
- **Tracking analytics** : `data-lead` devrait définir le plan de tracking (onboarding funnel, feature usage)

---

## Action requise de Félix

1. **Localiser et copier** le code WealthWise existant dans `Projets/WealthWise/`
2. **Relancer** le direction-ceo avec : *"direction-ceo, reprends le cadrage de WealthWise. Le code existant est dans Projets/WealthWise/. Rédige la mission, délègue le PRD au CPO, l'ADR au CTO, et lance les équipes."*
3. **Décider** quelles features du backlog Trello prioriser pour la V1
