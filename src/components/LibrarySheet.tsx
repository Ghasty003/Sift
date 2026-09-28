import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import BottomSheet from "./BottomSheet";
import {
  FolderIcon,
  TagIcon,
  EyeOffIcon,
  SettingsIcon,
  LogOutIcon,
  BookmarkIcon,
} from "../icons";
import { ApiCollection } from "../types/api";
import { Page } from "../types";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useLogout } from "../hooks/useAuth";
import { getAvatarColor, getInitials } from "../data";
import { useDashboardSummary } from "../hooks/useDashboard";

interface LibrarySheetProps {
  collections: ApiCollection[];
  onNavigate: (
    page: Page,
    params?: { collectionId?: string; tag?: string },
  ) => void;
  onClose: () => void;
}

export default function LibrarySheet({
  collections,
  onNavigate,
  onClose,
}: LibrarySheetProps) {
  const { data: user } = useCurrentUser();
  const { data: summary } = useDashboardSummary();
  const logout = useLogout();
  const navigate = useNavigate();

  function row(
    label: string,
    icon: ReactNode,
    onClick: () => void,
    count?: number,
  ) {
    return (
      <button
        key={label}
        onClick={onClick}
        className="w-full flex items-center gap-3 px-5 py-3 text-left min-h-11 active:bg-muted/60 transition-colors"
      >
        <span className="text-muted-foreground shrink-0">{icon}</span>
        <span className="flex-1 text-sm text-foreground">{label}</span>
        {count !== undefined && count > 0 && (
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </button>
    );
  }

  return (
    <BottomSheet onClose={onClose} title="Library">
      <div className="pb-2">
        {row("All Bookmarks", <BookmarkIcon size={16} />, () =>
          onNavigate("all-bookmarks"),
        )}
        {row(
          "Unread",
          <EyeOffIcon size={16} />,
          () => onNavigate("unread"),
          summary?.unreadCount,
        )}
      </div>

      <div className="border-t border-border pt-2 pb-2">
        <p className="px-5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Collections
        </p>
        {collections.length === 0 ? (
          <p className="px-5 py-2 text-xs text-muted-foreground/70">
            No collections yet
          </p>
        ) : (
          collections.map((c) =>
            row(
              c.name,
              <FolderIcon size={16} />,
              () => onNavigate("collection-detail", { collectionId: c.id }),
              c.bookmarkCount,
            ),
          )
        )}
        {row("Tags", <TagIcon size={16} />, () => onNavigate("tags"))}
      </div>

      <div className="border-t border-border pt-2">
        {row("Settings", <SettingsIcon size={16} />, () =>
          onNavigate("settings"),
        )}
        <button
          onClick={() => {
            onClose();
            logout.mutate(undefined, { onSuccess: () => navigate("/login") });
          }}
          className="w-full flex items-center gap-3 px-5 py-3 text-left min-h-11 text-red-600 active:bg-red-50 transition-colors"
        >
          <LogOutIcon size={16} />
          <span className="text-sm">Log out</span>
        </button>
      </div>

      {user && (
        <div className="border-t border-border px-5 py-3 flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white font-semibold shrink-0"
            style={{ backgroundColor: getAvatarColor(user.email) }}
          >
            {getInitials(user.fullName)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {user.fullName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
      )}
    </BottomSheet>
  );
}
