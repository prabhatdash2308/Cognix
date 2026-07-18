"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { createAuthClient } from "@/lib/api-client";

export default function CreateOrganizationPage(): React.ReactElement {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Derive slug preview from name
  const slugPreview = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 40);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const token = getAccessToken();
      if (!token) {
        router.push("/sign-in");
        return;
      }
      const client = createAuthClient(token);
      const org = await client.organizations.create({ name });
      // Store org ID for next step
      sessionStorage.setItem("__cognix_pending_org_id", org.id);
      router.push("/create-workspace");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to create organization. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="onboard-card">
      {/* Step indicator */}
      <div className="onboard-steps">
        <div className="onboard-step onboard-step--active">
          <div className="onboard-step-dot" />
          <span>Organization</span>
        </div>
        <div className="onboard-step-line" />
        <div className="onboard-step">
          <div className="onboard-step-dot" />
          <span>Workspace</span>
        </div>
      </div>

      {/* Icon */}
      <div className="onboard-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>

      <h1 className="onboard-title">Create your organization</h1>
      <p className="onboard-subtitle">
        Your organization is the home for your team, projects, and AI agents.
      </p>

      {error && <div className="onboard-error" role="alert">{error}</div>}

      <form onSubmit={handleSubmit} className="onboard-form" noValidate>
        <div className="onboard-field">
          <label htmlFor="org-name" className="onboard-label">Organization name</label>
          <input
            id="org-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="onboard-input"
            placeholder="Acme Corp"
            autoFocus
            required
            maxLength={200}
            disabled={isLoading}
          />
          {name && (
            <div className="onboard-slug-preview">
              <span className="onboard-slug-label">URL:</span>
              <span className="onboard-slug-value">cognix.app/<strong>{slugPreview}</strong></span>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="onboard-button"
          disabled={isLoading || !name.trim()}
        >
          {isLoading ? (
            <><span className="onboard-spinner" aria-hidden /> Creating…</>
          ) : (
            <>Continue <span aria-hidden>→</span></>
          )}
        </button>
      </form>

      <OnboardStyles />
    </div>
  );
}

function OnboardStyles(): React.ReactElement {
  return (
    <style>{`
      .onboard-card {
        background: rgba(15,15,25,0.9);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(99,102,241,0.15);
        border-radius: 24px;
        padding: 2.5rem;
        box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 80px rgba(99,102,241,0.06);
      }
      .onboard-steps { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 2rem; }
      .onboard-step { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #475569; }
      .onboard-step--active { color: #818cf8; }
      .onboard-step-dot { width: 8px; height: 8px; border-radius: 50%; background: #334155; }
      .onboard-step--active .onboard-step-dot { background: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.2); }
      .onboard-step-line { flex: 1; height: 1px; background: #1e293b; }
      .onboard-icon { display: flex; align-items: center; justify-content: center; width: 52px; height: 52px; border-radius: 14px; background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.2); color: #818cf8; margin-bottom: 1.25rem; }
      .onboard-title { font-size: 1.5rem; font-weight: 700; color: #f1f5f9; letter-spacing: -0.03em; margin: 0 0 0.5rem; }
      .onboard-subtitle { font-size: 0.9rem; color: #64748b; margin: 0 0 1.75rem; line-height: 1.6; }
      .onboard-error { padding: 0.75rem 1rem; background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2); border-radius: 10px; color: #fca5a5; font-size: 0.875rem; margin-bottom: 1.25rem; }
      .onboard-form { display: flex; flex-direction: column; gap: 1.25rem; }
      .onboard-field { display: flex; flex-direction: column; gap: 0.4rem; }
      .onboard-label { font-size: 0.8125rem; font-weight: 500; color: #94a3b8; }
      .onboard-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(99,102,241,0.2); border-radius: 10px; padding: 0.75rem 1rem; font-size: 1rem; color: #f1f5f9; outline: none; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; font-family: inherit; }
      .onboard-input::placeholder { color: #334155; }
      .onboard-input:focus { border-color: rgba(99,102,241,0.6); box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
      .onboard-input:disabled { opacity: 0.5; }
      .onboard-slug-preview { display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #475569; margin-top: 0.25rem; }
      .onboard-slug-label { color: #334155; }
      .onboard-slug-value { color: #64748b; }
      .onboard-slug-value strong { color: #818cf8; }
      .onboard-button { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.8rem 1.5rem; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; font-family: inherit; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; box-shadow: 0 4px 20px rgba(99,102,241,0.4); }
      .onboard-button:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(99,102,241,0.5); }
      .onboard-button:disabled { opacity: 0.5; cursor: not-allowed; }
      .onboard-spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }
    `}</style>
  );
}
