"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";

export default function SignInPage(): React.ReactElement {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await signIn(email, password, rememberMe);
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid email or password.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="auth-form-header">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your Cognix account</p>
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
          <label htmlFor="email" className="auth-label">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            placeholder="you@company.com"
            autoComplete="email"
            required
            disabled={isLoading}
          />
        </div>

        <div className="auth-field">
          <div className="auth-field-row">
            <label htmlFor="password" className="auth-label">Password</label>
            <Link href="/forgot-password" className="auth-link auth-link--small">
              Forgot password?
            </Link>
          </div>
          <div className="auth-input-group">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input auth-input--password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        <label className="auth-checkbox">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
          />
          <span>Remember me for 30 days</span>
        </label>

        <button
          type="submit"
          className="auth-button auth-button--primary"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="auth-spinner" aria-hidden /> Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <p className="auth-footer-text">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="auth-link">Sign up for free</Link>
      </p>

      <AuthFormStyles />
    </>
  );
}

function AuthFormStyles(): React.ReactElement {
  return (
    <style>{`
      .auth-form-header { margin-bottom: 1.75rem; }
      .auth-title {
        font-size: 1.625rem;
        font-weight: 700;
        color: #f1f5f9;
        letter-spacing: -0.03em;
        margin: 0 0 0.375rem;
      }
      .auth-subtitle {
        font-size: 0.875rem;
        color: #64748b;
        margin: 0;
      }
      .auth-error {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        background: rgba(248, 113, 113, 0.08);
        border: 1px solid rgba(248, 113, 113, 0.2);
        border-radius: 10px;
        color: #fca5a5;
        font-size: 0.875rem;
        margin-bottom: 1.25rem;
      }
      .auth-form { display: flex; flex-direction: column; gap: 1.125rem; }
      .auth-field { display: flex; flex-direction: column; gap: 0.4rem; }
      .auth-field-row { display: flex; align-items: center; justify-content: space-between; }
      .auth-label { font-size: 0.8125rem; font-weight: 500; color: #94a3b8; }
      .auth-input {
        width: 100%;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(99,102,241,0.2);
        border-radius: 10px;
        padding: 0.65rem 0.875rem;
        font-size: 0.9375rem;
        color: #f1f5f9;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
        box-sizing: border-box;
        font-family: inherit;
      }
      .auth-input::placeholder { color: #334155; }
      .auth-input:focus {
        border-color: rgba(99,102,241,0.6);
        box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
      }
      .auth-input:disabled { opacity: 0.5; cursor: not-allowed; }
      .auth-input--password { padding-right: 2.75rem; }
      .auth-input-group { position: relative; }
      .auth-password-toggle {
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        cursor: pointer;
        color: #475569;
        padding: 0.25rem;
        display: flex;
        align-items: center;
        transition: color 0.2s;
      }
      .auth-password-toggle:hover { color: #94a3b8; }
      .auth-checkbox {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        font-size: 0.8125rem;
        color: #64748b;
      }
      .auth-checkbox input[type="checkbox"] {
        width: 15px; height: 15px;
        accent-color: #6366f1;
        cursor: pointer;
      }
      .auth-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.7rem 1.25rem;
        border-radius: 10px;
        font-size: 0.9375rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
        font-family: inherit;
        margin-top: 0.25rem;
      }
      .auth-button--primary {
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        box-shadow: 0 4px 16px rgba(99,102,241,0.35);
      }
      .auth-button--primary:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 6px 24px rgba(99,102,241,0.45);
      }
      .auth-button--primary:active:not(:disabled) { transform: translateY(0); }
      .auth-button:disabled { opacity: 0.6; cursor: not-allowed; }
      .auth-spinner {
        display: inline-block;
        width: 16px; height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      .auth-link {
        color: #818cf8;
        text-decoration: none;
        font-size: 0.875rem;
        transition: color 0.2s;
      }
      .auth-link:hover { color: #a5b4fc; }
      .auth-link--small { font-size: 0.8125rem; }
      .auth-footer-text {
        text-align: center;
        font-size: 0.875rem;
        color: #475569;
        margin-top: 1.5rem;
        margin-bottom: 0;
      }
    `}</style>
  );
}
