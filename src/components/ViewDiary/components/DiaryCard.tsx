"use client";

import { useState, useRef, useEffect } from "react";
import { DiaryResponse } from "../../../types/diary";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UpdateDiaryModal } from "./UpdateDiaryModal";
import DiaryService from "@/services/diary/DiaryService";
import { activityStorage } from "@/lib/activityStorage";
import { toast } from "sonner";
import { Trash2, Edit2, Play, Pause, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DiaryCardProps {
  diary: DiaryResponse;
  onRefresh: () => void;
}

export function DiaryCard({ diary, onRefresh }: DiaryCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestRef = useRef<number>(undefined);

  const createdAtTime = diary.createdAt ? format(parseISO(diary.createdAt), "HH:mm") : "00:00";
  const createdAtDate = diary.createdAt
    ? format(parseISO(diary.createdAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : "Data desconhecida";

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

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleEnded = () => {
    setIsPlayingAudio(false);
    setCurrentTime(0);
    if (audioRef.current) audioRef.current.currentTime = 0;
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await DiaryService.remove(diary.id);
      activityStorage.removeActivity(diary.id);
      setIsDeleteDialogOpen(false);
      toast.success("Pensamento deletado com sucesso!");
      onRefresh();
    } catch (error) {
      console.error("Erro ao deletar:", error);
      toast.error("Não foi possível deletar o pensamento.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        onClick={() => {
          if (!isDeleting) {
            activityStorage.addActivity({
              title: diary.title,
              tool: "Diário",
              icon: "LuBook",
              iconClass: "bg-purple-100 text-purple-600",
              resourceId: diary.id,
              resourceType: "diary",
            });
            setIsEditModalOpen(true);
          }
        }}
        className={`p-4 rounded-xl bg-white border border-purple-100 shadow-sm hover:shadow-md transition-all h-full flex flex-col justify-between ${isDeleting ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:scale-[1.01]"}`}
      >
        <div className="flex gap-3">
          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm truncate">{diary.title}</h3>
                <p className="text-[10px] text-gray-400 font-medium">{createdAtTime}</p>
              </div>

              <div className="flex gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditModalOpen(true);
                  }}
                  disabled={isDeleting}
                  className="h-7 w-7 text-blue-500 hover:bg-blue-50 disabled:opacity-50"
                >
                  <Edit2 size={14} />
                </Button>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="h-7 w-7 text-red-500 hover:bg-red-50 disabled:opacity-100"
                >
                  {isDeleting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
              {diary.content}
            </p>
          </div>
        </div>

        {diary.audioUrl && (
          <div
            className="mt-4 p-2 bg-purple-50/60 rounded-xl border border-purple-100 flex items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              disabled={isDeleting}
              onClick={() => {
                if (audioRef.current) {
                  if (isPlayingAudio) audioRef.current.pause();
                  else audioRef.current.play();
                  setIsPlayingAudio(!isPlayingAudio);
                }
              }}
              className="bg-white shadow-sm h-9 w-9 rounded-full flex-shrink-0 text-purple-600 hover:bg-white flex items-center justify-center disabled:opacity-50"
            >
              {isPlayingAudio ? (
                <Pause size={16} fill="currentColor" />
              ) : (
                <Play size={16} className="ml-0.5" fill="currentColor" />
              )}
            </Button>

            <div className="flex-1 flex flex-col justify-center pt-1">
              <input
                type="range"
                min={0}
                step="0.01"
                max={duration || 0}
                value={currentTime}
                disabled={isDeleting}
                onChange={handleSeek}
                className="w-full h-1 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="flex justify-between text-[9px] text-purple-400 font-bold mt-1 tracking-tighter">
                <span>{formatAudioTime(currentTime)}</span>
                <span>{formatAudioTime(duration)}</span>
              </div>
            </div>

            <audio
              ref={audioRef}
              src={diary.audioUrl}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleEnded}
              className="hidden"
            />
          </div>
        )}

        <p className="text-[10px] text-gray-400 mt-3 font-semibold uppercase tracking-wider">
          {createdAtDate}
        </p>
      </div>

      <UpdateDiaryModal
        open={isEditModalOpen}
        diary={diary}
        onSuccess={onRefresh}
        onOpenChange={setIsEditModalOpen}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Pensamento?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este pensamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
