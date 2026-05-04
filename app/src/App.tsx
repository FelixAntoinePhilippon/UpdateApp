import { useCallback, useEffect, useRef, useState } from "react";
import type { UnlistenFn } from "@tauri-apps/api/event";
import type { AppUpdate } from "./types";
import {
  checkWingetAvailable,
  forceUpdateApp,
  getKillableProcesses,
  listUpgradableApps,
  onUpdateProgress,
  updateAll,
  updateApp,
} from "./lib/winget";

import Header from "./components/Header";
import SummaryBar from "./components/SummaryBar";
import AppRow from "./components/AppRow";
import EmptyState from "./components/EmptyState";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import DisclaimerModal from "./components/DisclaimerModal";
import UpdateProgress from "./components/UpdateProgress";
import DebugLogsModal from "./components/DebugLogsModal";
import SelfUpdateModal from "./components/SelfUpdateModal";

type Status = "idle" | "loading" | "ready" | "error";

const DISCLAIMER_KEY = "wwu.disclaimer.accepted.v1";

// Fallback frontend si le backend ne retourne pas la liste de process
const FALLBACK_PROCESSES: Record<string, string[]> = {
  "apple.bonjour": ["mDNSResponder.exe", "mDNSResponderHelper.exe"],
  "microsoft.edge": ["msedge.exe"],
  "discord.discord": ["Discord.exe"],
  "spotify.spotify": ["Spotify.exe"],
  "microsoft.visualstudiocode": ["Code.exe"],
  "anysphere.cursor": ["Cursor.exe"],
  "microsoft.teams": ["ms-teams.exe", "Teams.exe"],
  "microsoft.onedrive": ["OneDrive.exe"],
  "google.chrome": ["chrome.exe"],
  "mozilla.firefox": ["firefox.exe"],
  "valve.steam": ["steam.exe"],
  "elgato.streamdeck": ["StreamDeck.exe"],
  "logitech.ghub": ["lghub.exe"],
  "bytedance.capcut": ["CapCut.exe"],
  "epicgames.epicgameslauncher": ["EpicGamesLauncher.exe"],
  "ubisoft.connect": ["upc.exe", "UbisoftConnect.exe"],
  "electronicarts.eadesktop": ["EADesktop.exe"],
  "anydesk.anydesk": ["AnyDesk.exe"],
  "elgato.4kcaptureutility": ["4KCaptureUtility.exe"],
};

