"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { createAuthClient, apiClient } from "@/lib/api-client";

function JoinWorkspaceContent(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [status, setStatus] = useState<"loading" | "preview" | "accepting" | "success" | "error">(
    token ? "loading" : "error"
  );
  const [invitationInfo, setInvitationInfo] = useState<{ email: string; orgName?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) { setStatus("error"); return; }
    apiClient.invitations
      .getByToken(token)
      .then((inv) => {
        setInvitationInfo({ email: inv.email });
        setStatus("preview");
      })
      .catch(() => {
        setError("Invitation not found or has expired.");
        setStatus("error");
      });
  }, [token]);

  async function handleAccept(): Promise<void> {
    setStatus("accepting");
    try {
      const accessToken = getAccessToken();
      if (!accessToken) { router.push(`/sign-in?redirect=/join?token=${token}`); return; }
      const client = createAuthClient(accessToken);
      await client.invitations.accept(token);
      setStatus("success");
      setTimeout(() => router.push("/"), 2000);
    } catch {
      setError("Failed to accept invitation. Please try again.");
      setStatus("preview");
    }
  }

  if (status === "loading") {
    return (
      <div style={{ textAlign: "center", color: "#64748b" }}>
        <div className="join-spinner" aria-label="Loading invitation…" />
        <p style={{ marginTop: "1rem" }}>Loading invitation…</p>
        <SpinnerStyle />
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="join-card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
        <h1 className="join-title">You&apos;re in!</h1>
        <p className="join-subtitle">You&apos;ve successfully joined the organization. Redirecting…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="join-card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>❌</div>
        <h1 className="join-title">Invalid invitation</h1>
        <p className="join-subtitle">
          {error ?? "This invitation link is no longer valid."}
        </p>
        <a href="/sign-in" className="join-button" style={{ marginTop: "1.5rem", textDecoration: "none", display: "inline-flex" }}>
          Go to sign in
        </a>
      </div>
    );
  }

  return (
    <div className="join-card">
      <div className="join-envelope" aria-hidden>✉️</div>
      <h1 className="join-title">You&apos;ve been invited</h1>
      <p className="join-subtitle">
        You have been invited to join an organization on Cognix.
        {invitationInfo?.email && (
          <> The invitation was sent to <strong style={{ color: "#94a3b8" }}>{invitationInfo.email}</strong>.</>
        )}
      </p>

      {error && <div className="join-error">{error}</div>}

      <div className="join-actions">
        <button
          onClick={handleAccept}
          className="join-button"
          disabled={status === "accepting"}
        >
          {status === "accepting" ? (
            <><span className="join-btn-spinner" aria-hidden /> Joining…</>
          ) : (
            "Accept invitation"
          )}
        </button>
        <a href="/" className="join-link">Decline</a>
      </div>

      <style>{`
        .join-card { background: rgba(15,15,25,0.9); backdrop-filter: blur(20px); border: 1px solid rgba(99,102,241,0.15); border-radius: 24px; padding: 2.5rem; box-shadow: 0 24px 64px rgba(0,0,0,0.5); text-align: center; }
        .join-envelope { font-size: 3rem; margin-bottom: 1rem; }
        .join-title { font-size: 1.625rem; font-weight: 700; color: #f1f5f9; letter-spacing: -0.03em; margin: 0 0 0.625rem; }
        .join-subtitle { font-size: 0.9rem; color: #64748b; line-height: 1.7; margin: 0 0 1.75rem; }
        .join-error { padding: 0.75rem 1rem; background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2); border-radius: 10px; color: #fca5a5; font-size: 0.875rem; margin-bottom: 1.25rem; }
        .join-actions { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .join-button { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.8rem 2.5rem; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; font-family: inherit; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; box-shadow: 0 4px 20px rgba(99,102,241,0.4); }
        .join-button:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(99,102,241,0.5); }
        .join-button:disabled { opacity: 0.6; cursor: not-allowed; }
        .join-link { color: #475569; font-size: 0.875rem; text-decoration: none; transition: color 0.2s; }
        .join-link:hover { color: #64748b; }
        .join-btn-spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .join-spinner { display: inline-block; width: 36px; height: 36px; border: 3px solid rgba(99,102,241,0.2); border-top-color: #6366f1; border-radius: 50%; animation: spin 0.9s linear infinite; margin: 0 auto; display: block; }
      `}</style>
    </div>
  );
}

function SpinnerStyle(): React.ReactElement {
  return (
    <style>{`
      .join-spinner { display: block; width: 36px; height: 36px; border: 3px solid rgba(99,102,241,0.2); border-top-color: #6366f1; border-radius: 50%; animation: spin 0.9s linear infinite; margin: 0 auto; }
      @keyframes spin { to { transform: rotate(360deg); } }
    `}</style>
  );
}

export default function JoinWorkspacePage(): React.ReactElement {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", color: "#64748b" }}>Loading…</div>}>
      <JoinWorkspaceContent />
    </Suspense>
  );
}
