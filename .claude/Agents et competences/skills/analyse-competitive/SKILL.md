---
name: analyse-competitive
description: Analyser un compétiteur en profondeur et produire une synthèse actionnable (battlecard, matrice comparative, gap analysis). À utiliser par l'agent recherche-competiteurs, ou par marketing-lead / direction-cpo quand ils ont besoin de benchmark rapide.
---

# SKILL : Analyse Compétitive

Ce skill structure une analyse compétitive rapide mais rigoureuse.

## Quand utiliser ce skill

- Cadrage d'un nouveau projet (connaître le terrain)
- Nouveau concurrent identifié
- Préparation d'un pitch (sales, investisseurs)
- Challenge d'un positionnement

## Framework 7P pour analyser un concurrent

### 1. Product
- Features principales (faire la liste exhaustive)
- Qualité perçue (reviews : G2, Capterra, App Store)
- Feuille de route visible (changelog, blog)
- Stack technique (builtwith.com, offres d'emploi sur LinkedIn)
- Points forts uniques
- Points faibles récurrents (plaintes dans les reviews 1-2 étoiles)

### 2. Price
- Plans tarifaires (capture d'écran + détail)
- Essai gratuit / freemium ?
- Pricing opaque au-delà d'un seuil ?
- Discount volume, annuel vs mensuel
- Comparaison par unité de valeur (par utilisateur, par projet, etc.)

### 3. Place (distribution)
- Canaux de vente (self-serve, sales-led, product-led)
- Géographies couvertes
- Intégrations clés (marketplaces, app stores)
- Partenaires revendeurs

### 4. Promotion
- Canaux d'acquisition dominants (analyser via SimilarWeb, Semrush)
- Content strategy (blog, YouTube, podcasts)
- Présence réseaux sociaux (plateformes + rythme)
- Ad spend estimé (Meta Ad Library, Google Ads transparency)
- Communauté (Discord, Slack, subreddit)

### 5. People
- Taille équipe (LinkedIn)
- Équipe fondatrice (backgrounds, crédibilité)
- Embauches récentes (signal stratégique : "Head of AI" = pivot IA)
- Départs clés (signal risque)

### 6. Process
- Signup flow (screenshots, friction points)
- Onboarding (email, in-app)
- Support : canaux, SLAs, qualité perçue
- Offboarding : facilité de partir = facilité de rester

### 7. Positioning
- Headline / tagline
- Proposition de valeur déclarée
- Personas ciblés (visibles dans case studies)
- Messaging par industrie / taille entreprise

## Outils pour récolter l'info

| Info | Outil |
|------|-------|
| Trafic, mots-clés | SimilarWeb, Semrush, Ahrefs |
| Stack technique | Wappalyzer, BuiltWith |
| Funding | Crunchbase, Pitchbook, Dealroom |
| Reviews utilisateurs | G2, Capterra, TrustRadius, AppStore, Play Store |
| Employés, recrutements | LinkedIn, Glassdoor, Blind |
| Ad creatives | Meta Ad Library, Google Ads Transparency |
| Trafic social | Sprout Social, BuzzSumo |
| Changements de site | Wayback Machine, Visualping |

## Gap analysis

Après l'analyse, remplis cette grille :

```
| Feature / Aspect       | Nous | Concurrent A | Concurrent B | Concurrent C |
|------------------------|------|--------------|--------------|--------------|
| Feature 1              | ✅   | ✅           | ❌           | ✅           |
| Feature 2              | ❌   | ✅           | ✅           | ❌           |
| ...                    |      |              |              |              |
| Prix entrée            | 29$  | 19$          | 49$          | Custom       |
| Essai gratuit          | 14j  | 7j           | 30j          | Démo only    |
| Support                | Chat | Email        | Chat + Phone | Success Mgr  |
```

Puis identifie :
- **Table stakes** : features que tout le monde a → on doit les avoir
- **Différenciateurs** : ce qu'eux ont et pas nous → décision : copier ou ignorer
- **Blind spots** : ce que personne n'a → opportunité potentielle
- **Over-investment** : ce qu'ils sur-investissent → probablement pas la priorité client

## Jobs-to-be-done comparatifs

Pour 3-5 jobs clients principaux, note qui résout le mieux :
```
Job : "Je veux importer rapidement mes données actuelles"
- Nous : 6/10 (import CSV manuel)
- Concurrent A : 9/10 (connecteurs natifs 20+ outils)
- Concurrent B : 3/10 (pas d'import)
- Concurrent C : 8/10 (API + templates)

Action : améliorer nos connecteurs ou développer un positionnement "simplicité".
```

## Livrable : battlecard 1 page

Format pour sales / marketing :

```
# VS [Concurrent]

## Leur pitch
[Headline exact + tagline]

## Leur force #1 (que tu dois reconnaître)
[Ce qu'ils font objectivement mieux]

## Notre angle d'attaque
[La dimension sur laquelle on gagne sans conteste]

## 3 objections fréquentes et réponses
1. Objection : "Ils sont moins chers"
   Réponse : "Vrai, pour le plan de base. Mais dès que tu passes à [cas d'usage], leur tarif triple alors que le nôtre plafonne à $X."
2. ...

## Signaux d'alerte à soulever (red flags)
[Churn élevé dans reviews ? Bugs récurrents ? Roadmap en retard ?]

## Preuves à avancer
[Quote client, chiffre comparatif, case study]
```

## Checklist qualité analyse

- [ ] Sources citées pour chaque affirmation
- [ ] Capture d'écran datée (contexte change vite)
- [ ] Forces reconnues avant faiblesses (crédibilité)
- [ ] Actionnabilité : chaque constat → action possible
- [ ] Mise à jour planifiée (max 90 jours)

## Anti-patterns à éviter

- **Bash-fest** : ne lister que les défauts → pas crédible
- **Liste exhaustive** sans hiérarchie → inutile en opérationnel
- **Projection hostile** : supposer leurs motivations → on se trompe
- **Dépassé** : benchmark d'il y a 1 an → le marché bouge vite
