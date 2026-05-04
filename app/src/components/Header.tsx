interface HeaderProps {
  onRefresh: () => void;
  onShowLogs: () => void;
  onCheckSelfUpdate: () => void;
  isLoading: boolean;
}

export default function Header({ onRefresh, onShowLogs, onCheckSelfUpdate, isLoading }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-bg-secondary border-b border-zinc-800 select-none">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center shadow-lg shadow-accent/20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
        </div>
        <div>
          <h1 className="text-base font-semibold text-ink-primary leading-none">
            WealthWise Updater
          </h1>
          <p className="text-xs text-ink-secondary mt-1">
            Gestionnaire de mises à jour Windows
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onCheckSelfUpdate}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-bg-tertiary hover:bg-zinc-700 text-ink-secondary hover:text-ink-primary text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
          aria-label="Vérifier les mises à jour de WealthWise"
          title="Vérifier si une nouvelle version de WealthWise est disponible"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M12 2v4" />
            <path d="m16.24 7.76 2.83-2.83" />
            <path d="M18 12h4" />
            <path d="m16.24 16.24 2.83 2.83" />
            <path d="M12 18v4" />
            <path d="m4.93 19.07 2.83-2.83" />
            <path d="M2 12h4" />
            <path d="m4.93 4.93 2.83 2.83" />
          </svg>
          MAJ app
        </button>

        <button
          onClick={onShowLogs}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-bg-tertiary hover:bg-zinc-700 text-ink-secondary hover:text-ink-primary text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
          aria-label="Voir les logs winget bruts"
          title="Voir la sortie brute de winget (debug)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
          Logs
        </button>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-bg-tertiary hover:bg-zinc-700 text-ink-primary text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
          aria-label="Actualiser la liste des mises à jour"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          Actualiser
        </button>
      </div>
    </header>
  );
}
