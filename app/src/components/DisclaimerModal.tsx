import { useState } from "react";

interface DisclaimerModalProps {
  onAccept: () => void;
}

export default function DisclaimerModal({ onAccept }: DisclaimerModalProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="max-w-lg w-[92%] mx-auto bg-bg-secondary border border-zinc-800 rounded-2xl shadow-2xl shadow-black/50 p-7 animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-amber-400">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-ink-primary">
            Avant de continuer
          </h2>
        </div>

        <p className="text-sm text-ink-secondary mb-4 leading-relaxed">
          WealthWise Updater utilise <strong className="text-ink-primary">winget</strong>{" "}
          (l'outil officiel Microsoft) pour mettre à jour tes applications.
          C'est sûr, mais quelques précautions s'imposent :
        </p>

        <ul className="space-y-2.5 mb-5 text-sm">
          <li className="flex gap-3">
            <span className="text-accent flex-shrink-0 mt-0.5">•</span>
            <span className="text-ink-secondary">
              <strong className="text-ink-primary">Sauvegarde tes données</strong>{" "}
              avant une mise à jour groupée. Une nouvelle version peut casser ta config.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent flex-shrink-0 mt-0.5">•</span>
            <span className="text-ink-secondary">
              <strong className="text-ink-primary">Ferme les apps concernées</strong>{" "}
              pour éviter les conflits pendant l'installation.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent flex-shrink-0 mt-0.5">•</span>
            <span className="text-ink-secondary">
              <strong className="text-ink-primary">Windows peut demander</strong>{" "}
              les droits administrateur (UAC) pour certaines mises à jour.
            </span>
          </li>
        </ul>

        <p className="text-xs text-ink-secondary/80 mb-5 italic">
          WealthWise Updater est fourni « tel quel » sans garantie. Tu restes
          responsable de la compatibilité de tes applications.
        </p>

        <label className="flex items-start gap-3 mb-5 cursor-pointer select-none group">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="sr-only peer"
          />
          <span
            className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
              accepted
                ? "bg-accent border-accent"
                : "border-zinc-600 group-hover:border-zinc-400"
            }`}
          >
            {accepted && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-white">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </span>
          <span className="text-sm text-ink-primary">
            J'ai lu et je comprends ces précautions
          </span>
        </label>

        <button
          onClick={onAccept}
          disabled={!accepted}
          className="w-full px-4 py-2.5 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-accent active:scale-[0.98]"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
