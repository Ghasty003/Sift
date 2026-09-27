import { ApiCollection } from "../types/api";
import { ArrowLeftIcon, TagIcon } from "../icons";
import { useTagBookmarksList } from "../hooks/useBookmarks";
import InfiniteBookmarkList from "../components/InfiniteBookmarkList";

interface TagDetailProps {
  tag: { id: string; name: string };
  collections: ApiCollection[];
  onBack: () => void;
}

export default function TagDetail({
  tag,
  collections,
  onBack,
}: TagDetailProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useTagBookmarksList(tag.id);

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
          <h1 className="text-2xl font-bold text-foreground font-mono">
            #{tag.name}
          </h1>
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
            <p className="text-sm text-muted-foreground">
              No bookmarks with this tag.
            </p>
          </div>
        }
      />
    </div>
  );
}
