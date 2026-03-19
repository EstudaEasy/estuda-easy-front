import { Label } from "../ui/label";
import type { Deck } from "./resourceTypes";
import { FlashcardPreviewItem } from "./FlashcardPreviewItem";

interface PreviewDeckProps {
  normalizedData: Deck;
}

export function PreviewDeck({ normalizedData }: PreviewDeckProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Nome do Baralho</Label>
        <div className="mt-1 p-2 bg-gray-50 rounded text-sm font-medium">{normalizedData.name}</div>
      </div>
      {normalizedData.description && (
        <div>
          <Label>Descrição</Label>
          <div className="mt-1 p-2 bg-gray-50 rounded text-sm text-gray-700">
            {normalizedData.description}
          </div>
        </div>
      )}
      <div>
        <Label className="mb-2 block">Flashcards ({normalizedData.flashcards?.length || 0})</Label>
        <div className="max-h-[400px] overflow-y-auto space-y-4">
          {(normalizedData.flashcards || []).map((fc, i) => (
            <FlashcardPreviewItem key={i} flashcard={fc} />
          ))}
        </div>
      </div>
    </div>
  );
}
