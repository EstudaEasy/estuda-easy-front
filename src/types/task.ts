import { components } from "./api";

export type Task = TaskResponse;
export type TaskResponse = components["schemas"]["TaskResponseDTO"];
export type TasksResponse = components["schemas"]["FindTaskResponseDTO"];
export type CreateTaskRequest = components["schemas"]["CreateTaskBodyDTO"];
export type UpdateTaskRequest = components["schemas"]["UpdateTaskBodyDTO"];
