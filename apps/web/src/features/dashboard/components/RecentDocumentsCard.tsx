import { Card, CardHeader, CardTitle, CardContent, Stack } from "@cognix/ui";
import type { Document } from "@cognix/types";

export interface RecentDocumentsCardProps {
  documents: Document[] | undefined;
  isLoading?: boolean;
}

export function RecentDocumentsCard({ documents, isLoading }: RecentDocumentsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Documents</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Stack gap={0} className="divide-y divide-[var(--color-border)]">
          {isLoading ? (
            <div className="p-4 flex justify-center text-[var(--color-text-secondary)]">
              Loading...
            </div>
          ) : !documents || documents.length === 0 ? (
            <div className="p-4 text-center text-[var(--text-sm)] text-[var(--color-text-secondary)]">
              No recent documents found.
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 hover:bg-[var(--color-surface-hover)] transition-colors flex items-center justify-between group cursor-pointer"
              >
                <div className="flex flex-col min-w-0 pr-2">
                  <span className="font-medium text-[var(--text-sm)] text-[var(--color-text-primary)] truncate">
                    {doc.title}
                  </span>
                  <span className="text-[var(--text-xs)] text-[var(--color-text-secondary)]">
                    Edited {new Date(doc.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
