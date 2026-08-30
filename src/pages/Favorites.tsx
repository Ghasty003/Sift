import React, { useState } from 'react';
import { ApiBookmark, ApiCollection } from '../types/api';
import BookmarkCard from '../components/BookmarkCard';
import { StarIcon } from '../icons';

interface FavoritesProps {
  bookmarks: ApiBookmark[];
  collections: ApiCollection[];
}

export default function Favorites({ bookmarks, collections }: FavoritesProps) {
  const [search, setSearch] = useState('');

  const filtered = bookmarks.filter((b) =>
    !search ||
    b.tweet.text.toLowerCase().includes(search.toLowerCase()) ||
    b.tweet.authorName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <StarIcon size={18} className="text-muted-foreground" filled />
          <h1 className="text-2xl font-bold text-foreground">Favorites</h1>
          <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-1">
            {bookmarks.length}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">Bookmarks you want to find quickly.</p>
      </div>

      <div className="mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search favorites..."
          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <StarIcon size={22} className="text-amber-400" filled />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">
            {search ? 'No results' : 'No favorites yet'}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            {search ? 'Try a different search.' : 'Star a bookmark to save it here for quick access.'}
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
