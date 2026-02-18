import { components } from "./api";

export type Deck = DeckResponse;
export type DeckResponse = components["schemas"]["DeckResponseDTO"];
export type DecksResponse = components["schemas"]["FindDeckResponseDTO"];
export type CreateDeckRequest = components["schemas"]["CreateDeckBodyDTO"];
export type UpdateDeckRequest = components["schemas"]["UpdateDeckBodyDTO"];
