"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Quiz, QuizItem } from "@/types";
import QuizService from "@/services/quiz/QuizService";
import QuizItemService from "@/services/quiz/QuizItemService";
import { Button, Card, CardContent } from "@/components/base";
import { Typography } from "@/components/base/Typography";
import { Modal, ModalBody, ModalFooter } from "@/components/base";
import QuestionForm from "@/components/QuestionForm";
import { QuestionFormData } from "@/components/QuestionForm/questionForm.schema";
import { LuArrowLeft, LuPlus, LuPencil, LuPlay, LuTrash2 } from "react-icons/lu";
import styles from "./styles.module.css";

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
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; questionId?: number; questionText?: string }>({
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
    options: item.options?.map((opt) => ({
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
      <div className={styles.container}>
        <Typography variant="body-1">Carregando...</Typography>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className={styles.container}>
        <Typography variant="body-1" color="danger">
          {error || "Quiz não encontrado"}
        </Typography>
        <Button variant="secondary" onClick={() => router.back()} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => router.push('/tools')} className={styles.backButton}>
          <LuArrowLeft size={24} />
        </button>
        <Typography variant="heading-1" color="primary">
          {quiz.title}
        </Typography>
      </div>

      <Card className={styles.infoCard}>
        <CardContent className={styles.infoContent}>
          {quiz.description && (
            <Typography variant="body-1" color="secondary" className={styles.description}>
              {quiz.description}
            </Typography>
          )}
          <div className={styles.metadata}>
            <Typography variant="caption" color="secondary">
              Criado em: {new Date(quiz.createdAt).toLocaleDateString("pt-BR")}
            </Typography>
            {quiz.updatedAt && (
              <Typography variant="caption" color="secondary">
                Atualizado em: {new Date(quiz.updatedAt).toLocaleDateString("pt-BR")}
              </Typography>
            )}
          </div>
        </CardContent>
      </Card>

      <div className={styles.questionsSection}>
        <div className={styles.questionsSectionHeader}>
          <Typography variant="heading-2" color="primary">
            Perguntas ({quiz.items?.length || 0})
          </Typography>
          <Button
            variant="primary"
            size="md"
            onClick={openNewQuestionModal}
          >
            {/* <LuPlus size={20} /> */}
            Nova Pergunta
          </Button>
        </div>

        {quiz.items && quiz.items.length > 0 ? (
          <div className={styles.questionsList}>
            {quiz.items.map((item, index) => (
              <div key={item.id} className={styles.questionItem}>
                <div className={styles.questionContent}>
                  <Typography variant="body-1" weight="semibold" color="primary" as="div">
                    {index + 1}. {item.question}
                  </Typography>
                  <Typography variant="caption" color="primary" as="div">
                    {item.options?.length || 0} alternativas
                  </Typography>
                </div>
                <div className={styles.questionActions}>
                  <button
                    onClick={() => handleEditQuestion(item)}
                    className={styles.editButton}
                    aria-label="Editar pergunta"
                    title="Editar pergunta"
                  >
                    <LuPencil size={20} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmation({ isOpen: true, questionId: item.id, questionText: item.question })}
                    className={styles.deleteButton}
                    aria-label="Excluir pergunta"
                    title="Excluir pergunta"
                  >
                    <LuTrash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Typography variant="body-1" color="secondary">
              Nenhuma pergunta criada ainda.
            </Typography>
            <Typography variant="caption" color="secondary">
              Clique em "Nova Pergunta" para começar
            </Typography>
          </div>
        )}
      </div>

      {quiz.items && quiz.items.length > 0 && (
        <div className={styles.actionSection}>
          <Button
            variant="primary"
            size="full"
            onClick={() => {
              router.push(`/tools/quiz/${quiz.id}/play`);
            }}
          >
            <LuPlay size={20} />
            Iniciar Quiz
          </Button>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          if (!isSubmitting) {
            setIsModalOpen(false);
            setEditingQuestion(null);
          }
        }}
        title={editingQuestion ? "Editar Pergunta" : "Nova Pergunta"}
        size="lg"
        closeOnBackdropClick={!isSubmitting}
        closeOnEscape={!isSubmitting}
      >
        <ModalBody>
          <QuestionForm
            quizId={quizId}
            onSubmit={handleCreateQuestion}
            initialData={editingQuestion ? transformToFormData(editingQuestion) : undefined}
            isLoading={isSubmitting}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => {
              setIsModalOpen(false);
              setEditingQuestion(null);
            }}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="question-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Salvar Pergunta"}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false })}
        title="Excluir Pergunta"
        size="sm"
      >
        <ModalBody>
          <div className={styles.deleteConfirmation}>
            <Typography variant="body-1" as="p">
              Tem certeza que deseja excluir esta pergunta?
            </Typography>
            {deleteConfirmation.questionText && (
              <Typography variant="body-1" weight="semibold" color="primary" as="p" className={styles.deleteQuestionPreview}>
                "{deleteConfirmation.questionText}"
              </Typography>
            )}
            <Typography variant="caption" color="secondary" as="p">
              Esta ação não pode ser desfeita.
            </Typography>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => setDeleteConfirmation({ isOpen: false })}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteQuestion}
          >
            Excluir
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
