"use client";

import { useEffect, useState } from "react";
import FlashcardService from "@/services/deck/FlashcardService";
import { Flashcard } from "@/types";
import styles from "./styles.module.css";
import { LuCheck, LuEye, LuX, LuPlus, LuPencil, LuPlay, LuArrowLeft } from "react-icons/lu";
import { Typography } from "../ui/typography";

interface FlashcardListProps {
  deckId: string;
}

export default function FlashcardList({ deckId }: FlashcardListProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState<"list" | "study">("list");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
      setIsFinished(true);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const startStudySession = () => {
    setCurrentIndex(0);
    setCorrectCount(0);
    setWrongCount(0);
    setIsFinished(false);
    setIsFlipped(false);
    setViewMode("study");
  };

  const handleRestart = () => {
    startStudySession();
  };

  const openCreateModal = () => {
    setEditingCardId(null);
    setFrontText("");
    setBackText("");
    setIsModalOpen(true);
  };

  const openEditModal = (cardToEdit?: Flashcard) => {
    const targetCard = cardToEdit || flashcards[currentIndex];
    if (!targetCard) return;

    setEditingCardId(Number(targetCard.id));
    setFrontText(targetCard.front);
    setBackText(targetCard.back);
    setIsModalOpen(true);
  };

  const handleSaveFlashcard = async () => {
    if (!frontText || !backText || isSaving || isDeleting) return;

    setIsSaving(true);
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

      setIsModalOpen(false);
      setEditingCardId(null);
      setFrontText("");
      setBackText("");

      setTimeout(() => {
        fetchCards();
      }, 400);
    } catch (error) {
      console.error("Erro ao salvar flashcard:", error);
      alert("Falha ao salvar a carta. Verifique o console.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFlashcard = async () => {
    if (!editingCardId || isSaving || isDeleting) return;

    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta carta?");
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await FlashcardService.delete(deckId, String(editingCardId));

      setIsModalOpen(false);
      setEditingCardId(null);
      setFrontText("");
      setBackText("");

      setTimeout(() => {
        setCurrentIndex(0);
        fetchCards();
      }, 400);
    } catch (error) {
      console.error("Erro ao excluir flashcard:", error);
      alert("Falha ao excluir a carta.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && flashcards.length === 0) return <p>Carregando as cartas...</p>;

  if (viewMode === "study" && isFinished) {
    const totalAnswered = correctCount + wrongCount;
    const percentage = totalAnswered === 0 ? 0 : Math.round((correctCount / totalAnswered) * 100);

    return (
      <div className={styles.resultsBoard}>
        <h2 className={styles.resultsTitle}>Deck Concluído!</h2>
        <div className={styles.resultsScore}>{percentage}%</div>

        <div className={styles.statsRow}>
          <div className={styles.statBox}>
            <span className={styles.statNumber}>{correctCount}</span>
            <span className={styles.statLabel}>Acertos</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statNumber}>{wrongCount}</span>
            <span className={styles.statLabel}>Erros</span>
          </div>
        </div>

        <button onClick={handleRestart} className={styles.btnRestart}>
          Estudar Novamente
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={styles.btnCancel}
          style={{ marginTop: "12px", width: "100%" }}
        >
          Voltar para a Lista
        </button>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className={styles.listContainer}>
      {viewMode === "list" ? (
        <>
          <div className={styles.listHeader}>
            <button
              className={styles.btnStartStudy}
              onClick={startStudySession}
              disabled={flashcards.length === 0}
            >
              <LuPlay size={20} /> Estudar Deck
            </button>
            <span className={styles.cardCount}>Total: {flashcards.length} cartas</span>
          </div>

          <div className={styles.flashcardsGrid}>
            {flashcards.map((card) => (
              <div
                key={card.id}
                className={styles.miniCard}
                onClick={() => openEditModal(card)}
                title="Clique para editar"
              >
                <div className={styles.miniCardFront}>{card.front}</div>
                <div className={styles.miniCardBack}>{card.back}</div>
              </div>
            ))}

            {/* O SEU NOVO BOTÃO DE CARTA CINZA */}
            <div
              className={styles.miniCardAdd}
              onClick={openCreateModal}
              title="Criar Novo Flashcard"
            >
              <LuPlus size={48} />
            </div>

            {flashcards.length === 0 && (
              <p className={styles.emptyMessage}>
                Este deck ainda não tem flashcards. Crie um clicando na carta "+" acima!
              </p>
            )}
          </div>
        </>
      ) : (
        <div className={styles.studyBoard}>
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
              onClick={() => openEditModal()}
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
        </div>
      )}

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
                disabled={isSaving || isDeleting}
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
                disabled={isSaving || isDeleting}
              />
            </div>

            <div className={styles.modalActions}>
              <div>
                {editingCardId && (
                  <button
                    onClick={handleDeleteFlashcard}
                    className={styles.btnDelete}
                    disabled={isSaving || isDeleting}
                  >
                    {isDeleting ? "Excluindo..." : "Excluir"}
                  </button>
                )}
              </div>
              <div className={styles.modalActionsRight}>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={styles.btnCancel}
                  disabled={isSaving || isDeleting}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveFlashcard}
                  className={styles.btnSubmit}
                  disabled={isSaving || isDeleting}
                >
                  {isSaving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
