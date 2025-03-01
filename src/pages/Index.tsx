
import React, { useState, useRef } from "react";
import { Chat } from "@/components/Chat";
import { ChatInput } from "@/components/ChatInput";
import { SayHaloLogo } from "@/components/SayHaloLogo";
import { WelcomeMessage } from "@/components/WelcomeMessage";
import { ManagerAgent } from "@/components/ManagerAgent";
import { ApiSettings } from "@/components/ApiSettings";

export default function Index() {
  const [showChat, setShowChat] = useState(false);
  const chatRef = useRef<{ processUserMessage: (message: string) => void }>(null);

  const handleSendMessage = (message: string) => {
    if (chatRef.current) {
      chatRef.current.processUserMessage(message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-950/95 dark:backdrop-blur dark:supports-[backdrop-filter]:bg-gray-950/60">
        <div className="flex h-14 items-center px-4 md:px-6">
          <SayHaloLogo />
          <div className="ml-auto flex items-center space-x-2">
            <ApiSettings />
          </div>
        </div>
      </header>
      <main className="flex-1 grid md:grid-cols-[1fr_250px] lg:grid-cols-[1fr_300px] gap-6 p-4 md:p-6">
        <div className="h-[calc(100vh-7rem)] flex flex-col bg-white dark:bg-gray-950 border rounded-xl">
          {showChat ? (
            <>
              <div className="flex-1 overflow-auto">
                <Chat chatRef={chatRef} />
              </div>
              <div className="border-t p-4">
                <ChatInput onSendMessage={handleSendMessage} />
              </div>
            </>
          ) : (
            <WelcomeMessage onStart={() => setShowChat(true)} />
          )}
        </div>
        <ManagerAgent />
      </main>
    </div>
  );
}
