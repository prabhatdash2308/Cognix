import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Task, TaskStatus } from "@cognix/types";
import { TaskCard } from "./TaskCard";

interface TaskColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
}

export function TaskColumn({ id, title, tasks }: TaskColumnProps) {
  const { setNodeRef } = useDroppable({
    id: id,
    data: {
      type: "Column",
      column: { id, title },
    },
  });

  return (
    <div className="flex w-80 flex-col gap-4 rounded-xl bg-muted/50 p-4 h-full">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm tracking-tight">{title}</h3>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted-foreground/20 text-xs text-muted-foreground">
          {tasks.length}
        </span>
      </div>

      <div ref={setNodeRef} className="flex flex-col gap-3 min-h-[100px] h-full pb-2">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
