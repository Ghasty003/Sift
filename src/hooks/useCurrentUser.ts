import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "../api/users";
import { useAuthStore } from "../store/authStore";

export const currentUserKey = ["currentUser"] as const;

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: currentUserKey,
    queryFn: fetchCurrentUser,
    enabled: isAuthenticated,
  });
}
