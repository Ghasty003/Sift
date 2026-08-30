import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTag, fetchTags } from '../api/tags';
import { queryKeys } from '../lib/queryKeys';

export function useTags() {
  return useQuery({ queryKey: queryKeys.tags.all, queryFn: fetchTags });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createTag(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.tags.all }),
  });
}
