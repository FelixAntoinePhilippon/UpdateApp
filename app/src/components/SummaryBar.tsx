interface SummaryBarProps {
  totalApps: number;
  selectedCount: number;
  onUpdateSelected: () => void;
  onUpdateAll: () => void;
  isUpdating: boolean;
}

export default function SummaryBar({
  totalApps,
  selectedCount,
  onUpdateSelected,
  onUpdateAll,
  isUpdating,
}: SummaryBarProps) {
  if (totalApps === 0) return null;

  return (
    <div className="flex items-center justify-between px-8 py-3 bg-bg-secondary/60 border-b border-zinc-800/60 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/15 text-accent text-sm font-semibold">
          {totalApps}
        </span>
        <p className="text-sm text-ink-primary font-medium">
          {totalApps === 1 ? "mise à jour disponible" : "mises à jour disponibles"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {selectedCount > 0 && (
          <button
            onClick={onUpdateSelected}
            disabled={isUpdating}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-accent active:scale-95 shadow-lg shadow-accent/20"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Mettre à jour ({selectedCount})
          </button>
        )}

        <button
          onClick={onUpdateAll}
          disabled={isUpdating}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-95 shadow-lg shadow-emerald-600/20"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <polyline points="13 17 18 12 13 7" />
            <polyline points="6 17 11 12 6 7" />
          </svg>
          Tout mettre à jour
        </button>
      </div>
    </div>
  );
}
