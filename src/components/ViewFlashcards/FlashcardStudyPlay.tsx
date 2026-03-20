"use client";

import { useEffect, useState } from "react";
import FlashcardService from "@/services/deck/FlashcardService";
import { Flashcard } from "@/types";
import { LuPencil } from "react-icons/lu";
import { Typography } from "../ui/typography";
import { Progress } from "../ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import FlashcardForm from "@/components/FlashcardForm";
import { FlashcardFormData } from "@/components/FlashcardForm/flashcardForm.schema";
import { toast } from "sonner";
import LoadingState from "@/components/LoadingState";

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

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

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

  const handleEditFlashcard = async (data: FlashcardFormData) => {
    if (!editingCard) return;

    try {
      setIsSaving(true);
      await FlashcardService.update(deckId, String(editingCard.id), {
        front: data.front,
        back: data.back,
        position: flashcards.length + 1,
      });
      setIsEditModalOpen(false);
      setEditingCard(null);
      await fetchCards();
      toast.success("Flashcard atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao editar flashcard:", error);
      toast.error("Erro ao atualizar flashcard. Tente novamente");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFlashcard = async () => {
    if (!editingCard) return;

    try {
      setIsDeleting(true);
      await FlashcardService.delete(deckId, String(editingCard.id));
      setIsDeleteDialogOpen(false);
      setIsEditModalOpen(false);
      setEditingCard(null);
      await fetchCards();
      toast.success("Flashcard excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir flashcard:", error);
      toast.error("Erro ao excluir flashcard. Tente novamente");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && flashcards.length === 0) {
    return <LoadingState message="Carregando as cartas..." />;
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
          onClick={() => {
            setEditingCard(currentCard);
            setIsEditModalOpen(true);
          }}
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
        <p className="text-sm text-slate-500 text-center font-semibold">
          Como foi esse cartão? Use as classificações de dificuldade para avaliar e a opção "Não
          lembro" para anotar um erro{" "}
        </p>
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
            ⚠ Difícil
          </button>
          <button
            className="px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-all duration-200 hover:-translate-y-0.5 text-sm"
            onClick={() => handleRate("forgot")}
          >
            ✗ Não Lembro
          </button>
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Editar Flashcard</DialogTitle>
          </DialogHeader>
          {editingCard && (
            <FlashcardForm
              initialData={{
                front: editingCard.front,
                back: editingCard.back,
              }}
              onSubmit={handleEditFlashcard}
              isLoading={isSaving}
            />
          )}
          <DialogFooter className="flex justify-between gap-2">
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isSaving || isDeleting}
            >
              Excluir
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isSaving || isDeleting}
              >
                Cancelar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Flashcard?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este flashcard? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFlashcard}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
