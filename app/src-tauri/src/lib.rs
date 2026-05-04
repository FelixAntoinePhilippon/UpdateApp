// WealthWise Updater - Backend Rust (Tauri 2) - V0.2.2

use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::io::{BufRead, BufReader};
use std::process::{Command, Stdio};
use std::sync::Mutex;
use tauri::{AppHandle, Emitter, State};

#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

#[cfg(target_os = "windows")]
const CREATE_NO_WINDOW: u32 = 0x08000000;

const BACKEND_VERSION: &str = "v0.2.2-services-2026-05-01";
const APP_VERSION: &str = env!("CARGO_PKG_VERSION");

const SELF_UPDATE_URL: &str = "https://gist.githubusercontent.com/FelixAntoinePhilippon/4200222ee1e327f20c2d2c5438f0877a/raw/latest.json";

const SELFTEST_SAMPLE: &str = include_str!("selftest_sample.txt");

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct AppUpdate {
    pub name: String,
    pub id: String,
    pub version: String,
    pub available: String,
    pub source: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct SelfUpdateInfo {
    pub current: String,
    pub latest: String,
    pub available: bool,
    pub url: String,
    pub notes: String,
    pub pub_date: String,
    pub error: String,
}

pub struct UpdateLock(pub Mutex<()>);

// ===========================================================================
//  Mapping app_id -> process names + services Windows
// ===========================================================================

fn get_process_names_for_app(app_id: &str) -> Vec<&'static str> {
    let lower = app_id.to_lowercase();
    match lower.as_str() {
        "apple.bonjour" => vec!["mDNSResponder.exe", "mDNSResponderHelper.exe"],
        "microsoft.edge" => vec!["msedge.exe", "msedgewebview2.exe"],
        "discord.discord" => vec!["Discord.exe"],
        "spotify.spotify" => vec!["Spotify.exe"],
        "notepad++.notepad++" => vec!["notepad++.exe"],
        "microsoft.visualstudiocode" => vec!["Code.exe"],
        "microsoft.visualstudiocode.insiders" => vec!["Code - Insiders.exe"],
        "anysphere.cursor" => vec!["Cursor.exe"],
        "logitech.ghub" => vec!["lghub.exe", "lghub_agent.exe"],
        "bytedance.capcut" => vec!["CapCut.exe"],
        "obsproject.obsstudio" => vec!["obs64.exe", "obs32.exe"],
        "google.chrome" => vec!["chrome.exe"],
        "brave.brave" => vec!["brave.exe"],
        "mozilla.firefox" => vec!["firefox.exe"],
        "valve.steam" => vec!["steam.exe", "steamwebhelper.exe"],
        "epicgames.epicgameslauncher" => vec!["EpicGamesLauncher.exe"],
        "ubisoft.connect" => vec!["upc.exe", "UbisoftConnect.exe"],
        "electronicarts.eadesktop" => vec!["EADesktop.exe", "EALauncher.exe"],
        "elgato.streamdeck" => vec!["StreamDeck.exe"],
        "elgato.4kcaptureutility" => vec!["4KCaptureUtility.exe"],
        "microsoft.teams" => vec!["ms-teams.exe", "Teams.exe"],
        "microsoft.onedrive" => vec!["OneDrive.exe"],
        "microsoft.gameinput" => vec![],
        "windirstat.windirstat" => vec!["WinDirStat.exe"],
        "anydesk.anydesk" => vec!["AnyDesk.exe"],
        "stripe.stripecli" => vec!["stripe.exe"],
        "google.antigravity" => vec!["Antigravity.exe"],
        "python.python.3.12" => vec!["python.exe", "pythonw.exe"],
        "python.python.3.13" => vec!["python.exe", "pythonw.exe"],
        "python.python.3.14" => vec!["python.exe", "pythonw.exe"],
        "oracle.javaruntimeenvironment" => vec!["java.exe", "javaw.exe"],
        "eclipseadoptium.temurin.21.jdk" => vec!["java.exe", "javaw.exe"],
        "microsoft.visualstudio.buildtools" => vec![],
        "microsoft.vcredist.2012.x64" => vec![],
        "cfx.re.fivem" => vec!["FiveM.exe", "FiveM_GTAProcess.exe"],
        _ => Vec::new(),
    }
}

