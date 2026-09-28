import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addBookmarkToCollection,
  addTagToBookmark,
  BookmarkFilters,
  bulkDeleteBookmarks,
  bulkMoveBookmarks,
  deleteBookmark,
  fetchBookmarksPage,
  markAllBookmarksRead,
  removeTagFromBookmark,
  toggleBookmarkFavorite,
  toggleBookmarkRead,
  upsertBookmarkNote,
} from "../api/bookmarks";

function useBookmarkList(filters: BookmarkFilters, enabled = true) {
  return useInfiniteQuery({
    queryKey: ["bookmarks", "list", filters],
    queryFn: ({ pageParam }) =>
      fetchBookmarksPage({
        ...filters,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
    enabled,
  });
}

export function useAllBookmarksList(
  filters: Omit<BookmarkFilters, "collectionId"> & { collectionId?: string },
) {
  return useBookmarkList(filters);
}

export function useInboxBookmarksList(sort: "newest" | "oldest" = "newest") {
  return useBookmarkList({ collectionId: "inbox", sort });
}

export function useFavoriteBookmarksList() {
  return useBookmarkList({ favoriteOnly: true });
}

export function useUnreadBookmarksList() {
  return useBookmarkList({ read: false });
}

export function useCollectionBookmarksList(collectionId: string | undefined) {
  return useBookmarkList({ collectionId }, Boolean(collectionId));
}

function useInvalidateAllBookmarkLists() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
}

export function useAddBookmarkToCollection() {
  const invalidate = useInvalidateAllBookmarkLists();
  return useMutation({
    mutationFn: ({
      bookmarkId,
      collectionId,
    }: {
      bookmarkId: string;
      collectionId: string;
    }) => addBookmarkToCollection(bookmarkId, collectionId),
    onSuccess: invalidate,
  });
}

export function useAddTagToBookmark() {
  const invalidate = useInvalidateAllBookmarkLists();
  return useMutation({
    mutationFn: ({
      bookmarkId,
      tagId,
    }: {
      bookmarkId: string;
      tagId: string;
    }) => addTagToBookmark(bookmarkId, tagId),
    onSuccess: invalidate,
  });
}

export function useUpsertBookmarkNote() {
  const invalidate = useInvalidateAllBookmarkLists();
  return useMutation({
    mutationFn: ({
      bookmarkId,
      content,
    }: {
      bookmarkId: string;
      content: string;
    }) => upsertBookmarkNote(bookmarkId, content),
    onSuccess: invalidate,
  });
}

export function useToggleFavorite() {
  const invalidate = useInvalidateAllBookmarkLists();
  return useMutation({
    mutationFn: (bookmarkId: string) => toggleBookmarkFavorite(bookmarkId),
    onSuccess: invalidate,
  });
}

export function useToggleRead() {
  const invalidate = useInvalidateAllBookmarkLists();
  return useMutation({
    mutationFn: (bookmarkId: string) => toggleBookmarkRead(bookmarkId),
    onSuccess: invalidate,
  });
}

export function useDeleteBookmark() {
  const invalidate = useInvalidateAllBookmarkLists();
  return useMutation({
    mutationFn: (bookmarkId: string) => deleteBookmark(bookmarkId),
    onSuccess: invalidate,
  });
}

export function useRemoveTagFromBookmark() {
  const invalidate = useInvalidateAllBookmarkLists();
  return useMutation({
    mutationFn: ({
      bookmarkId,
      tagId,
    }: {
      bookmarkId: string;
      tagId: string;
    }) => removeTagFromBookmark(bookmarkId, tagId),
    onSuccess: invalidate,
  });
}

export function useTagBookmarksList(tagId: string | undefined) {
  return useBookmarkList({ tagId }, Boolean(tagId));
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllBookmarksRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useBulkDelete() {
  const invalidate = useInvalidateAllBookmarkLists();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookmarkIds: string[]) => bulkDeleteBookmarks(bookmarkIds),
    onSuccess: () => {
      invalidate();
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useBulkMove() {
  const invalidate = useInvalidateAllBookmarkLists();
  return useMutation({
    mutationFn: ({
      bookmarkIds,
      collectionId,
    }: {
      bookmarkIds: string[];
      collectionId: string;
    }) => bulkMoveBookmarks(bookmarkIds, collectionId),
    onSuccess: invalidate,
  });
}
