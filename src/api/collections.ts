import { apiClient } from '../lib/axios';
import type { ApiCollection, CreateCollectionPayload } from '../types/api';

export async function fetchCollections(): Promise<ApiCollection[]> {
  const { data } = await apiClient.get<ApiCollection[]>('/collections');
  return data;
}

export async function createCollection(payload: CreateCollectionPayload): Promise<ApiCollection> {
  const { data } = await apiClient.post<ApiCollection>('/collections/create', payload);
  return data;
}

// ⚠️ ASSUMPTION — you described this as "goes to /api/v1/collections" without
// a path param, but every other resource in this API deletes/mutates via
// /{id}. Built as DELETE /collections/{id} to match that convention; flag it
// if the real route differs.
export async function deleteCollection(collectionId: string): Promise<void> {
  await apiClient.delete(`/collections/${collectionId}`);
}
