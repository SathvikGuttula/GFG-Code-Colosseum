import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  isDark,
  onToggle,
  className = ''
}) => {
  return (
    <button
      id="theme-toggle-btn"
      onClick={onToggle}
      type="button"
      className={`relative inline-flex items-center justify-center p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-emerald-50 dark:hover:bg-zinc-800/80 hover:text-[#2F8D46] dark:hover:text-[#4ade80] border border-zinc-200 dark:border-zinc-800 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2F8D46]/40 ${className}`}
      aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    >
      {isDark ? (
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <Sun className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Light</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <Moon className="w-4 h-4 text-zinc-700" />
          <span className="hidden sm:inline">Dark</span>
        </div>
      )}
    </button>
  );
};
