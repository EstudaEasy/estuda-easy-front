export interface QuizOption {
  text: string;
  isCorrect: boolean;
  position: number;
}

export interface QuizItem {
  question: string;
  explanation?: string;
  position: number;
  options: QuizOption[];
}

export interface Quiz {
  title: string;
  description: string;
  items: QuizItem[];
}

export interface Flashcard {
  front: string;
  back: string;
  position: number;
}

export interface Deck {
  name: string;
  description: string;
  flashcards: Flashcard[];
}

export interface Task {
  name: string;
  description: string;
}

export type ResourceData = Quiz | Deck | Task;
