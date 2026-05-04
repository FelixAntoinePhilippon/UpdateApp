import type { AppUpdate } from "../types";

interface AppRowProps {
  app: AppUpdate;
  selected: boolean;
  isUpdating: boolean;
  onToggleSelect: (id: string) => void;
  onUpdate: (id: string) => void;
}

function getInitial(name: string): string {
  return (name.trim().charAt(0) || "?").toUpperCase();
}

function getColorFromString(s: string): string {
  // Pseudo-random pleasant hue from string hash
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) | 0;
  const palette = [
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-pink-500 to-rose-600",
    "from-violet-500 to-purple-600",
    "from-cyan-500 to-sky-600",
  ];
  return palette[Math.abs(hash) % palette.length];
}

export default function AppRow({
  app,
  selected,
  isUpdating,
  onToggleSelect,
  onUpdate,
}: AppRowProps) {
  const colorClass = getColorFromString(app.id);

  return (
    <div
      className={`group flex items-center gap-4 px-8 py-3 border-b border-zinc-800/40 transition-colors ${
        selected ? "bg-accent/5 hover:bg-accent/10" : "hover:bg-bg-secondary/60"
      }`}
    >
      {/* Checkbox */}
      <label className="flex items-center cursor-pointer select-none">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(app.id)}
          disabled={isUpdating}
          className="sr-only peer"
        />
        <span
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            selected
              ? "bg-accent border-accent"
              : "border-zinc-600 group-hover:border-zinc-400"
          } peer-disabled:opacity-50`}
        >
          {selected && (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-white">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
      </label>

      {/* Icon (color initial) */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-semibold text-base shadow-md`}
        aria-hidden="true"
      >
        {getInitial(app.name)}
      </div>

      {/* Name + ID */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink-primary truncate">
          {app.name}
        </p>
        <p className="text-xs text-ink-secondary truncate font-mono">
          {app.id}
        </p>
      </div>

      {/* Versions */}
      <div className="flex items-center gap-2 text-xs flex-shrink-0">
        <span className="text-ink-secondary font-mono">{app.version}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-ink-secondary">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
        <span className="text-emerald-400 font-mono font-medium">{app.available}</span>
      </div>

      {/* Source badge */}
      <span className="text-xs px-2 py-0.5 rounded bg-zinc-800/80 text-ink-secondary flex-shrink-0 hidden md:inline">
        {app.source || "winget"}
      </span>

      {/* Update button */}
      <button
        onClick={() => onUpdate(app.id)}
        disabled={isUpdating}
        className="flex-shrink-0 px-3 py-1.5 rounded-md bg-bg-tertiary hover:bg-accent text-ink-primary hover:text-white text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
        aria-label={`Mettre à jour ${app.name}`}
      >
        Mettre à jour
      </button>
    </div>
  );
}
