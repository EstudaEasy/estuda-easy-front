"use client";

import { useEffect, useState } from "react";
import FlashcardService from "@/services/deck/FlashcardService";
import { Flashcard } from "@/types";
import { LuPencil } from "react-icons/lu";
import { Typography } from "../ui/typography";
import { Progress } from "../ui/progress";

interface FlashcardStudyPlayProps {
  deckId: string;
  onFinish: (
    correctCount: number,
    wrongCount: number,
    ratings?: { easy: number; medium: number; hard: number; forgot: number },
  ) => void;
}

type CardRating = "easy" | "medium" | "hard" | "forgot" | null;

export default function FlashcardStudyPlay({ deckId, onFinish }: FlashcardStudyPlayProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const [easyCount, setEasyCount] = useState(0);
  const [mediumCount, setMediumCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);
  const [forgotCount, setForgotCount] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingCardId, setEditingCardId] = useState<number | null>(null);
  const [frontText, setFrontText] = useState("");
  const [backText, setBackText] = useState("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

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

  const handleRate = (rating: CardRating) => {
    if (!currentCard) return;

    if (rating === "easy") {
      setEasyCount(easyCount + 1);
      setCorrectCount(correctCount + 1);
    } else if (rating === "medium") {
      setMediumCount(mediumCount + 1);
      setCorrectCount(correctCount + 1);
    } else if (rating === "hard") {
      setHardCount(hardCount + 1);
      setWrongCount(wrongCount + 1);
    } else if (rating === "forgot") {
      setForgotCount(forgotCount + 1);
      setWrongCount(wrongCount + 1);
    }

    setIsFlipped(false);

    if (currentIndex + 1 >= flashcards.length) {
      onFinish(
        correctCount + (rating === "easy" || rating === "medium" ? 1 : 0),
        wrongCount + (rating === "hard" || rating === "forgot" ? 1 : 0),
        {
          easy: easyCount + (rating === "easy" ? 1 : 0),
          medium: mediumCount + (rating === "medium" ? 1 : 0),
          hard: hardCount + (rating === "hard" ? 1 : 0),
          forgot: forgotCount + (rating === "forgot" ? 1 : 0),
        },
      );
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const openEditModal = (cardToEdit: Flashcard) => {
    setEditingCardId(Number(cardToEdit.id));
    setFrontText(cardToEdit.front);
    setBackText(cardToEdit.back);
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

    setIsDeleting(true);
    try {
      await FlashcardService.delete(deckId, String(editingCardId));

      setIsModalOpen(false);
      setIsConfirmingDelete(false);
      setEditingCardId(null);
      setFrontText("");
      setBackText("");

      setTimeout(() => {
        fetchCards();
      }, 400);
    } catch (error) {
      console.error("Erro ao excluir flashcard:", error);
      alert("Falha ao excluir a carta.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && flashcards.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <Typography variant="body-1" color="light">
          Carregando as cartas...
        </Typography>
      </div>
    );
  }

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <Typography variant="body-1" color="light">
          Este deck não tem flashcards
        </Typography>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <Typography variant="caption" color="light">
          Carta {currentIndex + 1} de {flashcards.length}
        </Typography>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex justify-between gap-3 w-full">
        <div className="flex-1 bg-white border border-slate-200 rounded-xl py-3 px-0 flex flex-col items-center justify-center">
          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold uppercase">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Erros
          </div>
          <div className="text-xl font-extrabold text-slate-800 mt-1">{wrongCount}</div>
        </div>

        <div className="flex-1 bg-white border border-slate-200 rounded-xl py-3 px-0 flex flex-col items-center justify-center">
          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold uppercase">
            <span className="w-2 h-2 rounded-full bg-slate-300"></span> Restantes
          </div>
          <div className="text-xl font-extrabold text-slate-800 mt-1">
            {flashcards.length - currentIndex}
          </div>
        </div>

        <div className="flex-1 bg-white border border-slate-200 rounded-xl py-3 px-0 flex flex-col items-center justify-center">
          <div className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold uppercase">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Acertos
          </div>
          <div className="text-xl font-extrabold text-slate-800 mt-1">{correctCount}</div>
        </div>
      </div>

      <div className="w-full mb-4 flex justify-center relative">
        <button
          className="absolute -top-4 -right-4 w-11 h-11 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center cursor-pointer shadow-md z-10 transition-all duration-200 hover:text-blue-500 hover:scale-110"
          onClick={() => openEditModal(currentCard)}
          title="Editar Carta Atual"
        >
          <LuPencil size={20} />
        </button>
        <div
          className={`bg-blue-500 rounded-2xl w-75 h-[450px] flex items-center justify-center p-8 text-center shadow-lg cursor-pointer transition-all duration-300 overflow-hidden ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
          onClick={() => setIsFlipped(!isFlipped)}
          title="Clique para virar"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            <Typography
              variant="heading-4"
              color="white"
              weight="bold"
              className="break-words line-clamp-none text-center"
            >
              {isFlipped ? currentCard?.back : currentCard?.front}
            </Typography>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <p className="text-sm text-slate-500 text-center font-semibold">Como foi esse cartão?</p>
        <div className="grid grid-cols-2 gap-2 w-full">
          <button
            className="px-4 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all duration-200 hover:-translate-y-0.5 text-sm"
            onClick={() => handleRate("easy")}
          >
            ✓ Fácil
          </button>
          <button
            className="px-4 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-all duration-200 hover:-translate-y-0.5 text-sm"
            onClick={() => handleRate("medium")}
          >
            ◐ Médio
          </button>
          <button
            className="px-4 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-all duration-200 hover:-translate-y-0.5 text-sm"
            onClick={() => handleRate("hard")}
          >
            ✗ Difícil
          </button>
          <button
            className="px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-all duration-200 hover:-translate-y-0.5 text-sm"
            onClick={() => handleRate("forgot")}
          >
            ✗✗ Não Lembro
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
          <div className="bg-white p-7 rounded-2xl w-[90%] max-w-[400px] shadow-[0_10px_25px_rgba(0,0,0,0.2)]">
            <h3 className="text-[22px] font-bold text-slate-800 mb-6 text-center">
              Editar Flashcard
            </h3>

            <div className="flex flex-col mb-4 w-full">
              <label className="text-sm font-semibold text-slate-700 mb-1.5 text-left">
                Frente (Pergunta)
              </label>
              <input
                type="text"
                placeholder="Ex: Qual é a capital da França?"
                value={frontText}
                onChange={(e) => setFrontText(e.target.value)}
                className="w-full p-3.5 border border-slate-300 rounded-lg text-base text-slate-900 bg-white outline-none transition-colors duration-200 focus:border-blue-500 disabled:opacity-50 disabled:bg-slate-50"
                disabled={isSaving || isDeleting}
              />
            </div>

            <div className="flex flex-col mb-4 w-full">
              <label className="text-sm font-semibold text-slate-700 mb-1.5 text-left">
                Verso (Resposta)
              </label>
              <input
                type="text"
                placeholder="Ex: Paris"
                value={backText}
                onChange={(e) => setBackText(e.target.value)}
                className="w-full p-3.5 border border-slate-300 rounded-lg text-base text-slate-900 bg-white outline-none transition-colors duration-200 focus:border-blue-500 disabled:opacity-50 disabled:bg-slate-50"
                disabled={isSaving || isDeleting}
              />
            </div>

            <div className="flex justify-between items-center mt-2.5">
              <div>
                {editingCardId && (
                  <button
                    onClick={() => setIsConfirmingDelete(true)}
                    className="bg-transparent text-red-500 border border-red-500 px-5 py-3 rounded-lg cursor-pointer font-semibold transition-all duration-200 hover:not(:disabled):bg-red-500 hover:not(:disabled):text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSaving || isDeleting}
                  >
                    {isDeleting ? "Excluindo..." : "Excluir"}
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-100 text-slate-500 border-none px-5 py-3 rounded-lg cursor-pointer font-semibold transition-colors duration-200 hover:not(:disabled):bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSaving || isDeleting}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveFlashcard}
                  className="bg-blue-500 text-white border-none px-5 py-3 rounded-lg cursor-pointer font-semibold transition-colors duration-200 hover:not(:disabled):bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
                  disabled={isSaving || isDeleting}
                >
                  {isSaving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isConfirmingDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10001]">
          <div className="bg-white p-7 rounded-2xl w-[90%] max-w-[400px] shadow-[0_10px_25px_rgba(0,0,0,0.2)]">
            <h3 className="text-[20px] font-bold text-slate-800 mb-3 text-center">
              Excluir Flashcard?
            </h3>
            <p className="text-base text-slate-600 mb-6 text-center">
              Tem certeza que deseja excluir este flashcard? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setIsConfirmingDelete(false)}
                className="bg-slate-100 text-slate-500 border-none px-6 py-3 rounded-lg cursor-pointer font-semibold transition-colors duration-200 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteFlashcard}
                className="bg-red-500 text-white border-none px-6 py-3 rounded-lg cursor-pointer font-semibold transition-colors duration-200 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed flex-1"
                disabled={isDeleting}
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
