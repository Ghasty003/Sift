import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCollection, deleteCollection, fetchCollections } from '../api/collections';
import { queryKeys } from '../lib/queryKeys';
import type { CreateCollectionPayload } from '../types/api';

export function useCollections() {
  return useQuery({ queryKey: queryKeys.collections.all, queryFn: fetchCollections });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCollectionPayload) => createCollection(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.collections.all }),
  });
}

// Deleting a collection sets `collection = null` on every bookmark that was
// in it (moving them to Inbox) — so both the collections list AND every
// bookmark list need invalidating, not just collections.all.
export function useDeleteCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectionId: string) => deleteCollection(collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.all });
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
}
