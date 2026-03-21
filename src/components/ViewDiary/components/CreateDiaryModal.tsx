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
import { Mic, Trash2, Play, Upload, Pause } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { getErrorMessage } from "@/lib/errorMessage";

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
    setExternalAudio,
  } = useAudioRecorder();

  // Estados para o Player de áudio (Idêntico ao Card)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestRef = useRef<number>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lógica de animação da barra de progresso
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExternalAudio(file);
    }
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
        const fileName = audioBlob instanceof File ? audioBlob.name : "recording.webm";
        audioFormData.append("file", audioBlob, fileName);
        await DiaryService.uploadAudio(createdDiary.id, audioFormData);
      }

      toast.success("Pensamento e áudio salvos!");
      handleClose();
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error, "Erro ao salvar pensamento."));
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
          <DialogTitle>Adicionar Pensamento</DialogTitle>
        </DialogHeader>

        <form id="create-diary-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">Título do Pensamento</label>
            <input
              {...register("title")}
              className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 outline-none focus:border-blue-500 text-gray-900"
              placeholder="Ex: Reflexão sobre o dia"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700 ml-1">Descrição (Texto)</label>
            <textarea
              {...register("content")}
              className="w-full border border-gray-200 p-3 rounded-xl min-h-[100px] bg-gray-50 resize-none outline-none focus:border-blue-500 text-gray-900"
              placeholder="Escreva seu pensamento aqui..."
            />
          </div>

          <div className="flex flex-col gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <label className="text-sm font-bold text-gray-700">Áudio do Pensamento</label>

            {/* PLAYER COM BARRA DE PROGRESSO - Só aparece se houver áudio gravado ou subido */}
            {audioUrl && !isRecording && (
              <div className="p-3 bg-white rounded-lg border border-blue-200 flex items-center gap-3 mb-2">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 text-blue-600 bg-blue-50 rounded-full flex-shrink-0 hover:bg-blue-100"
                  onClick={() => {
                    if (audioRef.current) {
                      if (isPlayingAudio) audioRef.current.pause();
                      else audioRef.current.play();
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
                  src={audioUrl}
                  onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
                  onEnded={() => {
                    setIsPlayingAudio(false);
                    setCurrentTime(0);
                  }}
                  className="hidden"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {!isRecording && !audioUrl && (
                <>
                  <Button
                    type="button"
                    onClick={startRecording}
                    variant="outline"
                    className="flex-1 gap-2"
                  >
                    <Mic size={16} /> Gravar
                  </Button>
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="flex-1 gap-2"
                  >
                    <Upload size={16} /> Upload
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
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
                  className="flex-1 bg-red-50 text-red-600 border-red-100 animate-pulse h-10"
                >
                  Parar ({formatAudioTime(recordingDuration)})
                </Button>
              )}

              {audioUrl && !isRecording && (
                <Button
                  type="button"
                  onClick={clearRecording}
                  variant="outline"
                  className="flex-1 gap-2 bg-red-50 text-red-600 border-red-100"
                >
                  <Trash2 size={16} /> Limpar Áudio
                </Button>
              )}
            </div>

            {audioUrl && !isRecording && (
              <div className="text-[10px] text-green-600 bg-green-50 p-2 rounded flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                Áudio pronto para salvar!
              </div>
            )}
          </div>
        </form>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" form="create-diary-form" disabled={isSubmitting || isRecording}>
            {isSubmitting ? "Salvando..." : "Salvar Pensamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
