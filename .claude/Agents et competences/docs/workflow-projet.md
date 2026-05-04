# Workflow d'un projet logiciel — vue complète

Du "j'ai une idée" au "produit en prod et client qui paie".

---

## Phase 0 — Idéation (si on part de zéro)

**Durée** : 1-3 jours virtuels.

1. **Toi (utilisateur)** → exprime une intention (ex : "je veux créer un SaaS pour freelances").
2. **direction-ceo** : pose 3-5 questions de cadrage, ou invoque le skill `ideation-produit` pour générer des options.
3. **recherche-lead** : analyse marché rapide (TAM, tendances, 3 segments possibles).
4. **recherche-competiteurs** : 3-5 compétiteurs principaux repérés avec gap analysis.
5. **direction-ceo** : présente 2-3 options à l'utilisateur pour choisir.

**Livrable** : `docs/idees/[opportunites].md`

---

## Phase 1 — Cadrage (projet choisi)

**Durée** : 1-2 jours virtuels.

1. **direction-ceo** : rédige `docs/mission-[projet].md` (mission, valeur, cible, KPIs, non-goals).
2. **direction-cpo** : construit les personas détaillés + premier JTBD.
3. **direction-cto** : ADR de stack technique — `docs/adr/ADR-001-stack.md`.
4. **design-lead** : ébauche direction artistique (3 moodboards descriptifs).
5. **marketing-lead** : positionnement en 1 phrase + 3 canaux prioritaires.

**Livrables** :
- `docs/mission-[projet].md`
- `docs/recherche/personas.md`
- `docs/adr/ADR-001-stack.md`
- `docs/design/brand-guidelines.md` (v0)
- `docs/marketing/strategie-[projet].md` (v0)

**Validation** : `direction-ceo` remonte une synthèse à l'utilisateur pour green light.

---

## Phase 2 — Discovery détaillée

**Durée** : 1-2 semaines virtuelles.

1. **recherche-lead** : rédige un guide d'interview → simule 5-8 interviews → synthèse.
2. **data-lead** : identifie signaux existants (si produit déjà live) ou définit plan de tracking.
3. **direction-cpo** : priorise les jobs-to-be-done (top 3 → first feature de MVP).
4. **design-lead** : flows et wireframes bas-niveau.
5. **recherche-competiteurs** : battlecards des 3 top compétiteurs.

**Livrables** :
- `docs/recherche/synthese-[segment].md`
- `docs/data/tracking-plan.md`
- `docs/design/flows-mvp.md`
- `docs/marketing/battlecards/vs-[concurrent].md` (×3)

---

## Phase 3 — Spécification

**Durée** : 3-5 jours virtuels.

1. **direction-cpo** : rédige les PRD des 3-5 premières features → `docs/prd/PRD-00X-[feature].md`.
2. **direction-cto** : revue faisabilité, commentaires.
3. **design-ux-ui** : maquettes hi-fi + specs → `docs/design/specs/[feature]-spec.md`.
4. **dev-lead** : découpage technique → `docs/tasks/[feature]-tasks.md` + estimation.
5. **qa-lead** : plan de test → `docs/tests/test-plan-[feature].md`.

**Validation** : triple revue — CPO, CTO, Dev-Lead approuvent explicitement.

---

## Phase 4 — Développement

**Durée** : variable (sprints de 2 semaines).

### Sprint planning
- **dev-lead** et **qa-lead** : planifient le sprint à partir des priorités RICE.
- Capacité réelle < capacité théorique (réserve 20% pour imprévus).

### Sprint execution (quotidien)
- **dev-backend** et **dev-frontend** : travaillent en parallèle, alignés sur les contrats API.
- **qa-testeur** : écrit les tests automatisés en même temps que le code.
- **dev-lead** : code review chaque PR avant merge.

### Sprint review (fin)
- **qa-lead** : valide chaque feature contre son plan de test.
- **direction-cpo** : accepte ou rejette au regard du PRD.
- **design-lead** : valide respect des specs visuelles.

