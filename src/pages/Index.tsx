
import { Hand, Plane, User, Wrench } from "lucide-react";
import { SayHaloLogo } from "@/components/SayHaloLogo";
import { ChatInput } from "@/components/ChatInput";
import { WelcomeMessage } from "@/components/WelcomeMessage";
import { Toaster } from "@/components/ui/sonner";

/**
 * Index Page Component
 * 
 * Main landing page for the SayHalo chat application.
 * Displays the welcome message and chat input.
 * Implements the glassmorphism design pattern.
 * 
 * @returns {JSX.Element} - Rendered index page
 */
const Index = () => {
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
            <h1 className="text-sayhalo-dark font-bold text-lg">SayHalo</h1>
          </div>
          <button className="w-9 h-9 rounded-full bg-sayhalo-dark/10 flex items-center justify-center hover:bg-sayhalo-dark/20 transition-colors">
            <User size={20} className="text-sayhalo-dark" />
          </button>
        </header>

        {/* Chat Area - Empty State with Welcome Message */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <WelcomeMessage />
        </div>

        {/* Chat Input - fixed at the bottom of the screen */}
        <div className="py-6 fixed bottom-0 left-0 right-0 px-4">
          <div className="max-w-xl mx-auto">
            <ChatInput />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
