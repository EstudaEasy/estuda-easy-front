"use client";

import { usePomodoro } from "@/context/pomodoro";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings2 } from "lucide-react";

export function PomodoroSettings() {
  const { durations, rounds, updateDuration, setRounds, isRunning } = usePomodoro();

  return (
    <Card
      className={`mt-8 w-full border-gray-100 shadow-sm transition-opacity ${isRunning ? "opacity-50 pointer-events-none" : ""}`}
    >
      <CardHeader className="pb-4 border-b border-gray-50">
        <CardTitle className="text-lg text-[#1A2E5A] flex items-center gap-2">
          <Settings2 size={18} /> Configurações
        </CardTitle>
        <CardDescription>
          Ajuste os tempos do Pomodoro (apenas pause o relógio para editar).
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">Tempo de Estudo (Foco)</Label>
            <span className="text-sm text-gray-500 font-mono">{durations.focus / 60} min</span>
          </div>
          <Slider
            min={5}
            max={60}
            step={5}
            value={[durations.focus / 60]}
            onValueChange={(val) => updateDuration("focus", val[0] * 60)}
            disabled={isRunning}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">Pausa Curta</Label>
            <span className="text-sm text-gray-500 font-mono">
              {durations["short-break"] / 60} min
            </span>
          </div>
          <Slider
            min={5}
            max={30}
            step={5}
            value={[durations["short-break"] / 60]}
            onValueChange={(val) => updateDuration("short-break", val[0] * 60)}
            disabled={isRunning}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">Pausa Longa</Label>
            <span className="text-sm text-gray-500 font-mono">
              {durations["long-break"] / 60} min
            </span>
          </div>
          <Slider
            min={5}
            max={60}
            step={5}
            value={[durations["long-break"] / 60]}
            onValueChange={(val) => updateDuration("long-break", val[0] * 60)}
            disabled={isRunning}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">Rounds de Estudo</Label>
            <span className="text-sm text-gray-500 font-mono">{rounds} rodadas</span>
          </div>
          <Slider
            min={1}
            max={10}
            step={1}
            value={[rounds]}
            onValueChange={(val) => setRounds(val[0])}
            disabled={isRunning}
          />
        </div>
      </CardContent>
    </Card>
  );
}
