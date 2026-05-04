import { useEffect, useState } from "react";
import { getWingetDebugInfo } from "../lib/winget";

interface DebugLogsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DebugLogsModal({ open, onClose }: DebugLogsModalProps) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    setData(null);
    getWingetDebugInfo()
      .then((info) => setData(info))
      .catch((e) =>
        setError(typeof e === "string" ? e : JSON.stringify(e))
      )
      .finally(() => setLoading(false));
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleCopy = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  if (!open) return null;

  // Compte rapide d'apps detectees pour donner un indice
  const lineCount = data ? data.split("\n").length : 0;
  const dashLine = data
    ? data.split("\n").find((l) => l.trim().match(/^[-]{10,}$/))
    : null;
  const wingetVersion = data
    ? (data.match(/=== winget --version ===\s*\n([^\n]+)/) || [])[1] || "?"
    : "?";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-bg-secondary border border-zinc-800 rounded-2xl shadow-2xl shadow-black/50 animate-slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-accent">
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-primary">
                Logs winget bruts
              </p>
              <p className="text-xs text-ink-secondary">
                Sortie réelle utilisée par WealthWise Updater
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-ink-secondary hover:text-ink-primary p-1 rounded hover:bg-bg-tertiary"
            aria-label="Fermer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Quick stats */}
        {data && (
          <div className="grid grid-cols-3 gap-px bg-zinc-800 border-b border-zinc-800">
            <div className="px-4 py-3 bg-bg-secondary">
              <p className="text-xs text-ink-secondary uppercase tracking-wide">winget</p>
              <p className="text-sm text-ink-primary font-mono mt-0.5 truncate">
                {wingetVersion}
              </p>
            </div>
            <div className="px-4 py-3 bg-bg-secondary">
              <p className="text-xs text-ink-secondary uppercase tracking-wide">Lignes</p>
              <p className="text-sm text-ink-primary font-mono mt-0.5">
                {lineCount}
              </p>
            </div>
            <div className="px-4 py-3 bg-bg-secondary">
              <p className="text-xs text-ink-secondary uppercase tracking-wide">Sep `---`</p>
              <p className={`text-sm font-mono mt-0.5 ${dashLine ? "text-emerald-400" : "text-amber-400"}`}>
                {dashLine ? "détectée" : "absente"}
              </p>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-auto px-6 py-4 bg-bg-primary/40">
          {loading && (
            <div className="flex items-center gap-3 text-ink-secondary text-sm py-8 justify-center">
              <div className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
              Récupération de la sortie winget en cours…
            </div>
          )}
          {error && (
            <p className="text-sm text-red-400 font-mono whitespace-pre-wrap">
              Erreur : {error}
            </p>
          )}
          {data && (
            <pre className="text-xs font-mono text-ink-secondary whitespace-pre-wrap break-words leading-relaxed">
              {data}
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-800 bg-bg-secondary">
          <p className="text-xs text-ink-secondary italic">
            Tu peux copier ce texte et me l&apos;envoyer pour adapter le parser.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={!data || loading}
              className="px-3 py-1.5 rounded-md bg-bg-tertiary hover:bg-zinc-700 text-ink-primary text-xs font-medium transition-colors disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
            >
              {copied ? "✓ Copié" : "Copier"}
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-md bg-accent hover:bg-accent-hover text-white text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
