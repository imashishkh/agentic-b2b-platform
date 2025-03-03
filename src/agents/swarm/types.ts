/**
 * Type definitions for the Agent Swarm framework
 */

import { AgentType } from '../AgentTypes';

/**
 * Represents a node in the agent graph
 */
export interface AgentNode {
  id: string;
  type: AgentType;
  name: string;
  description: string;
  capabilities: string[];
}

/**
 * Represents a connection between agent nodes
 */
export interface AgentEdge {
  source: string;
  target: string;
  relationship: 'delegates' | 'collaborates' | 'reports';
}

/**
 * The state shared between agents
 */
export interface SwarmState {
  messages: SwarmMessage[];
  artifacts: SwarmArtifact[];
  taskStatus: SwarmTaskStatus;
  currentAssignee: string | null;
  memory: Record<string, any>;
}

/**
 * Represents a message exchanged within the swarm
 */
export interface SwarmMessage {
  id: string;
  from: string;
  to: string | null; // null means broadcast to all
  content: string;
  type: 'request' | 'response' | 'update' | 'question' | 'answer';
  timestamp: number;
  metadata?: Record<string, any>;
}

/**
 * Represents an artifact produced by an agent
 */
export interface SwarmArtifact {
  id: string;
  creator: string;
  name: string;
  type: 'code' | 'design' | 'data' | 'document' | 'other';
  content: string;
  metadata?: Record<string, any>;
  timestamp: number;
}

/**
 * Represents the current status of a task in the swarm
 */
export interface SwarmTaskStatus {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'blocked' | 'completed' | 'failed';
  assignedTo: string | null;
  progress: number; // 0-100
  created: number;
  updated: number;
  dependencies: string[];
}

/**
 * The configuration for a swarm
 */
export interface SwarmConfig {
  id: string;
  name: string;
  description: string;
  nodes: AgentNode[];
  edges: AgentEdge[];
  initialState: Partial<SwarmState>;
}

/**
 * The result of a swarm execution
 */
export interface SwarmResult {
  taskId: string;
  completed: boolean;
  artifacts: SwarmArtifact[];
  messages: SwarmMessage[];
  finalState: SwarmState;
  error?: string;
}

/**
 * Defines the available actions an agent can take
 */
export enum SwarmAction {
  SEND_MESSAGE = 'send_message',
  CREATE_ARTIFACT = 'create_artifact',
  UPDATE_STATUS = 'update_status',
  DELEGATE_TASK = 'delegate_task',
  REQUEST_INFORMATION = 'request_information',
  COMPLETE_TASK = 'complete_task',
}

/**
 * Interface for a function that can process agent swarm actions
 */
export interface SwarmActionHandler {
  (state: SwarmState, action: { type: SwarmAction; payload: any }): SwarmState;
}