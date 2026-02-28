"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Quiz, QuizItem } from "@/types";
import QuizService from "@/services/quiz/QuizService";
import QuizItemService from "@/services/quiz/QuizItemService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import QuestionForm from "@/components/QuestionForm";
import { QuestionFormData } from "@/components/QuestionForm/questionForm.schema";
import { LuArrowLeft, LuPencil, LuPlay, LuPlus, LuTrash2 } from "react-icons/lu";

export default function QuizDetailPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizItem | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    questionId?: number;
    questionText?: string;
  }>({
    isOpen: false,
  });

  useEffect(() => {
    async function fetchQuiz() {
      try {
        setLoading(true);
        const response = await QuizService.getById(quizId);
        setQuiz(response.data);
      } catch (err) {
        console.error("Erro ao buscar quiz:", err);
        setError("Não foi possível carregar o quiz");
      } finally {
        setLoading(false);
      }
    }

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  const transformToFormData = (item: QuizItem): QuestionFormData => ({
    question: item.question,
    options:
      item.options?.map((opt) => ({
        text: opt.text,
        isCorrect: opt.isCorrect,
        position: opt.position,
      })) || [],
    position: item.position,
    timeLimit: item.timeLimit,
    explanation: item.explanation || "",
  });

  const handleCreateQuestion = async (data: QuestionFormData) => {
    try {
      setIsSubmitting(true);

      if (editingQuestion) {
        // Editar pergunta existente
        await QuizItemService.update(quizId, editingQuestion.id, data);
        console.log("Pergunta atualizada com sucesso!");
      } else {
        // Criar nova pergunta
        await QuizItemService.create(quizId, data);
        console.log("Pergunta criada com sucesso!");
      }

      // Recarregar o quiz
      const response = await QuizService.getById(quizId);
      setQuiz(response.data);

      // Fechar o modal e limpar estado de edição
      setIsModalOpen(false);
      setEditingQuestion(null);
    } catch (err) {
      console.error("Erro ao salvar pergunta:", err);
      alert("Erro ao salvar pergunta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditQuestion = (item: QuizItem) => {
    setEditingQuestion(item);
    setIsModalOpen(true);
  };

  const handleDeleteQuestion = async () => {
    if (!deleteConfirmation.questionId) return;

    try {
      await QuizItemService.delete(quizId, deleteConfirmation.questionId);

      // Recarregar o quiz
      const response = await QuizService.getById(quizId);
      setQuiz(response.data);

      // Fechar modal de confirmação
      setDeleteConfirmation({ isOpen: false });

      console.log("Pergunta excluída com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir pergunta:", err);
      alert("Erro ao excluir pergunta. Tente novamente.");
    }
  };

  const openNewQuestionModal = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Typography variant="body-1" color="light">
          Carregando...
        </Typography>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex flex-col items-center gap-4 p-12">
        <Typography variant="body-1" color="error">
          {error || "Quiz não encontrado"}
        </Typography>
        <Button variant="outline" onClick={() => router.back()}>
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Voltar">
          <LuArrowLeft size={20} />
        </Button>
        <Typography variant="heading-3" color="primary">
          {quiz.title}
        </Typography>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-2 py-4">
          {quiz.description && (
            <Typography variant="body-1" color="light">
              {quiz.description}
            </Typography>
          )}
          <div className="flex flex-wrap gap-4">
            <Typography variant="caption" color="light">
              Criado em: {new Date(quiz.createdAt).toLocaleDateString("pt-BR")}
            </Typography>
            {quiz.updatedAt && (
              <Typography variant="caption" color="light">
                Atualizado em: {new Date(quiz.updatedAt).toLocaleDateString("pt-BR")}
              </Typography>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Typography variant="heading-4" color="dark">
              Perguntas
            </Typography>
            <Badge variant="secondary">{quiz.items?.length || 0}</Badge>
          </div>
          <Button onClick={openNewQuestionModal}>
            <LuPlus />
            Nova Pergunta
          </Button>
        </div>

        <Separator />

        {quiz.items && quiz.items.length > 0 ? (
          <div className="flex flex-col gap-3">
            {quiz.items.map((item, index) => (
              <Card key={item.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div className="flex flex-col gap-1">
                    <Typography variant="body-2" weight="semibold" color="dark">
                      {index + 1}. {item.question}
                    </Typography>
                    <Typography variant="caption" color="light">
                      {item.options?.length || 0} alternativas
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleEditQuestion(item)}
                      aria-label="Editar pergunta"
                    >
                      <LuPencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() =>
                        setDeleteConfirmation({
                          isOpen: true,
                          questionId: item.id,
                          questionText: item.question,
                        })
                      }
                      aria-label="Excluir pergunta"
                    >
                      <LuTrash2 size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <Typography variant="body-1" color="light">
              Nenhuma pergunta criada ainda.
            </Typography>
            <Typography variant="caption" color="light">
              Clique em "Nova Pergunta" para começar
            </Typography>
          </div>
        )}
      </div>

      {quiz.items && quiz.items.length > 0 && (
        <Button className="w-full" onClick={() => router.push(`/tools/quiz/${quiz.id}/play`)}>
          <LuPlay />
          Iniciar Quiz
        </Button>
      )}

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!isSubmitting) {
            setIsModalOpen(open);
            if (!open) setEditingQuestion(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingQuestion ? "Editar Pergunta" : "Nova Pergunta"}</DialogTitle>
          </DialogHeader>
          <QuestionForm
            quizId={quizId}
            onSubmit={handleCreateQuestion}
            initialData={editingQuestion ? transformToFormData(editingQuestion) : undefined}
            isLoading={isSubmitting}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setEditingQuestion(null);
              }}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" form="question-form" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar Pergunta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteConfirmation.isOpen}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirmation({ isOpen: false });
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir Pergunta</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Typography variant="body-1" color="dark">
              Tem certeza que deseja excluir esta pergunta?
            </Typography>
            {deleteConfirmation.questionText && (
              <Typography variant="body-2" weight="semibold" color="primary">
                "{deleteConfirmation.questionText}"
              </Typography>
            )}
            <Typography variant="caption" color="light">
              Esta ação não pode ser desfeita.
            </Typography>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmation({ isOpen: false })}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteQuestion}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
