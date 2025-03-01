
import React, { useRef, useState } from "react";
import { WelcomeMessage } from "@/components/WelcomeMessage";
import { ManagerAgent } from "@/components/ManagerAgent";
import { Chat } from "@/components/Chat";
import { ChatInput } from "@/components/ChatInput";
import { ApiSettings } from "@/components/ApiSettings";
import { SuggestCard } from "@/components/SuggestCard";

const Index = () => {
  const [chatStarted, setChatStarted] = useState(false);
  
  // State to toggle API settings modal
  const [showApiSettings, setShowApiSettings] = useState(false);
  
  // Reference to chat methods exposed by ChatProcessor
  const chatRef = useRef<{ processUserMessage: (message: string, files?: File[]) => void }>(null);
  
  const handleStart = () => {
    setChatStarted(true);
  };
  
  // Handle sending a message via the chat input
  const handleSendMessage = (message: string, files?: File[]) => {
    if (chatRef.current) {
      chatRef.current.processUserMessage(message, files);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sayhalo-light to-white overflow-hidden">
      <div className="max-w-screen-xl mx-auto p-4">
        <div className="flex justify-end mb-4">
          {/* Settings button that toggles the API settings modal */}
          <button 
            onClick={() => setShowApiSettings(true)}
            className="flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-slate-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            API Settings
          </button>
          
          {/* API Settings Modal */}
          {showApiSettings && (
            <ApiSettings onClose={() => setShowApiSettings(false)} />
          )}
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Welcome Message */}
          {!chatStarted && (
            <WelcomeMessage onStart={handleStart} />
          )}
          
          {/* Chat Section - Only shown after clicking Start */}
          {chatStarted && (
            <div className="rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm shadow-sm h-[calc(100vh-11rem)] flex flex-col">
              <div className="flex-1 overflow-hidden">
                <Chat chatRef={chatRef} />
              </div>
              <div className="p-4 border-t border-gray-200">
                <ChatInput onSendMessage={handleSendMessage} />
              </div>
            </div>
          )}
          
          {/* Manager Agent - Always shown */}
          <div className={chatStarted ? "" : "md:col-span-1"}>
            <ManagerAgent />
          </div>
          
          {/* Suggestions - Only shown before starting chat */}
          {!chatStarted && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-sayhalo-dark">Suggested Topics</h3>
              <div className="grid grid-cols-1 gap-3">
                <SuggestCard 
                  title="Upload Project Requirements" 
                  description="Share a markdown file with your project requirements for analysis"
                  onClick={handleStart}
                />
                <SuggestCard 
                  title="Setup E-commerce Architecture" 
                  description="Get advice on setting up a scalable e-commerce platform"
                  onClick={handleStart}
                />
                <SuggestCard 
                  title="Discuss Technical Stack" 
                  description="Explore the best technologies for your e-commerce platform"
                  onClick={handleStart}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
