"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Quiz } from "@/types";
import QuizService from "@/services/quiz/QuizService";
import { Button } from "@/components/base";
import { Typography } from "@/components/base/Typography";
import { LuArrowLeft } from "react-icons/lu";
import styles from "./styles.module.css";

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
      <div className={styles.container}>
        <Typography variant="body-1">Carregando...</Typography>
      </div>
    );
  }

  if (!quiz || !quiz.items || quiz.items.length === 0) {
    return (
      <div className={styles.container}>
        <Typography variant="body-1" color="danger">
          Quiz não encontrado ou sem perguntas
        </Typography>
      </div>
    );
  }

  const currentQuestion = quiz.items[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.items.length) * 100;
  const selectedOptionId = selectedAnswers[currentQuestion.id];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          onClick={() => router.push(`/tools/quiz/${quizId}`)}
          className={styles.backButton}
          aria-label="Voltar"
        >
          <LuArrowLeft size={24} />
        </button>

        <Typography
          variant="heading-2"
          weight="semibold"
          color="primary"
          as="h1"
          className={styles.headerTitle}
        >
          {quiz.title}
        </Typography>

        {timeRemaining !== null ? (
          <Typography
            variant="heading-2"
            weight="semibold"
            color={timeRemaining <= 10 ? "danger" : "danger"}
            as="span"
            className={styles.timer}
          >
            {formatTime(timeRemaining)}
          </Typography>
        ) : (
          <div className={styles.timerPlaceholder} />
        )}
      </div>

      <div className={styles.progressSection}>
        <Typography variant="body-1" weight="normal" as="p" className={styles.questionCounter}>
          Questão {currentQuestionIndex + 1}/{quiz.items.length}
        </Typography>

        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className={styles.questionCard}>
        <Typography variant="heading-2" weight="normal" as="h2" className={styles.questionText}>
          {currentQuestion.question}
        </Typography>
      </div>
      <div className={styles.optionsList}>
        {currentQuestion.options?.map((option) => {
          const isSelected = selectedOptionId === option.id;

          return (
            <button
              key={option.id}
              onClick={() => handleSelectAnswer(option.id)}
              className={`${styles.option} ${isSelected ? styles.optionSelected : ""}`}
            >
              <Typography variant="body-1" weight="normal" as="span">
                {option.text}
              </Typography>
            </button>
          );
        })}
      </div>

      <div className={styles.navigationButtons}>
        <Button
          variant="secondary"
          size="lg"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Voltar
        </Button>

        <Button variant="primary" size="lg" onClick={handleNext} disabled={!selectedOptionId}>
          {currentQuestionIndex === quiz.items.length - 1 ? "Finalizar" : "Próxima"}
        </Button>
      </div>
    </div>
  );
}
