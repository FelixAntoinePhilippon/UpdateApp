# SPEC V0.1 FINAL — WealthWise Updater (codename)

> CEO synthesis 2026-05-01 après 2 rounds : R1 (CTO + Security + Marketing) + R2 challenge (QA + Design + CFO + Legal). Les arbitrages ci-dessous sont définitifs pour le MVP V0.1.

## ⚖️ Arbitrages CEO (conflits tranchés)

| Conflit | Position retenue | Raison |
|---|---|---|
| Parser regex (CTO) vs unreliable (QA) | **Regex robuste + fallback width-based + try/catch + 5 tests obligatoires** | QA a raison sur edge cases. On ne peut pas attendre `--json` (n'existe pas sur winget upgrade). On hardcode 5 tests E2E. |
| Multi-update parallèle vs queue | **Single-update queue (FIFO), V0.1** | QA blocker accepté. Multi-update viendra en V0.2 avec channel Tokio. |
| Pas de timeout vs timeout 30s (QA) | **Timeout 60s sur list, 600s (10min) sur update_app individuel + bouton Cancel** | Tradeoff entre UX et longues installations (ex: VS Code = 200 MB) |
| 3,99 $ (Marketing) vs 7,99 $ (CFO) | **7,99 $/mois pour Pro, 25 $/user pour Business** (mais V1.0 seulement) | CFO a la modélisation chiffrée. V0.1 reste 100 % gratuit pour valider product-market fit. |
| Disclaimer simple (Security) vs EULA complet (Legal) | **V0.1 : modal premier lancement avec 3 risques + checkbox. V1.0 : EULA complet + clause backup avant batch.** | Pragmatique pour MVP, robuste pour monétisation |
| Nom "WealthWise Updater" vs "UpdateVault" | **Codename interne `wealthwise-updater` pour V0.1, décision finale après MVP fonctionnel** | Ne pas bloquer sur le naming, mais documenter |

## 🛠️ Implémentation V0.1 (locked)

### Backend Rust (3 commandes Tauri)

```rust
// src-tauri/src/main.rs

use std::process::{Command, Stdio};
use std::io::{BufRead, BufReader};
use std::time::Duration;
use std::sync::Mutex;
use serde::{Serialize, Deserialize};
use tauri::{AppHandle, Emitter, State};
use regex::Regex;
use lazy_static::lazy_static;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct AppUpdate {
    pub name: String,
    pub id: String,
    pub version: String,
    pub available: String,
    pub source: String,
}

// Mutex global = single-update queue (V0.1 simplification)
pub struct UpdateLock(Mutex<()>);

lazy_static! {
    static ref VALID_ID: Regex = Regex::new(r"^[a-zA-Z0-9._\-+]{1,128}$").unwrap();
}

#[tauri::command]
async fn list_upgradable_apps() -> Result<Vec<AppUpdate>, String> {
    let output = Command::new("winget")
        .args(&["upgrade", "--include-unknown", "--accept-source-agreements"])
        .output()
        .map_err(|e| format!("winget introuvable: {}", e))?;

    let stdout = String::from_utf8_lossy(&output.stdout);
    parse_winget_output(&stdout)
}

#[tauri::command]
async fn update_app(
    app: AppHandle,
    lock: State<'_, UpdateLock>,
    app_id: String,
) -> Result<String, String> {
    if !VALID_ID.is_match(&app_id) {
        return Err(format!("ID invalide (injection bloquée) : {}", app_id));
    }
    let _guard = lock.0.lock().map_err(|e| e.to_string())?;
    run_winget_streamed(&app, &["upgrade", "--id", &app_id, "--silent",
        "--accept-source-agreements", "--accept-package-agreements"])
}

#[tauri::command]
async fn update_all(app: AppHandle, lock: State<'_, UpdateLock>) -> Result<String, String> {
    let _guard = lock.0.lock().map_err(|e| e.to_string())?;
    run_winget_streamed(&app, &["upgrade", "--all", "--silent",
        "--accept-source-agreements", "--accept-package-agreements"])
}
```

### Frontend React (composants principaux)

- `App.tsx` — root, gère l'état global (apps list, selected, isUpdating)
- `Header.tsx` — branding + bouton refresh
- `SummaryBar.tsx` — compteur + bouton "Update All"
- `AppRow.tsx` — une ligne (checkbox + nom + version current → available + bouton Update)
- `EmptyState.tsx` — "✓ Toutes les apps sont à jour"
- `LoadingState.tsx` — spinner initial
- `ErrorState.tsx` — winget non trouvé / pas connexion
- `DisclaimerModal.tsx` — premier lancement, 3 risques + checkbox

### Design tokens (Tailwind)

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        bg: { primary: '#09090B', secondary: '#18181B', tertiary: '#27272A' },
        text: { primary: '#FAFAFA', secondary: '#A1A1AA' },
        accent: '#3B82F6',
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] }
    }
  }
}
```

### Tests obligatoires V0.1 (T1-T5 from QA)

| # | Test | Méthode |
|---|---|---|
| T1 | Parser robuste (5 inputs edge case) | unit test Rust avec fixtures |
| T2 | Injection ID bloquée | passer `"foo; rm -rf /"` → expect Err |
| T3 | Streaming events emit | mock Command + assert N events |
| T4 | UAC handling | manuel sur PC user (VSCode upgrade) |
| T5 | Cancel pendant update | bouton Cancel kill child process |

### Roadmap post-V0.1 (parking lot)

- V0.2 : multi-update parallèle (channel Tokio), virtualisation 100+ apps, recherche, badge durée
- V0.3 : icônes apps depuis registry, historique SQLite, notifications natives
- V1.0 : EULA + code signing ($300/an Sectigo) + monétisation Stripe + télémétrie opt-in

## ✅ Verdict CEO : GO CODE

Tous les blockers sont adressés. Le code peut commencer.
