import React from "react";
import { Button } from "../../ui/button";
import { Message } from "../types";

interface AgentMessageProps {
  message: Message;
  onOptionClick: (optionId: string, messageId: string) => void;
}

export function AgentMessage({ message, onOptionClick }: AgentMessageProps) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm flex-shrink-0">
        🤖
      </div>
      <div className="bg-blue-50 rounded-lg p-3 max-w-md">
        <p className="text-sm text-gray-900">{message.content}</p>
        {message.options && (
          <div className="flex flex-col gap-2 mt-3">
            {message.options.map((option) => (
              !option.clicked && (
                <Button
                  key={option.id}
                  variant="outline"
                  size="sm"
                  onClick={() => onOptionClick(option.id, message.id)}
                  className="justify-start"
                >
                  <span className="mr-2">{option.icon}</span>
                  {option.label}
                </Button>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
