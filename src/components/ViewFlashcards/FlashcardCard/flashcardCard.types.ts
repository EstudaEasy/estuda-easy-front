import { Deck } from "@/types/deck";

export interface FlashcardCardProps {
  title: string;
  cardsCount: number;
  onClick?: () => void;
  className?: string;
  deck?: Deck;
  onEdit?: (deck: Deck) => void;
  onDelete?: (deck: Deck) => void;
}
