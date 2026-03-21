"use client";

import { useEffect, useState } from "react";
import FlashcardService from "@/services/deck/FlashcardService";
import { Flashcard } from "@/types";
import { LuPlay, LuPlus } from "react-icons/lu";
import { Button } from "../ui/button";
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
import FlashcardForm from "@/components/FlashcardForm";
import { FlashcardFormData } from "@/components/FlashcardForm/flashcardForm.schema";
import { toast } from "sonner";
import LoadingState from "@/components/LoadingState";
import { getErrorMessage } from "@/lib/errorMessage";

interface FlashcardCardGalleryProps {
  deckId: string;
  onStudyClick?: () => void;
  cardsCount?: number;
  canEdit?: boolean;
}

export default function FlashcardCardGallery({
  deckId,
  onStudyClick,
  cardsCount,
  canEdit = true,
}: FlashcardCardGalleryProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

  const openCreateModal = () => {
    setEditingCard(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (card: Flashcard) => {
    setEditingCard(card);
    setIsEditModalOpen(true);
  };

  const handleCreateFlashcard = async (data: FlashcardFormData) => {
    try {
      setIsSaving(true);
      await FlashcardService.create(deckId, {
        front: data.front,
        back: data.back,
        position: flashcards.length + 1,
      });
      setIsCreateModalOpen(false);
      await fetchCards();
      toast.success("Flashcard criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar flashcard:", error);
      toast.error(getErrorMessage(error, "Erro ao criar flashcard. Tente novamente"));
    } finally {
      setIsSaving(false);
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
      toast.error(getErrorMessage(error, "Erro ao atualizar flashcard. Tente novamente"));
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
      toast.error(getErrorMessage(error, "Erro ao excluir flashcard. Tente novamente"));
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading && flashcards.length === 0) return <LoadingState message="Carregando as cartas..." />;

  return (
    <div className="w-full flex flex-col items-center gap-5">
      <div className="flex flex-col justify-center items-center w-full gap-2.5">
        <Button
          onClick={onStudyClick}
          disabled={flashcards.length === 0}
          className="px-6 py-3 text-base h-auto flex items-center gap-2"
        >
          <LuPlay size={24} />
          Estudar Deck
        </Button>
        <span className="text-slate-500 font-semibold text-base">
          Total: {cardsCount ?? flashcards.length} cartas
        </span>
      </div>

      <div className="flex flex-wrap gap-4 justify-center w-full">
        {flashcards.map((card) => (
          <div
            key={`${deckId}-${card.id}`}
            className={`bg-blue-500 border border-slate-200 rounded-xl p-6 relative transition-all duration-200 shadow-sm flex flex-col gap-3 text-center h-112.5 w-75 items-center justify-center shrink-0 ${canEdit ? "cursor-pointer hover:-translate-y-1 hover:border-blue-600" : ""}`}
            onClick={() => canEdit && openEditModal(card)}
            title={canEdit ? "Clique para editar" : ""}
          >
            <div className="text-lg font-bold text-white wrap-break-word">{card.front}</div>
            <div className="text-sm text-gray-200 wrap-break-word">{card.back}</div>
          </div>
        ))}

        {canEdit && (
          <div
            className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl h-112.5 w-75 flex items-center justify-center cursor-pointer text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:border-blue-500 hover:text-blue-500 hover:-translate-y-1 shrink-0 flex-col"
            onClick={openCreateModal}
            title="Criar Novo Flashcard"
          >
            <LuPlus size={48} />
            {flashcards.length === 0 && canEdit && (
              <p className="text-slate-500 text-center col-span-full py-10 text-base">
                Este deck ainda não tem flashcards. Crie um clicando nesta carta!
              </p>
            )}
          </div>
        )}

        {flashcards.length === 0 && !canEdit && (
          <p className="text-slate-500 text-center col-span-full py-10 text-base">
            Este deck ainda não tem flashcards.
          </p>
        )}
      </div>

      <Dialog
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          if (!isSaving) setIsCreateModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Novo Flashcard</DialogTitle>
          </DialogHeader>
          <FlashcardForm onSubmit={handleCreateFlashcard} isLoading={isSaving} />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button type="submit" form="flashcard-form" disabled={isSaving}>
              {isSaving ? "Criando..." : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-100">
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
        <AlertDialogContent className="max-w-100">
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
