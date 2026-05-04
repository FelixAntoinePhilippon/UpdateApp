import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import type { AppUpdate, SelfUpdateInfo } from "../types";

/**
 * Récupère la liste des applications avec mises à jour disponibles
 * via la commande winget upgrade.
 */
export async function listUpgradableApps(): Promise<AppUpdate[]> {
  return await invoke<AppUpdate[]>("list_upgradable_apps");
}

/**
 * Met à jour une application spécifique par son ID winget.
 * L'ID est validé côté Rust (regex strict, anti-injection).
 */
export async function updateApp(appId: string): Promise<string> {
  return await invoke<string>("update_app", { appId });
}

/**
 * Met à jour toutes les applications disponibles d'un coup.
 */
export async function updateAll(): Promise<string> {
  return await invoke<string>("update_all");
}

/**
 * S'abonne aux logs de progression émis par le backend Rust pendant
 * une mise à jour. Retourne une fonction de désabonnement.
 */
export async function onUpdateProgress(
  callback: (message: string) => void
): Promise<UnlistenFn> {
  return await listen<string>("update-progress", (event) => {
    callback(event.payload);
  });
}

/**
 * Vérifie que winget est disponible sur le système.
 * Utilisé pour afficher un message clair si winget manque.
 */
export async function checkWingetAvailable(): Promise<boolean> {
  try {
    return await invoke<boolean>("check_winget_available");
  } catch {
    return false;
  }
}

/**
 * Récupère la sortie BRUTE de `winget upgrade` pour debug.
 * Utile quand le parser échoue : permet à l'utilisateur de copier-coller
 * la sortie réelle pour comprendre ce qui ne va pas.
 */
export async function getWingetDebugInfo(): Promise<string> {
  return await invoke<string>("get_winget_debug_info");
}

/**
 * V0.2 : Retourne la liste des process names connus pour cette app.
 * Vide = inconnu, l'utilisateur doit fermer manuellement.
 */
export async function getKillableProcesses(appId: string): Promise<string[]> {
  return await invoke<string[]>("get_killable_processes", { appId });
}

/**
 * V0.2 : Tue les process associés à une app (sans relancer la MAJ).
 */
export async function killProcessForApp(appId: string): Promise<string[]> {
  return await invoke<string[]>("kill_process_for_app", { appId });
}

/**
 * V0.2 : Tue les process puis relance la MAJ ("Fermer et réessayer").
 */
export async function forceUpdateApp(appId: string): Promise<string> {
  return await invoke<string>("force_update_app", { appId });
}

/**
 * V0.2.1 : Vérifie si une nouvelle version de WealthWise Updater est dispo.
 */
export async function checkSelfUpdate(): Promise<SelfUpdateInfo> {
  return await invoke<SelfUpdateInfo>("check_self_update");
}

/**
 * V0.2.1 : Ouvre l'URL de téléchargement de la nouvelle version dans le navigateur.
 */
export async function openSelfUpdateUrl(url: string): Promise<void> {
  return await invoke<void>("open_self_update_url", { url });
}

