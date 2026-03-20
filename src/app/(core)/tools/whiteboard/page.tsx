"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Page from "@/components/Page";
import ViewWhiteboard from "@/components/ViewWhiteboard/viewWhiteBoard";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import WhiteboardForm from "@/components/ViewWhiteboard/WhiteboardForm";
import { WhiteboardFormData } from "@/components/ViewWhiteboard/WhiteboardForm/whiteboardForm.schema";
import WhiteboardService from "@/services/whiteboard/WhiteboardService";
import { CreateWhiteboardRequest, WhiteboardResponse } from "@/types/whiteboard";
import { activityStorage } from "@/lib/activityStorage";
import { toast } from "sonner";

export default function Whiteboard() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingWhiteboard, setEditingWhiteboard] = useState<WhiteboardResponse | null>(null);

  const handleCreateWhiteboard = async (data: WhiteboardFormData) => {
    try {
      setIsCreating(true);
      const whiteboardData: CreateWhiteboardRequest = {
        title: data.title,
        content: {},
      };
      const response = await WhiteboardService.create(whiteboardData);
      setIsCreateModalOpen(false);
      setRefreshTrigger((prev) => prev + 1);
      router.push(`/tools/whiteboard/${response.data.id}`);
    } catch (error) {
      console.error("Erro ao criar quadro:", error);
      toast.error("Erro ao criar quadro. Tente novamente");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteWhiteboard = async () => {
    if (!editingWhiteboard) return;

    try {
      setIsDeleting(true);
      await WhiteboardService.delete(editingWhiteboard.id);
      activityStorage.removeActivity(editingWhiteboard.id);
      setIsDeleteDialogOpen(false);
      setIsEditModalOpen(false);
      setEditingWhiteboard(null);
      setRefreshTrigger((prev) => prev + 1);
      toast.success("Quadro excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir quadro:", error);
      toast.error("Erro ao excluir quadro. Tente novamente");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditWhiteboard = async (data: WhiteboardFormData) => {
    if (!editingWhiteboard) return;

    try {
      setIsEditing(true);
      await WhiteboardService.update(editingWhiteboard.id, {
        title: data.title,
      });
      setIsEditModalOpen(false);
      setEditingWhiteboard(null);
      setRefreshTrigger((prev) => prev + 1);
      toast.success("Quadro atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao editar quadro:", error);
      toast.error("Erro ao editar quadro. Tente novamente");
    } finally {
      setIsEditing(false);
    }
  };

  const openEditModal = (whiteboard: WhiteboardResponse) => {
    setEditingWhiteboard(whiteboard);
    setIsEditModalOpen(true);
  };

  return (
    <Page>
      <Page.Header
        title="WhiteBoard"
        subtitle="Desenhe, anote e organize suas ideias em um quadro interativo!"
        buttonIcon={<Plus />}
        buttonText="Criar Quadro"
        onButtonClick={() => setIsCreateModalOpen(true)}
      />

      <Page.Content>
        <ViewWhiteboard
          refreshTrigger={refreshTrigger}
          onCreateWhiteboard={() => setIsCreateModalOpen(true)}
          onEditWhiteboard={openEditModal}
          onDeleteWhiteboard={(whiteboard) => {
            setEditingWhiteboard(whiteboard);
            setIsDeleteDialogOpen(true);
          }}
        />
      </Page.Content>

      <Dialog
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          if (!isCreating) setIsCreateModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Novo Quadro</DialogTitle>
          </DialogHeader>
          <WhiteboardForm onSubmit={handleCreateWhiteboard} isLoading={isCreating} />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button type="submit" form="whiteboard-form" disabled={isCreating}>
              {isCreating ? "Criando..." : "Criar Quadro"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditModalOpen}
        onOpenChange={(open) => {
          if (!isEditing) setIsEditModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Quadro</DialogTitle>
          </DialogHeader>
          {editingWhiteboard && (
            <WhiteboardForm
              onSubmit={handleEditWhiteboard}
              initialData={{
                title: editingWhiteboard.title,
              }}
              isLoading={isEditing}
            />
          )}
          <DialogFooter className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isEditing || isDeleting}
              >
                Cancelar
              </Button>
              <Button type="submit" form="whiteboard-form" disabled={isEditing}>
                {isEditing ? "Atualizando..." : "Atualizar"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Quadro?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar este quadro? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteWhiteboard}
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
