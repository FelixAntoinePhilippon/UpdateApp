# CLAUDE.md — WealthWise Updater

> Dernière mise à jour : 2026-05-01 — Pivot du projet WealthWise (finance) vers WealthWise Updater (gestionnaire de mises à jour Windows).

## 🎯 Mission du projet

**WealthWise Updater** est une application desktop Windows qui :
- Détecte automatiquement toutes les applications installées avec une mise à jour disponible
- Affiche visuellement la version actuelle vs la version la plus récente
- Permet de mettre à jour des logiciels spécifiques (sélection) ou tous d'un coup
- Utilise **winget** (le gestionnaire de paquets officiel Microsoft) → 100 % légal et sécurisé

### Pourquoi ce produit ?
- Windows ne notifie PAS clairement les MAJ d'apps tierces (Chrome, Discord, Notepad++, etc.)
- Les utilisateurs perdent du temps à les MAJ une par une
- Concurrence : Patch My PC (gratuit, UI vieille), UCheck (payant), winget natif (CLI uniquement)
- **Notre angle** : UI ultra moderne, freemium, support entreprise

## 🧱 Stack technique (immuable)

| Couche | Choix | Raison |
|---|---|---|
| Frontend | React 18 + TypeScript 5 + Vite 5 | Familier au fondateur, écosystème mature |
| Styling | Tailwind CSS 3 | Rapide, design system intégré |
| Backend | Rust (via Tauri 2) | Léger (~10 MB), sécurisé, performance native |
| Bundler | Tauri 2 | App Windows native, WebView2 |
| Mises à jour | `winget` (CLI Microsoft) | Officiel, pas besoin de ré-implémenter le téléchargement/install |
| Versionning | Git + GitHub Desktop | Déjà installé sur le PC |

**Règle d'or** : Aucune action de mise à jour ne se fait par téléchargement direct. Tout passe par `winget` → conformité totale, pas de risque malware.

## 👤 Fondateur

**Félix-Antoine Philippon**, 22 ans, Québec.
- Études en informatique
- Technicien en télétravail (à temps plein)
- Adore la finance, veut bâtir des revenus en ligne
- Travaille sur le projet en parallèle de son emploi

## 🏗️ Structure du projet

```
G:\ProjetAppUpdate\
├── CLAUDE.md                    ← ce fichier (lu en premier par Claude)
├── README.md                    ← documentation utilisateur
├── app\                         ← code source de l'application
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── src\                     ← React + TypeScript
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   └── index.css
│   └── src-tauri\               ← Backend Rust + config Tauri
│       ├── Cargo.toml
│       ├── tauri.conf.json
│       └── src\main.rs
├── scripts\
│   ├── install-prereqs.ps1      ← installeur auto (Rust, Node, WebView2)
│   ├── run-dev.bat              ← lance l'app en mode dev
│   └── build-release.bat        ← compile un .exe distribuable
├── docs\                        ← architecture, ADR, mission
└── .claude\                     ← agents et docs internes (ignore en runtime)
```

## 🗺️ Roadmap MVP (V0.1 — session 2026-05-01)

- [x] Pivot du projet WealthWise → WealthWise Updater
- [x] **Round 1 agents** : CTO + Security + Marketing en parallèle (3 rapports)
- [x] **Round 2 challenge** : QA + Design + CFO + Legal contestent R1
- [x] Synthèse CEO dans `docs/architecture/SPEC-V0.1-FINAL.md`
- [x] Scaffold Tauri 2 + React 18 + TypeScript + Tailwind 3
- [x] Backend Rust : `list_upgradable_apps`, `update_app`, `update_all`, `check_winget_available`
- [x] Frontend : 8 composants React (Header, SummaryBar, AppRow, EmptyState, LoadingState, ErrorState, DisclaimerModal, UpdateProgress)
- [x] Tests unitaires Rust (parser FR + EN, anti-injection ID)
- [x] Installeur auto PowerShell (winget + Node + Rust + MSVC + WebView2)
- [x] Audit code final (2 agents indépendants Rust/Frontend) → 7 corrections appliquées
- [ ] Test fonctionnel `run-dev.bat` (à faire par Félix)
- [ ] Commit GitHub Desktop (à faire par Félix)

## 🛣️ Roadmap Post-MVP

### V0.2 (1-2 semaines)
- Icônes des apps (récupérer depuis le registre Windows)
- Recherche / filtre dans la liste
- Tri par taille / catégorie / éditeur
- Notifications système quand MAJ disponibles
- Historique des MAJ effectuées (SQLite local)

