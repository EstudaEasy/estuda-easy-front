import { api } from './api';
import { CreateQuizDTO, UpdateQuizDTO, QuizResponse, QuizListResponse } from '@/types/quiz';

const QuizService = {

    create(data: CreateQuizDTO) {
        return api.post<QuizResponse>('/quizzes', data);
    },

    getAll() {
        return api.get<QuizListResponse>('/quizzes');
    },

    getById(id: string) {
        return api.get<QuizResponse>(`/quizzes/${id}`);
    },

    update(id: string, data: UpdateQuizDTO) {
        return api.patch<QuizResponse>(`/quizzes/${id}`, data);

    },

    delete(id: string) {
        return api.delete(`/quizzes/${id}`);
    },

}


export default QuizService;