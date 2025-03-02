
import React from "react";
import { ChatView } from "@/components/ChatView";
import { ChatProcessor } from "@/components/ChatProcessor";
import { ChatProvider } from "@/contexts/ChatContext";

interface ChatProps {
  chatRef: React.MutableRefObject<any>;
}

export function Chat({ chatRef }: ChatProps) {
  return (
    <div className="h-full flex flex-col bg-lavender-light">
      <ChatProvider>
        <div className="hidden">
          <ChatProcessor chatRef={chatRef} />
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatView />
        </div>
      </ChatProvider>
    </div>
  );
}
