"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Quiz } from "@/types";
import QuizService from "@/services/quiz/QuizService";
import { Button, Card, CardContent } from "@/components/base";
import { Typography } from "@/components/base/Typography";
import Image from "next/image";
import CompletedIllustration from "@/assets/undraw_completed_vjc6 (1).svg";
import styles from "./styles.module.css";

export default function QuizResultsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  const correctAnswers = parseInt(searchParams.get("correct") || "0");
  const totalQuestions = parseInt(searchParams.get("total") || "0");
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const response = await QuizService.getById(quizId);
        setQuiz(response.data);
      } catch (err) {
        console.error("Erro ao buscar quiz:", err);
      } finally {
        setLoading(false);
      }
    }

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  const getPerformanceMessage = () => {
    if (percentage === 100) {
      return {
        title: "Perfeito!",
        message: "Você acertou todas as questões! Parabéns pelo excelente desempenho!",
        color: "#10b981",
      };
    } else if (percentage >= 70) {
      return {
        title: "Muito bem!",
        message: "Ótimo desempenho! Continue assim!",
        color: "#3b82f6",
      };
    } else if (percentage >= 50) {
      return {
        title: "Bom trabalho!",
        message: "Você está no caminho certo. Continue praticando!",
        color: "#f59e0b",
      };
    } else {
      return {
        title: "Continue tentando!",
        message: "Não desanime! Revise o conteúdo e tente novamente.",
        color: "#ef4444",
      };
    }
  };

  const performanceData = getPerformanceMessage();

  if (loading) {
    return (
      <div className={styles.container}>
        <Typography variant="body-1">Carregando...</Typography>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* <div className={styles.illustrationContainer}>
        <Image
          src={CompletedIllustration}
          alt="Quiz completo"
          className={styles.illustration}
          width={300}
          height={300}
          priority
        />
      </div> */}
      <Card className={styles.resultCard}>
        <CardContent className={styles.resultContent}>
          <div className={styles.performanceHeader}>
            <Typography
              variant="heading-1"
              weight="bold"
              as="h1"
              style={{ color: performanceData.color }}
            >
              {performanceData.title}
            </Typography>
            <Typography variant="body-1" color="primary" as="p">
              {performanceData.message}
            </Typography>
          </div>

          <div className={styles.scoreSection}>
            <div className={styles.scoreCircle} style={{ borderColor: performanceData.color }}>
              <Typography
                variant="heading-1"
                weight="bold"
                as="span"
                className={styles.scorePercentage}
                style={{ color: performanceData.color }}
              >
                {percentage}%
              </Typography>
            </div>

            <div className={styles.scoreDetails}>
              <div className={styles.scoreItem}>
                <Typography variant="heading-2" weight="semibold" color="primary" as="div">
                  {correctAnswers}
                </Typography>
                <Typography variant="caption" color="primary" as="div">
                  Acertos
                </Typography>
              </div>

              <div className={styles.scoreDivider} />

              <div className={styles.scoreItem}>
                <Typography variant="heading-2" weight="semibold" color="primary" as="div">
                  {totalQuestions - correctAnswers}
                </Typography>
                <Typography variant="caption" color="primary" as="div">
                  Erros
                </Typography>
              </div>

              <div className={styles.scoreDivider} />

              <div className={styles.scoreItem}>
                <Typography variant="heading-2" weight="semibold" color="primary" as="div">
                  {totalQuestions}
                </Typography>
                <Typography variant="caption" color="primary" as="div">
                  Total
                </Typography>
              </div>
            </div>
          </div>

          {quiz && (
            <div className={styles.quizInfo}>
              <Typography variant="body-1" color="secondary" as="p">
                Quiz: <strong>{quiz.title}</strong>
              </Typography>
            </div>
          )}
        </CardContent>
      </Card>

      <div className={styles.actionsSection}>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => router.push("/tools")}
        >
          Ver Quizzes
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={() => router.push(`/tools/quiz/${quizId}/play`)}
        >
          Refazer Quiz
        </Button>
      </div>
    </div>
  );
}
