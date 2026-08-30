import React, { useState } from 'react';
import { ApiBookmark } from '../types/api';
import { TagIcon, SearchIcon } from '../icons';

interface TagsProps {
  bookmarks: ApiBookmark[];
  onSelectTag: (tagId: string) => void;
}

export default function Tags({ bookmarks, onSelectTag }: TagsProps) {
  const [search, setSearch] = useState('');

  // Derived entirely client-side from GET /bookmarks — there's no dedicated
  // "tags with counts" endpoint, and every bookmark already carries its full
  // tag list, so this mirrors exactly what the old mock data.ts did.
  const tagMap = new Map<string, { id: string; name: string; count: number; lastUsed: string }>();
  for (const b of bookmarks) {
    for (const tag of b.tags) {
      const existing = tagMap.get(tag.id);
      const isNewer = !existing || new Date(b.savedAt).getTime() > new Date(existing.lastUsed).getTime();
      tagMap.set(tag.id, {
        id: tag.id,
        name: tag.name,
        count: (existing?.count ?? 0) + 1,
        lastUsed: isNewer ? b.savedAt : existing!.lastUsed,
      });
    }
  }

  const tagData = Array.from(tagMap.values())
    .filter((t) => !search || t.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.count - a.count);

  const maxCount = tagData[0]?.count ?? 1;

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <TagIcon size={18} className="text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">Tags</h1>
          <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full ml-1">
            {tagMap.size}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">Tags help you connect bookmarks across collections.</p>
      </div>

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

      {tagData.length === 0 ? (
        <div className="text-center py-16">
          <TagIcon size={24} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {search ? `No tags matching "${search}"` : 'No tags yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {tagData.map((tag, idx) => (
            <button
              key={tag.id}
              onClick={() => onSelectTag(tag.id)}
              className={`w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-muted/50 transition-colors ${
                idx < tagData.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/40 rounded-full"
                    style={{ width: `${Math.min(100, (tag.count / maxCount) * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-mono text-foreground">#{tag.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{tag.count} bookmark{tag.count !== 1 ? 's' : ''}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
