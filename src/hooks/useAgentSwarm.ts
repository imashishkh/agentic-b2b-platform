/**
 * Hook for using the agent swarm in React components
 */
import { useState, useCallback } from 'react';
import { SwarmFactory } from '@/agents/swarm/SwarmFactory';
import { SwarmResult, SwarmArtifact, SwarmMessage } from '@/agents/swarm/types';

interface UseAgentSwarmOptions {
  swarmType: 'ecommerce' | 'custom';
  customConfig?: any;
}

interface UseAgentSwarmReturn {
  processing: boolean;
  result: SwarmResult | null;
  error: string | null;
  messages: SwarmMessage[];
  artifacts: SwarmArtifact[];
  sendMessage: (message: string) => Promise<void>;
  reset: () => void;
}

/**
 * Hook for interacting with the agent swarm
 * @param options Configuration options for the swarm
 * @returns Swarm state and interaction methods
 */
export function useAgentSwarm(options: UseAgentSwarmOptions = { swarmType: 'ecommerce' }): UseAgentSwarmReturn {
  const [processing, setProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<SwarmResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<SwarmMessage[]>([]);
  const [artifacts, setArtifacts] = useState<SwarmArtifact[]>([]);

  // Initialize the appropriate swarm based on options
  const swarm = options.swarmType === 'ecommerce' 
    ? SwarmFactory.createEcommerceSwarm()
    : SwarmFactory.createCustomSwarm(options.customConfig);

  /**
   * Send a message to the agent swarm for processing
   * @param message The user message to process
   */
  const sendMessage = useCallback(async (message: string) => {
    setProcessing(true);
    setError(null);
    
    try {
      // Process the message with the swarm
      const swarmResult = await swarm.processRequest(message);
      
      // Update state with the result
      setResult(swarmResult);
      setMessages(swarmResult.messages);
      setArtifacts(swarmResult.artifacts);
    } catch (err) {
      console.error('Error processing message with agent swarm:', err);
      setError(err.message || 'An error occurred while processing your request');
    } finally {
      setProcessing(false);
    }
  }, [swarm]);

  /**
   * Reset the swarm state
   */
  const reset = useCallback(() => {
    setProcessing(false);
    setResult(null);
    setError(null);
    setMessages([]);
    setArtifacts([]);
  }, []);

  return {
    processing,
    result,
    error,
    messages,
    artifacts,
    sendMessage,
    reset
  };
}