/// Services Windows a stopper (via `sc stop`) avant la MAJ.
/// Critique pour Bonjour, services Adobe, etc.
fn get_services_for_app(app_id: &str) -> Vec<&'static str> {
    let lower = app_id.to_lowercase();
    match lower.as_str() {
        "apple.bonjour" => vec!["Bonjour Service"],
        "logitech.ghub" => vec!["LGHUBUpdaterService"],
        "elgato.streamdeck" => vec![],
        _ => Vec::new(),
    }
}

fn is_system_protected_process(name: &str) -> bool {
    let lower = name.to_lowercase();
    matches!(lower.as_str(),
        "svchost.exe" | "csrss.exe" | "winlogon.exe" | "lsass.exe" |
        "smss.exe" | "wininit.exe" | "system" | "services.exe" |
        "explorer.exe" | "dwm.exe" | "spoolsv.exe" | "fontdrvhost.exe"
    )
}

/// Verifie si l'app tourne en mode administrateur. Sur Windows, teste si on
/// peut creer un fichier dans C:\Windows\Temp (necessite des droits eleves).
fn is_running_as_admin() -> bool {
    #[cfg(target_os = "windows")]
    {
        let test_path = "C:\\Windows\\System32\\.wwu_admin_test";
        match std::fs::File::create(test_path) {
            Ok(_) => {
                let _ = std::fs::remove_file(test_path);
                true
            }
            Err(_) => false,
        }
    }
    #[cfg(not(target_os = "windows"))]
    { false }
}

/// Stoppe un service Windows via sc.exe stop. Necessite des droits admin.
fn stop_windows_service(name: &str) -> Result<(), String> {
    let mut cmd = Command::new("sc");
    #[cfg(target_os = "windows")]
    cmd.creation_flags(CREATE_NO_WINDOW);
    let out = cmd.args(["stop", name])
        .output()
        .map_err(|e| format!("sc spawn : {}", e))?;
    if !out.status.success() {
        let stderr = String::from_utf8_lossy(&out.stderr);
        let stdout = String::from_utf8_lossy(&out.stdout);
        let msg = format!("{} {}", stderr.trim(), stdout.trim()).trim().to_string();
        return Err(msg);
    }
    Ok(())
}

// ===========================================================================
//  Parser winget
// ===========================================================================

fn clean_winget_output(raw: &str) -> String {
    raw.lines().filter(|line| {
        let trimmed = line.trim();
        if trimmed.is_empty() { return false; }
        let only_spinner = trimmed.chars().all(|c| matches!(c, '-' | '\\' | '|' | '/' | ' '));
        if only_spinner && trimmed.chars().count() < 5 { return false; }
        true
    }).collect::<Vec<&str>>().join("\n")
}

fn compute_column_positions(s: &str) -> Vec<usize> {
    let chars: Vec<char> = s.chars().collect();
    let mut positions = Vec::new();
    let mut in_seg = false;
    for (i, &c) in chars.iter().enumerate() {
        if c == '-' { if !in_seg { positions.push(i); in_seg = true; } } else { in_seg = false; }
    }
    positions
}

fn compute_column_positions_from_header(h: &str) -> Vec<usize> {
    let chars: Vec<char> = h.chars().collect();
    let mut positions = Vec::new();
    let mut i = 0; let mut in_word = false;
    while i < chars.len() {
        let c = chars[i];
        if c != ' ' && c != '\t' {
            if !in_word { positions.push(i); in_word = true; }
            i += 1;
        } else {
            let mut sp = 0; let mut j = i;
            while j < chars.len() && (chars[j] == ' ' || chars[j] == '\t') { sp += 1; j += 1; }
            if sp >= 2 { in_word = false; }
            i = j;
        }
    }
    positions
}

fn split_by_positions(line: &str, positions: &[usize]) -> Vec<String> {
    let chars: Vec<char> = line.chars().collect();
    let mut parts = Vec::new();
    for i in 0..positions.len() {
        let start = positions[i];
        let end = if i + 1 < positions.len() { positions[i + 1].min(chars.len()) } else { chars.len() };
        if start >= chars.len() { parts.push(String::new()); continue; }
        let p: String = chars[start..end].iter().collect();
        parts.push(p.trim().to_string());
    }
    parts
}

