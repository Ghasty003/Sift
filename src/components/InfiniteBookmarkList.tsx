import { useEffect, useRef } from "react";
import BookmarkCard from "./BookmarkCard";
import { ApiBookmark, ApiCollection } from "../types/api";
import { CursorPage } from "../api/bookmarks";
import { InfiniteData } from "@tanstack/react-query";
import SiftLoader from "./SiftLoader";

interface InfiniteBookmarkListProps {
  data: InfiniteData<CursorPage<ApiBookmark>> | undefined;
  collections: ApiCollection[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  fetchNextPage: () => void;
  emptyState: React.ReactNode;
}

export default function InfiniteBookmarkList({
  data,
  collections,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  fetchNextPage,
  emptyState,
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

  const bookmarks = data?.pages.flatMap((page) => page.items) ?? [];

  if (bookmarks.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((b) => (
        <BookmarkCard key={b.id} bookmark={b} collections={collections} />
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
