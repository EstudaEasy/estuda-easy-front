import type { Flashcard } from "./resourceTypes";

interface FlashcardPreviewItemProps {
  flashcard: Flashcard;
}

export function FlashcardPreviewItem({ flashcard }: FlashcardPreviewItemProps) {
  return (
    <div className="flex gap-2 h-20">
      <div className="flex-1 bg-white border border-slate-200 rounded-lg p-3 flex flex-col justify-between">
        <p className="text-xs text-slate-500 font-semibold uppercase">Frente</p>
        <p className="text-xs font-medium text-slate-700 line-clamp-2">{flashcard.front}</p>
      </div>
      <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3 flex flex-col justify-between">
        <p className="text-xs text-blue-600 font-semibold uppercase">Verso</p>
        <p className="text-xs font-medium text-blue-900 line-clamp-2">{flashcard.back}</p>
      </div>
    </div>
  );
}
