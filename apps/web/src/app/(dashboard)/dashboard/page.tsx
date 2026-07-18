"use client";

import { PageHeader } from "@cognix/app-shell";
import { Grid, Stack, Container } from "@cognix/ui";
import type { Workspace } from "@cognix/types";
import {
  WorkspaceStatsCard,
  QuickActionsCard,
  RecentProjectsCard,
  RecentTasksCard,
  RecentDocumentsCard,
  RecentActivityCard,
  NotificationCard,
  AgentOverviewCard,
} from "@/features/dashboard/components";
import {
  useRecentProjects,
  useRecentTasks,
  useRecentDocuments,
  useRecentActivity,
  useNotifications,
} from "@/features/dashboard/api/useDashboard";

export default function DashboardPage() {
  const workspaceId = "ws_1"; // Hardcoded for now

  // Fake workspace query since we haven't implemented it in dashboard.api.ts yet
  // Actually, we should probably add useWorkspaceSummary in useDashboard or just use the mock here.
  const workspace = {
    id: "ws_1",
    name: "Cognix HQ",
    organizationId: "org_1",
    createdAt: "",
    updatedAt: "",
  };

  const { data: projects, isLoading: isProjectsLoading } = useRecentProjects(workspaceId);
  const { data: tasks, isLoading: isTasksLoading } = useRecentTasks(workspaceId);
  const { data: documents, isLoading: isDocumentsLoading } = useRecentDocuments(workspaceId);
  const { data: activities, isLoading: isActivityLoading } = useRecentActivity(workspaceId);
  const { data: notifications, isLoading: isNotificationsLoading } = useNotifications();

  return (
    <Container className="py-8 max-w-[1400px]">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening in your workspace."
      />

      <Stack gap={6}>
        {/* Top Section */}
        <Grid cols={1} gap={6}>
          <WorkspaceStatsCard workspace={workspace as unknown as Workspace} />
          <QuickActionsCard />
        </Grid>

        {/* Middle Section - 3 columns */}
        <Grid gap={6} className="lg:grid-cols-3">
          <div className="col-span-1 lg:col-span-2">
            <Stack gap={6} className="h-full">
              <RecentProjectsCard projects={projects} isLoading={isProjectsLoading} />
              <RecentTasksCard tasks={tasks} isLoading={isTasksLoading} />
            </Stack>
          </div>
          <div className="col-span-1">
            <Stack gap={6} className="h-full">
              <NotificationCard notifications={notifications} isLoading={isNotificationsLoading} />
              <AgentOverviewCard />
            </Stack>
          </div>
        </Grid>

        {/* Bottom Section - 2 columns */}
        <Grid gap={6} className="lg:grid-cols-2">
          <RecentDocumentsCard documents={documents} isLoading={isDocumentsLoading} />
          <RecentActivityCard activities={activities} isLoading={isActivityLoading} />
        </Grid>
      </Stack>
    </Container>
  );
}