fn is_valid_id(id: &str) -> bool {
    !id.is_empty() && (id.contains('.') || id.contains('-') || id.contains('_'))
}

fn try_parse_app(parts: &[String]) -> Option<AppUpdate> {
    if parts.len() < 4 { return None; }
    let app = AppUpdate {
        name: parts[0].clone(), id: parts[1].clone(), version: parts[2].clone(),
        available: parts[3].clone(), source: parts.get(4).cloned().unwrap_or_default(),
    };
    if app.id.is_empty() || app.version.is_empty() || app.available.is_empty() { return None; }
    if !is_valid_id(&app.id) { return None; }
    Some(app)
}

fn parse_column_position(lines: &[&str], sep_idx: usize) -> Vec<AppUpdate> {
    let sep = lines[sep_idx];
    let header = if sep_idx > 0 { lines[sep_idx - 1] } else { return Vec::new(); };
    let mut positions = compute_column_positions(sep);
    if positions.len() < 4 { positions = compute_column_positions_from_header(header); }
    if positions.len() < 4 { return Vec::new(); }
    let mut apps = Vec::new();
    for line in lines.iter().skip(sep_idx + 1) {
        if line.trim().is_empty() { continue; }
        if !line.contains("  ") { break; }
        let parts = split_by_positions(line, &positions);
        if let Some(a) = try_parse_app(&parts) { apps.push(a); }
    }
    apps
}

fn parse_smart_split(lines: &[&str], sep_idx: usize) -> Vec<AppUpdate> {
    let mut apps = Vec::new();
    for line in lines.iter().skip(sep_idx + 1) {
        if line.trim().is_empty() { continue; }
        if !line.contains("  ") { break; }
        let mut parts: Vec<String> = Vec::new();
        let mut current = String::new();
        let chars: Vec<char> = line.chars().collect();
        let mut i = 0;
        while i < chars.len() {
            let c = chars[i];
            if c == ' ' || c == '\t' {
                let mut j = i;
                while j < chars.len() && (chars[j] == ' ' || chars[j] == '\t') { j += 1; }
                let sc = j - i;
                if sc >= 2 { if !current.is_empty() { parts.push(current.trim().to_string()); current.clear(); } }
                else if !current.is_empty() { current.push(' '); }
                i = j;
            } else { current.push(c); i += 1; }
        }
        if !current.is_empty() { parts.push(current.trim().to_string()); }
        if let Some(a) = try_parse_app(&parts) { apps.push(a); }
    }
    apps
}

pub fn parse_winget_output(output: &str) -> Result<Vec<AppUpdate>, String> {
    let cleaned = clean_winget_output(output);
    let lines: Vec<&str> = cleaned.lines().collect();
    let sep_idx = lines.iter().position(|line| {
        let t = line.trim();
        if t.is_empty() || t.chars().count() < 10 { return false; }
        t.chars().filter(|c| *c == '-').count() > t.chars().count() / 2
    });
    let Some(sep_idx) = sep_idx else { return Ok(Vec::new()); };
    if sep_idx + 1 >= lines.len() { return Ok(Vec::new()); }
    let apps_a = parse_column_position(&lines, sep_idx);
    let apps_b = parse_smart_split(&lines, sep_idx);
    let chosen = if apps_a.len() >= apps_b.len() { apps_a } else { apps_b };
    let mut seen: HashSet<String> = HashSet::new();
    let mut out: Vec<AppUpdate> = Vec::new();
    for app in chosen { if seen.insert(app.id.clone()) { out.push(app); } }
    Ok(out)
}

fn validate_id(id: &str) -> bool {
    if id.is_empty() || id.len() > 256 { return false; }
    id.chars().all(|c| c.is_ascii_alphanumeric() || c == '.' || c == '-' || c == '_' || c == '+')
}

fn winget_command() -> Command {
    let mut cmd = Command::new("winget");
    #[cfg(target_os = "windows")]
    cmd.creation_flags(CREATE_NO_WINDOW);
    cmd
}

