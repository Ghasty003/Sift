import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "../icons";
import { useResetPassword } from "../hooks/useAuth";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);
  const resetPassword = useResetPassword();

  const mismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !newPassword || mismatch) return;

    resetPassword.mutate(
      { token, newPassword },
      { onSuccess: () => setDone(true) },
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Invalid reset link
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            This link is missing its reset token. Request a new one below.
          </p>
          <Link
            to="/forgot-password"
            className="text-sm text-primary font-medium hover:opacity-70 transition-opacity"
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6h16M4 12h8m-8 6h6" />
            </svg>
          </div>
          <span className="text-base font-bold text-foreground">Sift</span>
        </div>

        {done ? (
          <>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Password updated
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              You&apos;ve been signed out of all devices for security. Sign in
              again with your new password.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Go to sign in
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              Set a new password
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              Choose a new password for your account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {resetPassword.isError && (
                <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                  {(
                    resetPassword.error as {
                      response?: { data?: { message?: string } };
                    }
                  )?.response?.data?.message ??
                    "Couldn't reset password. The link may have expired."}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 pr-10 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground transition-shadow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOffIcon size={15} />
                    ) : (
                      <EyeIcon size={15} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Confirm new password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground transition-shadow"
                />
                {mismatch && (
                  <p className="text-xs text-red-600 mt-1">
                    Passwords don&apos;t match.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  resetPassword.isPending ||
                  !newPassword ||
                  !confirmPassword ||
                  mismatch
                }
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {resetPassword.isPending ? "Updating…" : "Update password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
