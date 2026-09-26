import { useState } from "react";
import { ApiCollection } from "../types/api";
import { EyeOffIcon, CheckCircleIcon } from "../icons";
import { useToggleRead, useUnreadBookmarksList } from "../hooks/useBookmarks";
import InfiniteBookmarkList from "../components/InfiniteBookmarkList";

interface UnreadProps {
  collections: ApiCollection[];
}

export default function Unread({ collections }: UnreadProps) {
  const [search, setSearch] = useState("");
  const toggleRead = useToggleRead();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useUnreadBookmarksList();

  const allBookmarks = data?.pages.flatMap((p) => p.items) ?? [];
  const filtered = search
    ? allBookmarks.filter(
        (b) =>
          b.tweet.text.toLowerCase().includes(search.toLowerCase()) ||
          b.tweet.authorName.toLowerCase().includes(search.toLowerCase()),
      )
    : null;

  function markAllRead() {
    // Only marks whatever's currently loaded (and matches the active
    // search, if any) — with infinite scroll there's no guaranteed access
    // to every unread bookmark at once without loading every page first.
    // A true "mark all read" would need a dedicated bulk backend endpoint;
    // flagging rather than silently limiting scope further.
    const target = filtered ?? allBookmarks;
    target.forEach((b) => toggleRead.mutate(b.id));
  }

  const visibleCount = (filtered ?? allBookmarks).length;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <EyeOffIcon size={18} className="text-muted-foreground" />
            <h1 className="text-2xl font-bold text-foreground">Unread</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Bookmarks waiting to be read.
          </p>
        </div>
        {visibleCount > 0 && (
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

      {filtered !== null && filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
            <EyeOffIcon size={22} className="text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">
            No results
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Try a different search.
          </p>
        </div>
      ) : (
        <InfiniteBookmarkList
          data={
            filtered !== null
              ? {
                  pages: [
                    { items: filtered, nextCursor: null, hasMore: false },
                  ],
                  pageParams: [undefined],
                }
              : data
          }
          collections={collections}
          hasNextPage={filtered === null && hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
          emptyState={
            <div className="text-center py-16">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
                <EyeOffIcon size={22} className="text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">
                All caught up
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                No unread bookmarks. You're all caught up.
              </p>
            </div>
          }
        />
      )}
    </div>
  );
}
