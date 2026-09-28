import { useState } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import {
  GridIcon,
  InboxIcon,
  SearchIcon,
  StarIcon,
  MoreHorizontalIcon,
} from "../icons";
import { pageToPath } from "../lib/legacyNav";
import { useDashboardSummary } from "../hooks/useDashboard";
import LibrarySheet from "./LibrarySheet";
import { Page } from "../types";
import { ApiCollection } from "../types/api";

interface BottomNavProps {
  collections: ApiCollection[];
  onNavigate: (
    page: Page,
    params?: { collectionId?: string; tag?: string },
  ) => void;
  onOpenSearch: () => void;
}

export default function BottomNav({
  collections,
  onNavigate,
  onOpenSearch,
}: BottomNavProps) {
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const { data: summary } = useDashboardSummary();

  function isActive(page: Page) {
    return location.pathname === pageToPath(page);
  }

  function item(
    label: string,
    icon: ReactNode,
    onClick: () => void,
    active: boolean,
    badge?: number,
  ) {
    return (
      <button
        key={label}
        onClick={onClick}
        className="relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full"
      >
        <span
          className={`relative transition-colors duration-150 ${active ? "text-primary" : "text-muted-foreground"}`}
        >
          {icon}
          {badge !== undefined && badge > 0 && (
            <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-medium flex items-center justify-center">
              {badge > 99 ? "99+" : badge}
            </span>
          )}
        </span>
        <span
          className={`text-[10px] transition-colors duration-150 ${active ? "text-primary font-medium" : "text-muted-foreground"}`}
        >
          {label}
        </span>
      </button>
    );
  }

  return (
    <>
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex items-stretch bg-card border-t border-border h-16 pb-[env(safe-area-inset-bottom,0px)]"
        aria-label="Primary"
      >
        {item(
          "Home",
          <GridIcon size={19} />,
          () => onNavigate("dashboard"),
          isActive("dashboard"),
        )}
        {item(
          "Inbox",
          <InboxIcon size={19} />,
          () => onNavigate("inbox"),
          isActive("inbox"),
          summary?.inboxCount,
        )}
        {item("Search", <SearchIcon size={19} />, onOpenSearch, false)}
        {item(
          "Favorites",
          <StarIcon size={19} />,
          () => onNavigate("favorites"),
          isActive("favorites"),
          summary?.favoriteCount,
        )}
        {item(
          "More",
          <MoreHorizontalIcon size={19} />,
          () => setShowMore(true),
          showMore,
        )}
      </nav>

      <AnimatePresence>
        {showMore && (
          <LibrarySheet
            collections={collections}
            onNavigate={(page, params) => {
              onNavigate(page, params);
              setShowMore(false);
            }}
            onClose={() => setShowMore(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
