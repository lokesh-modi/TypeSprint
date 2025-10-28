import { Settings2, Zap } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  bestWPM: number;
}

export const Header = ({ onOpenSettings, bestWPM }: HeaderProps) => {
  return (
    <header className="w-full max-w-5xl mx-auto px-6 py-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Zap className="w-8 h-8 text-accent" strokeWidth={2} />
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          TypeSprint
        </h1>
      </div>

      <div className="flex items-center gap-6">
        {bestWPM > 0 && (
          <div className="text-sm text-secondary">
            Best: <span className="font-semibold text-accent">{bestWPM}</span> WPM
          </div>
        )}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg hover:bg-surface transition-colors"
          aria-label="Open settings"
        >
          <Settings2 className="w-5 h-5 text-secondary" />
        </button>
      </div>
    </header>
  );
};
