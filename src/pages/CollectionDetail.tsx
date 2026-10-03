import { useState } from "react";
import { ApiCollection } from "../types/api";
import { ArrowLeftIcon, FolderIcon, EyeOffIcon } from "../icons";
import {
  useCollectionBookmarksList,
  useInboxBookmarksList,
} from "../hooks/useBookmarks";
import InfiniteBookmarkList from "../components/InfiniteBookmarkList";
import SiftLoader from "../components/SiftLoader";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

interface CollectionDetailProps {
  collection:
    | ApiCollection
    | { id: "inbox"; name: string; description: string };
  allCollections: ApiCollection[];
  onBack: () => void;
}

export default function CollectionDetail({
  collection,
  allCollections,
  onBack,
}: CollectionDetailProps) {
  const [search, setSearch] = useState("");
  const isInbox = collection.id === "inbox";
  const debouncedSearch = useDebouncedValue(search.trim(), 250);

  const inboxQuery = useInboxBookmarksList(
    "newest",
    debouncedSearch || undefined,
  );
  const namedQuery = useCollectionBookmarksList(
    isInbox ? undefined : collection.id,
    debouncedSearch || undefined,
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    isInbox ? inboxQuery : namedQuery;

  const allBookmarks = data?.pages.flatMap((p) => p.items) ?? [];

  const bookmarkCount =
    "bookmarkCount" in collection ? collection.bookmarkCount : undefined;
  const unreadCount =
    "unreadCount" in collection ? collection.unreadCount : undefined;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeftIcon size={14} />
        Collections
      </button>

      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
            <FolderIcon size={15} className="text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {collection.name}
          </h1>
        </div>
        {collection.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {collection.description}
          </p>
        )}
        {bookmarkCount !== undefined && (
          <div className="flex items-center gap-4 mt-3">
            <span className="text-sm text-muted-foreground">
              {bookmarkCount} bookmarks
            </span>
            {!!unreadCount && (
              <span className="flex items-center gap-1.5 text-sm text-primary">
                <EyeOffIcon size={13} />
                {unreadCount} unread
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search in this collection..."
          className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
        />
      </div>

      {isLoading ? (
        <SiftLoader label="Loading this collection…" />
      ) : debouncedSearch && allBookmarks.length === 0 ? (
        <div className="text-center py-16">
          <FolderIcon
            size={24}
            className="text-muted-foreground mx-auto mb-3"
          />
          <p className="text-sm text-muted-foreground">
            No results for &ldquo;{search}&rdquo;
          </p>
        </div>
      ) : (
        <InfiniteBookmarkList
          data={data}
          collections={allCollections}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={false}
          fetchNextPage={fetchNextPage}
          emptyState={
            <div className="text-center py-16">
              <FolderIcon
                size={24}
                className="text-muted-foreground mx-auto mb-3"
              />
              <p className="text-sm text-muted-foreground">
                This collection is empty.
              </p>
            </div>
          }
        />
      )}
    </div>
  );
}
