import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s · Cognix",
    default: "Auth · Cognix",
  },
};

export default function AuthLayout({ children }: { children: ReactNode }): React.ReactElement {
  return (
    <div className="auth-root">
      {/* Animated background */}
      <div className="auth-bg" aria-hidden>
        <div className="auth-bg-orb auth-bg-orb--1" />
        <div className="auth-bg-orb auth-bg-orb--2" />
        <div className="auth-bg-orb auth-bg-orb--3" />
        <div className="auth-bg-grid" />
      </div>

      {/* Branding */}
      <header className="auth-header">
        <a href="/" className="auth-logo" aria-label="Cognix home">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
            <rect width="28" height="28" rx="8" fill="url(#g1)" />
            <path d="M8 14h4l2-6 4 12 2-6h4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <span>Cognix</span>
        </a>
      </header>

      {/* Card */}
      <main className="auth-main">
        <div className="auth-card">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-footer">
        <span>© 2026 Cognix. All rights reserved.</span>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
      </footer>

      <style>{`
        .auth-root {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #070710;
          position: relative;
          overflow: hidden;
          padding: 1.5rem;
          font-family: var(--font-sans, 'Inter', system-ui, sans-serif);
        }

        /* Animated orbs */
        .auth-bg {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .auth-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.18;
          animation: orbFloat 12s ease-in-out infinite;
        }
        .auth-bg-orb--1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, #6366f1, transparent 70%);
          top: -15%; left: -10%;
          animation-delay: 0s;
        }
        .auth-bg-orb--2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #8b5cf6, transparent 70%);
          bottom: -10%; right: -8%;
          animation-delay: -4s;
        }
        .auth-bg-orb--3 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #06b6d4, transparent 70%);
          top: 50%; left: 60%;
          animation-delay: -8s;
        }
        .auth-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 15px) scale(0.97); }
        }

        /* Header */
        .auth-header {
          position: fixed;
          top: 0; left: 0; right: 0;
          padding: 1.25rem 2rem;
          z-index: 10;
        }
        .auth-logo {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: #f1f5f9;
          font-weight: 700;
          font-size: 1.125rem;
          letter-spacing: -0.02em;
          transition: opacity 0.2s;
        }
        .auth-logo:hover { opacity: 0.8; }

        /* Main card */
        .auth-main {
          position: relative;
          z-index: 5;
          width: 100%;
          max-width: 420px;
        }
        .auth-card {
          background: rgba(15, 15, 25, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(99, 102, 241, 0.18);
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 24px 48px rgba(0,0,0,0.5),
            0 0 80px rgba(99,102,241,0.08);
        }

        /* Footer */
        .auth-footer {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          font-size: 0.75rem;
          color: #475569;
          z-index: 10;
        }
        .auth-footer a {
          color: #475569;
          text-decoration: none;
          transition: color 0.2s;
        }
        .auth-footer a:hover { color: #94a3b8; }
      `}</style>
    </div>
  );
}
