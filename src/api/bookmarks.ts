import { apiClient } from '../lib/axios';
import type { ApiBookmark, ApiNote } from '../types/api';

export async function fetchBookmarks(): Promise<ApiBookmark[]> {
  const { data } = await apiClient.get<ApiBookmark[]>('/bookmarks');
  return data;
}

export async function fetchInboxBookmarks(): Promise<ApiBookmark[]> {
  const { data } = await apiClient.get<ApiBookmark[]>('/bookmarks/inbox');
  return data;
}

export async function fetchFavoriteBookmarks(): Promise<ApiBookmark[]> {
  const { data } = await apiClient.get<ApiBookmark[]>('/bookmarks/favorites');
  return data;
}

export async function fetchUnreadBookmarks(): Promise<ApiBookmark[]> {
  const { data } = await apiClient.get<ApiBookmark[]>('/bookmarks/unread');
  return data;
}

export async function fetchBookmarksByCollection(collectionId: string): Promise<ApiBookmark[]> {
  const { data } = await apiClient.get<ApiBookmark[]>(`/bookmarks/collection/${collectionId}`);
  return data;
}

// Spec says this returns nothing (204/empty body) — callers should
// invalidate the relevant queries rather than use a return value.
export async function addBookmarkToCollection(bookmarkId: string, collectionId: string): Promise<void> {
  await apiClient.patch(`/bookmarks/${bookmarkId}/collection/${collectionId}`);
}

// Spec says this returns nothing.
export async function addTagToBookmark(bookmarkId: string, tagId: string): Promise<void> {
  await apiClient.post(`/bookmarks/${bookmarkId}/tags`, { tagId });
}

export async function upsertBookmarkNote(bookmarkId: string, content: string): Promise<ApiNote> {
  const { data } = await apiClient.put<ApiNote>(`/bookmarks/${bookmarkId}/note`, { content });
  return data;
}

// Both toggle endpoints return the full updated bookmark — useful for
// optimistic-update-free correctness (we just take the server's word for it).
export async function toggleBookmarkFavorite(bookmarkId: string): Promise<ApiBookmark> {
  const { data } = await apiClient.patch<ApiBookmark>(`/bookmarks/${bookmarkId}/favorite`);
  return data;
}

export async function toggleBookmarkRead(bookmarkId: string): Promise<ApiBookmark> {
  const { data } = await apiClient.patch<ApiBookmark>(`/bookmarks/${bookmarkId}/read`);
  return data;
}

export async function deleteBookmark(bookmarkId: string): Promise<void> {
  await apiClient.delete(`/bookmarks/${bookmarkId}`);
}

// Backend: @DeleteMapping("/bookmarks/{bookmarkId}/tags/{tagId}"), 204 No Content.
export async function removeTagFromBookmark(bookmarkId: string, tagId: string): Promise<void> {
  await apiClient.delete(`/bookmarks/${bookmarkId}/tags/${tagId}`);
}
