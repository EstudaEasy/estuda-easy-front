"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Deck } from "@/types";
import DeckService from "@/services/deck/DeckService";
import FlashcardCard from "./FlashcardCard";
import { Typography } from "@/components/ui/typography";
import EmptyToolState from "@/components/EmptyToolState/EmptyToolState";
import LoadingState from "@/components/LoadingState";

interface ViewFlashcardsProps {
  refreshTrigger?: number;
  onEditDeck?: (deck: Deck) => void;
  onDeleteDeck?: (deck: Deck) => void;
  onCreateDeck?: () => void;
  onShareDeck?: (deck: Deck) => void;
}

export default function ViewFlashcards({
  refreshTrigger,
  onEditDeck,
  onDeleteDeck,
  onCreateDeck,
  onShareDeck,
}: ViewFlashcardsProps) {
  const router = useRouter();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDecks();
  }, [refreshTrigger]);

  async function fetchDecks() {
    try {
      setLoading(true);
      const response = await DeckService.list();
      setDecks(response.data.decks);
    } catch (error) {
      console.error("Erro ao buscar decks:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingState message="Carregando decks..." />;
  }

  return (
    <div className="flex flex-col gap-6">
      {decks.length === 0 ? (
        <EmptyToolState
          title="Nada de decks por aqui"
          description="Crie seu primeiro deck e comece a revisar com flashcards!"
          actionLabel="Criar Deck"
          onAction={onCreateDeck}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => (
            <FlashcardCard
              key={deck.id}
              deck={deck}
              title={deck.name}
              cardsCount={deck.flashcards?.length || 0}
              onClick={() => router.push(`/tools/flashcards/${deck.id}`)}
              onEdit={onEditDeck}
              onDelete={onDeleteDeck}
              onShare={onShareDeck}
            />
          ))}
        </div>
      )}
    </div>
  );
}
