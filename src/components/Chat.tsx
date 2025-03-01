
import React from "react";
import { ChatView } from "@/components/ChatView";
import { ChatProcessor } from "@/components/ChatProcessor";
import { ChatProvider } from "@/contexts/ChatContext";

interface ChatProps {
  chatRef: React.MutableRefObject<any>;
}

export function Chat({ chatRef }: ChatProps) {
  return (
    <ChatProvider>
      <ChatProcessor chatRef={chatRef} />
      <ChatView />
    </ChatProvider>
  );
}
