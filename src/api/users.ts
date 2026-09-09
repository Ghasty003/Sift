import { apiClient } from "../lib/axios";
import type { CurrentUser } from "../types/api";

export async function fetchCurrentUser(): Promise<CurrentUser> {
  const { data } = await apiClient.get<CurrentUser>("/users/me");
  return data;
}
