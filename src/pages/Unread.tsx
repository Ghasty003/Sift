import React, { useState } from 'react';
import { ApiBookmark, ApiCollection } from '../types/api';
import BookmarkCard from '../components/BookmarkCard';
import { EyeOffIcon, CheckCircleIcon } from '../icons';
import { useToggleRead } from '../hooks/useBookmarks';

interface UnreadProps {
  bookmarks: ApiBookmark[];
  collections: ApiCollection[];
}

export default function Unread({ bookmarks, collections }: UnreadProps) {
  const [search, setSearch] = useState('');
  const toggleRead = useToggleRead();

  const filtered = bookmarks.filter((b) =>
    !search ||
    b.tweet.text.toLowerCase().includes(search.toLowerCase()) ||
    b.tweet.authorName.toLowerCase().includes(search.toLowerCase())
  );

  function markAllRead() {
    // Fires one mutation per bookmark — the API has no bulk "mark all read"
    // endpoint. Fine for realistic inbox sizes; revisit if this list ever
    // needs to handle hundreds of items at once.
    filtered.forEach((b) => toggleRead.mutate(b.id));
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <EyeOffIcon size={18} className="text-muted-foreground" />
            <h1 className="text-2xl font-bold text-foreground">Unread</h1>
            <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-1">
              {bookmarks.length}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Bookmarks waiting to be read.</p>
        </div>
        {bookmarks.length > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors bg-card"
          >
            <CheckCircleIcon size={14} />
            Mark all read
          </button>
        )}
      </div>

      <div className="mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search unread..."
          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
            <EyeOffIcon size={22} className="text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">
            {search ? 'No results' : 'All caught up'}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            {search ? 'Try a different search.' : "No unread bookmarks. You're all caught up."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => (
            <BookmarkCard key={b.id} bookmark={b} collections={collections} />
          ))}
        </div>
      )}
    </div>
  );
}
