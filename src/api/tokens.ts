import { apiClient } from '../lib/axios';

export interface ApiTokenSummary {
  tokenId: string;
  name: string;
  type: string;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
}

// ⚠️ ASSUMPTION — CreateApiTokenResponseDTO's field names weren't given,
// only its constructor call: `new CreateApiTokenResponseDTO(apiToken.getId(), rawToken, apiToken.getType(), apiToken.getName())`.
// Guessed at conventional Java record field names below. If the real JSON
// keys differ (e.g. "rawToken" instead of "token"), this is the one place
// to fix.
export interface CreateApiTokenResponse {
  id: string;
  token: string;
  type: string;
  name: string;
}

export async function createApiToken(payload: { type: string; name: string }): Promise<CreateApiTokenResponse> {
  const { data } = await apiClient.post<CreateApiTokenResponse>('/auth/tokens/create', payload);
  return data;
}

export async function fetchApiTokens(): Promise<ApiTokenSummary[]> {
  const { data } = await apiClient.get<ApiTokenSummary[]>('/auth/tokens');
  return data;
}

export async function revokeApiToken(tokenId: string): Promise<void> {
  await apiClient.post(`/auth/tokens/${tokenId}/revoke`);
}
