"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

type TimerMode = "focus" | "short-break" | "long-break";

const POMODORO_STORAGE_KEY = "estudaeasy:pomodoro";

interface PomodoroPersistedState {
  mode: TimerMode;
  durations: Record<TimerMode, number>;
  rounds: number;
  timeLeft: number;
  isRunning: boolean;
  focusSessionsCompleted: number;
  totalTimeSpent: number;
  sessionEndsAt: number | null;
}

function isValidPersistedState(value: unknown): value is PomodoroPersistedState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<PomodoroPersistedState>;

  return (
    (candidate.mode === "focus" ||
      candidate.mode === "short-break" ||
      candidate.mode === "long-break") &&
    typeof candidate.durations?.focus === "number" &&
    typeof candidate.durations?.["short-break"] === "number" &&
    typeof candidate.durations?.["long-break"] === "number" &&
    typeof candidate.rounds === "number" &&
    typeof candidate.timeLeft === "number" &&
    typeof candidate.isRunning === "boolean" &&
    typeof candidate.focusSessionsCompleted === "number" &&
    typeof candidate.totalTimeSpent === "number" &&
    (typeof candidate.sessionEndsAt === "number" || candidate.sessionEndsAt === null)
  );
}

interface PomodoroContextData {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  duration: number;
  durations: Record<TimerMode, number>;
  progress: number;
  focusSessionsCompleted: number;
  totalTimeSpent: number;
  rounds: number;
  setMode: (mode: TimerMode) => void;
  updateDuration: (mode: TimerMode, duration: number) => void;
  setRounds: (rounds: number) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
}

const PomodoroContext = createContext<PomodoroContextData>({} as PomodoroContextData);

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<TimerMode>("focus");
  const [durations, setDurations] = useState<Record<TimerMode, number>>({
    focus: 25 * 60,
    "short-break": 5 * 60,
    "long-break": 15 * 60,
  });
  const [rounds, setRounds] = useState(4);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [focusSessionsCompleted, setFocusSessionsCompleted] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [sessionEndsAt, setSessionEndsAt] = useState<number | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  const duration = durations[mode];
  const progress = ((duration - timeLeft) / duration) * 100;

  const setMode = useCallback(
    (newMode: TimerMode) => {
      setModeState(newMode);
      setTimeLeft(durations[newMode]);
      setIsRunning(false);
      setSessionEndsAt(null);
    },
    [durations],
  );

  const updateDuration = useCallback((modeToUpdate: TimerMode, newDuration: number) => {
    setDurations((prev) => ({ ...prev, [modeToUpdate]: newDuration }));
    setModeState((currentMode) => {
      if (currentMode === modeToUpdate) {
        setTimeLeft(newDuration);
        setIsRunning(false);
        setSessionEndsAt(null);
      }
      return currentMode;
    });
  }, []);

  const handleTimerComplete = useCallback(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Pomodoro Completo!", {
          body: mode === "focus" ? "Hora de fazer uma pausa!" : "De volta ao foco!",
          icon: "/favicon.ico",
        });
      }
    }

    if (mode === "focus") {
      setFocusSessionsCompleted((prev) => {
        const newCompleted = prev + 1;
        const nextMode = newCompleted % rounds === 0 ? "long-break" : "short-break";
        const nextDuration = durations[nextMode];

        setModeState(nextMode);
        setTimeLeft(nextDuration);
        setSessionEndsAt(Date.now() + nextDuration * 1000);

        return newCompleted;
      });
      setTotalTimeSpent((prev) => prev + durations.focus);
    } else {
      const nextDuration = durations.focus;
      setModeState("focus");
      setTimeLeft(nextDuration);
      setSessionEndsAt(Date.now() + nextDuration * 1000);
    }

    setIsRunning(true);
  }, [mode, rounds, durations]);

  useEffect(() => {
    if (!isRunning || !sessionEndsAt) {
      return;
    }

    const syncTimeLeft = () => {
      const remaining = Math.max(0, Math.ceil((sessionEndsAt - Date.now()) / 1000));

      if (remaining <= 0) {
        setTimeLeft(0);
        handleTimerComplete();
        return true;
      }

      setTimeLeft(remaining);
      return false;
    };

    if (syncTimeLeft()) {
      return;
    }

    const interval = setInterval(() => {
      syncTimeLeft();
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, sessionEndsAt, handleTimerComplete]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const raw = window.localStorage.getItem(POMODORO_STORAGE_KEY);

      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as unknown;

      if (!isValidPersistedState(parsed)) {
        return;
      }

      setDurations(parsed.durations);
      setRounds(parsed.rounds);
      setModeState(parsed.mode);
      setFocusSessionsCompleted(parsed.focusSessionsCompleted);
      setTotalTimeSpent(parsed.totalTimeSpent);

      if (parsed.isRunning && parsed.sessionEndsAt) {
        const remaining = Math.max(0, Math.ceil((parsed.sessionEndsAt - Date.now()) / 1000));

        if (remaining > 0) {
          setIsRunning(true);
          setSessionEndsAt(parsed.sessionEndsAt);
          setTimeLeft(remaining);
        } else {
          setIsRunning(false);
          setSessionEndsAt(null);
          setTimeLeft(parsed.durations[parsed.mode]);
        }
      } else {
        setIsRunning(false);
        setSessionEndsAt(null);
        setTimeLeft(parsed.timeLeft);
      }
    } catch (error) {
      console.error("Erro ao restaurar estado do Pomodoro:", error);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !hasHydrated) {
      return;
    }

    const snapshot: PomodoroPersistedState = {
      mode,
      durations,
      rounds,
      timeLeft,
      isRunning,
      focusSessionsCompleted,
      totalTimeSpent,
      sessionEndsAt,
    };

    window.localStorage.setItem(POMODORO_STORAGE_KEY, JSON.stringify(snapshot));
  }, [
    hasHydrated,
    mode,
    durations,
    rounds,
    timeLeft,
    isRunning,
    focusSessionsCompleted,
    totalTimeSpent,
    sessionEndsAt,
  ]);

  useEffect(() => {
    if (isRunning && !sessionEndsAt && timeLeft > 0) {
      setSessionEndsAt(Date.now() + timeLeft * 1000);
    }
  }, [isRunning, sessionEndsAt, timeLeft]);

  const toggleTimer = useCallback(() => {
    setIsRunning((prev) => {
      const nextRunning = !prev;

      if (nextRunning) {
        setSessionEndsAt(Date.now() + timeLeft * 1000);
      } else {
        setSessionEndsAt(null);
      }

      return nextRunning;
    });
  }, [timeLeft]);

  const startTimer = useCallback(() => {
    setSessionEndsAt(Date.now() + timeLeft * 1000);
    setIsRunning(true);
  }, [timeLeft]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    setSessionEndsAt(null);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setSessionEndsAt(null);
    setModeState("focus");
    setFocusSessionsCompleted(0);
    setTotalTimeSpent(0);
    setTimeLeft(durations.focus);
  }, [durations]);

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
        durations,
        progress,
        focusSessionsCompleted,
        totalTimeSpent,
        rounds,
        setMode,
        updateDuration,
        setRounds,
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
