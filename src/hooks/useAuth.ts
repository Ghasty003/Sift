import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginRequest, logoutRequest, registerRequest } from "../api/auth";
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

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logoutRequest(),
    onSettled: () => {
      // Clear local state regardless of whether the network call
      // succeeded — if the server's unreachable there's nothing more
      // useful to do than log out locally anyway.
      logout();
      queryClient.clear();
    },
  });
}
