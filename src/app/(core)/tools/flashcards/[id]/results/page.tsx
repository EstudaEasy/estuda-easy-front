"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Deck } from "@/types";
import DeckService from "@/services/deck/DeckService";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { LuArrowLeft } from "react-icons/lu";
import FlashcardResults from "@/components/ViewFlashcards/FlashcardResults";
import { useResourceConverter } from "@/context/resourceConverter/ResourceConverterContext";
import { ArrowRight } from "lucide-react";
import TiaFalando from "@/assets/TIA_falando.png";
import LoadingState from "@/components/LoadingState";

export default function FlashcardResultsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const deckId = params.id as string;
  const { notifyCompletion } = useResourceConverter();

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
    return <LoadingState message="Carregando resultado do deck..." />;
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-3">
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

      <div>
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

        <Card className="mt-4 w-full border-blue-100 bg-linear-to-r from-blue-50 to-sky-100 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="hidden h-16 w-16 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-blue-200 sm:block">
              <Image
                src={TiaFalando}
                alt="tIA"
                width={64}
                height={64}
                className="h-full w-full object-cover object-top"
                quality={100}
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Typography variant="caption" className="text-blue-700" weight="semibold">
                Sugestao da tIA
              </Typography>
              <Typography variant="body-2" className="text-slate-700">
                Bora transformar este deck em outro formato para reforcar a revisao e manter o
                ritmo de estudo?
              </Typography>
              <Button
                className="w-full gap-2 bg-blue-600 hover:bg-blue-700 sm:w-fit"
                onClick={() => {
                  if (deck) {
                    notifyCompletion({
                      resourceId: deckId,
                      resourceType: "deck",
                      resourceName: deck.name,
                    });
                  }
                }}
                disabled={!deck}
              >
                <ArrowRight size={16} />
                Conversar com a tIA sobre este deck
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
