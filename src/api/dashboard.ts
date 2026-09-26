import { apiClient } from "../lib/axios";
import type { ApiBookmark } from "../types/api";

export interface CollectionSummary {
  id: string;
  name: string;
  bookmarkCount: number;
  unreadCount: number;
}

export interface TagSummary {
  id: string;
  name: string;
  bookmarkCount: number;
}

export interface DashboardSummary {
  totalBookmarks: number;
  inboxCount: number;
  favoriteCount: number;
  unreadCount: number;
  collectionCount: number;
  tagCount: number;
  recentBookmarks: ApiBookmark[];
  recentCollections: CollectionSummary[];
  popularTags: TagSummary[];
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await apiClient.get<DashboardSummary>("/dashboard/summary");
  return data;
}
