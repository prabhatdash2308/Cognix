import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task, TaskPriority } from "@cognix/types";

import { Avatar, cn } from "@cognix/ui";

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: "bg-blue-500/10 text-blue-500",
  medium: "bg-orange-500/10 text-orange-500",
  high: "bg-red-500/10 text-red-500",
  urgent: "bg-rose-500/10 text-rose-500 border border-rose-500/20",
};

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
      initialStatus: task.status,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-32 w-full rounded-xl border-2 border-dashed border-primary/50 bg-primary/5"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative flex cursor-grab flex-col gap-3 rounded-xl border bg-card p-4 text-card-foreground shadow-sm transition-all hover:shadow-md active:cursor-grabbing",
        isOverlay ? "scale-105 rotate-2 cursor-grabbing shadow-xl ring-2 ring-primary/20 z-50" : "",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            PRIORITY_COLORS[task.priority],
          )}
        >
          {task.priority}
        </span>

        {task.type !== "task" && (
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            {task.type}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <h4 className="font-medium text-sm leading-snug line-clamp-2">{task.title}</h4>
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {task.labels?.map((label) => (
            <div
              key={label.id}
              className="h-2 w-8 rounded-full"
              style={{ backgroundColor: label.color }}
              title={label.name}
            />
          ))}
        </div>

        <div className="flex -space-x-2">
          {task.assigneeId && (
            <Avatar
              name={task.assigneeId}
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assigneeId}`}
              size="sm"
            />
          )}
        </div>
      </div>
    </div>
  );
}
