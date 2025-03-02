
import React, { useEffect, useRef } from "react";
import { useChat, KnowledgeBaseResource } from "@/contexts/ChatContext";
import { extractResourceUrls, suggestResourceCategory, extractTitleFromUrl } from "@/utils/knowledgeBaseUtils";
import { toast } from "sonner";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * Text input component for chat messages
 * Handles user typing and keyboard events
 * Also processes potential knowledge base resources
 */
export const MessageInput: React.FC<MessageInputProps> = ({ 
  value, 
  onChange, 
  onKeyDown 
}) => {
  const { isRequestingKnowledge, addKnowledgeResource } = useChat();
  const previousValueRef = useRef(value);

  /**
   * Process potential knowledge base resources when in knowledge request mode
   */
  useEffect(() => {
    // Only check for resources when we're specifically requesting them
    if (isRequestingKnowledge && value !== previousValueRef.current) {
      const urls = extractResourceUrls(value);
      
      // Process each URL to suggest it as a resource
      urls.forEach(url => {
        // Only process new URLs that weren't in the previous value
        if (previousValueRef.current.includes(url)) {
          return;
        }
        
        // Create a placeholder description from the URL
        const title = extractTitleFromUrl(url);
        const category = suggestResourceCategory(url);
        const description = `Resource from ${new URL(url).hostname.replace('www.', '')}`;
        
        // Show a notification that we've detected a resource
        toast.info(
          <div className="text-sm">
            <p className="font-medium mb-1">Resource detected</p>
            <p className="text-xs">{title}</p>
            <p className="text-xs text-gray-500 mt-1">Press Enter to add to knowledge base</p>
          </div>,
          {
            duration: 5000,
            action: {
              label: "Add",
              onClick: () => {
                addKnowledgeResource({
                  id: Date.now().toString(),
                  title,
                  url,
                  category,
                  description,
                  dateAdded: new Date()
                });
                toast.success("Resource added to knowledge base");
              }
            }
          }
        );
      });
    }
    
    previousValueRef.current = value;
  }, [value, isRequestingKnowledge, addKnowledgeResource]);

  return (
    <input 
      type="text" 
      placeholder={isRequestingKnowledge 
        ? "Paste a URL to add to knowledge base..." 
        : "Ask DevManager anything..."
      }
      className="flex-1 py-3 px-4 bg-transparent border-none outline-none text-sayhalo-dark placeholder:text-gray-400"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        // Handle special case for knowledge base URL submission
        if (isRequestingKnowledge && e.key === "Enter" && value.trim()) {
          const urls = extractResourceUrls(value);
          
          // If we have a URL, add it to the knowledge base
          if (urls.length > 0) {
            urls.forEach(url => {
              try {
                // Validate URL
                new URL(url);
                
                // Create resource
                const resource: KnowledgeBaseResource = {
                  id: Date.now().toString(),
                  title: extractTitleFromUrl(url),
                  url,
                  category: suggestResourceCategory(url),
                  description: `Resource from ${new URL(url).hostname.replace('www.', '')}`,
                  dateAdded: new Date()
                };
                
                // Add to knowledge base
                addKnowledgeResource(resource);
                toast.success("Resource added to knowledge base");
              } catch (error) {
                console.error("Invalid URL:", url);
              }
            });
          }
        }
        
        // Pass the event to the parent handler
        onKeyDown(e);
      }}
    />
  );
};
