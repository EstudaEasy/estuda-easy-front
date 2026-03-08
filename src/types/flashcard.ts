import { components } from "./api";

export type Flashcard = FlashcardResponse;
export type FlashcardResponse = components["schemas"]["FlashcardResponseDTO"];
export type FlashcardsResponse = components["schemas"]["FindFlashcardResponseDTO"];
export type CreateFlashcardRequest = components["schemas"]["CreateFlashcardBodyDTO"];
export type UpdateFlashcardRequest = components["schemas"]["UpdateFlashcardBodyDTO"];
