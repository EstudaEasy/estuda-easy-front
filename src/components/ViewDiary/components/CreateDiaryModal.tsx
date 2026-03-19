"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { diarySchema, DiaryFormData } from "../schemas/diarySchema";
import DiaryService from "@/services/diary/DiaryService";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { Mic, Trash2, Play, Square } from "lucide-react";
import { useState } from "react";

interface Props {
  open: boolean;
  selectedDate: Date;
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

export function CreateDiaryModal({ open, selectedDate, onSuccess, onOpenChange }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DiaryFormData>({
    resolver: zodResolver(diarySchema),
  });

  const {
    isRecording,
    audioUrl,
    audioBlob,
    startRecording,
    stopRecording,
    clearRecording,
    recordingDuration,
  } = useAudioRecorder();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const onSubmit = async (data: DiaryFormData) => {
    try {
      const response = await DiaryService.create({
        title: data.title,
        content:
          data.content || `[Pensamento em ${new Date(selectedDate).toLocaleDateString("pt-BR")}]`,
      });

      const createdDiary = response.data;

      if (createdDiary?.id && audioBlob) {
        const audioFormData = new FormData();

        const audioFile = new File([audioBlob], "audio.webm", {
          type: "audio/webm",
        });

        audioFormData.append("file", audioFile);

        await DiaryService.uploadAudio(createdDiary.id, audioFormData);
      }

      toast.success("Pensamento e áudio salvos!");
      reset();
      clearRecording();
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Erro completo:", error);
      toast.error("Erro ao salvar pensamento ou áudio.");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!isSubmitting) {
          onOpenChange(newOpen);
          if (!newOpen) {
            reset();
            clearRecording();
          }
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Pensamento</DialogTitle>
        </DialogHeader>
        <form id="create-diary-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">Título do Pensamento</label>
            <input
              {...register("title")}
              placeholder="Ex: Reflexão sobre o dia"
              className="w-full border border-gray-200 p-3 rounded-xl text-gray-900 focus:border-blue-500 outline-none bg-gray-50"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">Descrição (Texto)</label>
            <textarea
              {...register("content")}
              placeholder="Escreva seu pensamento aqui..."
              className="w-full border border-gray-200 p-3 rounded-xl min-h-[100px] text-gray-900 focus:border-blue-500 outline-none bg-gray-50 resize-none"
            />
            {errors.content && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.content.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <label className="text-sm font-bold text-gray-700">Adicionar Áudio</label>
            <p className="text-xs text-gray-600">Grave um áudio do seu pensamento (opcional)</p>

            <div className="flex gap-2">
              {!isRecording && !audioUrl && (
                <Button
                  type="button"
                  onClick={startRecording}
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <Mic size={16} /> Gravar
                </Button>
              )}

              {isRecording && (
                <>
                  <Button
                    type="button"
                    onClick={stopRecording}
                    variant="outline"
                    className="flex-1 gap-2 bg-red-50 hover:bg-red-100"
                  >
                    <Square size={16} /> Parar
                  </Button>
                  <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-xs font-mono text-gray-700">
                      {formatTime(recordingDuration)}
                    </span>
                  </div>
                </>
              )}

              {audioUrl && !isRecording && (
                <>
                  <Button
                    type="button"
                    onClick={clearRecording}
                    variant="outline"
                    className="flex-1 gap-2 bg-red-50 hover:bg-red-100"
                  >
                    <Trash2 size={16} /> Limpar
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      if (audioRef) {
                        if (isPlayingAudio) {
                          audioRef.pause();
                        } else {
                          audioRef.play();
                        }
                        setIsPlayingAudio(!isPlayingAudio);
                      }
                    }}
                    variant="outline"
                    className="flex-1 gap-2"
                  >
                    <Play size={16} /> {isPlayingAudio ? "Pausar" : "Ouvir"}
                  </Button>
                </>
              )}
            </div>

            {audioUrl && (
              <audio
                ref={setAudioRef}
                src={audioUrl}
                onEnded={() => setIsPlayingAudio(false)}
                className="hidden"
              />
            )}

            {audioUrl && (
              <div className="text-xs text-green-600 bg-green-50 p-2 rounded flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full" />
                Áudio gravado com sucesso!
              </div>
            )}
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" form="create-diary-form" disabled={isSubmitting || isRecording}>
            {isSubmitting ? "A guardar..." : "Salvar Pensamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
