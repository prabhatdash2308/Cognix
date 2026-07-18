import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragStartEvent, DragOverEvent, DragEndEvent } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState, useMemo, useEffect } from "react";
import type { Task, TaskStatus } from "@cognix/types";
import { TaskColumn } from "./TaskColumn";
import { TaskCard } from "./TaskCard";
import { useUpdateTask } from "../hooks";

interface TaskBoardProps {
  projectId: string;
  tasks: Task[];
}

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "in_review", title: "In Review" },
  { id: "done", title: "Done" },
];

export function TaskBoard({ projectId, tasks }: TaskBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { mutate: updateTask } = useUpdateTask(projectId);

  // Local state for optimistic drag & drop
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const columns = useMemo(() => {
    const cols = new Map<TaskStatus, Task[]>();
    COLUMNS.forEach((c) => cols.set(c.id, []));
    localTasks.forEach((task) => {
      if (cols.has(task.status)) {
        cols.get(task.status)!.push(task);
      }
    });
    return cols;
  }, [localTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    setLocalTasks((prev) => {
      const activeTask = prev.find((t) => t.id === activeId);
      const overTask = prev.find((t) => t.id === overId);

      if (!activeTask) return prev;

      if (isOverTask && overTask && activeTask.status !== overTask.status) {
        return prev.map((t) => (t.id === activeTask.id ? { ...t, status: overTask.status } : t));
      }

      if (isOverColumn) {
        return prev.map((t) =>
          t.id === activeTask.id ? { ...t, status: overId as TaskStatus } : t,
        );
      }

      return prev;
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const activeTask = localTasks.find((t) => t.id === activeId);

    if (activeTask && activeTask.status !== active.data.current?.initialStatus) {
      updateTask({
        taskId: activeId as string,
        data: { status: activeTask.status },
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4 items-start h-full">
        {COLUMNS.map((col) => (
          <TaskColumn
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={columns.get(col.id) || []}
          />
        ))}
      </div>

      <DragOverlay>
        {activeId ? <TaskCard task={localTasks.find((t) => t.id === activeId)!} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
