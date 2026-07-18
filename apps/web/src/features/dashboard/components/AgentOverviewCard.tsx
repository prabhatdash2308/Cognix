import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from "@cognix/ui";

export function AgentOverviewCard() {
  return (
    <Card className="h-full border-dashed border-[var(--color-border-strong)] bg-transparent">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[var(--color-text-secondary)]">AI Overview</CardTitle>
        <Badge variant="outline" size="sm">
          Coming Soon
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center py-10">
        <div className="h-12 w-12 rounded-full bg-[var(--color-surface-raised)] flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6 text-[var(--color-text-secondary)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        </div>
        <h3 className="text-[var(--text-base)] font-medium text-[var(--color-text-primary)] mb-2">
          No AI agents active
        </h3>
        <p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] max-w-xs mb-6">
          Autonomous AI agents will be able to monitor tasks, process documents, and assist your
          team in this workspace.
        </p>
        <Button variant="primary" disabled className="relative group">
          Create Agent
        </Button>
      </CardContent>
    </Card>
  );
}
