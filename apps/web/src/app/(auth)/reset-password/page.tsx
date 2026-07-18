"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { apiClient } from "@/lib/api-client";

function ResetPasswordForm(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }
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
      await apiClient.auth.confirmPasswordReset({ token, new_password: password });
      setSuccess(true);
      setTimeout(() => router.push("/sign-in"), 2500);
    } catch {
      setError("Reset link is invalid or has expired. Please request a new one.");
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="auth-success" style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="23" stroke="#34d399" strokeWidth="1.5" />
            <path
              d="M14 24l7 7 14-16"
              stroke="#34d399"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f1f5f9", margin: "0 0 0.5rem" }}>
          Password updated!
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.875rem" }}>Redirecting you to sign in…</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ marginBottom: "1.75rem" }}>
        <h1
          style={{
            fontSize: "1.625rem",
            fontWeight: 700,
            color: "#f1f5f9",
            letterSpacing: "-0.03em",
            margin: "0 0 0.375rem",
          }}
        >
          Set new password
        </h1>
        <p style={{ fontSize: "0.875rem", color: "#64748b", margin: 0 }}>
          Choose a strong password for your account
        </p>
      </div>

      {!token && (
        <div className="auth-error" role="alert" style={{ marginBottom: "1.25rem" }}>
          Invalid reset link.{" "}
          <Link href="/forgot-password" style={{ color: "#818cf8" }}>
            Request a new one
          </Link>
          .
        </div>
      )}

      {error && (
        <div className="auth-error" role="alert" style={{ marginBottom: "1.25rem" }}>
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}
        noValidate
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label
            htmlFor="password"
            style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#94a3b8" }}
          >
            New password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            required
            disabled={isLoading || !token}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <label
            htmlFor="confirm-password"
            style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#94a3b8" }}
          >
            Confirm password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="auth-input"
            placeholder="Re-enter password"
            autoComplete="new-password"
            required
            disabled={isLoading || !token}
          />
        </div>

        <button
          type="submit"
          className="auth-button auth-button--primary"
          disabled={isLoading || !token}
          style={{ marginTop: "0.25rem" }}
        >
          {isLoading ? (
            <>
              <span className="auth-spinner" aria-hidden /> Updating…
            </>
          ) : (
            "Update password"
          )}
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          fontSize: "0.875rem",
          color: "#475569",
          marginTop: "1.5rem",
          marginBottom: 0,
        }}
      >
        <Link href="/sign-in" style={{ color: "#818cf8", textDecoration: "none" }}>
          ← Back to sign in
        </Link>
      </p>

      <style>{`
        .auth-error { padding: 0.75rem 1rem; background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2); border-radius: 10px; color: #fca5a5; font-size: 0.875rem; }
        .auth-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(99,102,241,0.2); border-radius: 10px; padding: 0.65rem 0.875rem; font-size: 0.9375rem; color: #f1f5f9; outline: none; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; font-family: inherit; }
        .auth-input::placeholder { color: #334155; }
        .auth-input:focus { border-color: rgba(99,102,241,0.6); box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
        .auth-input:disabled { opacity: 0.5; cursor: not-allowed; }
        .auth-button { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.7rem 1.25rem; border-radius: 10px; font-size: 0.9375rem; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; font-family: inherit; width: 100%; }
        .auth-button--primary { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; box-shadow: 0 4px 16px rgba(99,102,241,0.35); }
        .auth-button--primary:hover:not(:disabled) { transform: translateY(-1px); }
        .auth-button:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}

export default function ResetPasswordPage(): React.ReactElement {
  return (
    <Suspense fallback={<div style={{ color: "#64748b", textAlign: "center" }}>Loading…</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
