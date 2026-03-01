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
import QuizForm from "@/components/QuizForm";
import { QuizFormData } from "@/components/QuizForm/quizForm.schema";
import QuizService from "@/services/quiz/QuizService";
import { CreateQuizRequest } from "@/types";

export default function Quiz() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
      alert("Erro ao criar quiz. Tente novamente.");
    } finally {
      setIsCreating(false);
    }
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
        <ViewQuiz refreshTrigger={refreshTrigger} />
      </Page.Content>

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
    </Page>
  );
}
