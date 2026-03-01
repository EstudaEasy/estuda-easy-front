"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { usePomodoro } from "@/context/pomodoro";

interface PomodoroTimerProps {
  label: string;
  color?: string;
}

export default function PomodoroTimer({ label, color = "text-[#1A2E5A]" }: PomodoroTimerProps) {
  const { timeLeft, isRunning, progress, toggleTimer, resetTimer } = usePomodoro();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const circumference = 2 * Math.PI * 140;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative">
        <svg className="transform -rotate-90" width="320" height="320">
          <circle
            cx="160"
            cy="160"
            r="140"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="160"
            cy="160"
            r="140"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress / 100)}
            className={`transition-all duration-1000 ${color}`}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-bold text-[#1A2E5A] tabular-nums">
            {formatTime(timeLeft)}
          </span>
          <span className="text-sm text-gray-500 mt-2 uppercase tracking-wider">{label}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          onClick={toggleTimer}
          size="lg"
          className="w-32"
          variant={isRunning ? "outline" : "default"}
        >
          {isRunning ? (
            <>
              <Pause className="mr-2" size={18} />
              Pausar
            </>
          ) : (
            <>
              <Play className="mr-2" size={18} />
              Iniciar
            </>
          )}
        </Button>

        <Button onClick={resetTimer} size="lg" variant="outline">
          <RotateCcw size={18} />
        </Button>
      </div>
    </div>
  );
}
