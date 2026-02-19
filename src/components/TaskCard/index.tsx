import { TaskResponse } from "../../types/task";
import { format, parseISO } from "date-fns";

interface TaskCardProps {
  task: TaskResponse;
}

const colorVariants = {
  blue: "bg-blue-500 text-white",
  orange: "bg-orange-500 text-white",
  gray: "bg-gray-100 text-gray-800",
};

export function TaskCard({ task }: TaskCardProps) {
  const variant = (task.color as keyof typeof colorVariants) || "gray";

  const startTime = task.startDate ? format(parseISO(task.startDate), "HH:mm") : "00:00";
  const endTime = task.endDate ? format(parseISO(task.endDate), "HH:mm") : "00:00";

  return (
    <div
      className={`p-4 pb-10 pt-10 rounded-xl flex items-center justify-between ${colorVariants[variant]}`}
    >
      <div className="flex items-center gap-4">
        <div className="w-6 h-6 border-2 border-white/50 rounded-full flex-shrink-0" />
        <div>
          <h3 className="font-bold text-lg leading-tight">{task.name}</h3>
          <p className="text-xs opacity-80">{task.description}</p>
        </div>
      </div>
      <span className="text-xs font-medium whitespace-nowrap">
        {startTime} - {endTime}
      </span>
    </div>
  );
}
