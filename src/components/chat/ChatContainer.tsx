
import React, { useRef } from "react";
import { ChatView } from "@/components/ChatView";
import { useChat } from "@/contexts/ChatContext";

export function ChatContainer() {
  const chatRef = useRef<{ processUserMessage: (message: string, files?: File[]) => void }>(null);
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ChatView />
      </div>
    </div>
  );
}
