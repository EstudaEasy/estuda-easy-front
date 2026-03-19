"use client";

import { useState } from "react";
import { DiaryResponse } from "../../../types/diary";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UpdateDiaryModal } from "./UpdateDiaryModal";
import DiaryService from "@/services/diary/DiaryService";
import { activityStorage } from "@/lib/activityStorage";
import { toast } from "sonner";
import { Trash2, Edit2, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DiaryCardProps {
  diary: DiaryResponse;
  onRefresh: () => void;
}

export function DiaryCard({ diary, onRefresh }: DiaryCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  const createdAtTime = diary.createdAt ? format(parseISO(diary.createdAt), "HH:mm") : "00:00";
  const createdAtDate = diary.createdAt
    ? format(parseISO(diary.createdAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : "Data desconhecida";

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm("Tem certeza que deseja deletar este pensamento?")) return;

    try {
      setIsDeleting(true);
      await DiaryService.remove(diary.id);
      toast.success("Pensamento deletado com sucesso!");
      onRefresh();
    } catch (error) {
      console.error("Erro ao deletar pensamento:", error);
      toast.error("Não foi possível deletar o pensamento.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCardClick = () => {
    activityStorage.addActivity({
      title: diary.title,
      tool: "Diário",
      icon: "LuBook",
      iconClass: "bg-purple-100 text-purple-600",
    });
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="p-3 rounded-xl bg-white border border-purple-100 shadow-sm hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer h-fit"
      >
        <div className="flex gap-3">
          <div className="flex flex-col items-center gap-2">
            <div className="w-2.5 h-2.5 bg-purple-500 rounded-full mt-1" />
          </div>

          <div className="flex-1 pb-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-sm">{diary.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{createdAtTime}</p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditModalOpen(true);
                  }}
                  disabled={isDeleting}
                  className="hover:bg-blue-50"
                >
                  <Edit2 size={16} className="text-blue-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="hover:bg-red-50"
                >
                  <Trash2 size={16} className="text-red-600" />
                </Button>
              </div>
            </div>

            <p className="text-xs text-gray-700 mt-1.5 line-clamp-2">{diary.content}</p>

            {diary.audioUrl && (
              <div className="mt-2 p-2 bg-purple-50 rounded-lg flex items-center gap-2">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (audioRef) {
                      if (isPlayingAudio) {
                        audioRef.pause();
                      } else {
                        audioRef.play();
                      }
                      setIsPlayingAudio(!isPlayingAudio);
                    }
                  }}
                  className="hover:bg-purple-100 h-7 w-7"
                >
                  {isPlayingAudio ? (
                    <Pause size={12} className="text-purple-600" />
                  ) : (
                    <Play size={12} className="text-purple-600" />
                  )}
                </Button>
                <span className="text-xs text-gray-600">Ouvir áudio</span>
                <audio
                  ref={setAudioRef}
                  src={diary.audioUrl}
                  onEnded={() => setIsPlayingAudio(false)}
                  className="hidden"
                />
              </div>
            )}

            <p className="text-xs text-gray-400 mt-1.5">{createdAtDate}</p>
          </div>
        </div>
      </div>

      <UpdateDiaryModal
        open={isEditModalOpen}
        diary={diary}
        onSuccess={onRefresh}
        onOpenChange={setIsEditModalOpen}
      />
    </>
  );
}
