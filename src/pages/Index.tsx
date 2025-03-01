
import { Hand, Plane, User, Wrench } from "lucide-react";
import { SayHaloLogo } from "@/components/SayHaloLogo";
import { SuggestCard } from "@/components/SuggestCard";
import { ChatInput } from "@/components/ChatInput";
import { WelcomeMessage } from "@/components/WelcomeMessage";

const Index = () => {
  return (
    <div className="min-h-screen w-full gradient-bg noise-bg relative flex flex-col">
      <div className="w-full max-w-[1200px] mx-auto h-screen flex flex-col px-4 md:px-6">
        {/* Header */}
        <header className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <SayHaloLogo size={36} />
            <h1 className="text-sayhalo-dark font-bold text-lg">SayHalo</h1>
          </div>
          <button className="w-8 h-8 rounded-full bg-sayhalo-dark/10 flex items-center justify-center hover:bg-sayhalo-dark/20 transition-colors">
            <User size={18} className="text-sayhalo-dark" />
          </button>
        </header>

        {/* Chat Area - Empty State with Welcome Message */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <WelcomeMessage />
        </div>

        {/* Suggestion Cards */}
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <SuggestCard 
            icon={<Plane size={18} className="text-white" />}
            title="Wanderlust Destinations 2024"
            subtitle="Must-Visit Places"
          />
          <SuggestCard 
            icon={<Hand size={18} className="text-white" />}
            title="SayHalo AI: What Sets Us Apart"
            subtitle="Key Differentiators"
          />
          <SuggestCard 
            icon={<Wrench size={18} className="text-white" />}
            title="Design Trends on TikTok 2024"
            subtitle="Trending Now"
          />
        </div>

        {/* Chat Input */}
        <div className="py-6">
          <ChatInput />
        </div>
      </div>
    </div>
  );
};

export default Index;
