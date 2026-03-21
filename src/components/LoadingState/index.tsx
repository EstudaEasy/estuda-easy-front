"use client";

import Lottie from "lottie-react";
import LoadingAnimation from "@/assets/Loading.json";

interface LoadingStateProps {
  message: string;
  className?: string;
  variant?: "full" | "inline";
}

export default function LoadingState({ message, className, variant = "full" }: LoadingStateProps) {
  const isInline = variant === "inline";

  return (
    <div
      className={`flex w-full flex-col items-center justify-center ${isInline ? "gap-3 py-8" : "min-h-[50vh] gap-4 py-12"} ${className ?? ""}`}
    >
      <div
        className={
          isInline
            ? "h-28 w-40"
            : "h-98 w-126 max-h-[78vh] max-w-[88vw]"
        }
      >
        <Lottie
          animationData={LoadingAnimation}
          loop
          autoplay
          className={
            isInline ? "h-full w-full" : "h-full w-full [&>svg]:origin-center [&>svg]:scale-[4.5]"
          }
        />
      </div>
      <p className={isInline ? "text-sm font-medium text-slate-600" : "text-base font-semibold text-slate-700"}>
        {message}
      </p>
    </div>
  );
}
