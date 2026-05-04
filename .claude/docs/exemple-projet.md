# Exemple de projet — "BudgetFlow" : app budget pour freelances au Québec

Ce document illustre comment utiliser l'entreprise d'agents sur un projet concret.

---

## Scénario

Félix (toi) ouvre une session dans ce dossier et tape :

> *"Je veux créer une app web qui aide les freelances québécois à gérer leur budget, leur TPS/TVQ, et leurs versements d'impôts. Marché local, prix accessible. Peux-tu cadrer le projet ?"*

---

## Étape 1 — CEO prend en charge

Claude Code reconnaît l'intention stratégique et invoque `direction-ceo`.

**Le CEO** rédige `docs/mission-budgetflow.md` :

```markdown
# Mission : BudgetFlow

## Problème à résoudre
Les freelances au Québec (~400 000 actifs) gèrent leur comptabilité sur Excel/papier et ratent souvent 
leurs échéances TPS/TVQ + acomptes provisionnels, ce qui entraîne pénalités et stress fiscal.

## Proposition de valeur
BudgetFlow automatise la compta de base, calcule tes taxes en temps réel, 
et t'envoie un rappel avant chaque échéance — pour 19$/mois.

## Audience cible (3 personas)
1. **Freelance techno 25-35 ans** (80%) : revenu variable, pas envie de comptable
2. **Artiste/créatif 30-45 ans** : angoisse fiscale, allergique aux outils compliqués
3. **Consultant 40+** : veut rationaliser, ouvert à des outils modernes

## Critères de succès (90 jours post-lancement)
- 500 utilisateurs actifs payants
- NPS ≥ 40
- Churn mensuel < 5%

## Contraintes
- Produit local QC uniquement (adaptabilité règles TPS/TVQ)
- Budget initial : ~8000 $ (infra + outils SaaS)
- Solo-founder : délais souples, 20-30h/semaine
- Conformité Loi 25 (PII)

## Non-objectifs explicites
- Pas de facturation (on intègre plutôt avec Wave, QuickBooks)
- Pas d'exports gouvernementaux directs (lien vers guide IRS Québec)
- Pas d'expansion France/Belgique v1

## Répartition
- Direction : CEO + CTO + CPO
- Dev : frontend React, backend Node, DB Postgres
- Design : UI minimaliste, couleur confiance (bleu + blanc cassé)
- Recherche : 10 freelances QC à interviewer
- Data : tracking de onboarding + calculs fiscaux
```

Puis il délègue :
- À **recherche-lead** : valide le marché + benchmark 5 compétiteurs (Wave, FreshBooks, QuickBooks Self-Employed, Dext, Hurdlr)
- À **direction-cto** : ADR de stack
- À **direction-cpo** : personas et premier PRD

---

## Étape 2 — Recherche marché

**recherche-lead** produit `docs/recherche/marche-budgetflow.md` :

- TAM au Québec : ~400k freelances × 240$/an = 96M$/an
- SAM réaliste : 200k (early adopters, 30-45 ans) × 240 = 48M$/an
- SOM 3 ans : 5% = 2,4M$ ARR
- Tendances : hausse freelance post-COVID, complexification fiscale, fatigue Excel

**recherche-competiteurs** produit `docs/recherche/competiteurs/matrice.md` :

| Feature | BudgetFlow | Wave | QuickBooks SE | FreshBooks | Hurdlr |
|---------|------------|------|---------------|------------|--------|
| Prix | 19$/mo | Gratuit | 25$/mo US | 19$/mo | 10$/mo |
| TPS/TVQ Québec | ✅ Auto | ❌ | Partiel | ❌ | ❌ |
| Acomptes IRS QC | ✅ | ❌ | ❌ | ❌ | ❌ |
| Intégration bancaire QC | ✅ | ✅ | ✅ | ✅ | ✅ |
| Simplicité UX | ✅✅ | ❌ (complexe) | ❌ | ✅ | ✅ |

**Insight** : personne ne couvre la fiscalité québécoise complète. **Notre angle** : "Le seul outil fait AU Québec POUR le Québec".

---

## Étape 3 — Cadrage produit (CPO)

**direction-cpo** rédige `docs/prd/PRD-001-mvp-core.md` avec 5 features :

