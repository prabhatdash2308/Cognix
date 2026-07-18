import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { template: "%s · Cognix", default: "Setup · Cognix" },
};

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <div className="onboard-root">
      <div className="onboard-bg" aria-hidden>
        <div className="onboard-orb onboard-orb--1" />
        <div className="onboard-orb onboard-orb--2" />
      </div>

      <header className="onboard-header">
        <a href="/" className="onboard-logo">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none" aria-hidden>
            <rect width="28" height="28" rx="8" fill="url(#g2)" />
            <path d="M8 14h4l2-6 4 12 2-6h4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="g2" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          Cognix
        </a>
      </header>

      <main className="onboard-main">{children}</main>

      <style>{`
        .onboard-root {
          min-height: 100dvh;
          background: #070710;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          position: relative;
          overflow: hidden;
          font-family: var(--font-sans, 'Inter', system-ui, sans-serif);
        }
        .onboard-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
        .onboard-orb { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.12; }
        .onboard-orb--1 { width: 600px; height: 600px; background: radial-gradient(circle, #6366f1, transparent 70%); top: -20%; left: -15%; }
        .onboard-orb--2 { width: 500px; height: 500px; background: radial-gradient(circle, #8b5cf6, transparent 70%); bottom: -15%; right: -10%; }
        .onboard-header { position: fixed; top: 0; left: 0; right: 0; padding: 1.25rem 2rem; z-index: 10; }
        .onboard-logo { display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; color: #f1f5f9; font-weight: 700; font-size: 1.0625rem; letter-spacing: -0.02em; }
        .onboard-main { position: relative; z-index: 5; width: 100%; max-width: 520px; }
      `}</style>
    </div>
  );
}
