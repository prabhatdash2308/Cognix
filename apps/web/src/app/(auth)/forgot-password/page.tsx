"use client";

import { useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";

export default function ForgotPasswordPage(): React.ReactElement {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await apiClient.auth.requestPasswordReset({ email });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (submitted) {
    return (
      <>
        <div className="auth-success">
          <div className="auth-success-icon" aria-hidden>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="15" stroke="#34d399" strokeWidth="1.5" />
              <path d="M10 16l4.5 4.5L22 11" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="auth-title">Check your inbox</h1>
          <p className="auth-subtitle">
            If <strong>{email}</strong> has an account, we&apos;ve sent a reset link.
            Check your spam folder if you don&apos;t see it.
          </p>
          <Link href="/sign-in" className="auth-button auth-button--secondary auth-button--block" style={{ textDecoration: "none", marginTop: "1.5rem", display: "flex" }}>
            ← Back to sign in
          </Link>
        </div>
        <SuccessStyles />
      </>
    );
  }

  return (
    <>
      <div className="auth-form-header">
        <h1 className="auth-title">Reset your password</h1>
        <p className="auth-subtitle">
          Enter your email and we&apos;ll send a reset link
        </p>
      </div>

      {error && (
        <div className="auth-error" role="alert">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="auth-field">
          <label htmlFor="email" className="auth-label">Email address</label>
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

        <button
          type="submit"
          className="auth-button auth-button--primary"
          disabled={isLoading}
        >
          {isLoading ? <><span className="auth-spinner" aria-hidden /> Sending…</> : "Send reset link"}
        </button>
      </form>

      <p className="auth-footer-text">
        <Link href="/sign-in" className="auth-link">← Back to sign in</Link>
      </p>

      <FormStyles />
    </>
  );
}

function FormStyles(): React.ReactElement {
  return (
    <style>{`
      .auth-form-header { margin-bottom: 1.75rem; }
      .auth-title { font-size: 1.625rem; font-weight: 700; color: #f1f5f9; letter-spacing: -0.03em; margin: 0 0 0.375rem; }
      .auth-subtitle { font-size: 0.875rem; color: #64748b; margin: 0; line-height: 1.6; }
      .auth-error { padding: 0.75rem 1rem; background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2); border-radius: 10px; color: #fca5a5; font-size: 0.875rem; margin-bottom: 1.25rem; }
      .auth-form { display: flex; flex-direction: column; gap: 1.125rem; }
      .auth-field { display: flex; flex-direction: column; gap: 0.4rem; }
      .auth-label { font-size: 0.8125rem; font-weight: 500; color: #94a3b8; }
      .auth-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(99,102,241,0.2); border-radius: 10px; padding: 0.65rem 0.875rem; font-size: 0.9375rem; color: #f1f5f9; outline: none; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; font-family: inherit; }
      .auth-input::placeholder { color: #334155; }
      .auth-input:focus { border-color: rgba(99,102,241,0.6); box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
      .auth-input:disabled { opacity: 0.5; cursor: not-allowed; }
      .auth-button { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.7rem 1.25rem; border-radius: 10px; font-size: 0.9375rem; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; font-family: inherit; }
      .auth-button--primary { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; box-shadow: 0 4px 16px rgba(99,102,241,0.35); }
      .auth-button--primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(99,102,241,0.45); }
      .auth-button--secondary { background: rgba(255,255,255,0.06); color: #94a3b8; border: 1px solid rgba(255,255,255,0.08); }
      .auth-button--block { width: 100%; justify-content: center; }
      .auth-button:disabled { opacity: 0.6; cursor: not-allowed; }
      .auth-spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .auth-link { color: #818cf8; text-decoration: none; font-size: 0.875rem; transition: color 0.2s; }
      .auth-link:hover { color: #a5b4fc; }
      .auth-footer-text { text-align: center; font-size: 0.875rem; color: #475569; margin-top: 1.5rem; margin-bottom: 0; }
    `}</style>
  );
}

function SuccessStyles(): React.ReactElement {
  return (
    <style>{`
      .auth-success { text-align: center; }
      .auth-success-icon { display: flex; justify-content: center; margin-bottom: 1.25rem; }
      .auth-title { font-size: 1.625rem; font-weight: 700; color: #f1f5f9; letter-spacing: -0.03em; margin: 0 0 0.75rem; }
      .auth-subtitle { font-size: 0.9rem; color: #64748b; line-height: 1.7; }
      .auth-subtitle strong { color: #94a3b8; }
      .auth-button { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.7rem 1.25rem; border-radius: 10px; font-size: 0.9375rem; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; font-family: inherit; }
      .auth-button--secondary { background: rgba(255,255,255,0.06); color: #94a3b8; border: 1px solid rgba(255,255,255,0.08); }
    `}</style>
  );
}
