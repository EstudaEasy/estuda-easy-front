import { api } from "../api";
import { CreateTaskRequest, UpdateTaskRequest, TaskResponse, TasksResponse } from "@/types";

const TaskService = {
  create(data: CreateTaskRequest) {
    return api.post<TaskResponse>("/tasks", data);
  },

  list() {
    return api.get<TasksResponse>("/tasks");
  },

  listShared() {
    return api.get<TasksResponse>("/tasks/shared");
  },

  getById(taskId: string) {
    return api.get<TaskResponse>(`/tasks/${taskId}`);
  },

  update(taskId: string, data: UpdateTaskRequest) {
    return api.patch<TaskResponse>(`/tasks/${taskId}`, data);
  },

  delete(taskId: string) {
    return api.delete<void>(`/tasks/${taskId}`);
  },
};

export default TaskService;