fn decode_winget_error(code: i32) -> String {
    let u = code as u32;
    let msg = match u {
        0x8A150019 => "Accord de licence non accepte. Reessaye.",
        0x8A150010 => "Aucun installateur applicable pour ton systeme.",
        0x8A150011 => "Cette app n'est pas dans le catalogue winget.",
        0x8A15002B => "Le package est en cours d'utilisation.",
        0x8A150044 => "Cette mise a jour necessite un redemarrage Windows.",
        0x8A150049 => "Cette mise a jour necessite une interaction. Lance WealthWise en admin.",
        0x8A15004A => "Mise a jour necessite un redemarrage avant de continuer.",
        0x80070005 => "Acces refuse. Lance WealthWise en administrateur.",
        0x8A150037 => "Dependances manquantes pour cette installation.",
        0x8A150052 => "Hash de l'installateur incorrect (probleme de telechargement, reessaye).",
        _ => "",
    };
    if msg.is_empty() {
        format!("Echec winget (code {} / 0x{:08X})", code, u)
    } else {
        format!("{} (code {})", msg, code)
    }
}

fn is_newer_version(a: &str, b: &str) -> bool {
    let parse = |s: &str| -> Vec<u32> {
        s.trim_start_matches('v').split('.')
            .filter_map(|p| p.split('-').next().and_then(|x| x.parse::<u32>().ok()))
            .collect()
    };
    let va = parse(a); let vb = parse(b);
    for i in 0..vb.len().max(va.len()) {
        let x = va.get(i).copied().unwrap_or(0);
        let y = vb.get(i).copied().unwrap_or(0);
        if y > x { return true; }
        if y < x { return false; }
    }
    false
}

// ===========================================================================
//  Commandes Tauri
// ===========================================================================

#[tauri::command]
async fn list_upgradable_apps() -> Result<Vec<AppUpdate>, String> {
    let out = winget_command()
        .args(["upgrade", "--include-unknown", "--accept-source-agreements"])
        .stdout(Stdio::piped()).stderr(Stdio::piped())
        .output().map_err(|e| format!("Spawn winget : {}", e))?;
    let stdout = String::from_utf8_lossy(&out.stdout).to_string();
    parse_winget_output(&stdout)
}

#[tauri::command]
async fn update_app(app: AppHandle, lock: State<'_, UpdateLock>, app_id: String) -> Result<String, String> {
    if !validate_id(&app_id) { return Err(format!("ID rejete : {}", app_id)); }
    let _g = lock.0.lock().map_err(|e| e.to_string())?;
    run_streamed(&app, &["upgrade","--id",&app_id,"--silent","--accept-source-agreements","--accept-package-agreements","--disable-interactivity"])
}

#[tauri::command]
async fn update_all(app: AppHandle, lock: State<'_, UpdateLock>) -> Result<String, String> {
    let _g = lock.0.lock().map_err(|e| e.to_string())?;
    run_streamed(&app, &["upgrade","--all","--silent","--accept-source-agreements","--accept-package-agreements","--disable-interactivity"])
}

#[tauri::command]
async fn check_winget_available() -> Result<bool, String> {
    Ok(matches!(winget_command().arg("--version").output(), Ok(o) if o.status.success()))
}

#[tauri::command]
async fn check_admin_status() -> Result<bool, String> {
    Ok(is_running_as_admin())
}

#[tauri::command]
async fn get_killable_processes(app_id: String) -> Result<Vec<String>, String> {
    let mut all: Vec<String> = get_process_names_for_app(&app_id).iter().map(|s| s.to_string()).collect();
    for s in get_services_for_app(&app_id) { all.push(format!("[svc] {}", s)); }
    Ok(all)
}

#[tauri::command]
async fn kill_process_for_app(app_id: String) -> Result<Vec<String>, String> {
    if !validate_id(&app_id) { return Err(format!("ID rejete : {}", app_id)); }
    let processes = get_process_names_for_app(&app_id);
    let services = get_services_for_app(&app_id);
    if processes.is_empty() && services.is_empty() {
        return Err(format!("App '{}' inconnue. Ferme-la manuellement.", app_id));
    }
    let mut killed: Vec<String> = Vec::new();
    // 1. Stop services FIRST (Bonjour Service, etc.)
    for svc in &services {
        if stop_windows_service(svc).is_ok() { killed.push(format!("svc:{}", svc)); }
    }
    // 2. Kill processes
    for proc_name in &processes {
        if is_system_protected_process(proc_name) { continue; }
        let mut cmd = Command::new("taskkill");
        #[cfg(target_os = "windows")]
        cmd.creation_flags(CREATE_NO_WINDOW);
        if let Ok(out) = cmd.args(["/F", "/IM", proc_name, "/T"]).output() {
            if out.status.success() { killed.push(proc_name.to_string()); }
        }
    }
    if killed.is_empty() {
        return Err("Rien tue (probablement besoin des droits admin)".to_string());
    }
    Ok(killed)
}

