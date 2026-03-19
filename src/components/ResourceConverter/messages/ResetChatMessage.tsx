import React from "react";
import { Button } from "../../ui/button";

interface ResetChatMessageProps {
  content?: string;
  onReset: () => void;
  onClose: () => void;
}

export function ResetChatMessage({ content, onReset, onClose }: ResetChatMessageProps) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm flex-shrink-0">
        🤖
      </div>
      <div className="bg-blue-50 rounded-lg p-4 flex-1 space-y-3">
        <p className="text-sm text-gray-900">{content}</p>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 bg-white" onClick={onReset}>
            Sim, converter outro
          </Button>
          <Button size="sm" variant="ghost" className="flex-1" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
