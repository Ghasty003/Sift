import { apiClient } from "../lib/axios";
import type {
  AuthCredentials,
  RegisterCredentials,
  AuthResponse,
} from "../types/api";

export async function loginRequest(
  credentials: AuthCredentials,
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(
    "/auth/login",
    credentials,
  );
  return data;
}

export async function registerRequest(
  credentials: RegisterCredentials,
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(
    "/auth/register",
    credentials,
  );
  return data;
}

export async function logoutRequest(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function googleLoginRequest(
  idToken: string,
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/google", {
    idToken,
  });
  return data;
}

export async function forgotPasswordRequest(email: string): Promise<void> {
  await apiClient.post("/auth/forgot-password", { email });
}

export async function resetPasswordRequest(
  token: string,
  newPassword: string,
): Promise<void> {
  await apiClient.post("/auth/reset-password", { token, newPassword });
}
