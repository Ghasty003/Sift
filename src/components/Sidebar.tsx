import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Page } from "../types";
import { ApiBookmark, ApiCollection } from "../types/api";
import {
  InboxIcon,
  BookmarkIcon,
  StarIcon,
  EyeOffIcon,
  FolderIcon,
  TagIcon,
  SettingsIcon,
  PlusIcon,
  XIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  GridIcon,
} from "../icons";
import { getAvatarColor, getInitials } from "../data";
import { pageToPath } from "../lib/legacyNav";
import { useCreateCollection } from "../hooks/useCollections";

interface SidebarProps {
  onNavigate: (
    page: Page,
    params?: { collectionId?: string; tag?: string },
  ) => void;
  collections: ApiCollection[];
  bookmarks: ApiBookmark[];
  isOpen: boolean;
  onClose: () => void;
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl border border-border shadow-xl w-full max-w-sm mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
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
              onKeyDown={(e) =>
                e.key === "Enter" &&
                name.trim() &&
                onSave(name.trim(), description.trim())
              }
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
      </div>
    </div>
  );
}

export default function Sidebar({
  onNavigate,
  collections,
  bookmarks,
  isOpen,
  onClose,
}: SidebarProps) {
  const [collectionsExpanded, setCollectionsExpanded] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const location = useLocation();
  const createCollection = useCreateCollection();

  const inboxCount = bookmarks.filter((b) => b.collection === null).length;
  const favoritesCount = bookmarks.filter((b) => b.isFavorite).length;
  const unreadCount = bookmarks.filter((b) => !b.isRead).length;

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
        onClick={() => {
          onNavigate(page, params);
          onClose();
        }}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left group ${
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        <span className="flex-shrink-0">{icon}</span>
        <span className="flex-1 truncate">{label}</span>
        {badge !== undefined && badge > 0 && (
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
              isActive
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {badge}
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

  const sidebarContent = (
    <div className="flex flex-col h-full py-4">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
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
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded text-muted-foreground hover:text-foreground"
        >
          <XIcon size={16} />
        </button>
      </div>

      {/* Primary nav */}
      <nav className="px-2 space-y-0.5">
        {navItem("Dashboard", <GridIcon size={15} />, "dashboard")}
        {navItem("Inbox", <InboxIcon size={15} />, "inbox", inboxCount)}
        {navItem("All Bookmarks", <BookmarkIcon size={15} />, "all-bookmarks")}
        {navItem(
          "Favorites",
          <StarIcon size={15} />,
          "favorites",
          favoritesCount,
        )}
        {navItem("Unread", <EyeOffIcon size={15} />, "unread", unreadCount)}
      </nav>

      <div className="mx-4 my-4 border-t border-border" />

      {/* Collections */}
      <div className="px-2 flex-1 overflow-y-auto min-h-0">
        <button
          onClick={() => setCollectionsExpanded((v) => !v)}
          className="w-full flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          {collectionsExpanded ? (
            <ChevronDownIcon size={12} />
          ) : (
            <ChevronRightIcon size={12} />
          )}
          Collections
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowCreateModal(true);
            }}
            className="ml-auto p-0.5 rounded hover:bg-muted hover:text-foreground transition-colors"
            title="New collection"
          >
            <PlusIcon size={13} />
          </button>
        </button>

        {collectionsExpanded && (
          <div className="mt-1 space-y-0.5">
            {collections.map((c) => {
              const count = bookmarks.filter(
                (b) => b.collection?.id === c.id,
              ).length;
              const isActive = location.pathname === `/collections/${c.id}`;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    onNavigate("collection-detail", { collectionId: c.id });
                    onClose();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <FolderIcon size={14} />
                  <span className="flex-1 truncate">{c.name}</span>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mx-4 my-3 border-t border-border" />

      {/* Tags + Settings */}
      <div className="px-2 space-y-0.5">
        {navItem("Tags", <TagIcon size={15} />, "tags")}
        {navItem("Settings", <SettingsIcon size={15} />, "settings")}
      </div>

      {/* User — static placeholder; wire to a real /me endpoint once one exists */}
      <div className="mt-3 px-3">
        <button
          onClick={() => {
            onNavigate("settings");
            onClose();
          }}
          className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white font-semibold flex-shrink-0"
            style={{ backgroundColor: getAvatarColor("alexchen") }}
          >
            {getInitials("Alex Chen")}
          </div>
          <div className="text-left min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              Alex Chen
            </p>
            <p className="text-xs text-muted-foreground truncate">
              alex@example.com
            </p>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-56 bg-card border-r border-border flex-shrink-0 h-full">
        {sidebarContent}
      </aside>

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-card border-r border-border shadow-xl transition-transform duration-200 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {showCreateModal && (
        <CreateCollectionModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateCollection}
          saving={createCollection.isPending}
        />
      )}
    </>
  );
}
