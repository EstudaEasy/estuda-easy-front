"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

type TimerMode = "focus" | "short-break" | "long-break";

interface PomodoroContextData {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  duration: number;
  progress: number;

  focusSessionsCompleted: number;
  totalTimeSpent: number;

  setMode: (mode: TimerMode) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
}

const TIMER_DURATIONS = {
  focus: 25 * 60,
  "short-break": 1,
  "long-break": 15 * 60,
};

const PomodoroContext = createContext<PomodoroContextData>({} as PomodoroContextData);

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const [focusSessionsCompleted, setFocusSessionsCompleted] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);

  const duration = TIMER_DURATIONS[mode];
  const progress = ((duration - timeLeft) / duration) * 100;

  const setMode = useCallback((newMode: TimerMode) => {
    setModeState(newMode);
    setTimeLeft(TIMER_DURATIONS[newMode]);
    setIsRunning(false);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = useCallback(() => {
    if (mode === "focus") {
      setFocusSessionsCompleted((prev) => prev + 1);
      setTotalTimeSpent((prev) => prev + TIMER_DURATIONS.focus);
    }

    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Pomodoro Completo!", {
          body: mode === "focus" ? "Hora de fazer uma pausa!" : "Hora de voltar ao foco!",
          icon: "/favicon.ico",
        });
      }
    }
  }, [mode, focusSessionsCompleted]);

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => !prev);
  }, []);

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(TIMER_DURATIONS[mode]);
  }, [mode]);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  return (
    <PomodoroContext.Provider
      value={{
        mode,
        timeLeft,
        isRunning,
        duration,
        progress,
        focusSessionsCompleted,
        totalTimeSpent,
        setMode,
        toggleTimer,
        resetTimer,
        startTimer,
        pauseTimer,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const context = useContext(PomodoroContext);

  if (!context) {
    throw new Error("usePomodoro must be used within a PomodoroProvider");
  }

  return context;
}
