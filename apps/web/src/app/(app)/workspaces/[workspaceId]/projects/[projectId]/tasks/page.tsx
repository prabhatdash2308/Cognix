"use client";

import { useParams } from "next/navigation";
import { TasksPage } from "@/features/tasks/pages/TasksPage";

export default function ProjectTasksRoute() {
  const params = useParams();
  const projectId = params.projectId as string;

  if (!projectId) {
    return null;
  }

  return <TasksPage projectId={projectId} />;
}
