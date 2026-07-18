"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";

export default function SignUpPage(): React.ReactElement {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordStrength = getPasswordStrength(password);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password, name);
      router.push("/create-organization");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="auth-form-header">
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Start building with AI-powered teams</p>
      </div>

      {error && (
        <div className="auth-error" role="alert">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <circle cx="8" cy="8" r="7" stroke="#f87171" strokeWidth="1.5" />
            <path d="M8 5v4M8 10.5v.5" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="auth-field">
          <label htmlFor="name" className="auth-label">Full name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="auth-input"
            placeholder="Jane Smith"
            autoComplete="name"
            required
            disabled={isLoading}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="email" className="auth-label">Work email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            placeholder="jane@company.com"
            autoComplete="email"
            required
            disabled={isLoading}
          />
        </div>

        <div className="auth-field">
          <label htmlFor="password" className="auth-label">Password</label>
          <div className="auth-input-group">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input auth-input--password"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
          {password && (
            <div className="auth-strength">
              <div className="auth-strength-bars">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className={`auth-strength-bar ${n <= passwordStrength.score ? `auth-strength-bar--${passwordStrength.level}` : ""}`}
                  />
                ))}
              </div>
              <span className={`auth-strength-label auth-strength-label--${passwordStrength.level}`}>
                {passwordStrength.label}
              </span>
            </div>
          )}
        </div>

        <div className="auth-field">
          <label htmlFor="confirm-password" className="auth-label">Confirm password</label>
          <input
            id="confirm-password"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`auth-input ${confirmPassword && confirmPassword !== password ? "auth-input--error" : ""}`}
            placeholder="Re-enter password"
            autoComplete="new-password"
            required
            disabled={isLoading}
          />
        </div>

        <p className="auth-terms">
          By creating an account, you agree to our{" "}
          <a href="/terms" className="auth-link">Terms of Service</a> and{" "}
          <a href="/privacy" className="auth-link">Privacy Policy</a>.
        </p>

        <button
          type="submit"
          className="auth-button auth-button--primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <><span className="auth-spinner" aria-hidden /> Creating account…</>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="auth-footer-text">
        Already have an account?{" "}
        <Link href="/sign-in" className="auth-link">Sign in</Link>
      </p>

      <style>{`
        .auth-form-header { margin-bottom: 1.75rem; }
        .auth-title { font-size: 1.625rem; font-weight: 700; color: #f1f5f9; letter-spacing: -0.03em; margin: 0 0 0.375rem; }
        .auth-subtitle { font-size: 0.875rem; color: #64748b; margin: 0; }
        .auth-error { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1rem; background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2); border-radius: 10px; color: #fca5a5; font-size: 0.875rem; margin-bottom: 1.25rem; }
        .auth-form { display: flex; flex-direction: column; gap: 1.125rem; }
        .auth-field { display: flex; flex-direction: column; gap: 0.4rem; }
        .auth-label { font-size: 0.8125rem; font-weight: 500; color: #94a3b8; }
        .auth-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(99,102,241,0.2); border-radius: 10px; padding: 0.65rem 0.875rem; font-size: 0.9375rem; color: #f1f5f9; outline: none; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; font-family: inherit; }
        .auth-input::placeholder { color: #334155; }
        .auth-input:focus { border-color: rgba(99,102,241,0.6); box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
        .auth-input--error { border-color: rgba(248,113,113,0.4) !important; }
        .auth-input:disabled { opacity: 0.5; cursor: not-allowed; }
        .auth-input--password { padding-right: 2.75rem; }
        .auth-input-group { position: relative; }
        .auth-password-toggle { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 1rem; padding: 0.25rem; display: flex; align-items: center; }
        .auth-strength { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.35rem; }
        .auth-strength-bars { display: flex; gap: 4px; flex: 1; }
        .auth-strength-bar { height: 3px; flex: 1; border-radius: 99px; background: rgba(255,255,255,0.08); transition: background 0.3s; }
        .auth-strength-bar--weak { background: #f87171; }
        .auth-strength-bar--fair { background: #fbbf24; }
        .auth-strength-bar--good { background: #34d399; }
        .auth-strength-bar--strong { background: #6366f1; }
        .auth-strength-label { font-size: 0.75rem; font-weight: 500; }
        .auth-strength-label--weak { color: #f87171; }
        .auth-strength-label--fair { color: #fbbf24; }
        .auth-strength-label--good { color: #34d399; }
        .auth-strength-label--strong { color: #818cf8; }
        .auth-terms { font-size: 0.8rem; color: #475569; margin: 0; line-height: 1.5; }
        .auth-link { color: #818cf8; text-decoration: none; transition: color 0.2s; }
        .auth-link:hover { color: #a5b4fc; }
        .auth-button { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.7rem 1.25rem; border-radius: 10px; font-size: 0.9375rem; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; font-family: inherit; margin-top: 0.25rem; }
        .auth-button--primary { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; box-shadow: 0 4px 16px rgba(99,102,241,0.35); }
        .auth-button--primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(99,102,241,0.45); }
        .auth-button:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .auth-footer-text { text-align: center; font-size: 0.875rem; color: #475569; margin-top: 1.5rem; margin-bottom: 0; }
      `}</style>
    </>
  );
}

function getPasswordStrength(password: string): {
  score: number;
  level: "weak" | "fair" | "good" | "strong";
  label: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const capped = Math.min(score, 4) as 0 | 1 | 2 | 3 | 4;
  const map: Record<number, { level: "weak" | "fair" | "good" | "strong"; label: string }> = {
    0: { level: "weak", label: "Too weak" },
    1: { level: "weak", label: "Weak" },
    2: { level: "fair", label: "Fair" },
    3: { level: "good", label: "Good" },
    4: { level: "strong", label: "Strong" },
  };
  return { score: capped, ...map[capped]! };
}
