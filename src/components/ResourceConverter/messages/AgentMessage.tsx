import React from "react";
import Image from "next/image";
import { Button } from "../../ui/button";
import { Message } from "../types";
import TiaFalando from "@/assets/TIA_falando.png";

interface AgentMessageProps {
  message: Message;
  onOptionClick: (optionId: string, messageId: string) => void;
}

export function AgentMessage({ message, onOptionClick }: AgentMessageProps) {
  return (
    <div className="flex gap-3">
      <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center shrink-0 ring-1 ring-blue-200">
        <Image
          src={TiaFalando}
          alt="Assistente TIA"
          width={36}
          height={36}
          className="h-full w-full object-cover object-top"
          quality={100}
          priority
        />
      </div>
      <div className="bg-blue-50 rounded-lg p-3 max-w-md">
        <p className="text-sm text-gray-900">{message.content}</p>
        {message.options && (
          <div className="flex flex-col gap-2 mt-3">
            {message.options.map(
              (option) =>
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
                ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
