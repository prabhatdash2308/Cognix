import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from "@cognix/ui";

export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Button variant="outline" className="w-full justify-center">
            New Project
          </Button>
          <Button variant="outline" className="w-full justify-center">
            New Task
          </Button>
          <Button variant="outline" className="w-full justify-center">
            Upload Document
          </Button>
          <Button variant="outline" className="w-full justify-center">
            Invite Member
          </Button>

          <Button variant="outline" disabled className="w-full justify-center relative group">
            Create AI Agent
            <span className="absolute -top-2 -right-2">
              <Badge variant="error" size="sm" className="text-[0.6rem] px-1 py-0 shadow-sm">
                Coming Soon
              </Badge>
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
