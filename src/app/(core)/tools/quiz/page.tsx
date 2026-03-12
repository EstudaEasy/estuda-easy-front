"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Page from "@/components/Page";
import ViewQuiz from "@/components/ViewQuiz/viewQuiz";
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
import QuizForm from "@/components/QuizForm";
import { QuizFormData } from "@/components/QuizForm/quizForm.schema";
import QuizService from "@/services/quiz/QuizService";
import { CreateQuizRequest, Quiz } from "@/types";
import { toast } from "sonner";

export default function QuizPage() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  const handleCreateQuiz = async (data: QuizFormData) => {
    try {
      setIsCreating(true);
      const quizData: CreateQuizRequest = {
        title: data.title,
        description: data.description || undefined,
      };
      const response = await QuizService.create(quizData);
      setIsCreateModalOpen(false);
      setRefreshTrigger((prev) => prev + 1);
      router.push(`/tools/quiz/${response.data.id}`);
    } catch (error) {
      console.error("Erro ao criar quiz:", error);
      toast.error("Erro ao criar quiz. Tente novamente");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditQuiz = async (data: QuizFormData) => {
    if (!editingQuiz) return;

    try {
      setIsCreating(true);
      await QuizService.update(editingQuiz.id, {
        title: data.title,
        description: data.description || undefined,
      });
      setIsEditModalOpen(false);
      setEditingQuiz(null);
      setRefreshTrigger((prev) => prev + 1);
      toast.success("Quiz atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao editar quiz:", error);
      toast.error("Erro ao editar quiz. Tente novamente");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!editingQuiz) return;

    try {
      setIsDeleting(true);
      await QuizService.delete(editingQuiz.id);
      setIsDeleteDialogOpen(false);
      setIsEditModalOpen(false);
      setEditingQuiz(null);
      setRefreshTrigger((prev) => prev + 1);
      toast.success("Quiz excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir quiz:", error);
      toast.error("Erro ao excluir quiz. Tente novamente");
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setIsEditModalOpen(true);
  };

  return (
    <Page>
      <Page.Header
        title="Quiz"
        subtitle="Teste seus conhecimentos e aprenda de forma divertida com nossos quizzes interativos!"
        buttonIcon={<Plus />}
        buttonText="Criar Quiz"
        onButtonClick={() => setIsCreateModalOpen(true)}
      />

      <Page.Content>
        <ViewQuiz
          refreshTrigger={refreshTrigger}
          onEditQuiz={openEditModal}
          onDeleteQuiz={(quiz) => {
            setEditingQuiz(quiz);
            setIsDeleteDialogOpen(true);
          }}
        />
      </Page.Content>

      {/* Modal de Criação */}
      <Dialog
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          if (!isCreating) setIsCreateModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Criar Novo Quiz</DialogTitle>
          </DialogHeader>
          <QuizForm onSubmit={handleCreateQuiz} isLoading={isCreating} />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button type="submit" form="quiz-form" disabled={isCreating}>
              {isCreating ? "Criando..." : "Criar Quiz"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Quiz</DialogTitle>
          </DialogHeader>
          {editingQuiz && (
            <QuizForm
              initialData={{
                title: editingQuiz.title,
                description: editingQuiz.description || "",
              }}
              onSubmit={handleEditQuiz}
              isLoading={isCreating}
            />
          )}
          <DialogFooter className="flex justify-between gap-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isCreating || isDeleting}
              >
                Cancelar
              </Button>
              <Button type="submit" form="quiz-form" disabled={isCreating}>
                {isCreating ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar este quiz? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteQuiz}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deletando..." : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  );
}
