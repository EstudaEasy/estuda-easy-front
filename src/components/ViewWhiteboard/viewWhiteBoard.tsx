"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WhiteboardResponse } from "@/types/whiteboard";
import WhiteboardService from "@/services/whiteboard/WhiteboardService";
import WhiteboardCard from "./WhiteBoardCard/whiteboardCard";
import { Typography } from "@/components/ui/typography";
import EmptyToolState from "@/components/EmptyToolState/EmptyToolState";

interface ViewWhiteboardProps {
  refreshTrigger?: number;
  onCreateWhiteboard?: () => void;
  onEditWhiteboard?: (whiteboard: WhiteboardResponse) => void;
  onDeleteWhiteboard?: (whiteboard: WhiteboardResponse) => void;
}

export default function ViewWhiteboard({
  refreshTrigger,
  onCreateWhiteboard,
  onEditWhiteboard,
  onDeleteWhiteboard,
}: ViewWhiteboardProps) {
  const router = useRouter();
  const [whiteboards, setWhiteboards] = useState<WhiteboardResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWhiteboards();
  }, [refreshTrigger]);

  async function fetchWhiteboards() {
    try {
      setLoading(true);
      const response = await WhiteboardService.list();
      setWhiteboards(response.data.whiteboards);
    } catch (error) {
      console.error("Erro ao buscar whiteboards:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Typography variant="body-1" color="light">
          Carregando quadros...
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {whiteboards.length === 0 ? (
        <EmptyToolState
          title="Quadro vazio por aqui"
          description="Que tal criar seu primeiro quadro e colocar suas ideias no lugar?"
          actionLabel="Criar Quadro"
          onAction={onCreateWhiteboard}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whiteboards.map((whiteboard) => (
            <WhiteboardCard
              key={whiteboard.id}
              whiteboard={whiteboard}
              title={whiteboard.title}
              createdAt={whiteboard.createdAt}
              onClick={() => router.push(`/tools/whiteboard/${whiteboard.id}`)}
              onEdit={onEditWhiteboard}
              onDelete={onDeleteWhiteboard}
            />
          ))}
        </div>
      )}
    </div>
  );
}
