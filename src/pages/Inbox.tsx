import { useState } from "react";
import { ApiCollection } from "../types/api";
import { InboxIcon } from "../icons";
import { useInboxBookmarksList } from "../hooks/useBookmarks";
import InfiniteBookmarkList from "../components/InfiniteBookmarkList";
import SiftLoader from "../components/SiftLoader";

interface InboxProps {
  collections: ApiCollection[];
}

export default function Inbox({ collections }: InboxProps) {
  const [search, setSearch] = useState("");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInboxBookmarksList();

  const allBookmarks = data?.pages.flatMap((p) => p.items) ?? [];
  const filtered = search
    ? allBookmarks.filter(
        (b) =>
          b.tweet.text.toLowerCase().includes(search.toLowerCase()) ||
          b.tweet.authorName.toLowerCase().includes(search.toLowerCase()) ||
          b.tweet.authorUsername.toLowerCase().includes(search.toLowerCase()),
      )
    : null;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <InboxIcon size={18} className="text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">Inbox</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Bookmarks you haven&apos;t organized yet.
        </p>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter inbox..."
          className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
        />
      </div>

      {isLoading ? (
        <SiftLoader label="Loading your inbox…" />
      ) : filtered !== null && filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm text-muted-foreground">
            No results for &ldquo;{search}&rdquo;
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
          isLoading={false}
          fetchNextPage={fetchNextPage}
          emptyState={<EmptyInbox />}
        />
      )}
    </div>
  );
}

function EmptyInbox() {
  return (
    <div className="text-center py-20">
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
        <InboxIcon size={22} className="text-muted-foreground" />
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1">
        Your Inbox is empty
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
        Save an X post using the browser extension or mobile Shortcut.
      </p>
    </div>
  );
}
