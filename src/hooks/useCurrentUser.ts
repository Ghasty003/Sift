import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  deleteAccount,
  fetchCurrentUser,
  updateProfile,
} from "../api/users";
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

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fullName: string) => updateProfile(fullName),
    onSuccess: (data) => {
      queryClient.setQueryData(currentUserKey, data);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: { currentPassword: string; newPassword: string }) =>
      changePassword(payload),
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: () => deleteAccount(),
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });
}
