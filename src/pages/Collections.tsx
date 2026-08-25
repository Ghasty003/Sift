import React, { useState } from 'react';
import { Bookmark, Collection, AppAction } from '../types';
import { FolderIcon, PlusIcon, MoreHorizontalIcon, TrashIcon, BookmarkIcon } from '../icons';
import { formatDate } from '../data';

interface CollectionsProps {
  bookmarks: Bookmark[];
  collections: Collection[];
  dispatch: React.Dispatch<AppAction>;
  onSelectCollection: (id: string) => void;
}

function CreateCollectionModal({ onClose, onSave }: { onClose: () => void; onSave: (name: string, desc: string) => void }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-xl border border-border shadow-xl w-full max-w-sm mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-sm font-semibold mb-4">Create Collection</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Name</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && name.trim() && onSave(name.trim(), description.trim())}
              placeholder="e.g. Performance"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Description (optional)</label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What goes in this collection?"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
          <button
            onClick={() => { if (name.trim()) onSave(name.trim(), description.trim()); }}
            disabled={!name.trim()}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Collections({ bookmarks, collections, dispatch, onSelectCollection }: CollectionsProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  function handleCreate(name: string, desc: string) {
    const id = `${name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${Date.now()}`;
    dispatch({ type: 'CREATE_COLLECTION', collection: { id, name, description: desc, createdAt: new Date().toISOString() } });
    setShowCreate(false);
  }

  function handleDelete(id: string) {
    dispatch({ type: 'DELETE_COLLECTION', id });
    setMenuOpen(null);
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderIcon size={18} className="text-muted-foreground" />
            <h1 className="text-2xl font-bold text-foreground">Collections</h1>
          </div>
          <p className="text-sm text-muted-foreground">Organize your bookmarks into focused groups.</p>
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
          onClick={() => onSelectCollection('inbox')}
          className="w-full bg-card border border-border rounded-xl p-5 text-left hover:border-foreground/20 transition-colors group"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-base">📥</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Inbox</p>
                <p className="text-xs text-muted-foreground mt-0.5">Unsorted bookmarks</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground tabular-nums">
                {bookmarks.filter((b) => b.collectionId === 'inbox').length}
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
          <h3 className="text-sm font-semibold text-foreground mb-1">Create your first collection</h3>
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
            const count = bookmarks.filter((b) => b.collectionId === c.id).length;
            const unread = bookmarks.filter((b) => b.collectionId === c.id && !b.isRead).length;
            const recent = bookmarks
              .filter((b) => b.collectionId === c.id)
              .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())[0];

            return (
              <div key={c.id} className="relative group">
                <button
                  onClick={() => onSelectCollection(c.id)}
                  className="w-full bg-card border border-border rounded-xl p-5 text-left hover:border-foreground/20 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                        <FolderIcon size={14} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{c.name}</p>
                        {c.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{c.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-bold text-foreground tabular-nums">{count}</p>
                      {unread > 0 && (
                        <p className="text-xs text-primary">{unread} unread</p>
                      )}
                    </div>
                  </div>

                  {recent && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed border-t border-border pt-3">
                      {recent.tweet.text.slice(0, 100)}{recent.tweet.text.length > 100 ? '…' : ''}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground mt-2">Created {formatDate(c.createdAt)}</p>
                </button>

                {/* Context menu */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === c.id ? null : c.id); }}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontalIcon size={14} />
                  </button>
                  {menuOpen === c.id && (
                    <div className="absolute right-0 top-full mt-1 z-20 bg-card border border-border rounded-lg shadow-lg py-1 min-w-36">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(c.id); }}
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

      {showCreate && <CreateCollectionModal onClose={() => setShowCreate(false)} onSave={handleCreate} />}
    </div>
  );
}
