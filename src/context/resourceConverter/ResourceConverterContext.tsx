"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

export interface CompletionEvent {
  resourceId: string;
  resourceType: "deck" | "quiz" | "task";
  resourceName: string;
}

interface ResourceConverterContextValue {
  pendingCompletion: CompletionEvent | null;
  converterOpen: boolean;
  notifyCompletion: (event: CompletionEvent) => void;
  clearCompletion: () => void;
  openConverter: () => void;
  closeConverter: () => void;
}

const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

const ResourceConverterContext = createContext<ResourceConverterContextValue | null>(null);

export function ResourceConverterProvider({ children }: { children: React.ReactNode }) {
  const [pendingCompletion, setPendingCompletion] = useState<CompletionEvent | null>(null);
  const [converterOpen, setConverterOpen] = useState(false);
  const lastSuggestedAt = useRef<number | null>(null);

  const notifyCompletion = useCallback((event: CompletionEvent) => {
    const now = Date.now();
    const withinCooldown =
      lastSuggestedAt.current !== null && now - lastSuggestedAt.current < COOLDOWN_MS;

    if (withinCooldown) {
      // Still in cooldown — open converter without pre-fill
      setConverterOpen(true);
      return;
    }

    // Register completion and open converter pre-filled
    lastSuggestedAt.current = now;
    setPendingCompletion(event);
    setConverterOpen(true);
  }, []);

  const clearCompletion = useCallback(() => {
    setPendingCompletion(null);
  }, []);

  const openConverter = useCallback(() => {
    setConverterOpen(true);
  }, []);

  const closeConverter = useCallback(() => {
    setConverterOpen(false);
  }, []);

  return (
    <ResourceConverterContext.Provider
      value={{
        pendingCompletion,
        converterOpen,
        notifyCompletion,
        clearCompletion,
        openConverter,
        closeConverter,
      }}
    >
      {children}
    </ResourceConverterContext.Provider>
  );
}

export function useResourceConverter() {
  const ctx = useContext(ResourceConverterContext);
  if (!ctx) {
    throw new Error("useResourceConverter must be used within a ResourceConverterProvider");
  }
  return ctx;
}
