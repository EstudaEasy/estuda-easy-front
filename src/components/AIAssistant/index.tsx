"use client";

import { Button } from "../ui/button";
import { ResourceConverter } from "../ResourceConverter";
import { Sparkles } from "lucide-react";
import { useResourceConverter } from "@/context/resourceConverter/ResourceConverterContext";

export function AiAssistant() {
  const { converterOpen, openConverter, closeConverter } = useResourceConverter();

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="icon-lg"
          className="rounded-full shadow-lg w-14 h-14 bg-blue-500 hover:bg-blue-600"
          aria-label="Assistente de IA"
          onClick={openConverter}
        >
          <Sparkles size={24} />
        </Button>
      </div>

      <ResourceConverter open={converterOpen} onOpenChange={(v) => !v && closeConverter()} />
    </>
  );
}
