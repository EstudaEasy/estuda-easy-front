import React from "react";
import { Button } from "../../ui/button";
import { Message } from "../types";

interface FinishConversionMessageProps {
  message: Message;
  onPreview: (payload: any, targetType: any, messageId: string) => void;
}

export function FinishConversionMessage({ message, onPreview }: FinishConversionMessageProps) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm flex-shrink-0">
        🤖
      </div>
      <div className="bg-green-50 rounded-lg p-4 flex-1 space-y-3">
        <p className="text-sm font-medium text-gray-900">{message.content}</p>
        <div className="bg-white rounded p-3 space-y-2 text-xs text-gray-600">
          <div>
            <span className="font-semibold">De:</span> {message.metadata?.sourceType}
          </div>
          <div>
            <span className="font-semibold">Para:</span> {message.metadata?.targetType}
          </div>
        </div>
        {message.payload != null && (
          <Button
            size="sm"
            variant={message.metadata?.saved ? "ghost" : "outline"}
            className={`w-full ${message.metadata?.saved ? "bg-gray-100 text-gray-500" : "bg-white"}`}
            disabled={message.metadata?.saved}
            onClick={() => onPreview(message.payload, message.targetType, message.id)}
          >
            {message.metadata?.saved ? "Recurso Salvo" : "Visualizar Conteúdo"}
          </Button>
        )}
      </div>
    </div>
  );
}
