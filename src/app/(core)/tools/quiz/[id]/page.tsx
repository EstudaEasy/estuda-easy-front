"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Quiz, QuizItem } from "@/types";
import QuizService from "@/services/quiz/QuizService";
import QuizItemService from "@/services/quiz/QuizItemService";
import ResourceConversionService from "@/services/resource/ResourceConversionService";
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
import { LuArrowLeft, LuPencil, LuPlay, LuPlus, LuTrash2, LuShare2 } from "react-icons/lu";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import LoadingState from "@/components/LoadingState";
import ShareResourceModal from "@/components/ShareResourceModal";
import { useResourcePermission } from "@/hooks/useResourcePermission";
import { getErrorMessage } from "@/lib/errorMessage";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QuizOption {
  text: string;
  isCorrect: boolean;
  position?: number;
}

interface QuizItemPayload {
  question: string;
  explanation?: string;
  position?: number;
  options: QuizOption[];
}

interface AIGeneratedPayload {
  data?: {
    items: QuizItemPayload[];
  };
  type?: string;
}

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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    questionId?: number;
    questionText?: string;
  }>({
    isOpen: false,
  });

  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [isAIPreviewOpen, setIsAIPreviewOpen] = useState(false);
  const [aiGeneratedPayload, setAIGeneratedPayload] = useState<AIGeneratedPayload | null>(null);
  const [isAISaving, setIsAISaving] = useState(false);

  const { canEdit } = useResourcePermission(quiz?.resourceId);

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
      toast.error(getErrorMessage(err, "Erro ao salvar pergunta. Tente novamente."));
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

      toast.success("Pergunta excluída com sucesso!");
    } catch (err) {
      console.error("Erro ao excluir pergunta:", err);
      toast.error(getErrorMessage(err, "Erro ao excluir pergunta. Tente novamente."));
    }
  };

  const handleGenerateWithAI = async () => {
    if (!quiz) return;

    try {
      setIsAIGenerating(true);

      // Call conversion service to generate questions via AI
      const conversionResponse = await ResourceConversionService.convert(quiz.resourceId, {
        sourceResourceId: quiz.resourceId,
        targetResourceType: "quiz",
      });

      // Parse response
      let parsedData: AIGeneratedPayload = {
        data: {
          items: [],
        },
      };
      if (typeof conversionResponse.data === "string") {
        try {
          parsedData = JSON.parse(conversionResponse.data) as AIGeneratedPayload;
        } catch (e) {
          console.error("Falha ao parsear JSON do recurso convertido", e);
        }
      } else if (conversionResponse.data) {
        parsedData = conversionResponse.data as unknown as AIGeneratedPayload;
      }

      setAIGeneratedPayload(parsedData);
      setIsAIPreviewOpen(true);
    } catch (err) {
      console.error("Erro ao gerar questões com IA:", err);
      toast.error("Erro ao gerar questões com IA. Tente novamente.");
    } finally {
      setIsAIGenerating(false);
    }
  };

  const handleSaveAIQuestions = async () => {
    if (!aiGeneratedPayload || !quiz) {
      toast.error("Dados de conversão inválidos");
      return;
    }

    try {
      setIsAISaving(true);
      const items = aiGeneratedPayload.data?.items || [];

      if (items.length === 0) {
        toast.error("Nenhuma questão foi gerada. Tente novamente");
        return;
      }

      // Create all quiz items in parallel
      await Promise.all(
        items.map((item: QuizItemPayload, index: number) =>
          QuizItemService.create(quizId, {
            question: item.question,
            explanation: item.explanation || "",
            position: item.position ?? (quiz.items?.length || 0) + index + 1,
            options: item.options.map((opt: QuizOption, j: number) => ({
              text: opt.text,
              isCorrect: opt.isCorrect,
              position: opt.position ?? j + 1,
            })),
          }),
        ),
      );

      // Reload quiz
      const response = await QuizService.getById(quizId);
      setQuiz(response.data);

      toast.success("Questões geradas com sucesso!");
      setIsAIPreviewOpen(false);
      setAIGeneratedPayload(null);
    } catch (error) {
      console.error("Erro ao salvar questões geradas:", error);
      toast.error("Erro ao salvar questões. Tente novamente");
    } finally {
      setIsAISaving(false);
    }
  };

  const openNewQuestionModal = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return <LoadingState message="Carregando quiz..." />;
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
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Voltar">
            <LuArrowLeft size={20} />
          </Button>
          <Typography variant="heading-3" color="primary">
            {quiz.title}
          </Typography>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => setIsShareModalOpen(true)}>
          <LuShare2 size={16} />
          Compartilhar
        </Button>
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
          {canEdit && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleGenerateWithAI}
                disabled={isAIGenerating}
                className="gap-2"
              >
                <Sparkles size={16} />
                {isAIGenerating ? "Gerando..." : "IA"}
              </Button>
              <Button onClick={openNewQuestionModal}>
                <LuPlus />
                Nova Pergunta
              </Button>
            </div>
          )}
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
                  {canEdit && (
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
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <Typography variant="body-1" color="light">
              Nenhuma pergunta criada ainda.
            </Typography>
            {canEdit && (
              <Typography variant="caption" color="light">
                Clique em "Nova Pergunta" para começar
              </Typography>
            )}
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

      {/* Modal de Preview de IA */}
      <Dialog open={isAIPreviewOpen} onOpenChange={setIsAIPreviewOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              Questões Geradas pela IA
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {aiGeneratedPayload?.data?.items && aiGeneratedPayload.data.items.length > 0 ? (
                aiGeneratedPayload.data.items.map((item: QuizItemPayload, index: number) => (
                  <div key={index} className="border rounded-lg p-4 bg-slate-50 space-y-3">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Questão {index + 1}</p>
                      <p className="text-base font-semibold mt-1">{item.question}</p>
                    </div>

                    {item.options && item.options.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-600">Opções:</p>
                        <div className="space-y-1 ml-2">
                          {item.options.map((option: QuizOption, optIndex: number) => (
                            <div
                              key={optIndex}
                              className={`flex items-start gap-2 p-2 rounded ${
                                option.isCorrect
                                  ? "bg-green-50 border border-green-200"
                                  : "bg-white border border-slate-200"
                              }`}
                            >
                              <span
                                className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold ${
                                  option.isCorrect
                                    ? "bg-green-500 text-white"
                                    : "bg-slate-300 text-slate-700"
                                }`}
                              >
                                {String.fromCharCode(65 + optIndex)}
                              </span>
                              <span className="text-sm">{option.text}</span>
                              {option.isCorrect && (
                                <span className="ml-auto text-xs font-semibold text-green-600">
                                  ✓ Correta
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.explanation && (
                      <div>
                        <p className="text-sm font-medium text-slate-600">Explicação:</p>
                        <p className="text-sm text-slate-700 mt-1">{item.explanation}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-32 text-slate-500">
                  {isAISaving ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Salvando...</span>
                    </div>
                  ) : (
                    "Nenhuma questão foi gerada"
                  )}
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAIPreviewOpen(false);
                setAIGeneratedPayload(null);
              }}
              disabled={isAISaving}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSaveAIQuestions}
              disabled={isAISaving || !aiGeneratedPayload?.data?.items?.length}
              className="gap-2"
            >
              {isAISaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isAISaving ? "Salvando..." : "Adicionar Questões"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {quiz && (
        <ShareResourceModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          resourceId={quiz.resourceId}
        />
      )}
    </div>
  );
}
