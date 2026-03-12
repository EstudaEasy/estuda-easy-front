"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Deck } from "@/types";
import DeckService from "@/services/deck/DeckService";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { LuArrowLeft } from "react-icons/lu";
import FlashcardStudyPlay from "@/components/ViewFlashcards/FlashcardStudyPlay";

export default function FlashcardPlayPage() {
  const router = useRouter();
  const params = useParams();
  const deckId = params.id as string;

  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDeck() {
      try {
        setLoading(true);
        const response = await DeckService.getById(deckId);
        setDeck(response.data);
      } catch (error) {
        console.error("Erro ao buscar deck:", error);
      } finally {
        setLoading(false);
      }
    }

    if (deckId) {
      fetchDeck();
    }
  }, [deckId]);

  const handleFinish = (
    correctCount: number,
    wrongCount: number,
    ratings?: { easy: number; medium: number; hard: number; forgot: number },
  ) => {
    const params = new URLSearchParams({
      correct: correctCount.toString(),
      wrong: wrongCount.toString(),
      ...(ratings && {
        easy: ratings.easy.toString(),
        medium: ratings.medium.toString(),
        hard: ratings.hard.toString(),
        forgot: ratings.forgot.toString(),
      }),
    });
    router.push(`/tools/flashcards/${deckId}/results?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Typography variant="body-1" color="light">
          Carregando...
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3 px-6 pt-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/tools/flashcards/${deckId}`)}
          aria-label="Voltar"
        >
          <LuArrowLeft size={20} />
        </Button>

        <Typography
          variant="heading-4"
          weight="semibold"
          color="dark"
          className="flex-1 text-center truncate"
        >
          {deck?.name}
        </Typography>

        <div className="w-16" />
      </div>

      <div className="px-6">
        <FlashcardStudyPlay deckId={deckId} onFinish={handleFinish} />
      </div>
    </div>
  );
}
