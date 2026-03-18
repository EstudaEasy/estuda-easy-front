"use client";

import Lottie from "lottie-react";
import emptyToolAnimation from "@/assets/Tumbleweed Rolling.json";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type EmptyToolStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyToolState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyToolStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 px-6 text-center">
      <div className="flex h-92 w-full max-w-150 max-h-[40vh] items-center justify-center">
        <Lottie
          animationData={emptyToolAnimation as object}
          loop
          style={{ width: "100%", height: "100%" }}
          rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Typography variant="body-1" color="light" className="font-semibold">
          {title}
        </Typography>
        <Typography variant="body-2" color="light">
          {description}
        </Typography>
      </div>

      {onAction && actionLabel ? (
        <Button
          variant="default"
          size="lg"
          onClick={onAction}
          className="rounded-md mt-2 shadow-sm hover:shadow-md transition-shadow transform hover:scale-[1.02]"
        >
          <Plus className="size-4" />
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
