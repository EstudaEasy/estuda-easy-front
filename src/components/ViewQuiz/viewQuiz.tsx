"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Quiz } from "@/types";
import QuizService from "@/services/quiz/QuizService";
import QuizCard from "./QuizCard";
import styles from "./styles.module.css";

export default function ViewQuiz() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Carregando quizzes...</p>
      </div>
    );
  }

  return (
    <div className={styles.quizzesContainer}>
      {quizzes.length === 0 ? (
        <p>Nenhum quiz encontrado. Crie seu primeiro quiz!</p>
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
  );
}
