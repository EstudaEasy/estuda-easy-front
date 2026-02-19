"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container/container";
import { LuLayers, LuArrowLeft } from "react-icons/lu";
import { Deck } from "@/types";
import DeckService from "@/services/deck/DeckService";
import styles from "./styles.module.css";

import FlashcardList from "./flashcardList";

export default function ViewFlashcards() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);

  useEffect(() => {
    async function fetchDecks() {
      try {
        const response = await DeckService.list();
        setDecks(response.data.decks);
      } catch (error) {
        console.error("Erro ao buscar decks:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDecks();
  }, []);

  if (loading) return <p>Carregando decks</p>;

  if (selectedDeck) {
    return (
      <div className={styles.flashcarsArea}>
        <button onClick={() => setSelectedDeck(null)} className={styles.backButton}>
          <LuArrowLeft size={20} />
          Voltar para os Decks
        </button>

        <h2 className={styles.deckTitle}>{selectedDeck.name}</h2>

        <FlashcardList deckId={selectedDeck.id} />
      </div>
    );
  }

  return (
    <div className={styles.decksContainer}>
      {" "}
      {decks.map((deck) => (
        <div
          key={deck.id}
          onClick={(e) => {
            e.preventDefault();
            setSelectedDeck(deck);
          }}
          className={styles.deckWrapper}
        >
          <Container href="#" title={deck.name} icon={<LuLayers size={30} />} />
        </div>
      ))}
    </div>
  );
}
