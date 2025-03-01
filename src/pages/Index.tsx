
import { Hand, Plane, User, Wrench } from "lucide-react";
import { SayHaloLogo } from "@/components/SayHaloLogo";
import { SuggestCard } from "@/components/SuggestCard";
import { ChatInput } from "@/components/ChatInput";
import { WelcomeMessage } from "@/components/WelcomeMessage";
import { Toaster } from "@/components/ui/sonner";

const Index = () => {
  return (
    <div className="min-h-screen w-full gradient-bg noise-bg relative flex flex-col">
      <Toaster position="top-center" />
      <div className="w-full max-w-[1200px] mx-auto h-screen flex flex-col px-6 md:px-8">
        {/* Header with more padding */}
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

        {/* Suggestion Cards - updated to be more centered and square */}
        <div className="w-full max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          <SuggestCard 
            icon={<Plane size={20} className="text-white" />}
            title="Wanderlust Destinations 2024"
            subtitle="Must-Visit Places"
          />
          <SuggestCard 
            icon={<Hand size={20} className="text-white" />}
            title="SayHalo AI: What Sets Us Apart"
            subtitle="Key Differentiators"
          />
          <SuggestCard 
            icon={<Wrench size={20} className="text-white" />}
            title="Design Trends on TikTok 2024"
            subtitle="Trending Now"
          />
        </div>

        {/* Chat Input - centered and pill-shaped */}
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
