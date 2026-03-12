import { Quiz } from "@/types";

export interface QuizCardProps {
  title: string;
  questionsCount: number;
  onClick?: () => void;
  className?: string;
  quiz?: Quiz;
  onEdit?: (quiz: Quiz) => void;
  onDelete?: (quiz: Quiz) => void;
}
