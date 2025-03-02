
import { AgentType } from "@/agents/AgentTypes";

export interface ChatMessage {
  type: 'user' | 'agent';
  content: string;
  agentType?: AgentType;
}
