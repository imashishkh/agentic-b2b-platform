
import { ArrowRight, Link, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  className?: string;
}

export function ChatInput({ className }: ChatInputProps) {
  return (
    <div className={cn(
      "w-full max-w-[80%] mx-auto relative",
      className
    )}>
      <div className="glass rounded-[15px] flex items-center w-full shadow-lg shadow-black/5 border border-white/15 px-4">
        <button className="p-2 text-sayhalo-dark opacity-70 hover:opacity-100 transition-opacity">
          <Settings size={20} />
        </button>
        <button className="p-2 text-sayhalo-dark opacity-70 hover:opacity-100 transition-opacity">
          <Link size={20} />
        </button>
        <input 
          type="text" 
          placeholder="Ask SayHalo anything..." 
          className="flex-1 py-3 px-2 bg-transparent border-none outline-none text-sayhalo-dark placeholder:text-sayhalo-light/70"
        />
        <button className="flex items-center justify-center gap-1 bg-sayhalo-coral text-white px-4 py-2 rounded-[10px] font-medium hover:shadow-md transition-all duration-300">
          Send
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
