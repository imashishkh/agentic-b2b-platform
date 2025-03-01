
import { User, FileText, Search, Brain } from "lucide-react";
import { SayHaloLogo } from "@/components/SayHaloLogo";
import { ChatInput } from "@/components/ChatInput";
import { Toaster } from "@/components/ui/sonner";
import { Chat } from "@/components/Chat";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { askClaude, searchInternet } from "@/utils/aiServices";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  const [showAgentBackstory, setShowAgentBackstory] = useState(false);
  const chatRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartChat = () => {
    setShowWelcome(false);
  };

  const handleSendMessage = async (message: string) => {
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's a markdown file
    if (file.name.endsWith('.md') || file.type === 'text/markdown') {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const content = event.target?.result as string;
        
        if (content && chatRef.current) {
          toast.success(`Parsing markdown file: ${file.name}`);
          // Send the markdown content to be processed
          chatRef.current.processUserMessage(`Parse markdown: \`\`\`markdown\n${content}\n\`\`\``);
        }
      };
      
      reader.onerror = () => {
        toast.error(`Failed to read file: ${file.name}`);
      };
      
      reader.readAsText(file);
    } else {
      toast.error("Please upload a markdown (.md) file");
    }
    
    // Reset the file input
    e.target.value = '';
  };

  const handleSearch = async () => {
    const searchQuery = prompt("What would you like to search for?");
    if (searchQuery && chatRef.current) {
      toast.success("Searching the internet...");
      
      try {
        const results = await searchInternet(searchQuery);
        chatRef.current.processUserMessage(`I searched for "${searchQuery}" and found:\n\n${results}`);
      } catch (error) {
        toast.error("Search failed");
        console.error(error);
      }
    }
  };

  const handleAskClaude = async () => {
    const query = prompt("What would you like to ask Claude?");
    if (query && chatRef.current) {
      toast.success("Asking Claude...");
      
      try {
        const response = await askClaude(query);
        chatRef.current.processUserMessage(`I asked Claude: "${query}"\n\nClaude's response:\n${response}`);
      } catch (error) {
        toast.error("Failed to get a response from Claude");
        console.error(error);
      }
    }
  };

  const toggleAgentBackstory = () => {
    setShowAgentBackstory(!showAgentBackstory);
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
            {/* Agent info button */}
            <button 
              onClick={toggleAgentBackstory}
              className="ml-4 text-xs px-2 py-1 bg-sayhalo-dark/10 hover:bg-sayhalo-dark/20 rounded-md transition-colors"
            >
              {showAgentBackstory ? "Hide Agent Info" : "Show Agent Info"}
            </button>
          </div>
          <div className="flex items-center gap-3">
            {/* File upload button */}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-9 h-9 rounded-full bg-sayhalo-dark/10 flex items-center justify-center hover:bg-sayhalo-dark/20 transition-colors"
              title="Upload Markdown file"
            >
              <FileText size={18} className="text-sayhalo-dark" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".md,text/markdown"
              onChange={handleFileUpload}
            />
            
            {/* Search button */}
            <button 
              onClick={handleSearch}
              className="w-9 h-9 rounded-full bg-sayhalo-dark/10 flex items-center justify-center hover:bg-sayhalo-dark/20 transition-colors"
              title="Search internet"
            >
              <Search size={18} className="text-sayhalo-dark" />
            </button>
            
            {/* Claude AI button */}
            <button 
              onClick={handleAskClaude}
              className="w-9 h-9 rounded-full bg-sayhalo-dark/10 flex items-center justify-center hover:bg-sayhalo-dark/20 transition-colors"
              title="Ask Claude AI"
            >
              <Brain size={18} className="text-sayhalo-dark" />
            </button>
            
            {/* User profile button */}
            <button className="w-9 h-9 rounded-full bg-sayhalo-dark/10 flex items-center justify-center hover:bg-sayhalo-dark/20 transition-colors">
              <User size={20} className="text-sayhalo-dark" />
            </button>
          </div>
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
              {/* Display agent backstory if enabled */}
              {showAgentBackstory && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-4 max-h-[30vh] overflow-y-auto">
                  <h2 className="text-lg font-semibold mb-2">DevManager AI Agent</h2>
                  <p className="text-sm mb-2"><strong>Background:</strong> I'm an AI development manager with extensive experience in building e-commerce platforms. I've led teams that built platforms like Shopify, WooCommerce, and custom solutions for Fortune 500 retailers.</p>
                  <p className="text-sm mb-2"><strong>Expertise:</strong> Frontend development, backend systems, payment processing, inventory management, user authentication, search engines, mobile design, and analytics.</p>
                  <p className="text-sm mb-2"><strong>Approach:</strong> I believe in an iterative development process that starts with core functionality and expands based on user feedback.</p>
                  <p className="text-sm"><strong>Specialties:</strong> Converting business requirements into technical specifications, identifying potential scalability challenges, recommending optimal tech stacks, and breaking complex projects into achievable milestones.</p>
                </div>
              )}
              <div className="flex-1 overflow-y-auto">
                <Chat chatRef={chatRef} />
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
};

export default Index;