#[tauri::command]
async fn force_update_app(app: AppHandle, lock: State<'_, UpdateLock>, app_id: String) -> Result<String, String> {
    if !validate_id(&app_id) { return Err(format!("ID rejete : {}", app_id)); }
    let admin = is_running_as_admin();
    let services = get_services_for_app(&app_id);
    let processes = get_process_names_for_app(&app_id);

    let mut killed_count = 0;
    let mut svc_errors: Vec<String> = Vec::new();

    // 1. Stop services
    for svc in &services {
        match stop_windows_service(svc) {
            Ok(_) => { killed_count += 1; let _ = app.emit("update-progress", format!("Service arrete : {}", svc)); }
            Err(e) => svc_errors.push(format!("{}: {}", svc, e)),
        }
    }

    // 2. Kill processes
    for proc_name in &processes {
        if is_system_protected_process(proc_name) { continue; }
        let mut cmd = Command::new("taskkill");
        #[cfg(target_os = "windows")]
        cmd.creation_flags(CREATE_NO_WINDOW);
        if let Ok(out) = cmd.args(["/F", "/IM", proc_name, "/T"]).output() {
            if out.status.success() {
                killed_count += 1;
                let _ = app.emit("update-progress", format!("Process tue : {}", proc_name));
            }
        }
    }

    // 3. Si on n'a rien tue ET qu'il y avait des services, c'est probablement un probleme d'admin
    if killed_count == 0 && (!services.is_empty() || !processes.is_empty()) {
        if !admin {
            return Err(format!(
                "Impossible de fermer le service. WealthWise doit etre lance en administrateur (clic droit > Executer en admin).\nDetails: {}",
                svc_errors.join("; ")
            ));
        }
    }

    std::thread::sleep(std::time::Duration::from_millis(1200));

    let _g = lock.0.lock().map_err(|e| e.to_string())?;
    let result = run_streamed(&app, &["upgrade","--id",&app_id,"--silent","--accept-source-agreements","--accept-package-agreements","--disable-interactivity"]);
    match result {
        Ok(s) => Ok(format!("{} (apres avoir ferme {} elements)", s, killed_count)),
        Err(e) => {
            // Si echec et pas admin, suggere admin
            if !admin && (e.contains("8A15002B") || e.contains("0x80070005") || e.contains("Acces refuse")) {
                Err(format!("{}\n\nAstuce : lance WealthWise en administrateur pour les services systeme.", e))
            } else { Err(e) }
        }
    }
}

#[tauri::command]
async fn check_self_update() -> Result<SelfUpdateInfo, String> {
    let current = APP_VERSION.to_string();
    if SELF_UPDATE_URL.is_empty() {
        return Ok(SelfUpdateInfo { current, latest: String::new(), available: false, url: String::new(), notes: String::new(), pub_date: String::new(), error: "URL non configuree.".to_string() });
    }
    let response = ureq::get(SELF_UPDATE_URL).timeout(std::time::Duration::from_secs(10)).call();
    let body = match response {
        Ok(r) => r.into_string().unwrap_or_default(),
        Err(e) => return Ok(SelfUpdateInfo { current, latest: String::new(), available: false, url: String::new(), notes: String::new(), pub_date: String::new(), error: format!("Connexion impossible : {}", e) }),
    };
    let json: serde_json::Value = match serde_json::from_str(&body) {
        Ok(v) => v,
        Err(e) => return Ok(SelfUpdateInfo { current, latest: String::new(), available: false, url: String::new(), notes: String::new(), pub_date: String::new(), error: format!("JSON invalide : {}", e) }),
    };
    let latest = json.get("version").and_then(|v| v.as_str()).unwrap_or("").to_string();
    let url = json.get("url").and_then(|v| v.as_str()).unwrap_or("").to_string();
    let notes = json.get("notes").and_then(|v| v.as_str()).unwrap_or("").to_string();
    let pub_date = json.get("pub_date").and_then(|v| v.as_str()).unwrap_or("").to_string();
    let available = !latest.is_empty() && is_newer_version(&current, &latest);
    Ok(SelfUpdateInfo { current, latest, available, url, notes, pub_date, error: String::new() })
}

