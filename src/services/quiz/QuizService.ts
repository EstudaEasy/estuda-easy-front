import { api } from "../api";
import { CreateQuizRequest, QuizzesResponse, UpdateQuizRequest, QuizResponse } from "@/types";

const QuizService = {
  create(data: CreateQuizRequest) {
    return api.post<QuizResponse>("/quizzes", data);
  },

  list() {
    return api.get<QuizzesResponse>("/quizzes");
  },

  listShared() {
    return api.get<QuizzesResponse>("/quizzes/shared");
  },

  getById(quizId: string) {
    return api.get<QuizResponse>(`/quizzes/${quizId}`);
  },

  update(quizId: string, data: UpdateQuizRequest) {
    return api.patch<QuizResponse>(`/quizzes/${quizId}`, data);
  },

  delete(quizId: string) {
    return api.delete<void>(`/quizzes/${quizId}`);
  },
};

export default QuizService;
