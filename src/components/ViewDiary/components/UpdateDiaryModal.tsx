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
import { Mic, Play, Pause, Upload } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { DiaryResponse } from "@/types/diary";
import { getErrorMessage } from "@/lib/errorMessage";

interface Props {
  open: boolean;
  diary: DiaryResponse | null;
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

export function UpdateDiaryModal({ open, diary, onSuccess, onOpenChange }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
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
    setExternalAudio,
  } = useAudioRecorder();

  // Estados para o Player (Igual ao DiaryCard)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestRef = useRef<number>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeAudioUrl = audioUrl || diary?.audioUrl;

  // Animação da bolinha avançando
  const animate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (isPlayingAudio) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlayingAudio]);

  useEffect(() => {
    if (open && diary) {
      setValue("title", diary.title);
      setValue("content", diary.content);
    }
  }, [open, diary, setValue]);

  const formatAudioTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const onSubmit = async (data: DiaryFormData) => {
    if (!diary) return;
    try {
      await DiaryService.update(diary.id, { title: data.title, content: data.content });
      if (audioBlob) {
        const audioFormData = new FormData();
        const fileName = audioBlob instanceof File ? audioBlob.name : "update.webm";
        audioFormData.append("file", audioBlob, fileName);
        await DiaryService.uploadAudio(diary.id, audioFormData);
      }
      toast.success("Alterações salvas com sucesso!");
      handleClose();
      onSuccess();
    } catch (error) {
      console.error("Erro ao atualizar pensamento:", error);
      toast.error(getErrorMessage(error, "Erro ao atualizar."));
    }
  };

  const handleClose = () => {
    reset();
    clearRecording();
    setIsPlayingAudio(false);
    setCurrentTime(0);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => !isSubmitting && (val ? onOpenChange(true) : handleClose())}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Pensamento</DialogTitle>
        </DialogHeader>

        <form id="update-diary-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">Título do Pensamento</label>
            <input
              {...register("title")}
              className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 outline-none focus:border-blue-500"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">Descrição (Texto)</label>
            <textarea
              {...register("content")}
              className="w-full border border-gray-200 p-3 rounded-xl min-h-[100px] bg-gray-50 resize-none outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <label className="text-sm font-bold text-gray-700">Áudio</label>

            {activeAudioUrl && (
              <div className="p-3 bg-white rounded-lg border border-blue-200 flex items-center gap-3">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 text-blue-600 bg-blue-50 rounded-full flex-shrink-0"
                  onClick={() => {
                    if (audioRef.current) {
                      if (isPlayingAudio) {
                        audioRef.current.pause();
                      } else {
                        audioRef.current.play();
                      }
                      setIsPlayingAudio(!isPlayingAudio);
                    }
                  }}
                >
                  {isPlayingAudio ? (
                    <Pause size={18} fill="currentColor" />
                  ) : (
                    <Play size={18} fill="currentColor" className="ml-0.5" />
                  )}
                </Button>

                <div className="flex-1 flex flex-col justify-center pt-1">
                  {/* SLIDER COM A BOLINHA */}
                  <input
                    type="range"
                    min={0}
                    step="0.01"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-blue-400 font-bold mt-1">
                    <span>{formatAudioTime(currentTime)}</span>
                    <span>{formatAudioTime(duration)}</span>
                  </div>
                </div>

                <audio
                  ref={audioRef}
                  src={activeAudioUrl}
                  onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
                  onEnded={() => {
                    setIsPlayingAudio(false);
                    setCurrentTime(0);
                  }}
                  className="hidden"
                />
              </div>
            )}

            <div className="flex gap-2 mt-1">
              {!isRecording && (
                <>
                  <Button
                    type="button"
                    onClick={startRecording}
                    variant="outline"
                    className="flex-1 gap-2 text-xs"
                  >
                    <Mic size={14} /> Regravar
                  </Button>
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex-1 gap-2 text-xs"
                  >
                    <Upload size={14} /> Upload
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files?.[0] && setExternalAudio(e.target.files[0])}
                    accept="audio/*"
                    className="hidden"
                  />
                </>
              )}
              {isRecording && (
                <Button
                  type="button"
                  onClick={stopRecording}
                  variant="outline"
                  className="flex-1 bg-red-50 text-red-600 border-red-100 animate-pulse"
                >
                  Parar Gravação ({recordingDuration}s)
                </Button>
              )}
            </div>
            {audioUrl && !isRecording && (
              <Button
                type="button"
                onClick={clearRecording}
                variant="ghost"
                className="text-red-500 text-[10px] h-6 uppercase font-bold"
              >
                Descartar novo áudio
              </Button>
            )}
          </div>
        </form>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" form="update-diary-form" disabled={isSubmitting || isRecording}>
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
