"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Quiz } from "@/types";
import QuizService from "@/services/quiz/QuizService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

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

  const getPerformanceData = () => {
    if (percentage === 100)
      return {
        title: "Perfeito!",
        message: "Você acertou todas as questões! Parabéns pelo excelente desempenho!",
        color: "text-emerald-500",
        progressClass: "bg-emerald-500",
      };
    if (percentage >= 70)
      return {
        title: "Muito bem!",
        message: "Ótimo desempenho! Continue assim!",
        color: "text-blue-500",
        progressClass: "bg-blue-500",
      };
    if (percentage >= 50)
      return {
        title: "Bom trabalho!",
        message: "Você está no caminho certo. Continue praticando!",
        color: "text-amber-500",
        progressClass: "bg-amber-500",
      };
    return {
      title: "Continue tentando!",
      message: "Não desanime! Revise o conteúdo e tente novamente.",
      color: "text-red-500",
      progressClass: "bg-red-500",
    };
  };

  const perf = getPerformanceData();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Typography variant="body-1" color="light">
          Carregando...
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6 max-w-lg mx-auto">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center gap-6 py-8">
          {/* Performance title & message */}
          <div className="flex flex-col items-center gap-1 text-center">
            <Typography variant="heading-2" className={perf.color}>
              {perf.title}
            </Typography>
            <Typography variant="body-1" color="light">
              {perf.message}
            </Typography>
          </div>

          {/* Score circle */}
          <div
            className={`flex h-32 w-32 items-center justify-center rounded-full border-4 ${perf.color.replace("text-", "border-")}`}
          >
            <Typography variant="heading-1" weight="bold" className={perf.color}>
              {percentage}%
            </Typography>
          </div>

          {/* Progress bar */}
          <Progress value={percentage} className="w-full h-3" />

          <Separator />

          {/* Score breakdown */}
          <div className="grid grid-cols-3 w-full divide-x text-center">
            <div className="flex flex-col items-center gap-1 px-4">
              <Typography variant="heading-3" weight="semibold" color="dark">
                {correctAnswers}
              </Typography>
              <Typography variant="caption" color="light">
                Acertos
              </Typography>
            </div>
            <div className="flex flex-col items-center gap-1 px-4">
              <Typography variant="heading-3" weight="semibold" color="dark">
                {totalQuestions - correctAnswers}
              </Typography>
              <Typography variant="caption" color="light">
                Erros
              </Typography>
            </div>
            <div className="flex flex-col items-center gap-1 px-4">
              <Typography variant="heading-3" weight="semibold" color="dark">
                {totalQuestions}
              </Typography>
              <Typography variant="caption" color="light">
                Total
              </Typography>
            </div>
          </div>

          {/* Quiz name */}
          {quiz && (
            <>
              <Separator />
              <Typography variant="caption" color="light">
                Quiz: <strong className="text-foreground">{quiz.title}</strong>
              </Typography>
            </>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex w-full gap-3">
        <Button variant="outline" className="flex-1" onClick={() => router.push("/tools/quiz")}>
          Ver Quizzes
        </Button>
        <Button className="flex-1" onClick={() => router.push(`/tools/quiz/${quizId}/play`)}>
          Refazer Quiz
        </Button>
      </div>
    </div>
  );
}
