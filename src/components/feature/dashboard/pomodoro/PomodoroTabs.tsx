"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PomodoroTimer from "./PomodoroTimer";
import { usePomodoro } from "@/context/pomodoro";

export default function PomodoroTabs() {
  const { mode, setMode } = usePomodoro();

  return (
    <Tabs
      value={mode}
      onValueChange={(value) => setMode(value as "focus" | "short-break" | "long-break")}
      className="w-full max-w-[500px]"
    >
      <TabsList variant={"line"} className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="focus">Foco</TabsTrigger>
        <TabsTrigger value="short-break">Pausa Curta</TabsTrigger>
        <TabsTrigger value="long-break">Pausa Longa</TabsTrigger>
      </TabsList>

      <TabsContent value="focus" className="flex justify-center">
        <PomodoroTimer label="Tempo de Foco" color="text-[#1A2E5A]" />
      </TabsContent>

      <TabsContent value="short-break" className="flex justify-center">
        <PomodoroTimer label="Pausa Curta" color="text-green-500" />
      </TabsContent>

      <TabsContent value="long-break" className="flex justify-center">
        <PomodoroTimer label="Pausa Longa" color="text-blue-500" />
      </TabsContent>
    </Tabs>
  );
}
