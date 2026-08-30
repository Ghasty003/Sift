import React, { useState } from 'react';
import { ApiBookmark, ApiCollection } from '../types/api';
import BookmarkCard from '../components/BookmarkCard';
import { ArrowLeftIcon, FolderIcon, EyeOffIcon } from '../icons';

interface CollectionDetailProps {
  bookmarks: ApiBookmark[];
  collection: ApiCollection | { id: 'inbox'; name: string; description: string };
  allCollections: ApiCollection[];
  onBack: () => void;
}

export default function CollectionDetail({ bookmarks, collection, allCollections, onBack }: CollectionDetailProps) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');

  const unreadCount = bookmarks.filter((b) => !b.isRead).length;

  const filtered = bookmarks
    .filter((b) =>
      !search ||
      b.tweet.text.toLowerCase().includes(search.toLowerCase()) ||
      b.tweet.authorName.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === 'newest'
        ? new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
        : new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime()
    );

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeftIcon size={14} />
        Collections
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
            <FolderIcon size={15} className="text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{collection.name}</h1>
        </div>
        {collection.description && (
          <p className="text-sm text-muted-foreground mt-1">{collection.description}</p>
        )}
        <div className="flex items-center gap-4 mt-3">
          <span className="text-sm text-muted-foreground">{bookmarks.length} bookmarks</span>
          {unreadCount > 0 && (
            <span className="flex items-center gap-1.5 text-sm text-primary">
              <EyeOffIcon size={13} />
              {unreadCount} unread
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search in this collection..."
          className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground focus:outline-none"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FolderIcon size={24} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {search ? `No results for "${search}"` : 'This collection is empty.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => (
            <BookmarkCard key={b.id} bookmark={b} collections={allCollections} />
          ))}
        </div>
      )}
    </div>
  );
}
