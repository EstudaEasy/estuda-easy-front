import React from "react";

interface UserMessageProps {
  content?: string;
}

export function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="flex justify-end">
      <div className="bg-blue-500 text-white rounded-lg px-3 py-2 max-w-[80%]">
        <p className="text-sm">{content}</p>
      </div>
    </div>
  );
}