**Livrables** : code en staging, tests verts, features validées.

---

## Phase 5 — Go to market (pré-lancement)

**Durée** : 2-4 semaines en parallèle du dev.

1. **marketing-lead** : plan de lancement (semaine par semaine).
2. **marketing-content** : rédige landing page, email séquence, article de lancement, posts sociaux.
3. **marketing-seo** : optimise landing, identifie mots-clés lancement, prépare backlinks.
4. **design-ux-ui** : crée 10-15 creatives (bannières, social, ads).
5. **recherche-lead** : recrute 20-50 beta testeurs via canaux identifiés.

**Livrables** :
- Landing page live
- Séquence email (5+ mails)
- Pack social (20+ creatives)
- Liste beta testeurs
- PR kit

---

## Phase 6 — Tests privés (beta)

**Durée** : 2-4 semaines.

1. Onboarding des beta testeurs par **marketing-content** (scripts + emails).
2. **data-analyste** : setup tableau de bord beta (usage, drop-offs, NPS).
3. **recherche-lead** : interviews de sortie (5-10 users).
4. **qa-lead** : bug triage, priorisation.
5. **dev-lead** : fix bugs P0/P1 en continu.
6. **direction-cpo** : décide pivot éventuel (feature qui n'est pas utilisée, friction inattendue).

**Livrables** :
- Rapport beta avec NPS, bugs trouvés, insights clients
- Backlog priorisé pour V1.0

---

## Phase 7 — Lancement public

**Durée** : 1 semaine sprint intense.

| Jour | Action |
|------|--------|
| J-7 | Dernière série de bugs fixés, features gelées |
| J-3 | Product Hunt préparé, PR kit envoyé aux journalistes |
| J-1 | Review finale par CEO, go/no-go |
| J0 | Lancement Product Hunt (8am PT) + email list + social blast |
| J+1 | Gestion du trafic, réponse commentaires, onboarding |
| J+3 | Premier rapport de performance par `data-analyste` |
| J+7 | Rétro de lancement par CEO |

---

## Phase 8 — Grow & retain

**Fréquence** : continu, rituels hebdo.

1. **data-lead** : weekly metrics review (NSM + KPIs).
2. **marketing-lead** : itère sur les canaux qui convertissent, coupe ceux qui ne marchent pas.
3. **direction-cpo** : roadmap mise à jour chaque mois (Now / Next / Later).
4. **recherche-lead** : interviews trimestrielles pour rester aligné.
5. **design-lead** + **dev-lead** : dette design / technique gérée 20% du temps.

---

## Cas particuliers

### Incident production (P0)
1. `qa-lead` ou `data-analyste` détecte.
2. Remontée immédiate à `dev-lead` et `direction-cto`.
3. `dev-lead` crée canal d'incident, assigne un dev.
4. Rollback si fix > 30 min.
5. Post-mortem dans 48h par `direction-cto`.

### Pivot produit
1. Signal de `data-lead` ou `recherche-lead`.
2. `direction-cpo` + `direction-ceo` évaluent.
3. Décision : persévérer / pivoter / tuer.
4. Si pivot, re-cadrage en Phase 1.

### Nouvelle opportunité (ex : demande d'un gros client)
1. `direction-ceo` évalue fit stratégique.
2. `direction-cpo` vérifie non-déviation roadmap.
3. Décision : prioriser / parquer / refuser.

---

## Estimation totale d'un projet MVP

**Temps virtuel** (en heures d'agents mobilisés) :
- Idéation + cadrage : 20-30h
- Discovery : 40-60h
- Spécification : 30-40h
- Développement : 200-400h
- GTM préparation : 60-80h
- Beta : 40-60h (+ calendaire)
- Lancement : 30h intense

**Total** : 400-700h d'agents pour un MVP complet.

En temps utilisateur humain (toi à superviser) : 2-4h / jour pendant 6-10 semaines.
