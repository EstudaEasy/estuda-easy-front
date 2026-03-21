"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ResourceShareService from "@/services/resource/ResourceShareService";
import DeckService from "@/services/deck/DeckService";
import QuizService from "@/services/quiz/QuizService";
import WhiteboardService from "@/services/whiteboard/WhiteboardService";
import { Button } from "@/components/ui/button";

type ShareState = "loading" | "error";

function getAccessToken() {
  return localStorage.getItem("@EstudaEasy:accessToken");
}

async function resolveResourceRoute(resourceId: string) {
  const [deckShared, deckOwned, quizShared, quizOwned, whiteboardShared, whiteboardOwned] =
    await Promise.allSettled([
      DeckService.listShared(),
      DeckService.list(),
      QuizService.listShared(),
      QuizService.list(),
      WhiteboardService.listShared(),
      WhiteboardService.list(),
    ]);

  if (deckShared.status === "fulfilled") {
    const deck = deckShared.value.data.decks.find((item) => item.resourceId === resourceId);
    if (deck) return `/tools/flashcards/${deck.id}`;
  }

  if (deckOwned.status === "fulfilled") {
    const deck = deckOwned.value.data.decks.find((item) => item.resourceId === resourceId);
    if (deck) return `/tools/flashcards/${deck.id}`;
  }

  if (quizShared.status === "fulfilled") {
    const quiz = quizShared.value.data.quizzes.find((item) => item.resourceId === resourceId);
    if (quiz) return `/tools/quiz/${quiz.id}`;
  }

  if (quizOwned.status === "fulfilled") {
    const quiz = quizOwned.value.data.quizzes.find((item) => item.resourceId === resourceId);
    if (quiz) return `/tools/quiz/${quiz.id}`;
  }

  if (whiteboardShared.status === "fulfilled") {
    const whiteboard = whiteboardShared.value.data.whiteboards.find(
      (item) => item.resourceId === resourceId,
    );
    if (whiteboard) return `/tools/whiteboard/${whiteboard.id}`;
  }

  if (whiteboardOwned.status === "fulfilled") {
    const whiteboard = whiteboardOwned.value.data.whiteboards.find(
      (item) => item.resourceId === resourceId,
    );
    if (whiteboard) return `/tools/whiteboard/${whiteboard.id}`;
  }

  return null;
}

export default function ShareLinkPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const linkId = params.linkId as string;
  const resourceId = searchParams.get("resourceId");
  const [state, setState] = useState<ShareState>("loading");
  const [errorMessage, setErrorMessage] = useState("Processando link de compartilhamento...");

  const currentPath = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.pathname + window.location.search;
  }, []);

  useEffect(() => {
    async function consumeShareLink() {
      try {
        if (!linkId) {
          setErrorMessage("Link inválido.");
          setState("error");
          return;
        }

        const token = getAccessToken();
        if (!token) {
          router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`);
          return;
        }

        if (!resourceId) {
          setErrorMessage("Não foi possível identificar o recurso deste link.");
          setState("error");
          return;
        }

        await ResourceShareService.createFromLink(resourceId, linkId);
        const destinationRoute = await resolveResourceRoute(resourceId);

        if (!destinationRoute) {
          setErrorMessage(
            "Acesso concedido, mas não foi possível abrir o recurso automaticamente.",
          );
          setState("error");
          return;
        }

        router.replace(destinationRoute);
      } catch {
        setErrorMessage("Este link é inválido, expirou ou você não tem acesso.");
        setState("error");
      }
    }

    void consumeShareLink();
  }, [currentPath, linkId, resourceId, router]);

  if (state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-800">Acessando recurso compartilhado...</p>
          <p className="text-sm text-gray-500 mt-2">Isso pode levar alguns segundos.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full border rounded-lg p-6 text-center space-y-4 bg-white">
        <h1 className="text-lg font-semibold text-gray-900">Não foi possível abrir o link</h1>
        <p className="text-sm text-gray-600">{errorMessage}</p>
        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => router.replace("/home")}>
            Ir para home
          </Button>
          <Button onClick={() => router.refresh()}>Tentar novamente</Button>
        </div>
      </div>
    </div>
  );
}
