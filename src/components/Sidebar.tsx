import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Page } from "../types";
import { ApiCollection } from "../types/api";
import {
  InboxIcon,
  BookmarkIcon,
  StarIcon,
  EyeOffIcon,
  FolderIcon,
  TagIcon,
  SettingsIcon,
  PlusIcon,
  ChevronDownIcon,
  GridIcon,
  LogOutIcon,
} from "../icons";
import { getAvatarColor, getInitials } from "../data";
import { pageToPath } from "../lib/legacyNav";
import { useCreateCollection } from "../hooks/useCollections";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useLogout } from "../hooks/useAuth";
import { useDashboardSummary } from "../hooks/useDashboard";
import { MOTION, prefersReducedMotion } from "../lib/motion";

interface SidebarProps {
  onNavigate: (
    page: Page,
    params?: { collectionId?: string; tag?: string },
  ) => void;
  collections: ApiCollection[];
}

function CreateCollectionModal({
  onClose,
  onSave,
  saving,
}: {
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  saving: boolean;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const reduceMotion = prefersReducedMotion();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={MOTION.ui}
    >
      <motion.div
        className="bg-card rounded-xl border border-border shadow-xl w-full max-w-sm mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
        initial={reduceMotion ? undefined : { opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
        transition={MOTION.ui}
      >
        <h3 className="text-sm font-semibold mb-4">New Collection</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Name
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && name.trim()) {
                  onSave(name.trim(), description.trim());
                }
                if (e.key === "Escape") onClose();
              }}
              placeholder="e.g. Performance"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              Description (optional)
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (name.trim()) onSave(name.trim(), description.trim());
            }}
            disabled={!name.trim() || saving}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Creating…" : "Create"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Badge({ value }: { value: number }) {
  const reduceMotion = prefersReducedMotion();
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={reduceMotion ? undefined : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={MOTION.micro}
        className="text-xs px-1.5 py-0.5 rounded-full font-medium bg-muted text-muted-foreground group-data-[active=true]:bg-primary/20 group-data-[active=true]:text-primary"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}

