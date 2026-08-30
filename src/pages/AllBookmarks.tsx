import React, { useState } from 'react';
import { ApiBookmark, ApiCollection, ApiTag } from '../types/api';
import BookmarkCard from '../components/BookmarkCard';
import { BookmarkIcon, XIcon } from '../icons';

interface AllBookmarksProps {
  bookmarks: ApiBookmark[];
  collections: ApiCollection[];
  allTags: ApiTag[];
}

type SortKey = 'newest-saved' | 'oldest-saved' | 'newest-tweet' | 'oldest-tweet';

export default function AllBookmarks({ bookmarks, collections, allTags }: AllBookmarksProps) {
  const [search, setSearch] = useState('');
  const [filterCollection, setFilterCollection] = useState(''); // '' = all, 'inbox' = no collection, else collection id
  const [filterTag, setFilterTag] = useState(''); // tag id
  const [filterRead, setFilterRead] = useState<'all' | 'read' | 'unread'>('all');
  const [filterFavorite, setFilterFavorite] = useState(false);
  const [sort, setSort] = useState<SortKey>('newest-saved');

  const filtered = bookmarks
    .filter((b) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !b.tweet.text.toLowerCase().includes(q) &&
          !b.tweet.authorName.toLowerCase().includes(q) &&
          !b.tweet.authorUsername.toLowerCase().includes(q) &&
          !(b.note?.content.toLowerCase().includes(q) ?? false) &&
          !b.tags.some((t) => t.name.toLowerCase().includes(q))
        )
          return false;
      }
      if (filterCollection === 'inbox' && b.collection !== null) return false;
      if (filterCollection && filterCollection !== 'inbox' && b.collection?.id !== filterCollection) return false;
      if (filterTag && !b.tags.some((t) => t.id === filterTag)) return false;
      if (filterRead === 'read' && !b.isRead) return false;
      if (filterRead === 'unread' && b.isRead) return false;
      if (filterFavorite && !b.isFavorite) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sort) {
        case 'newest-saved': return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
        case 'oldest-saved': return new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime();
        case 'newest-tweet': return new Date(b.tweet.createdAt).getTime() - new Date(a.tweet.createdAt).getTime();
        case 'oldest-tweet': return new Date(a.tweet.createdAt).getTime() - new Date(b.tweet.createdAt).getTime();
        default: return 0;
      }
    });

  const activeFilters = [
    filterCollection === 'inbox' ? 'Inbox' : collections.find((c) => c.id === filterCollection)?.name,
    filterTag ? `#${allTags.find((t) => t.id === filterTag)?.name ?? ''}` : undefined,
    filterRead !== 'all' && filterRead,
    filterFavorite && 'Favorites',
  ].filter(Boolean) as string[];

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BookmarkIcon size={18} className="text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">All Bookmarks</h1>
          <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-1">
            {filtered.length}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">Every bookmark, across all collections.</p>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search all bookmarks..."
            className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="px-3 py-2 text-sm border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="newest-saved">Newest saved</option>
            <option value="oldest-saved">Oldest saved</option>
            <option value="newest-tweet">Newest tweet</option>
            <option value="oldest-tweet">Oldest tweet</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={filterCollection}
            onChange={(e) => setFilterCollection(e.target.value)}
            className="px-3 py-1.5 text-xs border border-border rounded-lg bg-card text-foreground focus:outline-none"
          >
            <option value="">All collections</option>
            <option value="inbox">Inbox</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="px-3 py-1.5 text-xs border border-border rounded-lg bg-card text-foreground focus:outline-none"
          >
            <option value="">All tags</option>
            {allTags.map((t) => (
              <option key={t.id} value={t.id}>#{t.name}</option>
            ))}
          </select>

          <select
            value={filterRead}
            onChange={(e) => setFilterRead(e.target.value as 'all' | 'read' | 'unread')}
            className="px-3 py-1.5 text-xs border border-border rounded-lg bg-card text-foreground focus:outline-none"
          >
            <option value="all">All statuses</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
          </select>

          <button
            onClick={() => setFilterFavorite((v) => !v)}
            className={`px-3 py-1.5 text-xs border rounded-lg transition-colors ${
              filterFavorite
                ? 'border-amber-400 bg-amber-50 text-amber-700'
                : 'border-border bg-card text-muted-foreground hover:text-foreground'
            }`}
          >
            ★ Favorites only
          </button>

          {activeFilters.length > 0 && (
            <button
              onClick={() => {
                setFilterCollection('');
                setFilterTag('');
                setFilterRead('all');
                setFilterFavorite(false);
              }}
              className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <XIcon size={11} /> Clear filters
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <BookmarkIcon size={24} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">No bookmarks found</p>
          <p className="text-sm text-muted-foreground">Try another search or remove some filters.</p>
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
