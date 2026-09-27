import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { EyeIcon, EyeOffIcon, CheckIcon } from "../icons";
import { useRegister } from "../hooks/useAuth";

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function XLogoIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "Contains a number", ok: /\d/.test(password) },
    { label: "Contains a letter", ok: /[a-zA-Z]/.test(password) },
  ];

  if (!password) return null;

  const score = checks.filter((c) => c.ok).length;
  const colors = ["bg-red-400", "bg-amber-400", "bg-primary"];
  const labels = ["Weak", "Fair", "Strong"];

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i < score ? colors[score - 1] : "bg-border"}`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-2 w-10">
          {labels[score - 1] ?? ""}
        </span>
      </div>
      <div className="space-y-1">
        {checks.map((c) => (
          <div key={c.label} className="flex items-center gap-1.5">
            <CheckIcon
              size={11}
              className={c.ok ? "text-primary" : "text-muted-foreground/40"}
            />
            <span
              className={`text-xs ${c.ok ? "text-muted-foreground" : "text-muted-foreground/50"}`}
            >
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Signup() {
  const [fullName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const register = useRegister();

  function validate() {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.name = "Name is required.";
    if (!email) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email))
      e.email = "Enter a valid email address.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 8)
      e.password = "Password must be at least 8 characters.";
    if (!agreed) e.agreed = "You must agree to the terms.";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    register.mutate(
      { email, password, fullName },
      {
        onSuccess: () => navigate("/dashboard"),
        onError: () =>
          setErrors({
            email: "Could not create account. Try a different email.",
          }),
      },
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex flex-col w-120 shrink-0 bg-[#0D4440] text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <pattern
              id="grid2"
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
            <rect width="100%" height="100%" fill="url(#grid2)" />
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
            Start building your
            <br />
            knowledge library.
          </h1>
          <p className="text-[#A3C4C1] text-base leading-relaxed mb-12">
            Save the posts that matter, organize them into collections, and
            actually find them again when you need them.
          </p>

          <div className="space-y-4">
            {[
              "Save posts with one click from Chrome or iOS",
              "Organize with collections and tags",
              "Add personal notes and context",
              "Search across everything you've saved",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/40 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckIcon size={11} className="text-white" />
                </div>
                <span className="text-sm text-[#C5DCDA]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mt-12 space-y-2">
          {[
            {
              author: "Julia Evans",
              handle: "@b0rk",
              snippet: "TCP slow start is wild...",
            },
            {
              author: "Dan Abramov",
              handle: "@dan_abramov",
              snippet: "People get confused by useEffect cleanup...",
            },
          ].map((card) => (
            <div
              key={card.author}
              className="bg-white/8 rounded-lg px-4 py-3 flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-white/20 shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-white">
                    {card.author}
                  </span>
                  <span className="text-xs text-[#6EA8A4]">{card.handle}</span>
                </div>
                <p className="text-xs text-[#A3C4C1] truncate">
                  {card.snippet}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-sm py-8">
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
            Create your account
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Get started — it&apos;s free.
          </p>

          <div className="space-y-2.5 mb-6">
            <button
              type="button"
              disabled
              title="Coming soon"
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-card border border-border rounded-lg text-sm font-medium text-muted-foreground opacity-50 cursor-not-allowed"
            >
              <GoogleIcon />
              Continue with Google
            </button>
            <button
              type="button"
              disabled
              title="Coming soon"
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 bg-foreground text-background rounded-lg text-sm font-medium opacity-50 cursor-not-allowed"
            >
              <XLogoIcon />
              Continue with X
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">
              or sign up with email
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Full name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Alex Chen"
                className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground transition-shadow ${
                  errors.name ? "border-red-400" : "border-border"
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

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
                className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground transition-shadow ${
                  errors.email ? "border-red-400" : "border-border"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  className={`w-full px-3 py-2.5 pr-10 text-sm border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground transition-shadow ${
                    errors.password ? "border-red-400" : "border-border"
                  }`}
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
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password}</p>
              )}
              <PasswordStrength password={password} />
            </div>

            <div>
              <label className="flex items-start gap-2.5 cursor-pointer group">
                <div className="relative mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                      agreed
                        ? "bg-primary border-primary"
                        : errors.agreed
                          ? "border-red-400 bg-card"
                          : "border-border bg-card group-hover:border-primary/50"
                    }`}
                  >
                    {agreed && <CheckIcon size={10} className="text-white" />}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  I agree to the{" "}
                  <span className="text-primary cursor-pointer hover:opacity-70">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-primary cursor-pointer hover:opacity-70">
                    Privacy Policy
                  </span>
                </span>
              </label>
              {errors.agreed && (
                <p className="text-xs text-red-600 mt-1 ml-6">
                  {errors.agreed}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={register.isPending}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {register.isPending ? (
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
                  Creating account…
                </span>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:opacity-70 transition-opacity"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
