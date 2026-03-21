"use client";

import Page from "@/components/Page";
import PomodoroTabs from "@/components/feature/dashboard/pomodoro/PomodoroTabs";
import { DailyTasksWidget } from "@/components/feature/dashboard/pomodoro/DailyTasksWidget";

export default function Pomodoro() {
  return (
    <Page>
      <Page.Header
        title="Pomodoro"
        subtitle="Gerencie seu tempo com a técnica Pomodoro e aumente sua produtividade!"
      />

      <Page.Content>
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 min-h-[500px]">
          <div className="flex-1 w-full flex flex-col items-center max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <PomodoroTabs />
          </div>
          <div className="w-full lg:w-[450px] shrink-0">
            <DailyTasksWidget />
          </div>
        </div>
      </Page.Content>
    </Page>
  );
}
