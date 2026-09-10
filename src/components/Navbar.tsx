import React from 'react';
import { GfgLogo } from './GfgLogo';
import { ThemeToggle } from './ThemeToggle';
import { ShieldCheck, User, LogOut } from 'lucide-react';
import { StudentRecord } from '../types/contest';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  currentUser: StudentRecord | null;
  isAdmin: boolean;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDark,
  onToggleTheme,
  currentUser,
  isAdmin,
  onLogout
}) => {
  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-zinc-950/90 border-b border-zinc-200 dark:border-zinc-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo and Contest Title */}
        <div className="flex items-center gap-3">
          <GfgLogo size="md" />
          <div className="h-6 w-[1px] bg-zinc-300 dark:bg-zinc-700 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2">
            <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-emerald-600 to-green-700 dark:from-emerald-400 dark:to-green-500 bg-clip-text text-transparent uppercase">
              Code Colosseum
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
              DSA Contest
            </span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Badge / Role Indicator */}
          {currentUser && (
            <div
              id="user-badge"
              className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-200"
            >
              {isAdmin ? (
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin Mode</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 font-medium">
                  <User className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                  <span className="max-w-[120px] truncate font-semibold">
                    {currentUser.fullName}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Theme Toggle Button */}
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />

          {/* Logout Button */}
          {currentUser && (
            <button
              id="logout-btn"
              onClick={onLogout}
              type="button"
              className="p-2 rounded-xl text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-zinc-200 dark:border-zinc-800 transition-colors cursor-pointer"
              title="Logout / Change Account"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
