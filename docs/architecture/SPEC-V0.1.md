# SPEC V0.1 — WealthWise Updater (codename)

> Synthèse CEO du 2026-05-01 après consultation parallèle CTO + Security Officer + Marketing Lead.

## 🎯 Décisions tranchées

| Sujet | Décision | Justification |
|---|---|---|
| **Stack** | Tauri 2 + React 18 + TypeScript + Tailwind | Validé par utilisateur + CTO |
| **Parser winget** | Regex robuste avec fallback (CTO option A) | Survit à locale FR/EN, encodings |
| **Streaming progression** | `BufReader` + Tauri `app.emit()` | Non-bloquant, temps réel |
| **Validation IDs** | Regex `^[a-zA-Z0-9._-]{1,128}$` | Bloque injection (security blocker #1) |
| **Consentement utilisateur** | Disclaimer + checkbox obligatoire avant batch update | Security blocker #2 + conformité Loi 25 |
| **Nom commercial** | TBD — suggestion marketing : "UpdateVault" | Codename interne `wealthwise-updater` jusqu'à décision finale |
| **Pricing** | Free / Pro 3,99 $/mois (35 $/an) / Business 15 $/user/mois | Marketing recommande -1 $ vs initial |

## 📋 Commandes Tauri exposées (3)

```rust
#[tauri::command]
async fn list_upgradable_apps() -> Result<Vec<AppUpdate>, String>;

#[tauri::command]
async fn update_app(app: AppHandle, app_id: String) -> Result<String, String>;

#[tauri::command]
async fn update_all(app: AppHandle) -> Result<String, String>;
```

## 🔐 Capabilities Tauri V2 (minimal)

`src-tauri/capabilities/default.json` :
```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Permissions for WealthWise Updater MVP",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "core:event:default",
    "core:event:allow-emit",
    "core:event:allow-listen"
  ]
}
```

> Note : on n'utilise PAS le plugin `tauri-plugin-shell` car on spawn `winget` directement via `std::process::Command` côté Rust → moins de surface d'attaque.

## ⚠️ Risques identifiés (CTO)

1. **UAC elevation** — winget peut prompt UAC. À tester en V0.1, mitigation V0.2 (manifest `requestedExecutionLevel`).
2. **Encoding UTF-16** — toujours `String::from_utf8_lossy`.
3. **Processus zombie** — toujours `.take()` stdout/stderr + timeout sur `child.wait()`.

## 📂 Fichiers à créer

- `app/package.json`, `app/vite.config.ts`, `app/tsconfig.json`, `app/index.html`
- `app/src/main.tsx`, `app/src/App.tsx`, `app/src/index.css`
- `app/src-tauri/Cargo.toml`, `app/src-tauri/tauri.conf.json`, `app/src-tauri/build.rs`
- `app/src-tauri/src/main.rs`, `app/src-tauri/src/lib.rs`
- `app/src-tauri/capabilities/default.json`
- `scripts/install-prereqs.ps1`, `scripts/run-dev.bat`, `scripts/build-release.bat`

## ✅ Verdict GO/NO-GO

**🟢 GO** pour MVP V0.1 avec les 2 blockers security inclus dès le commit initial.
