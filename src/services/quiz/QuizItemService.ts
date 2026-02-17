import { api } from "../api";
import {
  CreateQuizItemDTO,
  UpdateQuizItemDTO,
  QuizItemResponse,
  QuizItemListResponse,
} from "@/types/quiz";

const QuizItemService = {
  create(quizId: string, data: CreateQuizItemDTO) {
    return api.post<QuizItemResponse>(`/quizzes/${quizId}/items`, data);
  },

  getAll(quizId: string) {
    return api.get<QuizItemListResponse>(`/quizzes/${quizId}/items`);
  },

  getById(quizId: string, quizItemId: number) {
    return api.get<QuizItemResponse>(`/quizzes/${quizId}/items/${quizItemId}`);
  },

  update(quizId: string, quizItemId: number, data: UpdateQuizItemDTO) {
    return api.patch<QuizItemResponse>(`/quizzes/${quizId}/items/${quizItemId}`, data);
  },

  delete(quizId: string, quizItemId: number) {
    return api.delete(`/quizzes/${quizId}/items/${quizItemId}`);
  },
};

export default QuizItemService;
