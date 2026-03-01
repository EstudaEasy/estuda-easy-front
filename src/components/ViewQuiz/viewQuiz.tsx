"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Quiz } from "@/types";
import QuizService from "@/services/quiz/QuizService";
import QuizCard from "./QuizCard";
import { Typography } from "@/components/ui/typography";

interface ViewQuizProps {
  refreshTrigger?: number;
}

export default function ViewQuiz({ refreshTrigger }: ViewQuizProps) {
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
    </div>
  );
}
