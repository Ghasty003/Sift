import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createApiToken, fetchApiTokens, revokeApiToken } from '../api/tokens';

const apiTokensKey = ['apiTokens'] as const;

export function useApiTokens() {
  return useQuery({ queryKey: apiTokensKey, queryFn: fetchApiTokens });
}

export function useCreateApiToken() {
  return useMutation({
    mutationFn: (payload: { type: string; name: string }) => createApiToken(payload),
  });
}

export function useRevokeApiToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tokenId: string) => revokeApiToken(tokenId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: apiTokensKey }),
  });
}
