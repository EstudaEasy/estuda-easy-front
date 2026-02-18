import { components } from "./api";

export type Quiz = QuizResponse;
export type QuizResponse = components["schemas"]["QuizResponseDTO"];
export type QuizzesResponse = components["schemas"]["FindQuizResponseDTO"];
export type CreateQuizRequest = components["schemas"]["CreateQuizBodyDTO"];
export type UpdateQuizRequest = components["schemas"]["UpdateQuizBodyDTO"];

export type QuizItem = QuizItemResponse;
export type QuizItemResponse = components["schemas"]["QuizItemResponseDTO"];
export type QuizItemsResponse = components["schemas"]["FindQuizItemResponseDTO"];
export type CreateQuizItemRequest = components["schemas"]["CreateQuizItemBodyDTO"];
export type UpdateQuizItemRequest = components["schemas"]["UpdateQuizItemBodyDTO"];

export type QuizOption = QuizOptionResponse;
export type QuizOptionResponse = components["schemas"]["QuizOptionResponseDTO"];
export type CreateQuizOptionRequest = components["schemas"]["CreateQuizOptionDTO"];
export type UpdateQuizOptionRequest = components["schemas"]["UpdateQuizOptionDTO"];
