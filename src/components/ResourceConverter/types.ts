import type { DeckResponse, DiaryResponse, QuizResponse, TaskResponse } from "@/types";

export enum ResourceType {
  DIARY = "diary",
  QUIZ = "quiz",
  DECK = "deck",
  TASK = "task",
}

export type ConversionKey = `${ResourceType}->${ResourceType}`;

export interface Resource {
  id: string;
  resourceId: string;
  name: string;
  description?: string;
  itemCount?: number;
}

export interface ConversionState {
  sourceToolType?: string;
  sourceResource?: Resource;
  targetToolType?: string;
  targetResource?: Resource;
}

export type MessageType = "agent" | "user" | "conversion" | "finish_conversion" | "reset_chat";
export type ResourceTargetType = "deck" | "quiz" | "task" | null;

export interface Message {
  id: string;
  type: MessageType;
  content?: string;
  options?: Array<{ id: string; label: string; icon?: string; clicked?: boolean }>;
  payload?: any;
  targetType?: ResourceTargetType;
  metadata?: { resourceName?: string; sourceType?: string; targetType?: string; saved?: boolean };
  actionDisabled?: boolean;
}

export interface IPayloadJSON {
  data: any;
  type: ResourceTargetType;
}

export const SUPPORTED_CONVERSIONS: Set<ConversionKey> = new Set([
  `${ResourceType.DIARY}->${ResourceType.QUIZ}`,
  `${ResourceType.DIARY}->${ResourceType.DECK}`,
  `${ResourceType.DIARY}->${ResourceType.TASK}`,
  `${ResourceType.QUIZ}->${ResourceType.DECK}`,
  `${ResourceType.QUIZ}->${ResourceType.TASK}`,
  `${ResourceType.DECK}->${ResourceType.QUIZ}`,
  `${ResourceType.DECK}->${ResourceType.TASK}`,
]);

export const isConversionAllowed = (sourceType: string, targetType: string): boolean => {
  const key = `${sourceType}->${targetType}` as ConversionKey;
  return SUPPORTED_CONVERSIONS.has(key);
};

export const AVAILABLE_TOOLS = [
  { id: ResourceType.DIARY, name: "Diários", disabled: false },
  { id: ResourceType.DECK, name: "Decks", disabled: false },
  { id: ResourceType.QUIZ, name: "Quizzes", disabled: false },
  { id: ResourceType.TASK, name: "Tarefas", disabled: true },
];

export const truncate = (value: string, max = 120) => {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trimEnd()}…`;
};

export const normalizeResources = (
  toolId: string,
  data: DiaryResponse[] | DeckResponse[] | QuizResponse[] | TaskResponse[],
): Resource[] => {
  if (toolId === ResourceType.DIARY) {
    return (data as DiaryResponse[]).map((d) => ({
      id: d.id,
      resourceId: d.resourceId,
      name: d.title,
      description: truncate(d.content ?? "", 120),
    }));
  }

  if (toolId === ResourceType.DECK) {
    return (data as DeckResponse[]).map((d) => ({
      id: d.id,
      resourceId: d.resourceId,
      name: d.name,
      description: d.description,
      itemCount: d.flashcards?.length,
    }));
  }

  if (toolId === ResourceType.QUIZ) {
    return (data as QuizResponse[]).map((q) => ({
      id: q.id,
      resourceId: q.resourceId,
      name: q.title,
      description: q.description,
      itemCount: q.items?.length,
    }));
  }

  return (data as TaskResponse[]).map((t) => ({
    id: t.id,
    resourceId: t.resourceId,
    name: t.name,
    description: t.description,
  }));
};
