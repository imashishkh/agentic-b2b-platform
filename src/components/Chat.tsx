
import React from "react";
import ChatView from "@/components/ChatView";
import { ChatProcessor } from "@/components/ChatProcessor";

interface ChatProps {
  chatRef: React.MutableRefObject<any>;
}

export function Chat({ chatRef }: ChatProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="hidden">
        <ChatProcessor chatRef={chatRef} />
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatView />
      </div>
    </div>
  );
}
