"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PomodoroTimer from "./PomodoroTimer";
import { PomodoroSettings } from "./PomodoroSettings";
import { usePomodoro } from "@/context/pomodoro";

type PomodoroTabValue = "focus" | "short-break" | "long-break" | "settings";

export default function PomodoroTabs() {
  const { mode, setMode } = usePomodoro();
  const [activeTab, setActiveTab] = useState<PomodoroTabValue>(mode);

  useEffect(() => {
    if (activeTab !== "settings") {
      setActiveTab(mode);
    }
  }, [mode, activeTab]);

  const handleTabChange = (value: string) => {
    const tabValue = value as PomodoroTabValue;
    setActiveTab(tabValue);

    if (tabValue !== "settings") {
      setMode(tabValue);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full max-w-[500px]">
      <TabsList variant={"line"} className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="focus">Foco</TabsTrigger>
        <TabsTrigger value="short-break">Pausa Curta</TabsTrigger>
        <TabsTrigger value="long-break">Pausa Longa</TabsTrigger>
        <TabsTrigger value="settings">Configurações</TabsTrigger>
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

      <TabsContent value="settings">
        <PomodoroSettings />
      </TabsContent>
    </Tabs>
  );
}
