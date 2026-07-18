import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Task, TaskCreateInput, TaskUpdateInput, TaskBulkUpdateInput } from "@cognix/types";
import { tasksApi } from "./api";
import { toast } from "sonner";

export const taskKeys = {
  all: ["tasks"] as const,
  lists: (projectId: string) => [...taskKeys.all, "list", projectId] as const,
  detail: (taskId: string) => [...taskKeys.all, "detail", taskId] as const,
};

export function useTasks(projectId: string) {
  return useQuery({
    queryKey: taskKeys.lists(projectId),
    queryFn: () => tasksApi.listByProject(projectId),
    enabled: !!projectId,
  });
}

export function useTask(taskId: string) {
  return useQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: () => tasksApi.get(taskId),
    enabled: !!taskId,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TaskCreateInput) => tasksApi.create(data),
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists(newTask.projectId) });
      toast.success("Task created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create task");
      console.error(error);
    },
  });
}

export function useUpdateTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: Omit<TaskUpdateInput, "id"> }) =>
      tasksApi.update(taskId, data),
    // Optimistic update for UI feel, especially good for Drag and Drop
    onMutate: async ({ taskId, data }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists(projectId) });
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.lists(projectId));

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(taskKeys.lists(projectId), (old) => {
          if (!old) return old;
          return old.map((t) => (t.id === taskId ? { ...t, ...data } : t));
        });
      }
      return { previousTasks };
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(taskKeys.lists(projectId), context?.previousTasks);
      toast.error("Failed to update task");
    },
    onSettled: (updatedTask) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists(projectId) });
      if (updatedTask) {
        queryClient.invalidateQueries({ queryKey: taskKeys.detail(updatedTask.id) });
      }
    },
  });
}

export function useDeleteTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => tasksApi.delete(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists(projectId) });
      toast.success("Task deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete task");
      console.error(error);
    },
  });
}

export function useBulkUpdateTasks(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TaskBulkUpdateInput) => tasksApi.bulkUpdate(data),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists(projectId) });
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.lists(projectId));

      if (previousTasks) {
        queryClient.setQueryData<Task[]>(taskKeys.lists(projectId), (old) => {
          if (!old) return old;
          return old.map((t) => {
            if (data.taskIds.includes(t.id)) {
              return {
                ...t,
                ...(data.status && { status: data.status }),
                ...(data.priority && { priority: data.priority }),
                ...(data.assigneeId !== undefined && { assigneeId: data.assigneeId }),
              };
            }
            return t;
          });
        });
      }
      return { previousTasks };
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(taskKeys.lists(projectId), context?.previousTasks);
      toast.error("Failed to update tasks");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists(projectId) });
    },
  });
}
