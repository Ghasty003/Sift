import { apiClient } from "../lib/axios";
import type { ApiBookmark, ApiNote } from "../types/api";

export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface BookmarkFilters {
  collectionId?: string; // 'inbox' or a collection UUID
  tagId?: string;
  read?: boolean;
  favoriteOnly?: boolean;
  search?: string;
  cursor?: string;
  limit?: number;
}

export async function fetchBookmarksPage(
  filters: BookmarkFilters,
): Promise<CursorPage<ApiBookmark>> {
  const { data } = await apiClient.get<CursorPage<ApiBookmark>>("/bookmarks", {
    params: filters,
  });
  return data;
}

export async function addBookmarkToCollection(
  bookmarkId: string,
  collectionId: string,
): Promise<void> {
  await apiClient.patch(`/bookmarks/${bookmarkId}/collection/${collectionId}`);
}

export async function addTagToBookmark(
  bookmarkId: string,
  tagId: string,
): Promise<void> {
  await apiClient.post(`/bookmarks/${bookmarkId}/tags`, { tagId });
}

export async function upsertBookmarkNote(
  bookmarkId: string,
  content: string,
): Promise<ApiNote> {
  const { data } = await apiClient.put<ApiNote>(
    `/bookmarks/${bookmarkId}/note`,
    { content },
  );
  return data;
}

export async function toggleBookmarkFavorite(
  bookmarkId: string,
): Promise<ApiBookmark> {
  const { data } = await apiClient.patch<ApiBookmark>(
    `/bookmarks/${bookmarkId}/favorite`,
  );
  return data;
}

export async function toggleBookmarkRead(
  bookmarkId: string,
): Promise<ApiBookmark> {
  const { data } = await apiClient.patch<ApiBookmark>(
    `/bookmarks/${bookmarkId}/read`,
  );
  return data;
}

export async function deleteBookmark(bookmarkId: string): Promise<void> {
  await apiClient.delete(`/bookmarks/${bookmarkId}`);
}

export async function removeTagFromBookmark(
  bookmarkId: string,
  tagId: string,
): Promise<void> {
  await apiClient.delete(`/bookmarks/${bookmarkId}/tags/${tagId}`);
}
