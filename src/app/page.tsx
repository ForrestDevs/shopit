import { AI } from "@/lib/providers/ai-state";
import { generateId } from "ai";
import { Chat } from "@/components/ai/chat/chat";

export default async function Home() {
  const id = generateId();
  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} />
    </AI>
  );
}
