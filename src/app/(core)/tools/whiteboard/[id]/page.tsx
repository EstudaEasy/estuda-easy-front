"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tldraw, Editor, getSnapshot, loadSnapshot } from "tldraw";
// @ts-ignore - TLDraw CSS
import "tldraw/tldraw.css";
import { Button } from "@/components/ui/button";
import WhiteboardService from "@/services/whiteboard/WhiteboardService";
import { WhiteboardResponse } from "@/types/whiteboard";
import { toast } from "sonner";
import { Save, ArrowLeft } from "lucide-react";

export default function WhiteboardEditor() {
  const params = useParams();
  const router = useRouter();
  const whiteboardId = params.id as string;

  const [editor, setEditor] = useState<Editor | null>(null);
  const [whiteboard, setWhiteboard] = useState<WhiteboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadWhiteboard();
  }, [whiteboardId]);

  useEffect(() => {
    if (editor && whiteboard && whiteboard.content) {
      try {
        if (Object.keys(whiteboard.content).length > 0) {
          loadSnapshot(editor.store, { document: whiteboard.content as any });
        }
      } catch (error) {
        console.error("Erro ao carregar conteúdo do quadro:", error);
        toast.error("Erro ao carregar o quadro");
      }
    }
  }, [editor, whiteboard]);

  async function loadWhiteboard() {
    try {
      setIsLoading(true);
      const response = await WhiteboardService.getById(whiteboardId);
      setWhiteboard(response.data);
    } catch (error) {
      console.error("Erro ao carregar quadro:", error);
      toast.error("Erro ao carregar o quadro");
      router.push("/tools/whiteboard");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    if (!editor || !whiteboard) return;

    try {
      setIsSaving(true);

      const snapshot = getSnapshot(editor.store);
      const contentToSave = snapshot.document;

      await WhiteboardService.update(whiteboardId, {
        title: whiteboard.title,
        content: contentToSave as any,
      });

      toast.success("Quadro salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar whiteBoard:", error);
      toast.error("Erro ao salvar whiteBoard. Tente novamente");
    } finally {
      setIsSaving(false);
    }
  }

  function handleMount(editor: Editor) {
    setEditor(editor);
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-700">Carregando quadro...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col">
      <div className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/tools/whiteboard")}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>

        <h1 className="text-xl font-bold text-gray-800">{whiteboard?.title}</h1>

        <Button onClick={handleSave} disabled={isSaving || !editor} className="gap-2">
          <Save size={16} />
          {isSaving ? "Salvando..." : "Salvar"}
        </Button>
      </div>

      <div className="flex-1 relative">
        <div className="absolute inset-0">
          <Tldraw onMount={handleMount} />
        </div>
      </div>
    </div>
  );
}
