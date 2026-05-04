interface EmptyStateProps {
  onRefresh: () => void;
  onShowLogs: () => void;
}

export default function EmptyState({ onRefresh, onShowLogs }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-emerald-400">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-ink-primary mb-2">
        Tout est à jour !
      </h2>
      <p className="text-sm text-ink-secondary text-center max-w-md mb-2">
        Aucune mise à jour détectée par winget pour le moment.
      </p>
      <p className="text-xs text-ink-secondary/70 text-center max-w-md mb-6 italic">
        Note : winget ne suit pas toutes tes apps (jeux Steam, Adobe, NVIDIA,
        apps Microsoft Store, etc.). Clique « Voir les logs » si tu veux vérifier.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          className="px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
        >
          Vérifier à nouveau
        </button>
        <button
          onClick={onShowLogs}
          className="px-4 py-2 rounded-md bg-bg-tertiary hover:bg-zinc-700 text-ink-primary text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
        >
          Voir les logs winget
        </button>
      </div>
    </div>
  );
}
