"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import type { ProjectVisibility } from "@cognix/types";

import {
  Button,
  Input,
  Textarea,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@cognix/ui";
import { useCreateProject } from "../hooks";

const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  description: z.string().max(500).optional(),
  emoji: z.string().max(10).optional(),
  color: z
    .string()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be a valid hex color")
    .optional()
    .or(z.literal("")),
  visibility: z.enum(["private", "team", "public"]),
});

type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

export interface CreateProjectPageProps {
  workspaceId: string;
}

const COLORS = [
  "#f87171",
  "#fb923c",
  "#fbbf24",
  "#a3e635",
  "#4ade80",
  "#2dd4bf",
  "#38bdf8",
  "#818cf8",
  "#c084fc",
  "#f472b6",
];

const EMOJIS = ["🚀", "✨", "🔥", "💡", "🛠️", "📈", "🎯", "🧠", "📦", "🎨"];

export function CreateProjectPage({ workspaceId }: CreateProjectPageProps) {
  const router = useRouter();
  const createProject = useCreateProject();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      emoji: "🚀",
      color: "#818cf8",
      visibility: "team",
    },
  });

  const selectedColor = watch("color");
  const selectedEmoji = watch("emoji");
  const selectedVisibility = watch("visibility");

  const onSubmit = async (data: CreateProjectFormValues) => {
    try {
      const payload: Record<string, unknown> = {
        workspaceId,
        name: data.name,
        visibility: data.visibility as ProjectVisibility,
      };
      if (data.description) payload.description = data.description;
      if (data.emoji) payload.emoji = data.emoji;
      if (data.color) payload.color = data.color;
      const project = await createProject.mutateAsync(
        payload as Parameters<typeof createProject.mutateAsync>[0],
      );
      router.push(`/workspaces/${workspaceId}/projects/${project.id}`);
    } catch (error) {
      console.error("Failed to create project", error);
      // In a real app, toast notification here
    }
  };

  return (
    <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <Link
          href={`/workspaces/${workspaceId}/projects`}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Create New Project</h2>
        <p className="text-muted-foreground mt-1">
          Set up a new workspace project to organize your team&apos;s tasks and agents.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="border-muted">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Give your project a distinct identity and clear purpose.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="name"
                placeholder="e.g. Website Redesign Q3"
                {...register("name")}
                className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                placeholder="What is this project about? (Optional)"
                {...register("description")}
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setValue("emoji", emoji)}
                      disabled={isSubmitting}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${
                        selectedEmoji === emoji
                          ? "bg-primary/20 scale-110 ring-2 ring-primary ring-offset-2 ring-offset-background"
                          : "bg-muted hover:bg-muted/80 hover:scale-105"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                  <Input
                    {...register("emoji")}
                    className="w-16 h-10 px-2 text-center ml-2"
                    placeholder="Type"
                    maxLength={2}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Theme Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setValue("color", color)}
                      disabled={isSubmitting}
                      className={`w-10 h-10 rounded-full transition-all ${
                        selectedColor === color
                          ? "scale-110 ring-2 ring-primary ring-offset-2 ring-offset-background"
                          : "hover:scale-105 opacity-80 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <label className="text-sm font-medium">Visibility</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: "private", title: "Private", desc: "Only invited members" },
                  { value: "team", title: "Team", desc: "Anyone in the workspace" },
                  { value: "public", title: "Public", desc: "Anyone on the internet" },
                ].map((vis) => (
                  <button
                    key={vis.value}
                    type="button"
                    onClick={() =>
                      setValue("visibility", vis.value as "private" | "team" | "public")
                    }
                    disabled={isSubmitting}
                    className={`flex flex-col text-left p-4 rounded-xl border-2 transition-all ${
                      selectedVisibility === vis.value
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-primary/50"
                    }`}
                  >
                    <span className="font-semibold">{vis.title}</span>
                    <span className="text-xs text-muted-foreground mt-1">{vis.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 border-t bg-muted/20 px-6 py-4">
            <Link href={`/workspaces/${workspaceId}/projects`}>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
