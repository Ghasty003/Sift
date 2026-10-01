import { useState } from "react";
import { ApiCollection, ApiTag } from "../types/api";
import { BookmarkIcon, XIcon } from "../icons";
import { useAllBookmarksList } from "../hooks/useBookmarks";
import InfiniteBookmarkList from "../components/InfiniteBookmarkList";
import { useSearchParams } from "react-router-dom";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

interface AllBookmarksProps {
  collections: ApiCollection[];
  allTags: ApiTag[];
}

export default function AllBookmarks({
  collections,
  allTags,
}: AllBookmarksProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") ?? "";
  function setSearch(value: string) {
    setSearchParams(value ? { q: value } : {}, { replace: true });
  }
  const debouncedSearch = useDebouncedValue(search.trim(), 250);

  const [filterCollection, setFilterCollection] = useState(""); // '' | 'inbox' | collection id
  const [filterTag, setFilterTag] = useState("");
  const [filterRead, setFilterRead] = useState<"all" | "read" | "unread">(
    "all",
  );
  const [filterFavorite, setFilterFavorite] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useAllBookmarksList({
      collectionId: filterCollection || undefined,
      tagId: filterTag || undefined,
      read: filterRead === "all" ? undefined : filterRead === "read",
      favoriteOnly: filterFavorite,
      search: debouncedSearch || undefined,
    });

  const activeFilters = [
    filterCollection === "inbox"
      ? "Inbox"
      : collections.find((c) => c.id === filterCollection)?.name,
    filterTag
      ? `#${allTags.find((t) => t.id === filterTag)?.name ?? ""}`
      : undefined,
    filterRead !== "all" && filterRead,
    filterFavorite && "Favorites",
  ].filter(Boolean) as string[];

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BookmarkIcon size={18} className="text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">All Bookmarks</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Every bookmark, across all collections.
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search all bookmarks..."
          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
        />

        <div className="flex flex-wrap gap-2">
          <select
            value={filterCollection}
            onChange={(e) => setFilterCollection(e.target.value)}
            className="px-3 py-1.5 text-xs border border-border rounded-lg bg-card text-foreground focus:outline-none"
          >
            <option value="">All collections</option>
            <option value="inbox">Inbox</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="px-3 py-1.5 text-xs border border-border rounded-lg bg-card text-foreground focus:outline-none"
          >
            <option value="">All tags</option>
            {allTags.map((t) => (
              <option key={t.id} value={t.id}>
                #{t.name}
              </option>
            ))}
          </select>

          <select
            value={filterRead}
            onChange={(e) =>
              setFilterRead(e.target.value as "all" | "read" | "unread")
            }
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
                ? "border-amber-400 bg-amber-50 text-amber-700"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            ★ Favorites only
          </button>

          {activeFilters.length > 0 && (
            <button
              onClick={() => {
                setFilterCollection("");
                setFilterTag("");
                setFilterRead("all");
                setFilterFavorite(false);
              }}
              className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <XIcon size={11} /> Clear filters
            </button>
          )}
        </div>
      </div>

      <InfiniteBookmarkList
        data={data}
        collections={collections}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        isLoading={isLoading}
        emptyState={
          <div className="text-center py-16">
            <BookmarkIcon
              size={24}
              className="text-muted-foreground mx-auto mb-3"
            />
            <p className="text-sm font-medium text-foreground mb-1">
              No bookmarks found
            </p>
            <p className="text-sm text-muted-foreground">
              Try another search or remove some filters.
            </p>
          </div>
        }
      />
    </div>
  );
}
