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
  items: QuizItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizListResponse {
  quizzes: QuizResponse[];
  total: number;
}

export interface CreateQuizItemDTO {
  question: string;
  options: CreateQuizOptionDTO[];
  position: number;
  timeLimit?: number;
  explanation?: string;
}

export interface UpdateQuizItemDTO {
  question?: string;
  position?: number;
  timeLimit?: number;
  explanation?: string;
  options?: QuizOptionResponse[];
}

export interface QuizItemResponse {
  id: number;
  quizId: string;
  question: string;
  options: QuizOptionResponse[];
  position: number;
  timeLimit?: number;
  explanation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuizItemListResponse {
  quizItems: QuizItemResponse[];
  total: number;
}

export interface CreateQuizOptionDTO {
  text: string;
  isCorrect: boolean;
  position: number;
}

export interface UpdateQuizOptionDTO {
  text: string;
  isCorrect: boolean;
  position: number;
}

export interface QuizOptionResponse {
  id: number;
  quizItemId: number;
  text: string;
  isCorrect: boolean;
  position: number;
}
