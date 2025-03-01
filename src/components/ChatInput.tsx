
import { useState, useRef } from "react";
import { ArrowRight, Link, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

interface ChatInputProps {
  className?: string;
}

export function ChatInput({ className }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSendMessage = () => {
    if (!message.trim() && !selectedFile) return;
    
    // In a real app, this would send the message to a backend
    toast.success("Message sent successfully");
    setMessage("");
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setSelectedFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={cn(
      "w-full max-w-[80%] mx-auto relative",
      className
    )}>
      <div className="glass rounded-[15px] flex items-center w-full shadow-lg shadow-black/5 border border-white/15 px-4">
        <Popover>
          <PopoverTrigger asChild>
            <button className="p-2 text-sayhalo-dark opacity-70 hover:opacity-100 transition-opacity">
              <Settings size={20} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-3">
              <h3 className="font-medium text-sm">Chat Settings</h3>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-sayhalo-dark/80 block">Response Length</label>
                <select className="w-full text-xs rounded-md border border-sayhalo-dark/20 p-1.5">
                  <option value="short">Short</option>
                  <option value="medium" selected>Medium</option>
                  <option value="long">Long</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-sayhalo-dark/80 block">Tone</label>
                <select className="w-full text-xs rounded-md border border-sayhalo-dark/20 p-1.5">
                  <option value="casual">Casual</option>
                  <option value="professional" selected>Professional</option>
                  <option value="friendly">Friendly</option>
                </select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <button 
          className="p-2 text-sayhalo-dark opacity-70 hover:opacity-100 transition-opacity"
          onClick={() => fileInputRef.current?.click()}
        >
          <Link size={20} />
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
        </button>
        
        <input 
          type="text" 
          placeholder="Ask SayHalo anything..." 
          className="flex-1 py-3 px-2 bg-transparent border-none outline-none text-sayhalo-dark placeholder:text-sayhalo-light/70"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        
        {selectedFile && (
          <div className="flex items-center gap-1 bg-sayhalo-dark/10 px-2 py-1 rounded-md mr-2">
            <span className="text-xs truncate max-w-[100px]">{selectedFile.name}</span>
            <button 
              className="text-sayhalo-dark/70 hover:text-sayhalo-dark"
              onClick={() => setSelectedFile(null)}
            >
              ×
            </button>
          </div>
        )}
        
        <button 
          className="flex items-center justify-center gap-1 bg-sayhalo-coral text-white px-4 py-2 rounded-[10px] font-medium hover:shadow-md transition-all duration-300"
          onClick={handleSendMessage}
        >
          Send
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
