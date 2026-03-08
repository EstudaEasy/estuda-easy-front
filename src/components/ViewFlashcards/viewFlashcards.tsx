"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container/container";
import { LuLayers, LuArrowLeft } from "react-icons/lu";
import { Deck } from "@/types";
import DeckService from "@/services/deck/DeckService";
import styles from "./styles.module.css";
import FlashcardList from "./flashcardList";

interface ViewFlashcardsProps {
  refreshTrigger?: number;
  onEditDeck: (deck: Deck) => void;
}

export default function ViewFlashcards({ refreshTrigger, onEditDeck }: ViewFlashcardsProps) {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);

  const fetchDecks = async () => {
    try {
      setLoading(true);
      const response = await DeckService.list();
      setDecks(response.data.decks);
    } catch (error) {
      console.error("Erro ao buscar decks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, [refreshTrigger]);

  if (loading && decks.length === 0) return <p>Carregando decks...</p>;

  if (selectedDeck) {
    return (
      <div className={styles.flashcarsArea}>
        <div className={styles.headerWrapper}>
          <button onClick={() => setSelectedDeck(null)} className={styles.backButton}>
            <LuArrowLeft size={24} />
            Voltar para os Decks
          </button>
          <h2 className={styles.deckTitle}>{selectedDeck.name}</h2>
        </div>
        <FlashcardList deckId={selectedDeck.id} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className={styles.menuArea}>
        <div className={styles.decksContainer}>
          {decks.map((deck) => (
            <div
              key={deck.id}
              onClick={(e) => {
                e.preventDefault();
                setSelectedDeck(deck);
              }}
              className={styles.deckWrapper}
            >
              <Container
                href="#"
                title={deck.name}
                icon={<LuLayers size={30} />}
                onEditClick={() => onEditDeck(deck)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
