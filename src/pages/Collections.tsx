import React, { useState } from "react";
import { ApiBookmark, ApiCollection } from "../types/api";
import { FolderIcon, PlusIcon, MoreHorizontalIcon, TrashIcon } from "../icons";
import { formatDate } from "../data";
import {
  useCreateCollection,
  useDeleteCollection,
} from "../hooks/useCollections";

interface CollectionsProps {
  bookmarks: ApiBookmark[];
  collections: ApiCollection[];
  onSelectCollection: (id: string) => void;
}

function CreateCollectionModal({
  onClose,
  onSave,
  saving,
}: {
  onClose: () => void;
  onSave: (name: string, desc: string) => void;
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
        <h3 className="text-sm font-semibold mb-4">Create Collection</h3>
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
              placeholder="What goes in this collection?"
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
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {saving ? "Creating…" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteCollectionModal({
  collectionName,
  bookmarkCount,
  onClose,
  onConfirm,
  deleting,
}: {
  collectionName: string;
  bookmarkCount: number;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl border border-border shadow-xl w-full max-w-sm mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-sm font-semibold mb-2">
          Delete &ldquo;{collectionName}&rdquo;?
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {bookmarkCount > 0
            ? `${bookmarkCount} bookmark${bookmarkCount !== 1 ? "s" : ""} in this collection will move to your Inbox. `
            : ""}
          This can&apos;t be undone.
        </p>
        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {deleting ? "Deleting…" : "Delete collection"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Collections({
  bookmarks,
  collections,
  onSelectCollection,
}: CollectionsProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ApiCollection | null>(
    null,
  );

  const createCollection = useCreateCollection();
  const deleteCollection = useDeleteCollection();

  function handleCreate(name: string, description: string) {
    createCollection.mutate(
      { name, description },
      { onSuccess: () => setShowCreate(false) },
    );
  }

  function handleConfirmDelete() {
    if (!pendingDelete) return;
    deleteCollection.mutate(pendingDelete.id, {
      onSuccess: () => setPendingDelete(null),
    });
  }

  const inboxCount = bookmarks.filter((b) => b.collection === null).length;

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderIcon size={18} className="text-muted-foreground" />
            <h1 className="text-2xl font-bold text-foreground">Collections</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Organize your bookmarks into focused groups.
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <PlusIcon size={14} />
          New Collection
        </button>
      </div>

      {/* Inbox (special) */}
      <div className="mb-4">
        <button
          onClick={() => onSelectCollection("inbox")}
          className="w-full bg-card border border-border rounded-xl p-5 text-left hover:border-foreground/20 transition-colors group"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-base">📥</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Inbox</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Unsorted bookmarks
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {inboxCount}
              </p>
              <p className="text-xs text-muted-foreground">bookmarks</p>
            </div>
          </div>
        </button>
      </div>

      {/* Collections grid */}
      {collections.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
            <FolderIcon size={22} className="text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Create your first collection
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Collections help you group related bookmarks together.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
          >
            Create collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {collections.map((c) => {
            const collectionBookmarks = bookmarks.filter(
              (b) => b.collection?.id === c.id,
            );
            const count = collectionBookmarks.length;
            const unread = collectionBookmarks.filter((b) => !b.isRead).length;
            const recent = [...collectionBookmarks].sort(
              (a, b) =>
                new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime(),
            )[0];

            return (
              <div key={c.id} className="relative group">
                <button
                  onClick={() => onSelectCollection(c.id)}
                  className="w-full bg-card border border-border rounded-xl p-5 text-left hover:border-foreground/20 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                        <FolderIcon
                          size={14}
                          className="text-muted-foreground"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {c.name}
                        </p>
                        {c.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {c.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold text-foreground tabular-nums">
                        {count}
                      </p>
                      {unread > 0 && (
                        <p className="text-xs text-primary">{unread} unread</p>
                      )}
                    </div>
                  </div>

                  {recent && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed border-t border-border pt-3">
                      {recent.tweet.text.slice(0, 100)}
                      {recent.tweet.text.length > 100 ? "…" : ""}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground mt-2">
                    Created {formatDate(c.createdAt)}
                  </p>
                </button>

                <div className="absolute top-3 right-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(menuOpen === c.id ? null : c.id);
                    }}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontalIcon size={14} />
                  </button>
                  {menuOpen === c.id && (
                    <div className="absolute right-0 top-full mt-1 z-20 bg-card border border-border rounded-lg shadow-lg py-1 min-w-36">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(null);
                          setPendingDelete(c);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <TrashIcon size={13} />
                        Delete collection
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showCreate && (
        <CreateCollectionModal
          onClose={() => setShowCreate(false)}
          onSave={handleCreate}
          saving={createCollection.isPending}
        />
      )}

      {pendingDelete && (
        <DeleteCollectionModal
          collectionName={pendingDelete.name}
          bookmarkCount={
            bookmarks.filter((b) => b.collection?.id === pendingDelete.id)
              .length
          }
          onClose={() => setPendingDelete(null)}
          onConfirm={handleConfirmDelete}
          deleting={deleteCollection.isPending}
        />
      )}
    </div>
  );
}
