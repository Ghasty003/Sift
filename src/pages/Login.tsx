import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "../icons";
import { useLogin } from "../hooks/useAuth";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useGoogleLogin } from "../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useLogin();

  const googleLogin = useGoogleLogin();

  function handleGoogleCredential(idToken: string) {
    setError("");
    googleLogin.mutate(idToken, {
      onSuccess: () => {
        const redirect = searchParams.get("redirect");
        navigate(redirect ? decodeURIComponent(redirect) : "/dashboard");
      },
      onError: () =>
        setError("Couldn't sign in with Google. Please try again."),
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setError("");

    login.mutate(
      { email, password },
      {
        onSuccess: () => {
          const redirect = searchParams.get("redirect");
          navigate(redirect ? decodeURIComponent(redirect) : "/dashboard");
        },
        onError: () => setError("Incorrect email or password."),
      },
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col w-120 shrink-0 bg-[#0D4440] text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <pattern
              id="grid"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 32 0 L 0 0 0 32"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative flex items-center gap-2.5 mb-16">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
            <svg
              width="16"
              height="16"
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
          <span className="text-lg font-bold tracking-tight">Sift</span>
        </div>

        <div className="relative flex-1 flex flex-col justify-center">
          <h1 className="text-4xl font-bold leading-tight mb-4 text-white">
            Your X bookmarks,
            <br />
            finally organized.
          </h1>
          <p className="text-[#A3C4C1] text-base leading-relaxed mb-12">
            Save, tag, and find posts from X — without the noise. A calm,
            focused workspace for your saved knowledge.
          </p>

          <div className="space-y-3">
            {[
              {
                emoji: "⚡",
                label: "Save from Chrome or iOS Share Sheet",
                sub: "One click, bookmark saved.",
              },
              {
                emoji: "📁",
                label: "Collections and tags",
                sub: "Structure your knowledge your way.",
              },
              {
                emoji: "🔍",
                label: "Search everything",
                sub: "Full-text across tweets, notes, and tags.",
              },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-start gap-3 bg-white/8 rounded-xl px-4 py-3"
              >
                <span className="text-base mt-0.5">{f.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-white">{f.label}</p>
                  <p className="text-xs text-[#A3C4C1] mt-0.5">{f.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-12">
          <p className="text-xs text-[#6EA8A4] italic">
            &ldquo;The right tweet at the right time — now you can actually find
            it.&rdquo;
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
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

          <h2 className="text-2xl font-bold text-foreground mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Sign in to your account to continue.
          </p>

          <div className="space-y-2.5 mb-6">
            <GoogleSignInButton
              onCredential={handleGoogleCredential}
              disabled={googleLogin.isPending}
            />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">
              or sign in with email
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                {error}
              </div>
            )}

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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:opacity-70 transition-opacity"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
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

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {login.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                    />
                  </svg>
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-primary font-medium hover:opacity-70 transition-opacity"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
