"use client";

import { useState } from "react";
import Page from "@/components/Page";
import ViewFlashcards from "@/components/ViewFlashcards/viewFlashcards";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import DeckForm from "@/components/DeckForm";
import { DeckFormData } from "@/components/DeckForm/deckForm.schema";
import { Deck } from "@/types";
import DeckService from "@/services/deck/DeckService";
import { toast } from "sonner";

export default function Flashcards() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);

  const handleCreateDeck = async (data: DeckFormData) => {
    try {
      setIsSaving(true);
      await DeckService.create({
        name: data.name,
        description: data.description || undefined,
      });
      setIsCreateModalOpen(false);
      setRefreshTrigger((prev) => prev + 1);
      toast.success("Deck criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar deck:", error);
      toast.error("Erro ao criar deck. Tente novamente");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditDeck = async (data: DeckFormData) => {
    if (!editingDeck) return;

    try {
      setIsSaving(true);
      await DeckService.update(editingDeck.id, {
        name: data.name,
        description: data.description || undefined,
      });
      setIsEditModalOpen(false);
      setEditingDeck(null);
      setRefreshTrigger((prev) => prev + 1);
      toast.success("Deck atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao editar deck:", error);
      toast.error("Erro ao editar deck. Tente novamente");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDeck = async () => {
    if (!editingDeck) return;

    try {
      setIsDeleting(true);
      await DeckService.delete(editingDeck.id);
      setIsDeleteDialogOpen(false);
      setIsEditModalOpen(false);
      setEditingDeck(null);
      setRefreshTrigger((prev) => prev + 1);
      toast.success("Deck excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir deck:", error);
      toast.error("Erro ao excluir deck. Tente novamente");
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = (deck: Deck) => {
    setEditingDeck(deck);
    setIsEditModalOpen(true);
  };

  return (
    <Page>
      <Page.Header
        title="Flashcards"
        subtitle="Reforce seu aprendizado e memorize informações de forma eficaz com nossos flashcards interativos!"
        buttonIcon={<Plus />}
        buttonText="Criar Deck"
        onButtonClick={() => setIsCreateModalOpen(true)}
      />
      <Page.Content>
        <ViewFlashcards
          refreshTrigger={refreshTrigger}
          onEditDeck={openEditModal}
          onDeleteDeck={(deck) => {
            setEditingDeck(deck);
            setIsDeleteDialogOpen(true);
          }}
          onCreateDeck={() => setIsCreateModalOpen(true)}
        />
      </Page.Content>

      <Dialog
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          if (!isSaving) setIsCreateModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Novo Deck</DialogTitle>
          </DialogHeader>
          <DeckForm onSubmit={handleCreateDeck} isLoading={isSaving} />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button type="submit" form="deck-form" disabled={isSaving}>
              {isSaving ? "Criando..." : "Criar Deck"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => {
          if (!isSaving) setIsEditModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Deck</DialogTitle>
          </DialogHeader>
          {editingDeck && (
            <DeckForm
              onSubmit={handleEditDeck}
              initialData={{
                name: editingDeck.name,
                description: editingDeck.description || "",
              }}
              isLoading={isSaving}
            />
          )}
          <DialogFooter className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button type="submit" form="deck-form" disabled={isSaving}>
                {isSaving ? "Atualizando..." : "Atualizar"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Deck?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Todos os flashcards neste deck serão removidos
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDeck}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  );
}
