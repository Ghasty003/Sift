import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { queryClient } from "@/lib/queryClient";
import { router } from "@/routes";
import { useAuthBootstrap } from "@/hooks/useAuthBootstrap";
import { ToastProvider } from "./components/Toast";

function AuthGate({ children }: { children: React.ReactNode }) {
  const isChecking = useAuthBootstrap();

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <ToastProvider>
      <QueryClientProvider client={queryClient}>
        <AuthGate>
          <RouterProvider router={router} />
        </AuthGate>
      </QueryClientProvider>
    </ToastProvider>
  );
}
