"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Page from "@/components/Page";
import { Typography } from "@/components/ui/typography";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EmptyToolState from "@/components/EmptyToolState/EmptyToolState";
import FlashcardCard from "@/components/ViewFlashcards/FlashcardCard";
import QuizCard from "@/components/ViewQuiz/QuizCard";
import WhiteboardCard from "@/components/ViewWhiteboard/WhiteBoardCard/whiteboardCard";
import DeckService from "@/services/deck/DeckService";
import QuizService from "@/services/quiz/QuizService";
import WhiteboardService from "@/services/whiteboard/WhiteboardService";
import DiaryService from "@/services/diary/DiaryService";
import TaskService from "@/services/task/TaskService";
import { Deck, DiaryResponse, Quiz, TaskResponse, WhiteboardResponse } from "@/types";

type SharedState = "loading" | "ready" | "error";

function SectionTitle({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center justify-between">
      <Typography variant="heading-4" color="dark">
        {title}
      </Typography>
      <Typography variant="caption" color="light">
        {count} {count === 1 ? "item" : "itens"}
      </Typography>
    </div>
  );
}

export default function SharedResourcesPage() {
  const router = useRouter();
  const [state, setState] = useState<SharedState>("loading");
  const [decks, setDecks] = useState<Deck[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [whiteboards, setWhiteboards] = useState<WhiteboardResponse[]>([]);
  const [diaries, setDiaries] = useState<DiaryResponse[]>([]);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);

  const hasAnyResource = useMemo(() => {
    return (
      decks.length > 0 ||
      quizzes.length > 0 ||
      whiteboards.length > 0 ||
      diaries.length > 0 ||
      tasks.length > 0
    );
  }, [decks.length, diaries.length, quizzes.length, tasks.length, whiteboards.length]);

  const fetchSharedResources = async () => {
    try {
      setState("loading");

      const [decksRes, quizzesRes, whiteboardsRes, diariesRes, tasksRes] = await Promise.all([
        DeckService.listShared(),
        QuizService.listShared(),
        WhiteboardService.listShared(),
        DiaryService.listShared(),
        TaskService.listShared(),
      ]);

      setDecks(decksRes.data.decks || []);
      setQuizzes(quizzesRes.data.quizzes || []);
      setWhiteboards(whiteboardsRes.data.whiteboards || []);
      setDiaries(diariesRes.data.diaries || []);
      setTasks(tasksRes.data.tasks || []);
      setState("ready");
    } catch (error) {
      console.error("Erro ao carregar recursos compartilhados:", error);
      setState("error");
    }
  };

  useEffect(() => {
    void fetchSharedResources();
  }, []);

  if (state === "loading") {
    return (
      <Page>
        <Page.Header
          title="Compartilhados"
          subtitle="Todos os recursos compartilhados com você em um só lugar."
          showButton={false}
        />
        <Page.Content>
          <div className="flex items-center justify-center p-12">
            <Typography variant="body-1" color="light">
              Carregando recursos compartilhados...
            </Typography>
          </div>
        </Page.Content>
      </Page>
    );
  }

  if (state === "error") {
    return (
      <Page>
        <Page.Header
          title="Compartilhados"
          subtitle="Todos os recursos compartilhados com você em um só lugar."
          showButton={false}
        />
        <Page.Content>
          <div className="flex flex-col items-center justify-center gap-4 p-12">
            <Typography variant="body-1" color="error">
              Não foi possível carregar seus recursos compartilhados.
            </Typography>
            <Button onClick={fetchSharedResources}>Tentar novamente</Button>
          </div>
        </Page.Content>
      </Page>
    );
  }

  return (
    <Page>
      <Page.Header
        title="Compartilhados"
        subtitle="Todos os recursos compartilhados com você em um só lugar."
        showButton={false}
      />

      <Page.Content className="space-y-8">
        {!hasAnyResource ? (
          <EmptyToolState
            title="Nenhum recurso compartilhado ainda"
            description="Quando alguém compartilhar um recurso com você, ele aparecerá aqui."
            actionLabel="Ir para dashboard"
            onAction={() => router.push("/home")}
          />
        ) : (
          <>
            {decks.length > 0 && (
              <section className="space-y-3">
                <SectionTitle title="Flashcards" count={decks.length} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {decks.map((deck) => (
                    <FlashcardCard
                      key={deck.id}
                      deck={deck}
                      title={deck.name}
                      cardsCount={deck.flashcards?.length || 0}
                      onClick={() => router.push(`/tools/flashcards/${deck.id}`)}
                    />
                  ))}
                </div>
              </section>
            )}

            {quizzes.length > 0 && (
              <section className="space-y-3">
                <SectionTitle title="Quiz" count={quizzes.length} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {quizzes.map((quiz) => (
                    <QuizCard
                      key={quiz.id}
                      quiz={quiz}
                      title={quiz.title}
                      questionsCount={quiz.items?.length || 0}
                      onClick={() => router.push(`/tools/quiz/${quiz.id}`)}
                    />
                  ))}
                </div>
              </section>
            )}

            {whiteboards.length > 0 && (
              <section className="space-y-3">
                <SectionTitle title="Whiteboard" count={whiteboards.length} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {whiteboards.map((whiteboard) => (
                    <WhiteboardCard
                      key={whiteboard.id}
                      whiteboard={whiteboard}
                      title={whiteboard.title}
                      createdAt={whiteboard.createdAt}
                      onClick={() => router.push(`/tools/whiteboard/${whiteboard.id}`)}
                    />
                  ))}
                </div>
              </section>
            )}

            {diaries.length > 0 && (
              <section className="space-y-3">
                <SectionTitle title="Diário" count={diaries.length} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {diaries.map((diary) => (
                    <Card
                      key={diary.id}
                      className="cursor-pointer transition-colors hover:bg-accent"
                      onClick={() => router.push("/tools/diary")}
                    >
                      <CardContent className="py-4">
                        <Typography variant="body-2" weight="semibold" color="dark">
                          {diary.title}
                        </Typography>
                        <Typography variant="caption" color="light">
                          Abrir em Diário
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {tasks.length > 0 && (
              <section className="space-y-3">
                <SectionTitle title="Tasks" count={tasks.length} />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {tasks.map((task) => (
                    <Card
                      key={task.id}
                      className="cursor-pointer transition-colors hover:bg-accent"
                      onClick={() => router.push("/tools/tasks")}
                    >
                      <CardContent className="py-4">
                        <Typography variant="body-2" weight="semibold" color="dark">
                          {task.name}
                        </Typography>
                        <Typography variant="caption" color="light">
                          Abrir em Tasks
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </Page.Content>
    </Page>
  );
}
