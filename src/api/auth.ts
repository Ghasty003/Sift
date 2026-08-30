import { apiClient } from '../lib/axios';
import type { AuthCredentials, AuthResponse } from '../types/api';

export async function loginRequest(credentials: AuthCredentials): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
  return data;
}

export async function registerRequest(credentials: AuthCredentials): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', credentials);
  return data;
}
