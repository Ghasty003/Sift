import { apiClient } from '../lib/axios';
import type { ApiTag } from '../types/api';

export async function fetchTags(): Promise<ApiTag[]> {
  const { data } = await apiClient.get<ApiTag[]>('/tags');
  return data;
}

export async function createTag(name: string): Promise<ApiTag> {
  const { data } = await apiClient.post<ApiTag>('/tags/create', { name });
  return data;
}
