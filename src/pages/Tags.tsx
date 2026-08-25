import React, { useState } from 'react';
import { Bookmark, AppAction } from '../types';
import { TagIcon, SearchIcon } from '../icons';

interface TagsProps {
  bookmarks: Bookmark[];
  allTags: string[];
  onSelectTag: (tag: string) => void;
  dispatch: React.Dispatch<AppAction>;
}

export default function Tags({ bookmarks, allTags, onSelectTag }: TagsProps) {
  const [search, setSearch] = useState('');

  const tagData = allTags
    .map((tag) => ({
      tag,
      count: bookmarks.filter((b) => b.tags.includes(tag)).length,
      lastUsed: bookmarks
        .filter((b) => b.tags.includes(tag))
        .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())[0]?.savedAt ?? '',
    }))
    .filter((t) => !search || t.tag.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <TagIcon size={18} className="text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">Tags</h1>
          <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-1">
            {allTags.length}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">Tags help you connect bookmarks across collections.</p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tags..."
          className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
        />
      </div>

      {/* Tags list */}
      {tagData.length === 0 ? (
        <div className="text-center py-16">
          <TagIcon size={24} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {search ? `No tags matching "${search}"` : 'No tags yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {tagData.map(({ tag, count }, idx) => (
            <button
              key={tag}
              onClick={() => onSelectTag(tag)}
              className={`w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-muted/50 transition-colors ${
                idx < tagData.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Bar visualization */}
                <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/40 rounded-full"
                    style={{ width: `${Math.min(100, (count / tagData[0].count) * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-mono text-foreground">{tag}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">{count} bookmark{count !== 1 ? 's' : ''}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
