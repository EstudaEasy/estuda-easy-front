import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import DeckService from "@/services/deck/DeckService";
import FlashcardService from "@/services/deck/FlashcardService";
import QuizService from "@/services/quiz/QuizService";
import QuizItemService from "@/services/quiz/QuizItemService";
import TaskService from "@/services/task/TaskService";
import { IPayloadJSON } from "./types";
import { PreviewDeck } from "./PreviewDeck";
import { PreviewQuiz } from "./PreviewQuiz";
import { PreviewTask } from "./PreviewTask";
import type { Deck, Quiz, Task } from "./resourceTypes";

interface PreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "deck" | "quiz" | "task" | null;
  payload: IPayloadJSON;
  onSaveSuccess?: () => void;
}

export function PreviewModal({
  open,
  onOpenChange,
  type,
  payload,
  onSaveSuccess,
}: PreviewModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const [taskDate, setTaskDate] = useState("");
  const [taskStartTime, setTaskStartTime] = useState("");
  const [taskEndTime, setTaskEndTime] = useState("");

  const { data: normalizedData } = payload;

  useEffect(() => {
    if (!normalizedData) return;
    setIsDisabled(false);
  }, [payload]);

  const processDeckCreation = async () => {
    const deckData = normalizedData as Deck;
    const deckRes = await DeckService.create({
      name: deckData.name || "Novo Baralho",
      description: deckData.description || "",
    });
    const deckId = deckRes.data.id;

    if (deckData.flashcards && Array.isArray(deckData.flashcards)) {
      await Promise.all(
        deckData.flashcards.map((fc, i) =>
          FlashcardService.create(deckId, {
            front: fc.front,
            back: fc.back,
            position: fc.position ?? i + 1,
          }),
        ),
      );
    }
    toast.success("Baralho salvo com sucesso!");
  };

  const processQuizCreation = async () => {
    const quizData = normalizedData as Quiz;
    const quizRes = await QuizService.create({
      title: quizData.title || "Novo Quiz",
      description: quizData.description || "",
    });
    const quizId = quizRes.data.id;

    if (quizData.items && Array.isArray(quizData.items)) {
      await Promise.all(
        quizData.items.map((item, i) =>
          QuizItemService.create(quizId, {
            question: item.question,
            explanation: item.explanation || "",
            position: item.position ?? i + 1,
            options: item.options.map((opt, j) => ({
              text: opt.text,
              isCorrect: opt.isCorrect,
              position: opt.position ?? j + 1,
            })),
          }),
        ),
      );
    }
    toast.success("Quiz salvo com sucesso!");
  };

  const processTaskCreation = async () => {
    if (!taskDate) {
      toast.error("Por favor, selecione a data da tarefa.");
      throw new Error("Data da tarefa é obrigatória");
    }

    const taskData = normalizedData as Task;
    const [year, month, day] = taskDate.split("-").map(Number);
    
    const startDateObj = new Date(year, month - 1, day);
    if (taskStartTime) {
      const [hours, minutes] = taskStartTime.split(":").map(Number);
      startDateObj.setHours(hours, minutes, 0, 0);
    } else {
      startDateObj.setHours(0, 0, 0, 0);
    }

    let endDateStr: string | undefined = undefined;
    if (taskEndTime) {
      const endDateObj = new Date(year, month - 1, day);
      const [hours, minutes] = taskEndTime.split(":").map(Number);
      endDateObj.setHours(hours, minutes, 0, 0);
      endDateStr = endDateObj.toISOString();
    }

    await TaskService.create({
      name: taskData.name || "Nova Tarefa",
      description: taskData.description || "",
      status: "pending",
      startDate: startDateObj.toISOString(),
      endDate: endDateStr,
    });
    toast.success("Tarefa salva com sucesso!");
  };

  const handleSave = async () => {
    if (!payload || !type) return;

    setIsSaving(true);
    try {
      if (type === "deck") {
        await processDeckCreation();
      } else if (type === "quiz") {
        await processQuizCreation();
      } else if (type === "task") {
        await processTaskCreation();
      }

      onOpenChange(false);
      setIsDisabled(true);
      if (onSaveSuccess) onSaveSuccess();
    } catch (error) {
      console.error("Erro ao salvar recurso:", error);
      toast.error("Ocorreu um erro ao salvar o recurso.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!payload) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Mesa de Visualização</DialogTitle>
          <DialogDescription>
            Confira como ficou a geração do seu recurso. Faça ajustes se necessário e clique em
            salvar.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 mt-4 border rounded-md p-4">
          {type === "deck" && <PreviewDeck normalizedData={normalizedData} />}
          {type === "quiz" && <PreviewQuiz normalizedData={normalizedData} />}
          {type === "task" && (
            <PreviewTask
              normalizedData={normalizedData}
              taskDate={taskDate}
              taskStartTime={taskStartTime}
              taskEndTime={taskEndTime}
              onTaskDateChange={setTaskDate}
              onTaskStartTimeChange={setTaskStartTime}
              onTaskEndTimeChange={setTaskEndTime}
              isDisabled={isDisabled}
            />
          )}
        </ScrollArea>

        <DialogFooter className="mt-6 flex gap-3 sm:justify-end shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving || isDisabled}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
