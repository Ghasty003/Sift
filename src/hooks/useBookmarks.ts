import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addBookmarkToCollection,
  addTagToBookmark,
  deleteBookmark,
  fetchBookmarks,
  fetchBookmarksByCollection,
  fetchFavoriteBookmarks,
  fetchInboxBookmarks,
  fetchUnreadBookmarks,
  removeTagFromBookmark,
  toggleBookmarkFavorite,
  toggleBookmarkRead,
  upsertBookmarkNote,
} from '../api/bookmarks';
import { queryKeys } from '../lib/queryKeys';

export function useBookmarks() {
  return useQuery({ queryKey: queryKeys.bookmarks.all, queryFn: fetchBookmarks });
}

export function useInboxBookmarks() {
  return useQuery({ queryKey: queryKeys.bookmarks.inbox, queryFn: fetchInboxBookmarks });
}

export function useFavoriteBookmarks() {
  return useQuery({ queryKey: queryKeys.bookmarks.favorites, queryFn: fetchFavoriteBookmarks });
}

export function useUnreadBookmarks() {
  return useQuery({ queryKey: queryKeys.bookmarks.unread, queryFn: fetchUnreadBookmarks });
}

export function useCollectionBookmarks(collectionId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.bookmarks.byCollection(collectionId ?? ''),
    queryFn: () => fetchBookmarksByCollection(collectionId as string),
    enabled: Boolean(collectionId),
  });
}

// Invalidates every bookmark list, since we don't know from the mutation
// alone which lists (all / inbox / favorites / unread / by-collection) a
// given bookmark currently appears in.
function useInvalidateAllBookmarkLists() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
}

export function useAddBookmarkToCollection() {
  const invalidate = useInvalidateAllBookmarkLists();

  return useMutation({
    mutationFn: ({ bookmarkId, collectionId }: { bookmarkId: string; collectionId: string }) =>
      addBookmarkToCollection(bookmarkId, collectionId),
    onSuccess: invalidate,
  });
}

export function useAddTagToBookmark() {
  const invalidate = useInvalidateAllBookmarkLists();

  return useMutation({
    mutationFn: ({ bookmarkId, tagId }: { bookmarkId: string; tagId: string }) =>
      addTagToBookmark(bookmarkId, tagId),
    onSuccess: invalidate,
  });
}

export function useUpsertBookmarkNote() {
  const invalidate = useInvalidateAllBookmarkLists();

  return useMutation({
    mutationFn: ({ bookmarkId, content }: { bookmarkId: string; content: string }) =>
      upsertBookmarkNote(bookmarkId, content),
    onSuccess: invalidate,
  });
}

// Favorite/read status affects which of the favorites/unread lists a
// bookmark appears in, so a broad invalidate is correct here, not just belt-
// and-suspenders. Could be swapped for a targeted setQueryData using the
// full bookmark the server returns, if this ever needs to feel snappier.
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
    mutationFn: ({ bookmarkId, tagId }: { bookmarkId: string; tagId: string }) =>
      removeTagFromBookmark(bookmarkId, tagId),
    onSuccess: invalidate,
  });
}