#[tauri::command]
async fn open_self_update_url(url: String) -> Result<(), String> {
    if !url.starts_with("https://") { return Err("URL invalide".to_string()); }
    let mut cmd = Command::new("cmd");
    #[cfg(target_os = "windows")]
    cmd.creation_flags(CREATE_NO_WINDOW);
    cmd.args(["/C", "start", "", &url]).spawn().map_err(|e| format!("Browser : {}", e))?;
    Ok(())
}

#[tauri::command]
async fn get_winget_debug_info() -> Result<String, String> {
    let v = winget_command().arg("--version").output()
        .map(|o| String::from_utf8_lossy(&o.stdout).trim().to_string())
        .unwrap_or_else(|_| "unknown".into());
    let out = winget_command().args(["upgrade","--include-unknown","--accept-source-agreements"]).output()
        .map_err(|e| format!("Spawn : {}", e))?;
    let stdout = String::from_utf8_lossy(&out.stdout).to_string();
    let stderr = String::from_utf8_lossy(&out.stderr).to_string();
    let real = match parse_winget_output(&stdout) {
        Ok(a) => format!("REEL : {} apps", a.len()),
        Err(e) => format!("REEL : ERR {}", e),
    };
    let st = match parse_winget_output(SELFTEST_SAMPLE) {
        Ok(a) => format!("SELFTEST : {} apps", a.len()),
        Err(e) => format!("SELFTEST : ERR {}", e),
    };
    let admin = if is_running_as_admin() { "OUI" } else { "NON (lance en clic droit > admin pour MAJ services)" };
    let mut s = format!(
        "=== {} ===\n=== APP {} ===\n=== ADMIN : {} ===\n=== {} ===\n=== {} ===\n=== winget {} ===\n=== exit {} ===\n\n=== stdout ===\n{}\n=== stderr ===\n{}",
        BACKEND_VERSION, APP_VERSION, admin, st, real, v, out.status.code().unwrap_or(-1), stdout, stderr
    );
    if s.len() > 16000 { s.truncate(16000); s.push_str("\n[tronque]"); }
    Ok(s)
}

fn run_streamed(app: &AppHandle, args: &[&str]) -> Result<String, String> {
    let mut child = winget_command().args(args).stdout(Stdio::piped()).stderr(Stdio::piped())
        .spawn().map_err(|e| format!("Spawn : {}", e))?;
    let stderr_handle = child.stderr.take();
    let stdout = child.stdout.take().ok_or("stdout".to_string())?;
    let mut n = 0usize;
    for line in BufReader::new(stdout).lines() {
        if let Ok(m) = line {
            let t = m.trim();
            if !t.is_empty() {
                let _ = app.emit("update-progress", t.to_string());
                n += 1;
            }
        }
    }
    let st = child.wait().map_err(|e| e.to_string())?;
    let err = stderr_handle.map(|mut s| {
        use std::io::Read;
        let mut b = String::new();
        let _ = s.read_to_string(&mut b);
        b
    }).unwrap_or_default();
    if st.success() { Ok(format!("OK ({} lignes)", n)) }
    else {
        let code = st.code().unwrap_or(-1);
        let decoded = decode_winget_error(code);
        let extra = err.trim();
        if extra.is_empty() { Err(decoded) } else { Err(format!("{}\n{}", decoded, extra)) }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(UpdateLock(Mutex::new(())))
        .invoke_handler(tauri::generate_handler![
            list_upgradable_apps, update_app, update_all,
            check_winget_available, get_winget_debug_info,
            get_killable_processes, kill_process_for_app, force_update_app,
            check_self_update, open_self_update_url, check_admin_status
        ])
        .run(tauri::generate_context!())
        .expect("error");
}
