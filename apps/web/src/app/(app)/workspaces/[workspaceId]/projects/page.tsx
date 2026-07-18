import { ProjectsPage } from "@/features/projects/pages/ProjectsPage";

interface PageProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function ProjectsRoute({ params }: PageProps) {
  const { workspaceId } = await params;
  return <ProjectsPage workspaceId={workspaceId} />;
}
