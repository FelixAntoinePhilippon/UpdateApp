import { useState } from "react";
import { getWingetDebugInfo } from "../lib/winget";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  const [debugOpen, setDebugOpen] = useState(false);
  const [debugLoading, setDebugLoading] = useState(false);
  const [debugData, setDebugData] = useState<string | null>(null);

  const isWingetMissing =
    message.toLowerCase().includes("winget") &&
    (message.toLowerCase().includes("introuvable") ||
      message.toLowerCase().includes("not found"));

  const isParserError =
    message.toLowerCase().includes("format winget") ||
    message.toLowerCase().includes("colonnes");

  const loadDebug = async () => {
    setDebugLoading(true);
    try {
      const info = await getWingetDebugInfo();
      setDebugData(info);
      setDebugOpen(true);
    } catch (e) {
      setDebugData(
        "Impossible de récupérer les logs : " +
          (typeof e === "string" ? e : JSON.stringify(e))
      );
      setDebugOpen(true);
    } finally {
      setDebugLoading(false);
    }
  };

  const copyDebug = async () => {
    if (!debugData) return;
    try {
      await navigator.clipboard.writeText(debugData);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-red-400">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <h2 className="text-lg font-semibold text-ink-primary mb-2">
        {isWingetMissing
          ? "winget non détecté"
          : isParserError
          ? "Sortie winget non reconnue"
          : "Une erreur est survenue"}
      </h2>

      <pre className="text-sm text-ink-secondary text-center max-w-2xl mb-6 font-mono whitespace-pre-wrap break-words bg-bg-secondary/40 px-4 py-3 rounded-lg border border-zinc-800">
        {message}
      </pre>

      {isWingetMissing && (
        <p className="text-xs text-ink-secondary text-center max-w-md mb-6">
          winget est inclus avec Windows 10 (1809+) et Windows 11. Sur les
          versions plus anciennes, installe « App Installer » via le Microsoft Store.
        </p>
      )}

      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
        >
          Réessayer
        </button>
        <button
          onClick={loadDebug}
          disabled={debugLoading}
          className="px-4 py-2 rounded-md bg-bg-tertiary hover:bg-zinc-700 text-ink-primary text-sm font-medium transition-colors disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
        >
          {debugLoading ? "Chargement..." : debugOpen ? "Recharger les logs" : "Voir les logs winget"}
        </button>
      </div>

      {debugOpen && debugData && (
        <div className="w-full max-w-3xl mt-4 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-ink-secondary font-medium uppercase tracking-wide">
              Sortie brute de winget
            </p>
            <button
              onClick={copyDebug}
              className="text-xs text-accent hover:text-accent-hover px-2 py-1 rounded hover:bg-accent/10"
            >
              Copier
            </button>
          </div>
          <pre className="max-h-80 overflow-auto text-xs font-mono bg-bg-primary border border-zinc-800 rounded-lg p-4 text-ink-secondary whitespace-pre-wrap break-words">
            {debugData}
          </pre>
          <p className="text-xs text-ink-secondary/70 mt-2 italic">
            Copie ce texte et envoie-le pour qu&apos;on adapte le parser à ton format winget.
          </p>
        </div>
      )}
    </div>
  );
}
