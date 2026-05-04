import { useEffect, useState } from "react";
import { checkSelfUpdate, openSelfUpdateUrl } from "../lib/winget";
import type { SelfUpdateInfo } from "../types";

interface SelfUpdateModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SelfUpdateModal({ open, onClose }: SelfUpdateModalProps) {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<SelfUpdateInfo | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setInfo(null);
    checkSelfUpdate()
      .then((i) => setInfo(i))
      .catch((e) =>
        setInfo({
          current: "?",
          latest: "",
          available: false,
          url: "",
          notes: "",
          pub_date: "",
          error: typeof e === "string" ? e : JSON.stringify(e),
        })
      )
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleDownload = async () => {
    if (!info?.url) return;
    try {
      await openSelfUpdateUrl(info.url);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-bg-secondary border border-zinc-800 rounded-2xl shadow-2xl shadow-black/50 animate-slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-accent">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 16h5v5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-primary">
                Mises à jour WealthWise
              </p>
              <p className="text-xs text-ink-secondary">
                Vérification de la dernière version
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

        {/* Body */}
        <div className="px-6 py-5">
          {loading && (
            <div className="flex items-center gap-3 text-ink-secondary text-sm py-4 justify-center">
              <div className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
              Connexion au serveur de mises à jour…
            </div>
          )}

          {info && !loading && (
            <>
              <div className="flex items-center justify-between text-sm mb-3 pb-3 border-b border-zinc-800">
                <span className="text-ink-secondary">Version actuelle</span>
                <span className="font-mono text-ink-primary">{info.current}</span>
              </div>

              {info.error && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-sm text-amber-200">
                  <p className="font-medium mb-1">Vérification impossible</p>
                  <p className="text-xs text-amber-200/80 font-mono break-words">
                    {info.error}
                  </p>
                  <p className="text-xs text-amber-200/70 mt-2 italic">
                    Il faut publier un fichier <code>latest.json</code> sur GitHub pour activer cette fonction.
                    Voir les instructions dans le README.
                  </p>
                </div>
              )}

              {!info.error && info.available && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <p className="text-sm font-semibold text-emerald-300">
                      Nouvelle version disponible : v{info.latest}
                    </p>
                  </div>
                  {info.pub_date && (
                    <p className="text-xs text-ink-secondary mb-2">
                      Publiée le {info.pub_date}
                    </p>
                  )}
                  {info.notes && (
                    <p className="text-xs text-ink-secondary mb-3 whitespace-pre-wrap">
                      {info.notes}
                    </p>
                  )}
                  <button
                    onClick={handleDownload}
                    className="w-full px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
                  >
                    Télécharger la mise à jour
                  </button>
                </div>
              )}

              {!info.error && !info.available && info.latest && (
                <div className="bg-bg-tertiary rounded-lg p-4 text-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-emerald-400 mx-auto mb-2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <p className="text-sm font-medium text-ink-primary">
                    Tu as la dernière version !
                  </p>
                  <p className="text-xs text-ink-secondary mt-1">
                    v{info.latest} est la version la plus récente.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