export default function App() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [apps, setApps] = useState<AppUpdate[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isUpdating, setIsUpdating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [showDisclaimer, setShowDisclaimer] = useState<boolean>(() => {
    try {
      return localStorage.getItem(DISCLAIMER_KEY) !== "true";
    } catch {
      return true;
    }
  });
  const [toast, setToast] = useState<{
    kind: "success" | "error";
    msg: string;
    appId?: string;
    canForce?: boolean;
    processes?: string[];
  } | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [showSelfUpdate, setShowSelfUpdate] = useState(false);

  const unlistenRef = useRef<UnlistenFn | null>(null);

  const loadApps = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const wingetOk = await checkWingetAvailable();
      if (!wingetOk) {
        setErrorMessage("winget introuvable. Installe Application Installer via le Microsoft Store.");
        setStatus("error");
        return;
      }
      const list = await listUpgradableApps();
      setApps(list);
      setStatus("ready");
    } catch (e) {
      setErrorMessage(typeof e === "string" ? e : JSON.stringify(e));
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (!showDisclaimer) loadApps();
  }, [showDisclaimer, loadApps]);

  useEffect(() => {
    let isActive = true;
    onUpdateProgress((message) => {
      if (!isActive) return;
      setLogs((prev) => [...prev, message]);
    }).then((unlisten) => {
      unlistenRef.current = unlisten;
    });
    return () => {
      isActive = false;
      if (unlistenRef.current) unlistenRef.current();
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    if (toast.kind === "error" && toast.canForce) return;
    const t = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleAcceptDisclaimer = () => {
    try { localStorage.setItem(DISCLAIMER_KEY, "true"); } catch { /* ignore */ }
    setShowDisclaimer(false);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleUpdateOne = async (id: string) => {
    if (isUpdating) return;
    setIsUpdating(true);
    setLogs([`Demarrage de la mise a jour : ${id}`]);
    try {
      await updateApp(id);
      setToast({ kind: "success", msg: `${id} mis a jour avec succes` });
      setApps((prev) => prev.filter((a) => a.id !== id));
      setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
    } catch (e) {
      const errMsg = typeof e === "string" ? e : "erreur inconnue";
      const isInUse =
        errMsg.includes("cours d'utilisation") ||
        errMsg.includes("8A15002B") ||
        errMsg.includes("-1978335189");
      let processes: string[] = [];
      if (isInUse) {
        try { processes = await getKillableProcesses(id); } catch { /* ignore */ }
        if (processes.length === 0) processes = FALLBACK_PROCESSES[id.toLowerCase()] || [];
      }
      setToast({
        kind: "error",
        msg: `Echec : ${errMsg}`,
        appId: id,
        canForce: isInUse,
        processes,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleForceUpdate = async () => {
    if (!toast || !toast.appId || isUpdating) return;
    const id = toast.appId;
    const procList = (toast.processes || []).join(", ") || "process associe";
    setIsUpdating(true);
    setLogs([`Fermeture de ${procList} puis MAJ de ${id}...`]);
    setToast(null);
    try {
      const result = await forceUpdateApp(id);
      setToast({ kind: "success", msg: `${id} mis a jour (${result})` });
      setApps((prev) => prev.filter((a) => a.id !== id));
      setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
    } catch (e) {
      const errMsg = typeof e === "string" ? e : "erreur";
      const isOldBinary = errMsg.includes("not allowed") || errMsg.includes("force_update_app") || errMsg.includes("invoke");
      setToast({
        kind: "error",
        msg: isOldBinary
          ? "Cette fonction n est pas dans ton .exe actuel. Recompile avec scripts/make-exe.bat pour avoir la V0.2."
          : `Echec apres fermeture : ${errMsg}`,
        appId: isOldBinary ? undefined : id,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateSelected = async () => {
    if (isUpdating || selected.size === 0) return;
    setIsUpdating(true);
    const ids = Array.from(selected);
    setLogs([`Demarrage de ${ids.length} mises a jour...`]);
    let s = 0, f = 0;
    for (const id of ids) {
      try { await updateApp(id); s++; } catch { f++; }
    }
    setToast({
      kind: f === 0 ? "success" : "error",
      msg: `${s} mise(s) a jour reussie(s)${f ? `, ${f} echec(s)` : ""}`,
    });
    setSelected(new Set());
    setIsUpdating(false);
    await loadApps();
  };

  const handleUpdateAll = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    setLogs(["Mise a jour de toutes les apps..."]);
    try {
      await updateAll();
      setToast({ kind: "success", msg: "Toutes les MAJ ont ete tentees" });
    } catch (e) {
      setToast({ kind: "error", msg: `Erreur : ${typeof e === "string" ? e : "voir les logs"}` });
    } finally {
      setIsUpdating(false);
      await loadApps();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-bg-primary">
      <Header
        onRefresh={loadApps}
        onShowLogs={() => setShowDebug(true)}
        onCheckSelfUpdate={() => setShowSelfUpdate(true)}
        isLoading={status === "loading"}
      />

      {status === "ready" && apps.length > 0 && (
        <SummaryBar
          totalApps={apps.length}
          selectedCount={selected.size}
          onUpdateSelected={handleUpdateSelected}
          onUpdateAll={handleUpdateAll}
          isUpdating={isUpdating}
        />
      )}

      <main className="flex-1 overflow-y-auto">
        {status === "loading" && <LoadingState />}
        {status === "error" && <ErrorState message={errorMessage} onRetry={loadApps} />}
        {status === "ready" && apps.length === 0 && (
          <EmptyState onRefresh={loadApps} onShowLogs={() => setShowDebug(true)} />
        )}
        {status === "ready" && apps.length > 0 && (
          <div className="animate-fade-in">
            {apps.map((app) => (
              <AppRow
                key={app.id}
                app={app}
                selected={selected.has(app.id)}
                isUpdating={isUpdating}
                onToggleSelect={toggleSelect}
                onUpdate={handleUpdateOne}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="px-8 py-2 bg-bg-secondary border-t border-zinc-800 text-xs text-ink-secondary flex items-center justify-between select-none">
        <span>
          {status === "ready"
            ? `${apps.length} app${apps.length > 1 ? "s" : ""} en attente`
            : "WealthWise Updater v0.2.1"}
        </span>
        <span className="font-mono">propulse par winget - Windows uniquement</span>
      </footer>

      {showDisclaimer && <DisclaimerModal onAccept={handleAcceptDisclaimer} />}
      <DebugLogsModal open={showDebug} onClose={() => setShowDebug(false)} />
      <SelfUpdateModal open={showSelfUpdate} onClose={() => setShowSelfUpdate(false)} />
      {isUpdating && <UpdateProgress logs={logs} />}

      {toast && (
        <div
          className={`fixed bottom-12 right-6 max-w-md rounded-lg shadow-2xl animate-slide-up overflow-hidden ${
            toast.kind === "success" ? "bg-emerald-600/95 text-white" : "bg-red-600/95 text-white"
          }`}
        >
          <div className="px-4 py-3 text-sm font-medium">{toast.msg}</div>
          {toast.canForce && toast.appId && (
            <div className="px-4 pb-3 pt-1 border-t border-white/20 bg-black/15">
              <p className="text-xs mb-2">
                {(toast.processes || []).length > 0 ? (
                  <>Fermer <span className="font-mono">{(toast.processes || []).join(", ")}</span> et reessayer ?</>
                ) : (
                  <>Tenter de fermer l app et reessayer ?</>
                )}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setToast(null)}
                  className="px-2 py-1 rounded text-xs hover:bg-white/10 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleForceUpdate}
                  disabled={isUpdating}
                  className="flex-1 px-3 py-1.5 rounded bg-white text-red-700 text-xs font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  Fermer et reessayer
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
