"use client";

import Page from "@/components/Page";
import PomodoroTabs from "@/components/feature/dashboard/pomodoro/PomodoroTabs";

export default function Pomodoro() {
  return (
    <Page>
      <Page.Header
        title="Pomodoro"
        subtitle="Gerencie seu tempo com a técnica Pomodoro e aumente sua produtividade!"
      />

      <Page.Content>
        <div className="flex items-center justify-center min-h-[500px]">
          <PomodoroTabs />
        </div>
      </Page.Content>
    </Page>
  );
}
