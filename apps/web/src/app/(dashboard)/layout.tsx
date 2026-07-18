"use client";

import { AppShellProvider, Sidebar, TopBar } from "@cognix/app-shell";
import { Suspense } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Normally we'd get this from auth context or similar, for now we mock
  const currentWorkspace = { id: "ws_1", name: "Cognix HQ", initials: "CQ" };
  const user = { id: "usr_1", name: "Admin", email: "admin@cognix.ai" };

  const nav = [
    {
      id: "workspace",
      label: "Workspace",
      items: [
        { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "dashboard" },
        { id: "projects", label: "Projects", href: "/projects", icon: "folder" },
        { id: "tasks", label: "Tasks", href: "/tasks", icon: "check-circle" },
      ],
    },
  ];

  return (
    <AppShellProvider
      nav={nav}
      currentWorkspace={currentWorkspace}
      workspaces={[currentWorkspace]}
      user={user}
    >
      <div className="flex h-screen w-full overflow-hidden bg-[var(--color-background)]">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto outline-none" tabIndex={-1}>
            <Suspense
              fallback={<div className="p-8 text-[var(--color-text-secondary)]">Loading...</div>}
            >
              {children}
            </Suspense>
          </main>
        </div>
      </div>
    </AppShellProvider>
  );
}
