import { useEffect, useRef } from "react";

interface UpdateProgressProps {
  logs: string[];
  onCancel?: () => void;
}

export default function UpdateProgress({ logs, onCancel }: UpdateProgressProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Estimer une « pseudo-progression » à partir des mots-clés winget
  const lastLog = logs[logs.length - 1] || "Démarrage…";
  const isDownloading = /download|téléch/i.test(lastLog);
  const isInstalling = /install/i.test(lastLog);
  const isVerifying = /verif|hash/i.test(lastLog);

  let stage = "Préparation";
  if (isDownloading) stage = "Téléchargement";
  else if (isVerifying) stage = "Vérification";
  else if (isInstalling) stage = "Installation";

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="w-full max-w-2xl bg-bg-secondary border border-zinc-800 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-accent animate-pulse-slow"></div>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-primary">
                Mise à jour en cours
              </p>
              <p className="text-xs text-ink-secondary">{stage}…</p>
            </div>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-xs text-ink-secondary hover:text-red-400 transition-colors px-3 py-1 rounded hover:bg-red-500/10"
            >
              Annuler
            </button>
          )}
        </div>

        {/* Indeterminate progress bar */}
        <div className="h-1 bg-zinc-800 overflow-hidden">
          <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent animate-slide-bar"></div>
        </div>

        {/* Logs */}
        <div
          ref={scrollRef}
          className="max-h-64 overflow-y-auto px-6 py-4 font-mono text-xs text-ink-secondary bg-bg-primary/40 space-y-1"
        >
          {logs.length === 0 && (
            <p className="text-ink-secondary italic">En attente de winget…</p>
          )}
          {logs.map((line, i) => (
            <p key={i} className="break-all leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
