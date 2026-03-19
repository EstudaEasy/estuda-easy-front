import { Label } from "../ui/label";
import { Input } from "../ui/input";
import type { Task } from "./resourceTypes";

interface PreviewTaskProps {
  normalizedData: Task;
  taskDate: string;
  taskStartTime: string;
  taskEndTime: string;
  isDisabled: boolean;
  onTaskDateChange: (date: string) => void;
  onTaskStartTimeChange: (time: string) => void;
  onTaskEndTimeChange: (time: string) => void;
}

export function PreviewTask({
  normalizedData,
  taskDate,
  taskStartTime,
  taskEndTime,
  isDisabled,
  onTaskDateChange,
  onTaskStartTimeChange,
  onTaskEndTimeChange,
}: PreviewTaskProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Nome da Tarefa</Label>
        <div className="mt-1 p-2 bg-gray-50 rounded text-sm font-medium">{normalizedData.name}</div>
      </div>
      {normalizedData.description && (
        <div>
          <Label>Descrição</Label>
          <div className="mt-1 p-2 bg-gray-50 rounded text-sm text-gray-700">
            {normalizedData.description}
          </div>
        </div>
      )}
      <div className="pt-4 border-t border-gray-100 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="task-date">
            Data da realização <span className="text-red-500">*</span>
          </Label>
          <Input
            id="task-date"
            type="date"
            value={taskDate}
            onChange={(e) => onTaskDateChange(e.target.value)}
            disabled={isDisabled}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="task-start-time">Horário Início (Opcional)</Label>
            <Input
              id="task-start-time"
              type="time"
              value={taskStartTime}
              onChange={(e) => onTaskStartTimeChange(e.target.value)}
              disabled={isDisabled}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="task-end-time">Horário Fim (Opcional)</Label>
            <Input
              id="task-end-time"
              type="time"
              value={taskEndTime}
              onChange={(e) => onTaskEndTimeChange(e.target.value)}
              disabled={isDisabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
