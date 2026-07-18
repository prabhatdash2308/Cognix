import { CreateProjectPage } from "@/features/projects/pages/CreateProjectPage";

interface PageProps {
  params: Promise<{ workspaceId: string }>;
}

export default async function CreateProjectRoute({ params }: PageProps) {
  const { workspaceId } = await params;
  return <CreateProjectPage workspaceId={workspaceId} />;
}