### V1.0 (Lancement payant)
- Auto-update planifié (cron Windows)
- Mode silencieux (background)
- Profils ("Apps Bureau", "Apps Gaming", "Apps Dev")
- Licence + activation (modèle freemium)
- Site web + landing page (Vercel + Tailwind)

### V1.5 (B2B)
- Dashboard cloud multi-PC (Supabase)
- Gestion de parc IT
- Export rapports CSV/PDF

## ⚖️ Conformité légale (CRITIQUE)

- **Aucun téléchargement direct** : on délègue 100 % à `winget` (signé Microsoft)
- **Pas d'installation silencieuse non-consentie** : checkbox UI obligatoire
- **Disclaimer de responsabilité** : présent au premier lancement
- **Données utilisateur** : aucune collecte, aucune télémétrie en V0
- **Open-source friendly** : licence MIT envisagée pour la base, propriétaire pour features pro

## 🎯 Modèle de monétisation

**Freemium** (validé avec l'utilisateur 2026-05-01) :

| Tier | Prix | Features |
|---|---|---|
| **Free** | 0 $ | Liste + MAJ manuelle (clic) |
| **Pro** | 4,99 $/mois ou 39 $/an | Auto-update planifié, profils, mode silencieux, notifications |
| **Business** | 19 $/utilisateur/mois | Dashboard multi-PC, gestion parc, support prioritaire |

Cible MRR à 12 mois : 500 $/mois (≈ 100 abonnés Pro).

## 👥 Équipe d'agents (transposés depuis WealthWise finance)

Le dossier `.claude/agents/` contient 30+ agents pré-configurés. La plupart sont **réutilisables tels quels** (CTO, CPO, dev-frontend, dev-backend, qa-lead, design-lead, marketing-lead). Quelques uns sont à adapter :

- ❌ `legal-amf-auditor` → renommer en `legal-software-compliance` (focus EULA, GPL/MIT, télémétrie)
- ❌ `ml-quant-analyste` → archiver (pas pertinent ici)
- ❌ `realtime-data-engineer` → archiver
- ❌ `finance-specialiste` → garder pour les calculs de pricing/MRR
- ✅ `security-officer` → critique (on touche à `winget` qui modifie le système)

À ajouter (à créer avec `/skill-creator` au besoin) :
- `windows-platform-expert` → connaissance approfondie de winget, registry, UAC
- `tauri-architect` → spécialiste Rust+React+Tauri

## 📋 Protocole de travail

1. **Toute décision majeure** → on consulte (CTO, CPO, security-officer) en parallèle, on synthétise
2. **Tout commit** → tests OK, lint OK, build OK
3. **Toute feature** → mission doc d'abord, puis spec, puis code
4. **Anti-pattern OneDrive** : le projet est sur OneDrive, attention aux fichiers tronqués lors d'écritures > 200 LOC. Préférer Edit ciblé ou Python heredoc pour les gros fichiers.

## 🚀 Quick Start (pour Félix)

```powershell
# 1. Lancer l'installeur auto (vérifie + installe Rust, Node, WebView2)
cd G:\ProjetAppUpdate
powershell -ExecutionPolicy Bypass -File .\scripts\install-prereqs.ps1

# 2. Lancer l'app en mode dev
.\scripts\run-dev.bat
```

## 📝 Journal des changements (CLAUDE.md history)

- **2026-05-01 (session complète)** :
  - Pivot du projet WealthWise (finance) vers WealthWise Updater (Windows app updater)
  - Stack Tauri 2 + React 18 + TypeScript + Tailwind validée
  - **Méthodologie 2-rounds appliquée** (R1 propose, R2 challenge, CEO tranche, code) à la demande de Félix
  - MVP V0.1 entièrement scaffold (37 fichiers, ~1800 LOC)
  - Backend Rust avec parser width-based robuste (locale FR + EN), validation anti-injection, single-update queue, console cachée Windows
  - Frontend dark mode, disclaimer obligatoire, streaming logs en temps réel
  - Installeur PowerShell automatique (vérifie + installe winget/Node/Rust/MSVC/WebView2)
  - 4 tests unitaires Rust pour le parser
  - **Audit final** par 2 agents indépendants : 7 corrections appliquées (regex retiré, stderr ordre, animation Tailwind, etc.)
  - Modèle freemium revu par CFO : Free / Pro 7,99 $/mois / Business 25 $/user/mois (V1.0)
  - **Pour lancer** : `powershell -ExecutionPolicy Bypass -File .\scripts\install-prereqs.ps1` puis `.\scripts\run-dev.bat`
