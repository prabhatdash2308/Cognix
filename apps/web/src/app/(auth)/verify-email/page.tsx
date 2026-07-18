"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";

function VerifyEmailContent(): React.ReactElement {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }
    apiClient.auth
      .verifyEmail({ token })
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", color: "#64748b" }}>
        <div className="verify-spinner" aria-label="Verifying…" />
        <p style={{ marginTop: "1rem" }}>Verifying your email…</p>
        <SpinnerStyle />
      </div>
    );
  }

  if (status === "success") {
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="25" stroke="#34d399" strokeWidth="1.5" opacity="0.4" />
            <circle cx="26" cy="26" r="20" fill="rgba(52,211,153,0.1)" />
            <path
              d="M17 26l6.5 6.5L36 19"
              stroke="#34d399"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f1f5f9", margin: "0 0 0.5rem" }}>
          Email verified!
        </h1>
        <p
          style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.75rem", lineHeight: 1.6 }}
        >
          Your email address has been successfully verified. You can now access all Cognix features.
        </p>
        <Link
          href="/sign-in"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.7rem 2rem",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            color: "white",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "0.9375rem",
            boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
            transition: "transform 0.2s",
          }}
        >
          Continue to sign in
        </Link>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <circle cx="26" cy="26" r="25" stroke="#f87171" strokeWidth="1.5" opacity="0.4" />
          <circle cx="26" cy="26" r="20" fill="rgba(248,113,113,0.08)" />
          <path
            d="M20 20l12 12M32 20L20 32"
            stroke="#f87171"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f1f5f9", margin: "0 0 0.5rem" }}>
        Verification failed
      </h1>
      <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "1.75rem", lineHeight: 1.6 }}>
        This verification link is invalid or has expired. Please request a new verification email.
      </p>
      <Link
        href="/sign-in"
        style={{ color: "#818cf8", textDecoration: "none", fontSize: "0.9rem" }}
      >
        ← Back to sign in
      </Link>
    </div>
  );
}

function SpinnerStyle(): React.ReactElement {
  return (
    <style>{`
      .verify-spinner {
        display: inline-block;
        width: 40px; height: 40px;
        border: 3px solid rgba(99,102,241,0.2);
        border-top-color: #6366f1;
        border-radius: 50%;
        animation: spin 0.9s linear infinite;
        margin: 0 auto;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
    `}</style>
  );
}

export default function VerifyEmailPage(): React.ReactElement {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", color: "#64748b" }}>Loading…</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
