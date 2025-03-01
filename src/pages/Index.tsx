
import { User } from "lucide-react";
import { SayHaloLogo } from "@/components/SayHaloLogo";
import { ChatInput } from "@/components/ChatInput";
import { Toaster } from "@/components/ui/sonner";
import { Chat } from "@/components/Chat";
import { useState, useRef } from "react";

/**
 * Index Page Component
 * 
 * Main landing page for the SayHalo chat application.
 * Displays the chat interface and input for interaction with the manager agent.
 * 
 * @returns {JSX.Element} - Rendered index page
 */
const Index = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const chatRef = useRef<{ processUserMessage: (message: string) => void }>(null);

  const handleStartChat = () => {
    setShowWelcome(false);
  };

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    
    // If welcome is still showing, hide it
    if (showWelcome) {
      setShowWelcome(false);
    }
    
    // Forward the message to the Chat component for processing
    if (chatRef.current) {
      chatRef.current.processUserMessage(message);
    }
  };

  return (
    <div className="min-h-screen w-full gradient-bg noise-bg relative flex flex-col">
      {/* Toast notification container */}
      <Toaster position="top-center" />
      
      <div className="w-full max-w-[1200px] mx-auto h-screen flex flex-col px-6 md:px-8">
        {/* Header with logo and user profile button */}
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <div className="bg-sayhalo-dark rounded-xl p-2">
              <SayHaloLogo size={24} />
            </div>
            <h1 className="text-sayhalo-dark font-bold text-lg">DevManager</h1>
          </div>
          <button className="w-9 h-9 rounded-full bg-sayhalo-dark/10 flex items-center justify-center hover:bg-sayhalo-dark/20 transition-colors">
            <User size={20} className="text-sayhalo-dark" />
          </button>
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col items-center overflow-hidden">
          {showWelcome ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center space-y-6">
                <div className="w-[80px] h-[80px] bg-sayhalo-dark rounded-[20px] flex items-center justify-center mb-2 mx-auto">
                  <SayHaloLogo size={48} className="animate-pulse-gentle" />
                </div>
                <h1 className="text-sayhalo-dark font-semibold text-2xl md:text-3xl">Development Manager Agent</h1>
                <p className="text-sayhalo-light text-center max-w-[70%] mx-auto mt-3 text-base">
                  I'll guide you through building a complex e-commerce platform by asking questions and helping you plan the development process.
                </p>
                <button 
                  className="bg-sayhalo-coral text-white px-6 py-3 rounded-xl font-medium hover:shadow-md transition-all duration-300"
                  onClick={handleStartChat}
                >
                  Start Conversation
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full h-full overflow-hidden flex flex-col">
              <div className="flex-1 overflow-y-auto">
                <Chat ref={chatRef} />
              </div>
            </div>
          )}
        </div>

        {/* Chat Input - fixed at the bottom of the screen */}
        <div className="py-6">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
