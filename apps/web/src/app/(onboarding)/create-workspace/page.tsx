"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";
import { createAuthClient } from "@/lib/api-client";

export default function CreateWorkspacePage(): React.ReactElement {
  const router = useRouter();
  const [orgId, setOrgId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const id = sessionStorage.getItem("__cognix_pending_org_id");
    if (!id) {
      router.push("/create-organization");
    } else {
      setOrgId(id);
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (!orgId) return;
    setError(null);
    setIsLoading(true);

    try {
      const token = getAccessToken();
      if (!token) {
        router.push("/sign-in");
        return;
      }
      const client = createAuthClient(token);
      await client.workspaces.create(orgId, { name, ...(description ? { description } : {}) });
      sessionStorage.removeItem("__cognix_pending_org_id");
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create workspace.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="onboard-card">
      {/* Step indicator */}
      <div className="onboard-steps">
        <div className="onboard-step onboard-step--done">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path
              d="M2 5l2.5 2.5L8 3"
              stroke="#34d399"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Organization</span>
        </div>
        <div className="onboard-step-line onboard-step-line--done" />
        <div className="onboard-step onboard-step--active">
          <div className="onboard-step-dot" />
          <span>Workspace</span>
        </div>
      </div>

      <div className="onboard-icon">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      </div>

      <h1 className="onboard-title">Create your first workspace</h1>
      <p className="onboard-subtitle">
        Workspaces are where your team collaborates on projects, tasks, and AI agents.
      </p>

      {error && (
        <div className="onboard-error" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="onboard-form" noValidate>
        <div className="onboard-field">
          <label htmlFor="ws-name" className="onboard-label">
            Workspace name
          </label>
          <input
            id="ws-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="onboard-input"
            placeholder="e.g. Engineering, Product, Marketing"
            autoFocus
            required
            maxLength={200}
            disabled={isLoading}
          />
        </div>

        <div className="onboard-field">
          <label htmlFor="ws-desc" className="onboard-label">
            Description <span style={{ color: "#334155" }}>(optional)</span>
          </label>
          <textarea
            id="ws-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="onboard-input onboard-textarea"
            placeholder="What does this workspace focus on?"
            rows={3}
            maxLength={500}
            disabled={isLoading}
          />
        </div>

        <div className="onboard-actions">
          <button
            type="button"
            className="onboard-button onboard-button--ghost"
            onClick={() => router.push("/create-organization")}
            disabled={isLoading}
          >
            ← Back
          </button>
          <button type="submit" className="onboard-button" disabled={isLoading || !name.trim()}>
            {isLoading ? (
              <>
                <span className="onboard-spinner" aria-hidden /> Creating…
              </>
            ) : (
              <>Launch workspace 🚀</>
            )}
          </button>
        </div>
      </form>

      <style>{`
        .onboard-card { background: rgba(15,15,25,0.9); backdrop-filter: blur(20px); border: 1px solid rgba(99,102,241,0.15); border-radius: 24px; padding: 2.5rem; box-shadow: 0 24px 64px rgba(0,0,0,0.5); }
        .onboard-steps { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 2rem; }
        .onboard-step { display: flex; align-items: center; gap: 0.375rem; font-size: 0.8rem; color: #475569; }
        .onboard-step--active { color: #818cf8; }
        .onboard-step--done { color: #34d399; }
        .onboard-step-dot { width: 8px; height: 8px; border-radius: 50%; background: #334155; }
        .onboard-step--active .onboard-step-dot { background: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.2); }
        .onboard-step-line { flex: 1; height: 1px; background: #1e293b; }
        .onboard-step-line--done { background: rgba(52,211,153,0.3); }
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
        .onboard-textarea { resize: vertical; min-height: 80px; }
        .onboard-actions { display: flex; gap: 0.75rem; }
        .onboard-button { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.8rem 1.5rem; border-radius: 12px; font-size: 0.9375rem; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; font-family: inherit; flex: 1; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; box-shadow: 0 4px 20px rgba(99,102,241,0.4); }
        .onboard-button--ghost { flex: 0 0 auto; background: rgba(255,255,255,0.04); color: #64748b; border: 1px solid rgba(255,255,255,0.06); box-shadow: none; padding: 0.8rem 1rem; }
        .onboard-button--ghost:hover:not(:disabled) { background: rgba(255,255,255,0.08); transform: none; }
        .onboard-button:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(99,102,241,0.5); }
        .onboard-button:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
        .onboard-spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
