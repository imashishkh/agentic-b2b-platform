/**
 * AgentSwarmChat - A component for interacting with the agent swarm
 */
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
// Temporarily comment out import to prevent white screen
// import { useAgentSwarm } from '@/hooks/useAgentSwarm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Code, Lightbulb, FileText, UserCircle, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

// Temporarily define interfaces here instead of importing
interface SwarmMessage {
  id: string;
  from: string;
  to: string | null;
  content: string;
  type: string;
  timestamp: number;
}

interface SwarmArtifact {
  id: string;
  creator: string;
  name: string;
  type: string;
  content: string;
  timestamp: number;
}

/**
 * Component for displaying and interacting with the agent swarm
 */
export function AgentSwarmChat() {
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('messages');
  
  // Mock implementation of useAgentSwarm
  const [processing, setProcessing] = useState(false);
  const [messages, setMessages] = useState<SwarmMessage[]>([]);
  const [artifacts, setArtifacts] = useState<SwarmArtifact[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Mock sendMessage function
  const sendMessage = async (message: string) => {
    setProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // Create a user message
      const userMessage: SwarmMessage = {
        id: Math.random().toString(),
        from: 'user',
        to: null,
        content: message,
        type: 'request',
        timestamp: Date.now()
      };
      
      // Create a response from the swarm
      const responseMessage: SwarmMessage = {
        id: Math.random().toString(),
        from: 'manager',
        to: null,
        content: `This is a placeholder response because the LangGraph integration is currently being configured. Your message was: "${message}"`,
        type: 'response',
        timestamp: Date.now() + 1000
      };
      
      setMessages(prevMessages => [...prevMessages, userMessage, responseMessage]);
      setProcessing(false);
    }, 1000);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!userInput.trim() || processing) return;
    
    await sendMessage(userInput);
    setUserInput('');
  };

  // Handle key press in the textarea
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Get agent color based on agent ID
  const getAgentColor = (agentId: string) => {
    const colorMap: Record<string, string> = {
      'user': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'manager': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'ecommerce': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'frontend': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'backend': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      'database': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      'ux': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      'devops': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'system': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    
    return colorMap[agentId] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  };

  // Get icon for an agent
  const getAgentIcon = (agentId: string) => {
    switch (agentId) {
      case 'user':
        return <UserCircle className="h-5 w-5" />;
      case 'system':
        return <Bot className="h-5 w-5" />;
      default:
        return <Bot className="h-5 w-5" />;
    }
  };

  // Render a message
  const renderMessage = (message: SwarmMessage) => {
    return (
      <div 
        key={message.id} 
        className={`flex flex-col mb-4 ${message.from === 'user' ? 'items-end' : 'items-start'}`}
      >
        <div className="flex items-center mb-1">
          <Badge variant="outline" className={`${getAgentColor(message.from)} flex items-center gap-1`}>
            {getAgentIcon(message.from)}
            {message.from.charAt(0).toUpperCase() + message.from.slice(1)}
          </Badge>
          <span className="text-xs text-gray-500 ml-2">{formatTime(message.timestamp)}</span>
        </div>
        
        <div className={`rounded-lg px-4 py-2 max-w-[80%] ${
          message.from === 'user' 
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}>
          {message.content}
        </div>
      </div>
    );
  };

  // Render an artifact
  const renderArtifact = (artifact: SwarmArtifact) => {
    return (
      <Card key={artifact.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-md">{artifact.name}</CardTitle>
            <Badge variant="outline" className={getAgentColor(artifact.creator)}>
              {artifact.creator}
            </Badge>
          </div>
          <CardDescription>
            Created {new Date(artifact.timestamp).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {artifact.type === 'code' ? (
            <pre className="p-4 bg-muted rounded-md overflow-x-auto">
              <code>{artifact.content}</code>
            </pre>
          ) : (
            <div className="text-sm">{artifact.content}</div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle>B2B E-commerce Agent Swarm</CardTitle>
          <CardDescription>
            Collaborative AI agents working together to help build your B2B e-commerce platform
          </CardDescription>
        </CardHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-6">
            <TabsList className="w-full">
              <TabsTrigger value="messages" className="flex-1">
                <MessageCircle className="h-4 w-4 mr-2" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="artifacts" className="flex-1">
                <Code className="h-4 w-4 mr-2" />
                Artifacts ({artifacts.length})
              </TabsTrigger>
            </TabsList>
          </div>
          
          <CardContent className="flex-1 pt-4 overflow-hidden">
            <TabsContent value="messages" className="h-full data-[state=active]:flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4">
                    <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Start collaborating with the agent swarm
                    </h3>
                    <p className="text-muted-foreground text-sm max-w-md">
                      Ask about building B2B e-commerce features like bulk ordering, 
                      quote management, company accounts, or contract pricing.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map(renderMessage)}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="artifacts" className="h-full data-[state=active]:flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                {artifacts.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center px-4">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No artifacts created yet</h3>
                    <p className="text-muted-foreground text-sm max-w-md">
                      Ask the agent swarm to generate code, create designs, or produce 
                      documentation for your B2B e-commerce platform.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {artifacts.map(renderArtifact)}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </CardContent>
        </Tabs>
        
        <CardFooter className="border-t bg-card pt-4">
          {error && (
            <div className="w-full mb-2 p-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 text-sm rounded">
              Error: {error}
            </div>
          )}
          
          <div className="w-full flex space-x-2">
            <Textarea
              placeholder="Ask the agent swarm about building your B2B e-commerce platform..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 min-h-[60px] resize-none"
              disabled={processing}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!userInput.trim() || processing}
              className="self-end"
            >
              {processing ? 'Processing...' : 'Send'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}