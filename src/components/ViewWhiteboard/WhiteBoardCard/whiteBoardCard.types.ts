import { WhiteboardResponse } from "@/types/whiteboard";

export interface WhiteboardCardProps {
  title: string;
  createdAt: string;
  whiteboard: WhiteboardResponse;
  onClick?: () => void;
  onEdit?: (whiteboard: WhiteboardResponse) => void;
  onDelete?: (whiteboard: WhiteboardResponse) => void;
  className?: string;
}
