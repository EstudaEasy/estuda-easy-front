"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Deck } from "@/types";
import DeckService from "@/services/deck/DeckService";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { LuArrowLeft } from "react-icons/lu";
import FlashcardResults from "@/components/ViewFlashcards/FlashcardResults";

export default function FlashcardResultsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const deckId = params.id as string;

  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);

  const correctCount = parseInt(searchParams.get("correct") || "0");
  const wrongCount = parseInt(searchParams.get("wrong") || "0");
  const easyCount = parseInt(searchParams.get("easy") || "0");
  const mediumCount = parseInt(searchParams.get("medium") || "0");
  const hardCount = parseInt(searchParams.get("hard") || "0");
  const forgotCount = parseInt(searchParams.get("forgot") || "0");

  useEffect(() => {
    async function fetchDeck() {
      try {
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

  const handleRetry = () => {
    router.push(`/tools/flashcards/${deckId}/play`);
  };

  const handleBack = () => {
    router.push(`/tools/flashcards/${deckId}`);
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
        <FlashcardResults
          correctCount={correctCount}
          wrongCount={wrongCount}
          deckTitle={deck?.name}
          onRetry={handleRetry}
          onBack={handleBack}
          easyCount={easyCount}
          mediumCount={mediumCount}
          hardCount={hardCount}
          forgotCount={forgotCount}
        />
      </div>
    </div>
  );
}
