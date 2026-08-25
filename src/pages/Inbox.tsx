import React, { useState } from 'react';
import { Bookmark, Collection, AppAction } from '../types';
import BookmarkCard from '../components/BookmarkCard';
import { InboxIcon, SortIcon } from '../icons';

interface InboxProps {
  bookmarks: Bookmark[];
  collections: Collection[];
  dispatch: React.Dispatch<AppAction>;
}

export default function Inbox({ bookmarks, collections, dispatch }: InboxProps) {
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [search, setSearch] = useState('');

  const filtered = bookmarks
    .filter((b) =>
      !search ||
      b.tweet.text.toLowerCase().includes(search.toLowerCase()) ||
      b.tweet.author.displayName.toLowerCase().includes(search.toLowerCase()) ||
      b.tweet.author.username.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === 'newest'
        ? new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
        : new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime()
    );

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <InboxIcon size={18} className="text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">Inbox</h1>
          <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-1">
            {bookmarks.length}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">Bookmarks you haven&apos;t organized yet.</p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter inbox..."
          className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {/* List */}
      {filtered.length === 0 && bookmarks.length === 0 && (
        <EmptyInbox />
      )}

      {filtered.length === 0 && bookmarks.length > 0 && (
        <div className="text-center py-16">
          <p className="text-sm text-muted-foreground">No results for &ldquo;{search}&rdquo;</p>
        </div>
      )}

      <div className="space-y-4">
        {filtered.map((b) => (
          <BookmarkCard key={b.id} bookmark={b} collections={collections} dispatch={dispatch} />
        ))}
      </div>
    </div>
  );
}

function EmptyInbox() {
  return (
    <div className="text-center py-20">
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
        <InboxIcon size={22} className="text-muted-foreground" />
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1">Your Inbox is empty</h3>
      <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
        Save an X post using the browser extension or mobile Shortcut.
      </p>
    </div>
  );
}
