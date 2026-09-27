import { apiClient } from "../lib/axios";
import type { CurrentUser } from "../types/api";

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const { data } = await apiClient.get<CurrentUser>("/users/me");
  return data;
}

export async function updateProfile(fullName: string): Promise<CurrentUser> {
  const { data } = await apiClient.patch<CurrentUser>("/users/me", {
    fullName,
  });
  return data;
}

export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  await apiClient.put("/users/me/password", payload);
}

export async function deleteAccount(): Promise<void> {
  await apiClient.delete("/users/me");
}
