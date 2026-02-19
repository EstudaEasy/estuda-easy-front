"use client";

import { useEffect, useState } from "react";
import FlashcardService from "@/services/deck/FlashcardService";
import { Flashcard } from "@/types";
import styles from "./styles.module.css";
import { Typography } from "../base";
import { LuArrowBigRight, LuCheck, LuEye, LuX } from "react-icons/lu";

interface FlashcardListProps {
  deckId: string;
}

export default function FlashcardList({ deckId }: FlashcardListProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(true);
  const [correct, setCorrect] = useState(true);
  const [wrong, setWrong] = useState(true);

  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await FlashcardService.list(deckId);

        setFlashcards(response.data.flashcards);
      } catch (error) {
        console.error("Erro ao carregar flashcards:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCards();
  }, [deckId]);

  if (loading) return <p>Carregando</p>;

  if (flashcards.length === 0) {
    return <p>Este deck ainda não tem flashcards.</p>;
  }

  return (
    <div className={styles.cardsGrid}>
      {flashcards.map((card) => (
        <div key={card.id} className={styles.flashcard}>
          {show ? (
            <Typography variant="heading-1" color="primary">
              {" "}
              {card.back}{" "}
            </Typography>
          ) : (
            <Typography variant="heading-1"> {card.front} </Typography>
          )}
        </div>
      ))}

      <button onClick={() => setWrong(!wrong)}>
        {" "}
        <LuX color="gray" size={30} />{" "}
      </button>

      <button onClick={() => setShow(!show)}>
        {" "}
        <LuEye color="gray" size={30} />{" "}
      </button>

      <button onClick={() => setCorrect(!correct)}>
        {" "}
        <LuCheck color="gray" size={30} />{" "}
      </button>
    </div>
  );
}
