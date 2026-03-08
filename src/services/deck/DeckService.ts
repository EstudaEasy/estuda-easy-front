import { api } from "../api";
import { CreateDeckRequest, UpdateDeckRequest, DeckResponse, DecksResponse } from "@/types";

const DeckService = {
  create(data: CreateDeckRequest) {
    return api.post<DeckResponse>("/decks", data);
  },

  list() {
    return api.get<DecksResponse>("/decks");
  },

  listShared() {
    return api.get<DecksResponse>("/decks/shared");
  },

  getById(deckId: string) {
    return api.get<DeckResponse>(`/decks/${deckId}`);
  },

  update(deckId: string, data: UpdateDeckRequest) {
    return api.patch<DeckResponse>(`/decks/${deckId}`, data);
  },

  delete(deckId: string) {
    return api.delete<void>(`/decks/${deckId}`);
  },
};

export default DeckService;
