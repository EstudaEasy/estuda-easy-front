"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Quiz, CreateQuizRequest } from "@/types";
import QuizService from "@/services/quiz/QuizService";
import QuizCard from "./QuizCard";
import { Button } from "@/components/base";
import { Modal, ModalBody, ModalFooter } from "@/components/base";
import QuizForm from "@/components/QuizForm";
import { QuizFormData } from "@/components/QuizForm/quizForm.schema";
import { LuPlus } from "react-icons/lu";
import styles from "./styles.module.css";

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
      // Navegar para a página de detalhes do quiz recém-criado
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
      <div className={styles.loadingContainer}>
        <p>Carregando quizzes...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Meus Quizzes</h2>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          className={styles.createButton}
        >
          <LuPlus size={20} />
          Criar Quiz
        </Button>
      </div>

      <div className={styles.quizzesContainer}>
        {quizzes.length === 0 ? (
          <p className={styles.emptyMessage}>Nenhum quiz encontrado. Crie seu primeiro quiz!</p>
        ) : (
          quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              title={quiz.title}
              questionsCount={quiz.items?.length || 0}
              onClick={() => router.push(`/tools/quiz/${quiz.id}`)}
            />
          ))
        )}
      </div>

      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => !isCreating && setIsCreateModalOpen(false)}
          title="Criar Novo Quiz"
          size="md"
        >
          <ModalBody>
            <QuizForm onSubmit={handleCreateQuiz} isLoading={isCreating} />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={isCreating}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
              form="quiz-form"
              disabled={isCreating}
              onClick={() => {
                const form = document.querySelector("form");
                if (form) {
                  form.requestSubmit();
                }
              }}
            >
              {isCreating ? "Criando..." : "Criar Quiz"}
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
}
