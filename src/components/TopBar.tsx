import React from 'react';
import { SearchIcon, MenuIcon, BellIcon } from '../icons';
import { getAvatarColor, getInitials } from '../data';

interface TopBarProps {
  onSearchOpen: () => void;
  onMenuOpen: () => void;
}

export default function TopBar({ onSearchOpen, onMenuOpen }: TopBarProps) {
  return (
    <header className="flex items-center gap-3 px-5 py-3 bg-card border-b border-border flex-shrink-0 h-14">
      {/* Mobile menu */}
      <button
        onClick={onMenuOpen}
        className="lg:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <MenuIcon size={18} />
      </button>

      {/* Search button */}
      <button
        onClick={onSearchOpen}
        className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-muted rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors text-left max-w-md"
      >
        <SearchIcon size={14} />
        <span className="flex-1">Search bookmarks...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 text-xs text-muted-foreground bg-background border border-border rounded px-1.5 py-0.5 font-mono">
          <span>⌘</span><span>K</span>
        </kbd>
      </button>

      <div className="flex items-center gap-1 ml-auto">
        <button
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Notifications"
        >
          <BellIcon size={16} />
        </button>

        <button
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-white font-semibold flex-shrink-0 ml-1"
          style={{ backgroundColor: getAvatarColor('alexchen') }}
          title="Your profile"
        >
          {getInitials('Alex Chen')}
        </button>
      </div>
    </header>
  );
}
