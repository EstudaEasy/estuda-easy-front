"use client";

import { useEffect, useState } from "react";
import FlashcardService from "@/services/deck/FlashcardService";
import { Flashcard } from "@/types";
import styles from "./styles.module.css";
import { Typography } from "../base";
import { LuCheck, LuEye, LuX, LuPlus, LuPencil } from "react-icons/lu";

interface FlashcardListProps {
  deckId: string;
}

export default function FlashcardList({ deckId }: FlashcardListProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCardId, setEditingCardId] = useState<number | null>(null);
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await FlashcardService.list(deckId);
      setFlashcards(response.data.flashcards);
    } catch (error) {
      console.error("Erro ao carregar flashcards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [deckId]);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectCount(correctCount + 1);
    } else {
      setWrongCount(wrongCount + 1);
    }

    setIsFlipped(false);

    if (currentIndex + 1 >= flashcards.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const openCreateModal = () => {
    setEditingCardId(null);
    setFrontText("");
    setBackText("");
    setIsModalOpen(true);
  };

  const openEditModal = () => {
    const currentCard = flashcards[currentIndex];
    if (!currentCard) return;

    setEditingCardId(Number(currentCard.id));
    setFrontText(currentCard.front);
    setBackText(currentCard.back);
    setIsModalOpen(true);
  };

  const handleSaveFlashcard = async () => {
    if (!frontText || !backText) return;

    const payload = {
      front: frontText,
      back: backText,
      position: flashcards.length + 1,
    };

    try {
      if (editingCardId) {
        await FlashcardService.update(deckId, String(editingCardId), payload);
      } else {
        await FlashcardService.create(deckId, payload);
      }

      await fetchCards();
      setIsModalOpen(false);
      setEditingCardId(null);
      setFrontText("");
      setBackText("");
    } catch (error) {
      console.error("Erro ao salvar flashcard:", error);
      alert("Falha ao salvar a carta. Verifique o console.");
    }
  };

  const handleDeleteFlashcard = async () => {
    if (!editingCardId) return;

    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta carta?");
    if (!confirmDelete) return;

    try {
      await FlashcardService.delete(deckId, String(editingCardId));
      setCurrentIndex(0);
      await fetchCards();
      setIsModalOpen(false);
      setEditingCardId(null);
      setFrontText("");
      setBackText("");
    } catch (error) {
      console.error("Erro ao excluir flashcard:", error);
      alert("Falha ao excluir a carta.");
    }
  };

  if (loading && flashcards.length === 0) return <p>Carregando as cartas...</p>;

  const currentCard = flashcards[currentIndex];

  return (
    <div className={styles.studyBoard}>
      {flashcards.length === 0 ? (
        <p>Este deck ainda não tem flashcards. Crie um no botão abaixo!</p>
      ) : (
        <>
          <div className={styles.hud}>
            <div className={styles.hudCard}>
              <div className={styles.hudLabel}>
                <span className={`${styles.dot} ${styles.dotRed}`}></span> Erros
              </div>
              <div className={styles.hudValue}>{wrongCount}</div>
            </div>

            <div className={styles.hudCard}>
              <div className={styles.hudLabel}>
                <span className={`${styles.dot} ${styles.dotGray}`}></span> Restantes
              </div>
              <div className={styles.hudValue}>{flashcards.length - currentIndex}</div>
            </div>

            <div className={styles.hudCard}>
              <div className={styles.hudLabel}>
                <span className={`${styles.dot} ${styles.dotGreen}`}></span> Acertos
              </div>
              <div className={styles.hudValue}>{correctCount}</div>
            </div>
          </div>

          <div className={styles.singleCardWrapper}>
            <button
              className={styles.editCardBtn}
              onClick={openEditModal}
              title="Editar Carta Atual"
            >
              <LuPencil size={20} />
            </button>
            <div className={`${styles.flashcardBlue} ${isFlipped ? styles.isFlipped : ""}`}>
              {isFlipped ? (
                <Typography variant="heading-1" color="white" weight="bold">
                  {currentCard?.back}
                </Typography>
              ) : (
                <Typography variant="heading-1" color="white" weight="bold">
                  {currentCard?.front}
                </Typography>
              )}
            </div>
          </div>

          <div className={styles.controls}>
            <button className={styles.btnWrong} onClick={() => handleAnswer(false)}>
              <LuX size={24} />
            </button>

            <button className={styles.btnFlip} onClick={() => setIsFlipped(!isFlipped)}>
              <LuEye size={24} />
            </button>

            <button className={styles.btnCorrect} onClick={() => handleAnswer(true)}>
              <LuCheck size={24} />
            </button>
          </div>
        </>
      )}

      <button className={styles.fabButton} onClick={openCreateModal}>
        <LuPlus size={30} />
      </button>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>
              {editingCardId ? "Editar Flashcard" : "Criar Novo Flashcard"}
            </h3>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Frente (Pergunta)</label>
              <input
                type="text"
                placeholder="Ex: Qual é a capital da França?"
                value={frontText}
                onChange={(e) => setFrontText(e.target.value)}
                className={styles.inputField}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Verso (Resposta)</label>
              <input
                type="text"
                placeholder="Ex: Paris"
                value={backText}
                onChange={(e) => setBackText(e.target.value)}
                className={styles.inputField}
              />
            </div>

            <div className={styles.modalActions}>
              <div>
                {editingCardId && (
                  <button onClick={handleDeleteFlashcard} className={styles.btnDelete}>
                    Excluir
                  </button>
                )}
              </div>
              <div className={styles.modalActionsRight}>
                <button onClick={() => setIsModalOpen(false)} className={styles.btnCancel}>
                  Cancelar
                </button>
                <button onClick={handleSaveFlashcard} className={styles.btnSubmit}>
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
