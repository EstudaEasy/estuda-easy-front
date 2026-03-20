"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Deck } from "@/types";
import DeckService from "@/services/deck/DeckService";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { LuArrowLeft, LuShare2 } from "react-icons/lu";
import FlashcardCardGallery from "@/components/ViewFlashcards/FlashcardCardGallery";
import ShareResourceModal from "@/components/ShareResourceModal";
import { useResourcePermission } from "@/hooks/useResourcePermission";

export default function FlashcardDeckPage() {
  const router = useRouter();
  const params = useParams();
  const deckId = params.id as string;

  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const { canEdit } = useResourcePermission(deck?.resourceId);

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

  const handleStudy = () => {
    router.push(`/tools/flashcards/${deckId}/play`);
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
          onClick={() => router.push("/tools/flashcards")}
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

        <Button
          variant="outline"
          className="gap-2 shrink-0"
          onClick={() => setIsShareModalOpen(true)}
        >
          <LuShare2 size={16} />
        </Button>
      </div>

      <div className="px-6">
        <FlashcardCardGallery
          deckId={deckId}
          onStudyClick={handleStudy}
          cardsCount={deck?.flashcards?.length}
          canEdit={canEdit}
        />
      </div>
      {deck && (
        <ShareResourceModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          resourceId={deck.resourceId}
        />
      )}
    </div>
  );
}
