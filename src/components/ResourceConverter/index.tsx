"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Loader2, Check, ArrowRight, X, ArrowLeft } from "lucide-react";
import DiaryService from "@/services/diary/DiaryService";
import DeckService from "@/services/deck/DeckService";
import QuizService from "@/services/quiz/QuizService";
import TaskService from "@/services/task/TaskService";
import ResourceConversionService from "@/services/resource/ResourceConversionService";
import { PreviewModal } from "./PreviewModal";
import {
  ResourceType,
  Resource,
  ConversionState,
  Message,
  IPayloadJSON,
  ResourceTargetType,
  isConversionAllowed,
  AVAILABLE_TOOLS,
  normalizeResources,
} from "./types";
import { AgentMessage } from "./messages/AgentMessage";
import { UserMessage } from "./messages/UserMessage";
import { ConversionMessage } from "./messages/ConversionMessage";
import { FinishConversionMessage } from "./messages/FinishConversionMessage";
import { ResetChatMessage } from "./messages/ResetChatMessage";
import { useResourceConverter } from "@/context/resourceConverter/ResourceConverterContext";
import TiaFalando from "@/assets/TIA_falando.png";

const DEFAULT_TIA_WELCOME =
  "Oi! Eu sou a tIA ✨ Posso te ajudar a transformar seus recursos entre Quiz, Deck e Task em poucos cliques. O que você quer converter agora?";