export default function Sidebar({ onNavigate, collections }: SidebarProps) {
  const [collectionsExpanded, setCollectionsExpanded] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const createCollection = useCreateCollection();
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const { data: summary } = useDashboardSummary();
  const reduceMotion = prefersReducedMotion();

  const inboxCount = summary?.inboxCount ?? 0;
  const favoritesCount = summary?.favoriteCount ?? 0;
  const unreadCount = summary?.unreadCount ?? 0;

  function navItem(
    label: string,
    icon: React.ReactNode,
    page: Page,
    badge?: number,
    params?: { collectionId?: string; tag?: string },
  ) {
    const isActive = location.pathname === pageToPath(page, params);
    return (
      <button
        onClick={() => onNavigate(page, params)}
        data-active={isActive}
        className="group relative w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left"
      >
        {isActive && (
          <motion.span
            layoutId="sidebar-active-pill"
            className="absolute inset-0 bg-primary/10 rounded-lg"
            transition={reduceMotion ? { duration: 0 } : MOTION.ui}
          />
        )}
        <span
          className={`relative shrink-0 transition-colors duration-150 ${
            isActive
              ? "text-primary"
              : "text-muted-foreground group-hover:text-foreground"
          }`}
        >
          {icon}
        </span>
        <span
          className={`relative flex-1 truncate transition-colors duration-150 ${
            isActive
              ? "text-primary font-medium"
              : "text-muted-foreground group-hover:text-foreground"
          }`}
        >
          {label}
        </span>
        {badge !== undefined && badge > 0 && (
          <span className="relative">
            <Badge value={badge} />
          </span>
        )}
      </button>
    );
  }

  function handleCreateCollection(name: string, description: string) {
    createCollection.mutate(
      { name, description },
      { onSuccess: () => setShowCreateModal(false) },
    );
  }

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => navigate("/login"),
    });
  }

  return (
    <aside className="hidden lg:flex flex-col w-56 bg-card border-r border-border shrink-0 h-full">
      <div className="flex flex-col h-full py-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 mb-6">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6h16M4 12h8m-8 6h6" />
            </svg>
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">
            Sift
          </span>
        </div>

        {/* Primary — dashboard + the three filtered views */}
        <nav className="px-2 space-y-0.5">
          {navItem("Dashboard", <GridIcon size={15} />, "dashboard")}
          {navItem("Inbox", <InboxIcon size={15} />, "inbox", inboxCount)}
          {navItem(
            "All Bookmarks",
            <BookmarkIcon size={15} />,
            "all-bookmarks",
          )}
          {navItem(
            "Favorites",
            <StarIcon size={15} />,
            "favorites",
            favoritesCount,
          )}
          {navItem("Unread", <EyeOffIcon size={15} />, "unread", unreadCount)}
        </nav>

        <div className="mx-4 my-4 border-t border-border" />

        {/* Library */}
        <p className="px-5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          Library
        </p>

        <div className="px-2 flex-1 overflow-y-auto min-h-0">
          <button
            onClick={() => setCollectionsExpanded((v) => !v)}
            className="w-full flex items-center gap-1.5 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg"
          >
            <motion.span
              animate={{ rotate: collectionsExpanded ? 0 : -90 }}
              transition={reduceMotion ? { duration: 0 } : MOTION.ui}
              className="shrink-0"
            >
              <ChevronDownIcon size={13} />
            </motion.span>
            <FolderIcon size={14} className="shrink-0" />
            <span className="flex-1 text-left">Collections</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCreateModal(true);
              }}
              title="New collection"
              className="p-0.5 rounded hover:bg-muted hover:text-foreground transition-colors"
            >
              <PlusIcon size={13} />
            </button>
          </button>

          <AnimatePresence initial={false}>
            {collectionsExpanded && (
              <motion.div
                initial={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                transition={MOTION.ui}
                className="overflow-hidden"
              >
                <div className="mt-0.5 space-y-0.5 pl-5">
                  {collections.length === 0 ? (
                    <p className="px-3 py-2 text-xs text-muted-foreground/70">
                      No collections yet
                    </p>
                  ) : (
                    collections.map((c) => {
                      const isActive =
                        location.pathname === `/collections/${c.id}`;
                      return (
                        <button
                          key={c.id}
                          onClick={() =>
                            onNavigate("collection-detail", {
                              collectionId: c.id,
                            })
                          }
                          data-active={isActive}
                          className={`group w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm text-left transition-colors duration-150 ${
                            isActive
                              ? "text-primary font-medium bg-primary/10"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <span className="flex-1 truncate">{c.name}</span>
                          <span className="text-xs text-muted-foreground/70 tabular-nums">
                            {c.bookmarkCount}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-1">
            {navItem("Tags", <TagIcon size={15} />, "tags")}
          </div>
        </div>

        <div className="mx-4 my-3 border-t border-border" />

        {/* Settings */}
        <div className="px-2">
          {navItem("Settings", <SettingsIcon size={15} />, "settings")}
        </div>

        {/* User */}
        <div className="mt-3 px-3 space-y-1">
          <button
            onClick={() => onNavigate("settings")}
            className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted transition-colors duration-150"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white font-semibold shrink-0"
              style={{
                backgroundColor: user ? getAvatarColor(user.email) : "#D4D4D8",
              }}
            >
              {user ? getInitials(user.fullName) : ""}
            </div>
            <div className="text-left min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                {user?.fullName ?? "Loading…"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email ?? ""}
              </p>
            </div>
          </button>

          <AnimatePresence mode="wait" initial={false}>
            {confirmLogout ? (
              <motion.div
                key="confirm"
                initial={reduceMotion ? undefined : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                transition={MOTION.ui}
                className="flex items-center gap-2 px-2 py-1 overflow-hidden"
              >
                <span className="text-xs text-muted-foreground flex-1">
                  Log out?
                </span>
                <button
                  onClick={handleLogout}
                  disabled={logout.isPending}
                  className="text-xs text-red-600 font-medium hover:opacity-70 px-2 py-1 rounded border border-red-200 bg-red-50 disabled:opacity-60"
                >
                  {logout.isPending ? "…" : "Yes"}
                </button>
                <button
                  onClick={() => setConfirmLogout(false)}
                  className="text-xs text-muted-foreground hover:text-foreground px-1"
                >
                  No
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="button"
                initial={reduceMotion ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
                transition={MOTION.ui}
                onClick={() => setConfirmLogout(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
              >
                <LogOutIcon size={15} />
                <span>Log out</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <CreateCollectionModal
            onClose={() => setShowCreateModal(false)}
            onSave={handleCreateCollection}
            saving={createCollection.isPending}
          />
        )}
      </AnimatePresence>
    </aside>
  );
}
