import React from "react";
import Image from "next/image";
import { Button } from "../../ui/button";
import TiaFalando from "@/assets/TIA_falando.png";

interface ResetChatMessageProps {
  content?: string;
  onReset: () => void;
  onClose: () => void;
}

export function ResetChatMessage({ content, onReset, onClose }: ResetChatMessageProps) {
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
