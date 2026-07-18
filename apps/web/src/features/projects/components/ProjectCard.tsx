import * as React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import type { Project } from "@cognix/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@cognix/ui";
import { Badge } from "@cognix/ui";
import { Globe, Users, Lock } from "lucide-react";
import type { Route } from "next";

export interface ProjectCardProps {
  project: Project;
  href: string;
}

export function ProjectCard({ project, href }: ProjectCardProps) {
  const isArchived = project.status === "archived";

  const getVisibilityIcon = () => {
    switch (project.visibility) {
      case "public":
        return <Globe className="w-4 h-4 text-muted-foreground" />;
      case "private":
        return <Lock className="w-4 h-4 text-muted-foreground" />;
      case "team":
      default:
        return <Users className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <Link href={href as Route<string>} className="block group">
      <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/50 relative overflow-hidden">
        {project.color && (
          <div
            className="absolute top-0 left-0 w-full h-1"
            style={{ backgroundColor: project.color }}
          />
        )}
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              {project.emoji && <span className="text-2xl">{project.emoji}</span>}
              <div>
                <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {project.name}
                </CardTitle>
                <CardDescription className="text-sm mt-1 line-clamp-2">
                  {project.description || "No description provided."}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex items-center gap-2">
            <Badge variant={isArchived ? "outline" : "default"} className="capitalize">
              {project.status.replace("_", " ")}
            </Badge>
            <div
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
              title={`Visibility: ${project.visibility}`}
            >
              {getVisibilityIcon()}
              <span className="capitalize">{project.visibility}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 text-xs text-muted-foreground border-t bg-muted/20 px-6 py-3 mt-auto">
          <div className="flex justify-between w-full">
            <span>
              Created{" "}
              {project.createdAt
                ? formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })
                : "recently"}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
