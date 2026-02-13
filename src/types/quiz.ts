export interface CreateQuizDTO {
  title: string;
  description?: string;
}

export interface UpdateQuizDTO {
  title?: string;
  description?: string;
}

export interface QuizResponse {
    id: string;
    title: string;
    description?: string;
    items: any[];
    createdAt: string;
    updatedAt: string;
}

export interface QuizListResponse {
  quizzes: QuizResponse[];  
  total: number;
}