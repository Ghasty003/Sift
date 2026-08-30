import { useMutation } from "@tanstack/react-query";
import { loginRequest, registerRequest } from "../api/auth";
import { useAuthStore } from "@/store/authStore";
import type { AuthCredentials } from "../types/api";

export function useLogin() {
  const setToken = useAuthStore((s) => s.setToken);

  return useMutation({
    mutationFn: (credentials: AuthCredentials) => loginRequest(credentials),
    onSuccess: (data) => setToken(data.accessToken),
  });
}

export function useRegister() {
  const setToken = useAuthStore((s) => s.setToken);

  return useMutation({
    mutationFn: (credentials: AuthCredentials) => registerRequest(credentials),
    onSuccess: (data) => setToken(data.accessToken),
  });
}
