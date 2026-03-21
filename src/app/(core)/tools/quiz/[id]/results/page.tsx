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
import { useResourceConverter } from "@/context/resourceConverter/ResourceConverterContext";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import TiaFalando from "@/assets/TIA_falando.png";
import LoadingState from "@/components/LoadingState";

export default function QuizResultsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const quizId = params.id as string;
  const { notifyCompletion } = useResourceConverter();

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
    return <LoadingState message="Carregando resultado do quiz..." />;
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 p-6">
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
      <div className="flex w-full flex-col gap-3">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => router.push("/tools/quiz")}>
            Ver Quizzes
          </Button>
          <Button className="flex-1" onClick={() => router.push(`/tools/quiz/${quizId}/play`)}>
            Refazer Quiz
          </Button>
        </div>
        <Card className="w-full border-blue-100 bg-linear-to-r from-blue-50 to-sky-100 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="hidden h-16 w-16 shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-blue-200 sm:block">
              <Image
                src={TiaFalando}
                alt="tIA"
                width={64}
                height={64}
                className="h-full w-full object-cover object-top"
                quality={100}
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Typography variant="caption" className="text-blue-700" weight="semibold">
                Sugestao da tIA
              </Typography>
              <Typography variant="body-2" className="text-slate-700">
                Quer aproveitar seu resultado e transformar este quiz em outro formato para revisar
                melhor depois?
              </Typography>
              <Button
                className="w-full gap-2 bg-blue-600 hover:bg-blue-700 sm:w-fit"
                onClick={() => {
                  if (quiz) {
                    notifyCompletion({
                      resourceId: quizId,
                      resourceType: "quiz",
                      resourceName: quiz.title,
                    });
                  }
                }}
                disabled={!quiz}
              >
                <ArrowRight size={16} />
                Conversar com a tIA sobre este quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
