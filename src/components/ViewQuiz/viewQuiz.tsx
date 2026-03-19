"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Quiz } from "@/types";
import QuizService from "@/services/quiz/QuizService";
import QuizCard from "./QuizCard";
import { Typography } from "@/components/ui/typography";
import EmptyToolState from "@/components/EmptyToolState/EmptyToolState";

interface ViewQuizProps {
  refreshTrigger?: number;
  onEditQuiz?: (quiz: Quiz) => void;
  onDeleteQuiz?: (quiz: Quiz) => void;
  onCreateQuiz?: () => void;
}

export default function ViewQuiz({
  refreshTrigger,
  onEditQuiz,
  onDeleteQuiz,
  onCreateQuiz,
}: ViewQuizProps) {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, [refreshTrigger]);

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
      {quizzes.length === 0 ? (
        <EmptyToolState
          title="Não encontramos nada por aqui"
          description="Parece que você ainda não criou nenhum quiz. Bora dar o primeiro passo?"
          actionLabel="Criar Quiz"
          onAction={onCreateQuiz}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              title={quiz.title}
              questionsCount={quiz.items?.length || 0}
              quiz={quiz}
              onClick={() => router.push(`/tools/quiz/${quiz.id}`)}
              onEdit={onEditQuiz}
              onDelete={onDeleteQuiz}
            />
          ))}
        </div>
      )}
    </div>
  );
}
