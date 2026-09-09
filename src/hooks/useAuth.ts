import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginRequest, registerRequest } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import { currentUserKey } from "./useCurrentUser";
import type { AuthCredentials, RegisterCredentials } from "../types/api";

export function useLogin() {
  const setToken = useAuthStore((s) => s.setToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: AuthCredentials) => loginRequest(credentials),
    onSuccess: (data) => {
      setToken(data.accessToken);
      // Pre-seed the cache — the login response already carries the full
      // user record, so AppLayout/Sidebar/TopBar don't need to fire a
      // redundant GET /users/me the instant someone logs in.
      queryClient.setQueryData(currentUserKey, data.user);
    },
  });
}

export function useRegister() {
  const setToken = useAuthStore((s) => s.setToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      registerRequest(credentials),
    onSuccess: (data) => {
      setToken(data.accessToken);
      queryClient.setQueryData(currentUserKey, data.user);
    },
  });
}