export function ResourceConverter({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "agent",
      content: DEFAULT_TIA_WELCOME,
      options: [
        {
          id: "convert",
          label: "Quero converter recursos",
          icon: "🔄",
        },
      ],
    },
  ]);

  const { pendingCompletion, clearCompletion } = useResourceConverter();
  const preFillHandledRef = useRef(false);

  const [conversionState, setConversionState] = useState<ConversionState>({});
  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [resourceStep, setResourceStep] = useState<"type" | "select">("type");
  const [currentStep, setCurrentStep] = useState<"source" | "target" | null>(null);
  const [selectedToolType, setSelectedToolType] = useState<string>("");
  const [toolResources, setToolResources] = useState<Resource[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [resourcesError, setResourcesError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<IPayloadJSON>({ data: null, type: null });
  const [previewType, setPreviewType] = useState<ResourceTargetType>(null);

  
  useEffect(() => {
    if (!open) {
      preFillHandledRef.current = false;
      return;
    }
    if (!pendingCompletion || preFillHandledRef.current) return;

    preFillHandledRef.current = true;

    const typeLabels: Record<string, string> = {
      quiz: "Quiz",
      deck: "Deck",
      task: "Tarefa",
    };
    const label = typeLabels[pendingCompletion.resourceType] ?? pendingCompletion.resourceType;

    const preFilledResource: Resource = {
      id: pendingCompletion.resourceId,
      resourceId: pendingCompletion.resourceId,
      name: pendingCompletion.resourceName,
    };

    setConversionState({
      sourceToolType: pendingCompletion.resourceType,
      sourceResource: preFilledResource,
    });

    setMessages([
      {
        id: "welcome",
        type: "agent",
        content: `Amei ver você concluindo o ${label} "${pendingCompletion.resourceName}"! Quer que eu converta esse conteúdo para outro formato agora?`,
        options: [
          { id: "convert-prefill", label: "Sim, vamos converter", icon: "✨" },
          { id: "no-thanks", label: "Vou deixar pra depois", icon: "🙂" },
        ],
      },
    ]);

    clearCompletion();
  }, [open, pendingCompletion, clearCompletion]);

  const handleSaveSuccess = () => {
    setMessages((prev) =>
      prev.map((m) =>
        m.type === "finish_conversion" ? { ...m, metadata: { ...m.metadata, saved: true } } : m,
      ),
    );
  };

  const toolLabelById = useMemo(() => {
    const map = new Map<string, string>();
    for (const t of AVAILABLE_TOOLS) map.set(t.id, t.name);
    return map;
  }, []);

  const appendUserMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        type: "user",
        content,
      },
    ]);
  };

  const appendAgentMessage = (content: string, options?: Message["options"]) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `agent-${Date.now()}`,
        type: "agent",
        content,
        options,
      },
    ]);
  };

  const appendConversionMessage = (content: string, payload?: any, targetType?: any) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `conversion-${Date.now()}`,
        type: "conversion",
        content,
        payload,
        targetType,
      },
    ]);
  };

  const appendFinishConversionMessage = (
    resourceName: string,
    sourceType: string,
    targetType: string,
    payload: any,
    conversionTargetType: ResourceTargetType,
    messageIdToDisable: string,
  ) => {
    setMessages((prev) => {
      const updatedPrev = prev.map((m) =>
        m.id === messageIdToDisable ? { ...m, actionDisabled: true } : m,
      );
      return [
        ...updatedPrev,
        {
          id: `finish-${Date.now()}`,
          type: "finish_conversion",
          content: `Convertido: ${resourceName}`,
          metadata: { resourceName, sourceType, targetType },
          payload,
          targetType: conversionTargetType,
        },
        {
          id: `reset-${Date.now()}`,
          type: "reset_chat",
          content: "Gostaria de converter outro recurso?",
        },
      ];
    });
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "welcome",
        type: "agent",
        content: DEFAULT_TIA_WELCOME,
        options: [
          {
            id: "convert",
            label: "Quero converter recursos",
            icon: "🔄",
          },
        ],
      },
    ]);
    setConversionState({});
    setIsPreviewOpen(false);
    setPreviewData({ data: null, type: null });
    setPreviewType(null);
  };

  const handleOptionClick = (optionId: string, messageId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? {
              ...m,
              options: m.options?.map((opt) => ({
                ...opt,
                clicked: opt.clicked || opt.id === optionId,
              })),
            }
          : m,
      ),
    );

    console.log("Messages:", messages);

    if (optionId === "convert") {
      appendUserMessage("Quero converter recursos.");
      appendAgentMessage("Perfeito! Me diz de onde vem o conteúdo e para onde você quer levar:");

      setTimeout(() => {
        appendConversionMessage("Escolha os recursos para a conversão");
      }, 800);
    }

    if (optionId === "convert-prefill") {
      appendUserMessage("Sim, quero converter agora!");
      appendAgentMessage("Perfeito! A origem já está pronta. Falta só você escolher o destino:");

      setTimeout(() => {
        appendConversionMessage("Escolha o formato de destino");
      }, 800);
    }

    if (optionId === "no-thanks") {
      appendUserMessage("Agora não, obrigado.");
      appendAgentMessage(
        "Sem problemas! Quando quiser, eu te ajudo a converter rapidinho. 💙",
        [{ id: "convert", label: "Quero converter recursos", icon: "🔄" }],
      );
    }
  };

  const handleSelectResourceType = (step: "source" | "target") => {
    if (step === "target" && !conversionState.sourceResource) {
      appendAgentMessage(
        "Primeiro selecione um recurso de origem para liberar os destinos possíveis.",
      );
      return;
    }
    setCurrentStep(step);
    setResourceStep("type");
    setSelectedToolType("");
    setResourceModalOpen(true);
  };

  const handleToolTypeSelected = async (toolId: string) => {
    setSelectedToolType(toolId);

    if (currentStep === "target") {
      setConversionState((prev) => ({
        ...prev,
        targetToolType: toolId,
        targetResource: {
          id: "new",
          resourceId: "new",
          name: `Novo ${toolLabelById.get(toolId) ?? toolId}`,
        },
      }));
      setResourceModalOpen(false);
      return;
    }

    setIsLoadingResources(true);
    setResourcesError(null);

    try {
      if (toolId === ResourceType.DIARY) {
        const res = await DiaryService.list();
        setToolResources(normalizeResources(toolId, res.data.diaries));
      } else if (toolId === ResourceType.DECK) {
        const res = await DeckService.list();
        setToolResources(normalizeResources(toolId, res.data.decks));
      } else if (toolId === ResourceType.QUIZ) {
        const res = await QuizService.list();
        setToolResources(normalizeResources(toolId, res.data.quizzes));
      } else if (toolId === ResourceType.TASK) {
        const res = await TaskService.list();
        setToolResources(normalizeResources(toolId, res.data.tasks));
      } else {
        setToolResources([]);
      }
      setResourceStep("select");
    } catch {
      setToolResources([]);
      setResourcesError("Não foi possível carregar seus recursos. Tente novamente.");
      setResourceStep("select");
    } finally {
      setIsLoadingResources(false);
    }
  };

  const handleResourceSelected = (resource: Resource) => {
    if (currentStep === "source") {
      const nextState: ConversionState = {
        sourceToolType: selectedToolType,
        sourceResource: resource,
        targetToolType: conversionState.targetToolType,
        targetResource: conversionState.targetResource,
      };

      if (
        nextState.targetToolType &&
        !isConversionAllowed(selectedToolType, nextState.targetToolType)
      ) {
        nextState.targetToolType = undefined;
        nextState.targetResource = undefined;
        appendAgentMessage(
          "Como você mudou a origem, eu limpei o destino para evitar uma conversão inválida.",
        );
      }

      setConversionState(nextState);
    } else if (currentStep === "target") {
      setConversionState((prev) => ({
        ...prev,
        targetToolType: selectedToolType,
        targetResource: resource,
      }));
    }
    setResourceModalOpen(false);
  };

  const handleConvert = (messageId: string) => {
    if (!conversionState.sourceResource || !conversionState.targetToolType) return;

    setIsConverting(true);
    appendUserMessage(
      `Converter ${conversionState.sourceResource.name} para ${conversionState.targetToolType}.`,
    );

    ResourceConversionService.convert(conversionState.sourceResource.resourceId, {
      sourceResourceId: conversionState.sourceResource.resourceId,
      targetResourceType: conversionState.targetToolType as "quiz" | "deck" | "task",
    })
      .then((res) => {
        let parsedData: any = res.data;
        if (typeof res.data === "string") {
          try {
            parsedData = JSON.parse(res.data);
          } catch (e) {
            console.error("Falha ao parsear JSON do recurso convertido", e);
          }
        }
        setPreviewData(parsedData as IPayloadJSON);
        setPreviewType(conversionState.targetToolType as ResourceTargetType);
        appendFinishConversionMessage(
          conversionState.sourceResource!.name,
          conversionState.sourceToolType!,
          conversionState.targetToolType!,
          parsedData,
          conversionState.targetToolType as ResourceTargetType,
          messageId,
        );
        setIsPreviewOpen(true);
      })
      .catch(() => {
        appendAgentMessage("Não consegui converter agora. Tente novamente em alguns instantes.");
      })
      .finally(() => {
        setIsConverting(false);
      });
  };

  const getAvailableToolsForStep = () => {
    if (currentStep === "source") {
      return AVAILABLE_TOOLS.filter((tool) => !tool.disabled);
    }

    if (currentStep === "target" && conversionState.sourceToolType) {
      return AVAILABLE_TOOLS.filter((tool) =>
        isConversionAllowed(conversionState.sourceToolType!, tool.id),
      );
    }

    return [];
  };

  const canConvert =
    conversionState.sourceResource &&
    conversionState.targetResource &&
    isConversionAllowed(conversionState.sourceToolType!, conversionState.targetToolType!);

  if (!open) return null;

  return (
    <>
      <div className="fixed bottom-24 right-6 z-50 w-96 h-125 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-linear-to-r from-blue-50 to-sky-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-white/80 shadow-sm bg-white">
              <Image
                src={TiaFalando}
                alt="tIA"
                width={40}
                height={40}
                className="h-full w-full object-cover object-top"
                quality={100}
                priority
              />
            </div>
            <div>
              <h2 className="font-semibold leading-tight text-gray-900">tIA</h2>
              <p className="text-xs text-gray-600">Sua assistente de conversao</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 hover:bg-white/70"
          >
            <X size={18} />
          </Button>
        </div>

        <ScrollArea className="flex-1 overflow-hidden">
          <div className="space-y-4 p-4 pr-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                {message.type === "user" && <UserMessage content={message.content} />}

                {message.type === "agent" && (
                  <AgentMessage message={message} onOptionClick={handleOptionClick} />
                )}

                {message.type === "conversion" && (
                  <ConversionMessage
                    message={message}
                    conversionState={conversionState}
                    canConvert={Boolean(canConvert)}
                    isConverting={isConverting}
                    onPreview={(payload, targetType) => {
                      setPreviewData(payload);
                      setPreviewType(targetType);
                      setIsPreviewOpen(true);
                    }}
                    onSelectSource={() => handleSelectResourceType("source")}
                    onSelectTarget={() => handleSelectResourceType("target")}
                    onConvert={handleConvert}
                  />
                )}

                {message.type === "finish_conversion" && (
                  <FinishConversionMessage
                    message={message}
                    onPreview={(payload, targetType) => {
                      setPreviewData(payload);
                      setPreviewType(targetType);
                      setIsPreviewOpen(true);
                    }}
                  />
                )}

                {message.type === "reset_chat" && (
                  <ResetChatMessage
                    content={message.content}
                    onReset={handleResetChat}
                    onClose={() => onOpenChange(false)}
                  />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Dialog open={resourceModalOpen} onOpenChange={setResourceModalOpen}>
        <DialogContent className="max-w-md">
          {resourceStep === "type" ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  Selecionar tipo de recurso ({currentStep === "source" ? "Origem" : "Destino"})
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                {getAvailableToolsForStep().map((tool) => (
                  <Button
                    key={tool.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleToolTypeSelected(tool.id)}
                  >
                    {tool.name}
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      setResourceStep("type");
                      setToolResources([]);
                      setResourcesError(null);
                    }}
                    aria-label="Voltar"
                  >
                    <ArrowLeft size={18} />
                  </Button>
                  <span>
                    Selecionar recurso ({currentStep === "source" ? "Origem" : "Destino"})
                  </span>
                </DialogTitle>
              </DialogHeader>
              {isLoadingResources ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="animate-spin" />
                </div>
              ) : resourcesError ? (
                <div className="space-y-3">
                  <p className="text-sm text-red-600">{resourcesError}</p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleToolTypeSelected(selectedToolType)}
                  >
                    Tentar novamente
                  </Button>
                </div>
              ) : (
                <ScrollArea className="w-full h-80">
                  <div className="space-y-2 pr-4">
                    {toolResources.map((resource) => (
                      <Button
                        key={resource.id}
                        variant="outline"
                        className="w-full max-w-full justify-start text-left h-auto py-3 overflow-hidden"
                        onClick={() => handleResourceSelected(resource)}
                      >
                        <div className="flex flex-col items-start w-full overflow-hidden min-w-0">
                          <span className="font-medium text-sm truncate w-full block">
                            {resource.name}
                          </span>
                          {resource.description && (
                            <span className="text-xs text-gray-500 line-clamp-2 w-full whitespace-normal wrap-break-word mt-1">
                              {resource.description}
                            </span>
                          )}
                          {resource.itemCount != null && (
                            <span className="text-xs text-gray-400 mt-1 block">
                              {resource.itemCount} itens
                            </span>
                          )}
                        </div>
                      </Button>
                    ))}

                    {toolResources.length === 0 && (
                      <div className="py-6 text-center text-sm text-gray-500">
                        Nenhum recurso encontrado.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <PreviewModal
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        type={previewType}
        payload={previewData}
        onSaveSuccess={handleSaveSuccess}
      />
    </>
  );
}
