import React from "react";
import { Button } from "../../ui/button";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { Message, ConversionState } from "../types";

interface ConversionMessageProps {
  message: Message;
  conversionState: ConversionState;
  canConvert: boolean;
  isConverting: boolean;
  onPreview: (payload: any, targetType: any, messageId: string) => void;
  onSelectSource: () => void;
  onSelectTarget: () => void;
  onConvert: (messageId: string) => void;
}

export function ConversionMessage({
  message,
  conversionState,
  canConvert,
  isConverting,
  onPreview,
  onSelectSource,
  onSelectTarget,
  onConvert,
}: ConversionMessageProps) {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm flex-shrink-0">
        🤖
      </div>
      <div className="bg-blue-50 rounded-lg p-4 flex-1 space-y-3">
        <p className="text-sm font-medium text-gray-900">{message.content}</p>

        {message.payload != null && (
          <div className="mt-2 space-y-2 pb-2">
            <span className="text-xs text-gray-500 block">
              Recurso gerado pronto para uso.
            </span>
            <Button
              size="sm"
              variant={message.metadata?.saved ? "ghost" : "outline"}
              className={`w-full ${message.metadata?.saved ? "bg-gray-100 text-gray-500" : "bg-white"}`}
              disabled={message.metadata?.saved}
              onClick={() => onPreview(message.payload, message.targetType, message.id)}
            >
              {message.metadata?.saved ? "Recurso Salvo" : "Visualizar"}
            </Button>
          </div>
        )}

        <div className="space-y-2">
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">Origem</p>
            <Button
              variant={conversionState.sourceResource ? "default" : "outline"}
              size="sm"
              className="w-full justify-start text-left"
              onClick={onSelectSource}
              disabled={message.actionDisabled}
            >
              {conversionState.sourceResource ? (
                <>
                  <Check size={16} className="mr-2" />
                  {conversionState.sourceResource.name}
                </>
              ) : (
                "Selecionar recurso de origem"
              )}
            </Button>
          </div>

          {conversionState.sourceResource && conversionState.targetResource && (
            <div className="flex justify-center py-1">
              <ArrowRight size={20} className="text-gray-400" />
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">Destino</p>
            <Button
              variant={conversionState.targetResource ? "default" : "outline"}
              size="sm"
              className="w-full justify-start text-left"
              onClick={onSelectTarget}
              disabled={!conversionState.sourceResource || message.actionDisabled}
            >
              {conversionState.targetResource ? (
                <>
                  <Check size={16} className="mr-2" />
                  {conversionState.targetResource.name}
                </>
              ) : (
                "Selecionar recurso de destino"
              )}
            </Button>
          </div>

          {canConvert && !message.payload && !message.actionDisabled && (
            <Button
              onClick={() => onConvert(message.id)}
              className="w-full mt-3"
              size="sm"
              disabled={isConverting}
            >
              {isConverting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} />
                  Convertendo...
                </span>
              ) : (
                "Converter"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
