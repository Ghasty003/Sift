import { useEffect, useState } from "react";
import { apiClient } from "../lib/axios";
import { useAuthStore } from "../store/authStore";

/**
 * Runs once on app load. The access token lives in memory only, so a page
 * refresh always starts with none — this silently exchanges the httpOnly
 * refresh cookie (if a valid, unrevoked one exists) for a fresh access
 * token so the person isn't forced to log in again just from refreshing.
 * If there's no valid cookie, this leaves them logged out, same as before.
 */
export function useAuthBootstrap(): boolean {
  const setToken = useAuthStore((s) => s.setToken);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    apiClient
      .post<{ accessToken: string }>("/auth/refresh")
      .then(({ data }) => {
        if (!cancelled) setToken(data.accessToken);
      })
      .catch(() => {
        // No valid refresh cookie — nothing to do, stay logged out.
      })
      .finally(() => {
        if (!cancelled) setIsChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [setToken]);

  return isChecking;
}
