---
name: ideation-produit
description: Générer, filtrer et prioriser des idées de logiciels rentables à partir de signaux marché (tendances, douleurs utilisateur, gaps compétitifs). À utiliser au début d'un nouveau projet, pour une pivot discussion, ou quand on cherche une opportunité de business.
---

# SKILL : Idéation Produit

Ce skill guide le processus d'idéation : passer de "j'ai envie de créer quelque chose" à "voici 3 idées validées prêtes à prototyper".

## Quand utiliser ce skill

- Début d'un nouveau projet sans idée fixée
- Pivot d'un produit existant
- Exploration trimestrielle de nouveaux marchés
- Challenge d'une intuition produit

## Phase 1 — Collecte de signaux (30 min)

Source des idées valides, en ordre de qualité :

1. **Douleurs vécues personnellement** — les meilleures, parce que tu es à la fois utilisateur et constructeur.
2. **Douleurs de ton entourage professionnel** — à valider par interview.
3. **Trends croisés** : technologie émergente × secteur mature (ex : IA × compta, blockchain × propriété intellectuelle).
4. **Changements réglementaires** : nouvelle loi = nouveau marché (Loi 25 Québec, DSA/DMA Europe, SEC règles).
5. **Insatisfaction client mesurable** : reviews 1-2 étoiles des compétiteurs, posts Reddit en colère.
6. **Gaps de compétiteurs** : features manquantes notées par analyste compétiteurs.
7. **Demande non satisfaite** : "je cherche un outil pour [X] mais rien ne convient" sur forums.

## Phase 2 — Grille de filtrage

Pour chaque idée, score de 1 à 5 sur :

| Critère | Question |
|---------|----------|
| **Douleur** | Les gens paient déjà pour résoudre ça (ou perdent temps/argent) ? |
| **Taille marché** | TAM > 100M$ si B2C, > 10M$ si B2B niche ? |
| **Compétition** | Marché existant mais imparfait (sweet spot), pas greenfield ni rouge vif ? |
| **Accessibilité** | Canal d'acquisition clair et réaliste ? |
| **Monétisation** | Business model évident (pas "on verra pour la monétisation") ? |
| **Défendabilité** | Peut-on créer un moat (data, network effects, IP, switching cost) ? |
| **Timing** | Pourquoi maintenant ? (tech mature, régulation, changement social) |
| **Fit personnel** | Tu as une edge (expertise, réseau, insight) ? |

Score ≥ 32/40 = vaut le coup de creuser.

## Phase 3 — Validation par hypothèses

Formule chaque idée en 3 hypothèses falsifiables :

```
Hypothèse produit :
  Nous croyons que [segment X] a [problème Y] 
  parce que [signal observé].
  Nous le prouverons en [test concret] 
  avec le résultat [critère mesurable] 
  dans [délai].
```

Tests de validation selon ambition :
- **Smoke test** (1-3 jours) : landing page + Google Ads, mesurer CTR + email sign-ups.
- **Concierge** (1-2 semaines) : livrer la valeur manuellement à 5 clients.
- **Wizard of Oz** (2-4 semaines) : UI qui semble automatique, backend humain.
- **MVP** (1-3 mois) : produit minimal qui délivre le job principal.

## Phase 4 — Modèle économique

Vérifie :
- **Willingness to pay** : prix que les clients accepteraient (demander en interview)
- **CAC prévisionnel** : via quel canal ? combien coûte un lead ?
- **LTV cible** : tenure × ARPU × marge
- **Ratio LTV/CAC** : >3 pour scaler sereinement
- **Payback period** : < 12 mois idéalement

## Phase 5 — Go / No-Go

Feu vert si :
- [ ] Score ≥ 32/40 en grille de filtrage
- [ ] Au moins 1 hypothèse validée par test concret
- [ ] Modèle économique unitaire positif
- [ ] Énergie de l'équipe pour 24 mois minimum

Sinon : documenter l'idée dans un "graveyard" avec ce qu'on a appris, et passer à la suivante.

## Livrable final

Document `docs/idees/[nom-idee].md` :
- Résumé 1 phrase : problème / solution / cible
- Score filtrage + justification par critère
- Hypothèses formulées
- Tests effectués et résultats
- Modèle économique prévisionnel
- Décision : GO / NO-GO / PIVOT

## Idées classiques à éviter (trop saturées)

- Un nouveau Slack / Notion / Trello sans angle très différencié
- Une marketplace X pour Y (sans liquidité initiale)
- App sociale (network effects prohibitivement cher à construire en tant que petit)
- Produit "pour tout le monde"
