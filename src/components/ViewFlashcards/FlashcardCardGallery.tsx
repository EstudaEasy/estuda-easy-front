"use client";

import { useEffect, useState } from "react";
import FlashcardService from "@/services/deck/FlashcardService";
import { Flashcard } from "@/types";
import { LuPlus } from "react-icons/lu";
import { Button } from "../ui/button";

interface FlashcardCardGalleryProps {
  deckId: string;
  onStudyClick?: () => void;
  cardsCount?: number;
}

export default function FlashcardCardGallery({
  deckId,
  onStudyClick,
  cardsCount,
}: FlashcardCardGalleryProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);

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

  const openCreateModal = () => {
    setEditingCardId(null);
    setFrontText("");
    setBackText("");
    setIsModalOpen(true);
  };

  const openEditModal = (card: Flashcard) => {
    setEditingCardId(Number(card.id));
    setFrontText(card.front);
    setBackText(card.back);
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

  if (loading && flashcards.length === 0)
    return <p className="text-slate-500">Carregando as cartas...</p>;

  return (
    <div className="w-full flex flex-col items-center gap-5">
      <div className="flex flex-col justify-center items-center w-full gap-2.5">
        <Button
          onClick={onStudyClick}
          disabled={flashcards.length === 0}
          className="px-6 py-3 text-base h-auto flex items-center gap-2"
        >
          Estudar Deck
        </Button>
        <span className="text-slate-500 font-semibold text-base">
          Total: {cardsCount ?? flashcards.length} cartas
        </span>
      </div>

      <div className="flex flex-wrap gap-4 justify-center w-full">
        {flashcards.map((card) => (
          <div
            key={card.id}
            className="bg-blue-500 border border-slate-200 rounded-xl p-6 relative cursor-pointer transition-all duration-200 shadow-sm flex flex-col gap-3 text-center h-[450px] w-75 items-center justify-center hover:-translate-y-1 hover:border-blue-600 flex-shrink-0"
            onClick={() => openEditModal(card)}
            title="Clique para editar"
          >
            <div className="text-lg font-bold text-white break-words">{card.front}</div>
            <div className="text-sm text-gray-200 break-words">{card.back}</div>
          </div>
        ))}

        <div
          className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl h-[450px] w-75 flex items-center justify-center cursor-pointer text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:border-blue-500 hover:text-blue-500 hover:-translate-y-1 flex-shrink-0"
          onClick={openCreateModal}
          title="Criar Novo Flashcard"
        >
          <LuPlus size={48} />
        </div>

        {flashcards.length === 0 && (
          <p className="text-slate-500 text-center col-span-full py-10 text-base">
            Este deck ainda não tem flashcards. Crie um clicando na carta "+" ao lado!
          </p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
          <div className="bg-white p-7 rounded-2xl w-[90%] max-w-[400px] shadow-[0_10px_25px_rgba(0,0,0,0.2)]">
            <h3 className="text-[22px] font-bold text-slate-800 mb-6 text-center">
              {editingCardId ? "Editar Flashcard" : "Criar Novo Flashcard"}
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
