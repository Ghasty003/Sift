import React from 'react';
import { Bookmark, Collection, AppAction } from '../types';
import BookmarkCard from '../components/BookmarkCard';
import { ArrowLeftIcon, TagIcon } from '../icons';

interface TagDetailProps {
  bookmarks: Bookmark[];
  tag: string;
  collections: Collection[];
  dispatch: React.Dispatch<AppAction>;
  onBack: () => void;
}

export default function TagDetail({ bookmarks, tag, collections, dispatch, onBack }: TagDetailProps) {
  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeftIcon size={14} />
        Tags
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <TagIcon size={18} className="text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground font-mono">{tag}</h1>
        </div>
        <p className="text-sm text-muted-foreground">{bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''}</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-muted-foreground">No bookmarks with this tag.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((b) => (
            <BookmarkCard key={b.id} bookmark={b} collections={collections} dispatch={dispatch} />
          ))}
        </div>
      )}
    </div>
  );
}
