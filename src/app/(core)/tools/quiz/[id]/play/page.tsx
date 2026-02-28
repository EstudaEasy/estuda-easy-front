"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Quiz } from "@/types";
import QuizService from "@/services/quiz/QuizService";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LuArrowLeft } from "react-icons/lu";

export default function QuizPlayPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        setLoading(true);
        const response = await QuizService.getById(quizId);
        setQuiz(response.data);
        if (response.data.items?.[0]?.timeLimit) {
          setTimeRemaining(response.data.items[0].timeLimit);
        }
      } catch (err) {
        console.error("Erro ao buscar quiz:", err);
        alert("Não foi possível carregar o quiz");
        router.push(`/tools/quiz/${quizId}`);
      } finally {
        setLoading(false);
      }
    }

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId, router]);

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          handleNext();
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleSelectAnswer = (optionId: number) => {
    if (!quiz?.items) return;

    const currentQuestion = quiz.items[currentQuestionIndex];
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (!quiz?.items) return;

    if (currentQuestionIndex < quiz.items.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      const nextQuestion = quiz.items[nextIndex];
      if (nextQuestion.timeLimit) {
        setTimeRemaining(nextQuestion.timeLimit);
      } else {
        setTimeRemaining(null);
      }
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      const prevQuestion = quiz?.items?.[prevIndex];
      if (prevQuestion?.timeLimit) {
        setTimeRemaining(prevQuestion.timeLimit);
      } else {
        setTimeRemaining(null);
      }
    }
  };

  const handleFinish = () => {
    if (!quiz?.items) return;
    let correctCount = 0;

    quiz.items.forEach((question) => {
      const selectedOptionId = selectedAnswers[question.id];
      if (selectedOptionId) {
        const selectedOption = question.options?.find((opt) => opt.id === selectedOptionId);
        if (selectedOption?.isCorrect) {
          correctCount++;
        }
      }
    });
    router.push(`/tools/quiz/${quizId}/results?correct=${correctCount}&total=${quiz.items.length}`);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Typography variant="body-1" color="light">
          Carregando...
        </Typography>
      </div>
    );
  }

  if (!quiz || !quiz.items || quiz.items.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <Typography variant="body-1" color="error">
          Quiz não encontrado ou sem perguntas
        </Typography>
      </div>
    );
  }

  const currentQuestion = quiz.items[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.items.length) * 100;
  const selectedOptionId = selectedAnswers[currentQuestion.id];

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/tools/quiz/${quizId}`)}
          aria-label="Voltar"
        >
          <LuArrowLeft size={20} />
        </Button>

        <Typography
          variant="heading-4"
          weight="semibold"
          color="dark"
          className="flex-1 text-center truncate"
        >
          {quiz.title}
        </Typography>

        {timeRemaining !== null ? (
          <Typography
            variant="heading-4"
            weight="semibold"
            className={cn(
              "tabular-nums",
              timeRemaining <= 10 ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {formatTime(timeRemaining)}
          </Typography>
        ) : (
          <div className="w-16" />
        )}
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-1.5">
        <Typography variant="caption" color="light">
          Questão {currentQuestionIndex + 1} de {quiz.items.length}
        </Typography>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <Card>
        <CardContent className="py-6">
          <Typography variant="heading-4" weight="normal" color="dark">
            {currentQuestion.question}
          </Typography>
        </CardContent>
      </Card>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {currentQuestion.options?.map((option) => {
          const isSelected = selectedOptionId === option.id;
          return (
            <button
              key={option.id}
              onClick={() => handleSelectAnswer(option.id)}
              className={cn(
                "w-full rounded-lg border px-5 py-4 text-left text-sm font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isSelected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground",
              )}
            >
              {option.text}
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Voltar
        </Button>
        <Button className="flex-1" onClick={handleNext} disabled={!selectedOptionId}>
          {currentQuestionIndex === quiz.items.length - 1 ? "Finalizar" : "Próxima"}
        </Button>
      </div>
    </div>
  );
}
