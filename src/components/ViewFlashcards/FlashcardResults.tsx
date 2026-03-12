"use client";

import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Typography } from "../ui/typography";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";

interface FlashcardResultsProps {
  correctCount: number;
  wrongCount: number;
  deckTitle?: string;
  onRetry: () => void;
  onBack: () => void;
  easyCount?: number;
  mediumCount?: number;
  hardCount?: number;
  forgotCount?: number;
}

export default function FlashcardResults({
  correctCount,
  wrongCount,
  deckTitle = "Deck",
  onRetry,
  onBack,
  easyCount = 0,
  mediumCount = 0,
  hardCount = 0,
  forgotCount = 0,
}: FlashcardResultsProps) {
  const totalAnswered = correctCount + wrongCount;
  const percentage = totalAnswered === 0 ? 0 : Math.round((correctCount / totalAnswered) * 100);

  const getPerformanceData = () => {
    if (percentage === 100)
      return {
        title: "Perfeito!",
        message: "Você acertou todas as cartas! Parabéns pelo excelente desempenho!",
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

  return (
    <div className="flex flex-col items-center gap-6">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center gap-6 py-8">
          <div className="flex flex-col items-center gap-1 text-center">
            <Typography variant="heading-2" className={perf.color}>
              {perf.title}
            </Typography>
            <Typography variant="body-1" color="light">
              {perf.message}
            </Typography>
          </div>

          <div
            className={`flex h-32 w-32 items-center justify-center rounded-full border-4 ${perf.color.replace("text-", "border-")}`}
          >
            <Typography variant="heading-1" weight="bold" className={perf.color}>
              {percentage}%
            </Typography>
          </div>

          <Progress value={percentage} className="w-full h-3" />

          <Separator />

          <div className="grid grid-cols-3 w-full divide-x text-center">
            <div className="flex flex-col items-center gap-1 px-4">
              <Typography variant="heading-3" weight="semibold" color="dark">
                {correctCount}
              </Typography>
              <Typography variant="caption" color="light">
                Acertos
              </Typography>
            </div>
            <div className="flex flex-col items-center gap-1 px-4">
              <Typography variant="heading-3" weight="semibold" color="dark">
                {wrongCount}
              </Typography>
              <Typography variant="caption" color="light">
                Erros
              </Typography>
            </div>
            <div className="flex flex-col items-center gap-1 px-4">
              <Typography variant="heading-3" weight="semibold" color="dark">
                {totalAnswered}
              </Typography>
              <Typography variant="caption" color="light">
                Total
              </Typography>
            </div>
          </div>

          <Separator />
          <Typography variant="caption" color="light">
            Deck: <strong className="text-foreground">{deckTitle}</strong>
          </Typography>

          {(easyCount > 0 || mediumCount > 0 || hardCount > 0 || forgotCount > 0) && (
            <>
              <Separator />
              <div className="w-full">
                <Typography variant="caption" color="light" className="text-center block mb-4">
                  Classificação dos Cartões
                </Typography>
                <div className="grid grid-cols-4 gap-2 w-full text-center">
                  <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-emerald-50">
                    <Typography variant="heading-3" weight="semibold" className="text-emerald-600">
                      {easyCount}
                    </Typography>
                    <Typography variant="caption" color="light" className="text-xs">
                      Fácil
                    </Typography>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-blue-50">
                    <Typography variant="heading-3" weight="semibold" className="text-blue-600">
                      {mediumCount}
                    </Typography>
                    <Typography variant="caption" color="light" className="text-xs">
                      Médio
                    </Typography>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-amber-50">
                    <Typography variant="heading-3" weight="semibold" className="text-amber-600">
                      {hardCount}
                    </Typography>
                    <Typography variant="caption" color="light" className="text-xs">
                      Difícil
                    </Typography>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-red-50">
                    <Typography variant="heading-3" weight="semibold" className="text-red-600">
                      {forgotCount}
                    </Typography>
                    <Typography variant="caption" color="light" className="text-xs">
                      Não Lembro
                    </Typography>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3 w-full">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Voltar para o Deck
        </Button>
        <Button className="flex-1" onClick={onRetry}>
          Estudar Novamente
        </Button>
      </div>
    </div>
  );
}
