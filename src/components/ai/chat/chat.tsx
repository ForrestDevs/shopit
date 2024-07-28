"use client";

import { ChatMessages } from "./chat-messages";
import { useUIState } from "ai/rsc";
import { ImageUploader } from "./image-upload";

type ChatProps = {
  id?: string;
  query?: string;
};

export function Chat({ id, query }: ChatProps) {
  const [messages] = useUIState();

  return (
    <div className="px-8 sm:px-12 pt-12 md:pt-14 pb-14 md:pb-24 max-w-3xl mx-auto flex flex-col space-y-3 md:space-y-4">
      <ImageUploader />
      <ChatMessages messages={messages} />
    </div>
  );
}
