export default function LoadingState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 animate-fade-in">
      <div className="relative w-16 h-16 mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-zinc-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
      </div>
      <h2 className="text-base font-medium text-ink-primary mb-1">
        Analyse en cours...
      </h2>
      <p className="text-sm text-ink-secondary">
        Recherche des mises à jour disponibles via winget
      </p>
    </div>
  );
}
