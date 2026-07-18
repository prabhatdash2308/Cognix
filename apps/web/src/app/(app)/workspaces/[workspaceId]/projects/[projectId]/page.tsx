import { ProjectDetailsPage } from "@/features/projects/pages/ProjectDetailsPage";

interface PageProps {
  params: Promise<{ workspaceId: string; projectId: string }>;
}

export default async function ProjectDetailsRoute({ params }: PageProps) {
  const { workspaceId, projectId } = await params;
  return <ProjectDetailsPage workspaceId={workspaceId} projectId={projectId} />;
}
