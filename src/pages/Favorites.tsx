import { useState } from "react";
import { ApiCollection } from "../types/api";
import { StarIcon } from "../icons";
import { useFavoriteBookmarksList } from "../hooks/useBookmarks";
import InfiniteBookmarkList from "../components/InfiniteBookmarkList";
import SiftLoader from "../components/SiftLoader";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

interface FavoritesProps {
  collections: ApiCollection[];
}

export default function Favorites({ collections }: FavoritesProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 250);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFavoriteBookmarksList(debouncedSearch || undefined);

  const allBookmarks = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <StarIcon size={18} className="text-muted-foreground" filled />
          <h1 className="text-2xl font-bold text-foreground">Favorites</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Bookmarks you want to find quickly.
        </p>
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

      {isLoading ? (
        <SiftLoader label="Loading your favorites…" />
      ) : debouncedSearch && allBookmarks.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <StarIcon size={22} className="text-amber-400" filled />
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
          data={data}
          collections={collections}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={false}
          fetchNextPage={fetchNextPage}
          emptyState={
            <div className="text-center py-16">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
                <StarIcon size={22} className="text-amber-400" filled />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">
                No favorites yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Star a bookmark to save it here for quick access.
              </p>
            </div>
          }
        />
      )}
    </div>
  );
}
