import { api } from "../api";
import {
  QuizItemsResponse,
  QuizItemResponse,
  CreateQuizItemRequest,
  UpdateQuizItemRequest,
} from "@/types";

const QuizItemService = {
  create(quizId: string, data: CreateQuizItemRequest) {
    return api.post<QuizItemResponse>(`/quizzes/${quizId}/items`, data);
  },

  list(quizId: string) {
    return api.get<QuizItemsResponse>(`/quizzes/${quizId}/items`);
  },

  getById(quizId: string, quizItemId: number) {
    return api.get<QuizItemResponse>(`/quizzes/${quizId}/items/${quizItemId}`);
  },

  update(quizId: string, quizItemId: number, data: UpdateQuizItemRequest) {
    return api.patch<QuizItemResponse>(`/quizzes/${quizId}/items/${quizItemId}`, data);
  },

  delete(quizId: string, quizItemId: number) {
    return api.delete<void>(`/quizzes/${quizId}/items/${quizItemId}`);
  },
};

export default QuizItemService;
