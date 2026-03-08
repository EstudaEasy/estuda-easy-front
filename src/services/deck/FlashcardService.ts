import { api } from "../api";
import {
  CreateFlashcardRequest,
  UpdateFlashcardRequest,
  FlashcardResponse,
  FlashcardsResponse,
} from "@/types";

const FlashcardService = {
  create(deckId: string, data: CreateFlashcardRequest) {
    return api.post<FlashcardResponse>(`/decks/${deckId}/flashcards`, data);
  },

  list(deckId: string) {
    return api.get<FlashcardsResponse>(`/decks/${deckId}/flashcards`);
  },

  getById(deckId: string, flashcardId: string) {
    return api.get<FlashcardResponse>(`/decks/${deckId}/flashcards/${flashcardId}`);
  },

  update(deckId: string, flashcardId: string, data: UpdateFlashcardRequest) {
    return api.patch<FlashcardResponse>(`/decks/${deckId}/flashcards/${flashcardId}`, data);
  },

  delete(deckId: string, flashcardId: string) {
    return api.delete<void>(`/decks/${deckId}/flashcards/${flashcardId}`);
  },
};

export default FlashcardService;
