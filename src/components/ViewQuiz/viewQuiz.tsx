"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Quiz, CreateQuizRequest } from "@/types";
import QuizService from "@/services/quiz/QuizService";
import QuizCard from "./QuizCard";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import QuizForm from "@/components/QuizForm";
import { QuizFormData } from "@/components/QuizForm/quizForm.schema";
import PageHeader from "../PageHeader";

export default function ViewQuiz() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  async function fetchQuizzes() {
    try {
      setLoading(true);
      const response = await QuizService.list();
      setQuizzes(response.data.quizzes);
    } catch (error) {
      console.error("Erro ao buscar quizzes:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateQuiz = async (data: QuizFormData) => {
    try {
      setIsCreating(true);
      const quizData: CreateQuizRequest = {
        title: data.title,
        description: data.description || undefined,
      };
      const response = await QuizService.create(quizData);
      setIsCreateModalOpen(false);
      await fetchQuizzes();
      router.push(`/tools/quiz/${response.data.id}`);
    } catch (error) {
      console.error("Erro ao criar quiz:", error);
      alert("Erro ao criar quiz. Tente novamente.");
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Typography variant="body-1" color="light">
          Carregando quizzes...
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Meus Quizzes"
        buttonText="Criar Quiz"
        onButtonClick={() => setIsCreateModalOpen(true)}
      />

      <Separator />

      {quizzes.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <Typography variant="body-1" color="light">
            Nenhum quiz encontrado. Crie seu primeiro quiz!
          </Typography>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              title={quiz.title}
              questionsCount={quiz.items?.length || 0}
              onClick={() => router.push(`/tools/quiz/${quiz.id}`)}
            />
          ))}
        </div>
      )}

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
    </div>
  );
}
