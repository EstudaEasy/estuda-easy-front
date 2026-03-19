import { Label } from "../ui/label";
import type { Quiz } from "./resourceTypes";

interface PreviewQuizProps {
  normalizedData: Quiz;
}

export function PreviewQuiz({ normalizedData }: PreviewQuizProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Título do Quiz</Label>
        <div className="mt-1 p-2 bg-gray-50 rounded text-sm font-medium">
          {normalizedData.title}
        </div>
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
        <Label className="mb-4 block">Perguntas ({normalizedData.items?.length || 0})</Label>
        <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
          {(normalizedData.items || []).map((item, i) => (
            <div key={i} className="border p-4 rounded bg-white shadow-sm flex flex-col gap-2">
              <div className="text-xs font-semibold text-gray-400">
                Questão {item.position ?? i + 1}
              </div>
              <p className="text-sm font-medium">{item.question}</p>
              {item.explanation && (
                <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                  Explicação: {item.explanation}
                </p>
              )}
              <div className="mt-2 space-y-1">
                {(item.options || []).map((opt, j) => (
                  <div
                    key={j}
                    className={`p-2 rounded border text-sm flex items-center gap-2 ${
                      opt.isCorrect ? "bg-green-50 border-green-200" : "bg-gray-50"
                    }`}
                  >
                    <span className="font-mono text-xs text-gray-400">
                      {opt.position ?? j + 1}.
                    </span>
                    <span
                      className={opt.isCorrect ? "font-medium text-green-900" : "text-gray-700"}
                    >
                      {opt.text}
                    </span>
                    {opt.isCorrect && (
                      <span className="ml-auto text-xs font-bold text-green-600">Correta</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
