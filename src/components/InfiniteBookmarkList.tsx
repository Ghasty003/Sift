import { useEffect, useRef } from "react";
import BookmarkCard from "./BookmarkCard";
import { ApiBookmark, ApiCollection } from "../types/api";
import { CursorPage } from "../api/bookmarks";
import { InfiniteData } from "@tanstack/react-query";
import SiftLoader from "./SiftLoader";
import { CheckCircleIcon, CircleIcon } from "../icons";

interface InfiniteBookmarkListProps {
  data: InfiniteData<CursorPage<ApiBookmark>> | undefined;
  collections: ApiCollection[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  isError?: boolean;
  onRetry?: () => void;
  fetchNextPage: () => void;
  emptyState: React.ReactNode;
  selectMode?: boolean;
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
}

export default function InfiniteBookmarkList({
  data,
  collections,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  isError = false,
  onRetry,
  fetchNextPage,
  emptyState,
  selectMode = false,
  selectedIds = [],
  onToggleSelect,
}: InfiniteBookmarkListProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <SiftLoader label="Loading your bookmarks…" />;
  }

  if (isError) {
    return (
      <div className="text-center py-16">
        <p className="text-sm font-medium text-foreground mb-1">
          Couldn&apos;t load your bookmarks
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Check your connection and try again.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 text-sm border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  const bookmarks = data?.pages.flatMap((page) => page.items) ?? [];

  if (bookmarks.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((b) => (
        <div key={b.id} className="flex items-start gap-2">
          {selectMode && (
            <button
              onClick={() => onToggleSelect?.(b.id)}
              className="mt-6 shrink-0 text-muted-foreground hover:text-primary transition-colors"
            >
              {selectedIds.includes(b.id) ? (
                <CheckCircleIcon size={18} className="text-primary" />
              ) : (
                <CircleIcon size={18} />
              )}
            </button>
          )}
          <div className="flex-1 min-w-0">
            <BookmarkCard bookmark={b} collections={collections} />
          </div>
        </div>
      ))}
      <div ref={sentinelRef} aria-hidden className="h-px" />
      {isFetchingNextPage && (
        <p className="text-center text-sm text-muted-foreground py-4">
          Loading more…
        </p>
      )}
    </div>
  );
}