1. Connexion bancaire (via Plaid ou Flinks pour CA)
2. Catégorisation auto des dépenses (règles simples, pas ML au MVP)
3. Calcul TPS/TVQ en temps réel
4. Rappels d'échéances fiscales
5. Tableau de bord mensuel

Chaque feature a ses user stories, ses critères d'acceptation, ses métriques.

---

## Étape 4 — Stack (CTO)

**direction-cto** rédige `docs/adr/ADR-001-stack-budgetflow.md` :

- **Frontend** : Next.js 14 + Tailwind + tRPC
- **Backend** : Node + Prisma + PostgreSQL
- **Auth** : Clerk (simple, prix OK à <1000 users, puis migrer)
- **Paiement** : Stripe (avec TPS/TVQ auto)
- **Banking** : Flinks (Canada-native, meilleure couverture QC)
- **Hosting** : Vercel + Railway (pas d'AWS en MVP)
- **Observabilité** : Sentry + PostHog self-host

**Justifications** dans le doc.

---

## Étape 5 — Design

**design-lead** définit :
- Palette : bleu "confiance" (#1E40AF) + crème (#FDF9F3) + accent corail (#F87171)
- Typo : Inter pour UI, Fraunces pour titres
- Ton visuel : minimaliste, chaleureux, pro — contre Wave (corporate froid)

**design-ux-ui** produit les wireframes des 5 écrans principaux + specs de composants.

---

## Étape 6 — Développement

**dev-lead** découpe en 6 sprints de 2 semaines :
- Sprint 1 : Auth + setup projet
- Sprint 2 : Intégration Flinks + import transactions
- Sprint 3 : Catégorisation + calculs fiscaux
- Sprint 4 : Dashboard + rappels
- Sprint 5 : Paiement + onboarding
- Sprint 6 : Polish + beta

**dev-frontend** et **dev-backend** travaillent en parallèle, avec **qa-testeur** qui écrit les tests en continu.

---

## Étape 7 — Marketing en parallèle

**marketing-lead** définit : 
- Canaux : SEO + TikTok + partenariats (comptables QC) + Reddit r/QuebecLivre
- Lancement : Product Hunt + La Presse + Journal Métro + podcast DoubleFuture

**marketing-content** rédige :
- Landing "Le budget pour freelances québécois" (focus bénéfice + screenshot)
- 15 articles SEO ("comment calculer TPS TVQ freelance", "acomptes provisionnels IRS Québec", etc.)
- Séquence email 7 jours
- 20 posts TikTok scriptés (shorts éducatifs fiscaux)

**marketing-seo** cible 30 mots-clés longue traîne avec difficulté <25.

---

## Étape 8 — Lancement

Sur Product Hunt à J-0 :
- Titre : "BudgetFlow — Comptabilité + TPS/TVQ pour freelances du Québec"
- 1 GIF démo 15 sec
- 3 testimonials beta testers
- Promo code PRODUCTHUNT pour 3 mois à 10$

**data-analyste** suit en live :
- Trafic, signups, conversions.
- Top pays / villes → bingo : 90% Québec.
- Funnel de onboarding → 62% complètent.

---

## Étape 9 — Post-lancement (J+30)

**data-lead** synthèse 30 jours :
- 340 signups, 210 payants à 19$/mo = 3990 $ MRR
- NPS : 52
- Churn : 4% mois 1

**direction-ceo** décide :
- Doubler sur TikTok (meilleur CAC)
- Prochaine feature : export T2125 pour impôt (demande #1 des utilisateurs)

---

## Résumé : qui fait quoi

| Phase | Agents principaux |
|-------|-------------------|
| Cadrage | `direction-ceo`, `direction-cto`, `direction-cpo` |
| Marché | `recherche-lead`, `recherche-competiteurs` |
| Produit | `direction-cpo`, `design-lead`, `design-ux-ui` |
| Code | `dev-lead`, `dev-frontend`, `dev-backend`, `qa-lead`, `qa-testeur` |
| GTM | `marketing-lead`, `marketing-content`, `marketing-seo`, `design-ux-ui` (creatives) |
| Data | `data-lead`, `data-analyste` |

---

Ce n'est qu'un exemple — adapte le workflow à chaque projet selon ses contraintes.
