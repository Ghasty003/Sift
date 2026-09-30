import { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPassword } from "../hooks/useAuth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const forgotPassword = useForgotPassword();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    forgotPassword.mutate(email, {
      onSuccess: () => setSubmitted(true),
      // The backend never reveals whether the email exists — show the
      // same success state either way, so don't branch on error here for
      // "email not found." A genuine network/server error is the only
      // case that should surface differently.
      onError: () => setSubmitted(true),
    });
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

        {submitted ? (
          <>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Check your email
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              If an account exists for <strong>{email}</strong>, we&apos;ve sent
              a link to reset your password. It&apos;ll expire in 30 minutes.
            </p>
            <Link
              to="/login"
              className="text-sm text-primary font-medium hover:opacity-70 transition-opacity"
            >
              Back to sign in
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              Forgot your password?
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              Enter your email and we&apos;ll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground transition-shadow"
                />
              </div>

              <button
                type="submit"
                disabled={forgotPassword.isPending || !email}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {forgotPassword.isPending ? "Sending…" : "Send reset link"}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              <Link
                to="/login"
                className="text-primary font-medium hover:opacity-70 transition-opacity"
              >
                Back to sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
