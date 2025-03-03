/**
 * SwarmCoordinator - Manages the agent swarm using LangGraph
 */
import { v4 as uuidv4 } from 'uuid';
import { StateGraph, StateGraphArgs } from '@langchain/langgraph';
import { ChatMessage, FunctionMessage, HumanMessage } from '@langchain/core/messages';
import { RunnableSequence } from '@langchain/core/runnables';

import { 
  SwarmState, 
  SwarmConfig, 
  SwarmResult, 
  SwarmAction, 
  SwarmMessage,
  SwarmArtifact
} from './types';
import { AgentType } from '../AgentTypes';
import { EcommerceAgent } from '../EcommerceAgent'; 
import { FrontendAgent } from '../FrontendAgent';
import { BackendAgent } from '../BackendAgent';
import { DatabaseAgent } from '../DatabaseAgent';
import { UXAgent } from '../UXAgent';
import { DevOpsAgent } from '../DevOpsAgent';
import { ManagerAgent } from '../ManagerAgent';

/**
 * Class to coordinate a swarm of agents using LangGraph
 */
export class SwarmCoordinator {
  private graph: StateGraph<SwarmState>;
  private config: SwarmConfig;
  private agents: Map<string, any>;

  /**
   * Create a new SwarmCoordinator
   * @param config - The configuration for the swarm
   */
  constructor(config: SwarmConfig) {
    this.config = config;
    this.agents = new Map();
    
    // Initialize the agent instances based on the configuration
    this.initializeAgents();
    
    // Create the graph that coordinates the agents
    this.graph = this.createAgentGraph();
  }

  /**
   * Create agent instances based on the configuration
   */
  private initializeAgents(): void {
    for (const node of this.config.nodes) {
      let agent;
      
      // Create the appropriate agent type
      switch (node.type) {
        case AgentType.ECOMMERCE:
          agent = new EcommerceAgent();
          break;
        case AgentType.FRONTEND:
          agent = new FrontendAgent();
          break;
        case AgentType.BACKEND:
          agent = new BackendAgent();
          break;
        case AgentType.DATABASE:
          agent = new DatabaseAgent();
          break;
        case AgentType.UX:
          agent = new UXAgent();
          break;
        case AgentType.DEVOPS:
          agent = new DevOpsAgent();
          break;
        case AgentType.MANAGER:
          agent = new ManagerAgent();
          break;
        default:
          throw new Error(`Unknown agent type: ${node.type}`);
      }
      
      this.agents.set(node.id, agent);
    }
  }

  /**
   * Create the agent graph using LangGraph
   */
  private createAgentGraph(): StateGraph<SwarmState> {
    // Define the initial state
    const initialState: SwarmState = {
      messages: [],
      artifacts: [],
      taskStatus: {
        id: uuidv4(),
        name: 'Initial Task',
        description: 'Starting the swarm',
        status: 'pending',
        assignedTo: null,
        progress: 0,
        created: Date.now(),
        updated: Date.now(),
        dependencies: []
      },
      currentAssignee: null,
      memory: {},
      ...this.config.initialState
    };

    // Create the graph
    const graphArgs: StateGraphArgs<SwarmState> = {
      channels: {
        messages: {
          value: (s: SwarmState) => s.messages,
          default: () => []
        },
        artifacts: {
          value: (s: SwarmState) => s.artifacts,
          default: () => []
        },
        taskStatus: {
          value: (s: SwarmState) => s.taskStatus,
          default: () => ({
            id: uuidv4(),
            name: 'Initial Task',
            description: 'Starting the swarm',
            status: 'pending',
            assignedTo: null,
            progress: 0,
            created: Date.now(),
            updated: Date.now(),
            dependencies: []
          })
        },
        currentAssignee: {
          value: (s: SwarmState) => s.currentAssignee,
          default: () => null
        },
        memory: {
          value: (s: SwarmState) => s.memory,
          default: () => ({})
        }
      }
    };

    const graph = new StateGraph<SwarmState>(graphArgs);

    // Add nodes to the graph - each agent is a node
    for (const node of this.config.nodes) {
      graph.addNode(node.id, this.createAgentNode(node.id));
    }

    // Add the edges based on the configuration
    for (const edge of this.config.edges) {
      graph.addEdge(edge.source, edge.target);
    }

    // Add conditional routing
    graph.addConditionalEdges(
      this.config.nodes[0].id, // Start with the first node (typically manager)
      (state) => this.determineNextAgent(state),
      this.config.nodes.map(node => node.id)
    );

    return graph;
  }

  /**
   * Create a node for an agent in the graph
   * @param agentId - The ID of the agent
   */
  private createAgentNode(agentId: string) {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }

    // Create a runnable sequence that processes the state with this agent
    return RunnableSequence.from([
      // Extract the latest message or task for this agent
      (state: SwarmState) => {
        const relevantMessages = state.messages.filter(m => 
          m.to === agentId || m.to === null || m.from === agentId
        ).slice(-5); // get last 5 relevant messages for context
        
        // Create the prompt for the agent
        const input = relevantMessages.map(m => 
          new HumanMessage(m.content)
        );
        
        return {
          messages: input,
          artifacts: state.artifacts,
          taskStatus: state.taskStatus,
          agentId
        };
      },
      
      // Process with the agent
      async ({ messages, artifacts, taskStatus, agentId }) => {
        try {
          // Generate response from the agent
          const agentResponse = await agent.generateResponse(
            messages.length > 0 ? messages[messages.length - 1].content : 
            `You are working on: ${taskStatus.description}`,
            messages.slice(0, -1).map(m => m.content)
          );

          // Return the response
          return new FunctionMessage({
            name: agentId,
            content: agentResponse
          });
        } catch (error) {
          console.error(`Error with agent ${agentId}:`, error);
          return new FunctionMessage({
            name: agentId,
            content: `I encountered an error processing this request: ${error.message}`
          });
        }
      },
      
      // Update the state with the agent's response
      (response: ChatMessage, state: SwarmState) => {
        const newMessage: SwarmMessage = {
          id: uuidv4(),
          from: agentId,
          to: null, // Broadcast to all by default
          content: response.content,
          type: 'response',
          timestamp: Date.now()
        };
        
        // Create a new state with the updated messages
        return {
          ...state,
          messages: [...state.messages, newMessage],
          currentAssignee: this.determineNextAgent(state),
          taskStatus: {
            ...state.taskStatus,
            updated: Date.now(),
            status: this.isTaskComplete(response.content) ? 'completed' : 'in_progress',
            progress: this.calculateProgress(response.content, state.taskStatus.progress)
          }
        };
      }
    ]);
  }

  /**
   * Determine which agent should be assigned next based on the current state
   * @param state - The current swarm state
   */
  private determineNextAgent(state: SwarmState): string {
    // If a specific agent is mentioned, route to them
    const lastMessage = state.messages[state.messages.length - 1];
    if (!lastMessage) {
      // Default to the first agent if no messages yet
      return this.config.nodes[0].id;
    }

    // Check if the message mentions another agent
    for (const node of this.config.nodes) {
      if (lastMessage.content.toLowerCase().includes(node.name.toLowerCase())) {
        return node.id;
      }
    }

    // Check if message requests specific expertise
    for (const node of this.config.nodes) {
      for (const capability of node.capabilities) {
        if (lastMessage.content.toLowerCase().includes(capability.toLowerCase())) {
          return node.id;
        }
      }
    }

    // If the task is completed, route to the manager agent
    if (state.taskStatus.status === 'completed') {
      const managerNode = this.config.nodes.find(node => node.type === AgentType.MANAGER);
      if (managerNode) {
        return managerNode.id;
      }
    }

    // Otherwise, if the current assignee is set, keep it
    if (state.currentAssignee) {
      return state.currentAssignee;
    }

    // Default to the manager if available
    const managerNode = this.config.nodes.find(node => node.type === AgentType.MANAGER);
    return managerNode ? managerNode.id : this.config.nodes[0].id;
  }

  /**
   * Check if a task is complete based on the agent's response
   * @param response - The agent's response text
   */
  private isTaskComplete(response: string): boolean {
    const completionPhrases = [
      'task complete',
      'completed the task',
      'finished the task',
      'task is done',
      'successfully completed'
    ];
    
    return completionPhrases.some(phrase => 
      response.toLowerCase().includes(phrase.toLowerCase())
    );
  }

  /**
   * Calculate the progress based on the agent's response
   * @param response - The agent's response text
   * @param currentProgress - The current progress value
   */
  private calculateProgress(response: string, currentProgress: number): number {
    // Look for explicit progress indicators like "50% complete"
    const progressRegex = /(\d+)%\s*(complete|done|finished)/i;
    const match = response.match(progressRegex);
    
    if (match && match[1]) {
      const extractedProgress = parseInt(match[1], 10);
      if (!isNaN(extractedProgress) && extractedProgress >= 0 && extractedProgress <= 100) {
        return extractedProgress;
      }
    }
    
    // If no explicit indicator, increment by 10% from current unless already high
    if (currentProgress < 90) {
      return currentProgress + 10;
    }
    
    return currentProgress;
  }

  /**
   * Run the agent swarm on a user message
   * @param message - The user message to process
   * @returns The result of the swarm execution
   */
  public async run(message: string): Promise<SwarmResult> {
    try {
      // Create initial state with the user message
      const initialState: SwarmState = {
        messages: [{
          id: uuidv4(),
          from: 'user',
          to: null,
          content: message,
          type: 'request',
          timestamp: Date.now()
        }],
        artifacts: [],
        taskStatus: {
          id: uuidv4(),
          name: 'Process User Request',
          description: message,
          status: 'pending',
          assignedTo: null,
          progress: 0,
          created: Date.now(),
          updated: Date.now(),
          dependencies: []
        },
        currentAssignee: null,
        memory: {}
      };

      // Compile the graph
      const executor = this.graph.compile();
      
      // Execute the graph with the initial state
      const result = await executor.invoke(initialState);
      
      // Format the result
      return {
        taskId: result.taskStatus.id,
        completed: result.taskStatus.status === 'completed',
        artifacts: result.artifacts,
        messages: result.messages,
        finalState: result
      };
    } catch (error) {
      console.error('Error running agent swarm:', error);
      return {
        taskId: uuidv4(),
        completed: false,
        artifacts: [],
        messages: [{
          id: uuidv4(),
          from: 'system',
          to: null,
          content: `Error: ${error.message}`,
          type: 'response',
          timestamp: Date.now()
        }],
        finalState: {
          messages: [],
          artifacts: [],
          taskStatus: {
            id: uuidv4(),
            name: 'Error',
            description: 'Error processing request',
            status: 'failed',
            assignedTo: null,
            progress: 0,
            created: Date.now(),
            updated: Date.now(),
            dependencies: []
          },
          currentAssignee: null,
          memory: {}
        },
        error: error.message
      };
    }
  }

  /**
   * Create an artifact in the swarm
   * @param creator - The ID of the agent creating the artifact
   * @param name - The name of the artifact
   * @param type - The type of artifact
   * @param content - The content of the artifact
   * @param metadata - Additional metadata
   */
  public async createArtifact(
    creator: string,
    name: string,
    type: 'code' | 'design' | 'data' | 'document' | 'other',
    content: string,
    metadata?: Record<string, any>
  ): Promise<SwarmArtifact> {
    const artifact: SwarmArtifact = {
      id: uuidv4(),
      creator,
      name,
      type,
      content,
      metadata,
      timestamp: Date.now()
    };
    
    return artifact;
  }

  /**
   * Send a message within the swarm
   * @param from - The ID of the sender
   * @param content - The message content
   * @param to - The ID of the recipient (null for broadcast)
   * @param type - The type of message
   */
  public async sendMessage(
    from: string,
    content: string,
    to: string | null = null,
    type: 'request' | 'response' | 'update' | 'question' | 'answer' = 'update'
  ): Promise<SwarmMessage> {
    const message: SwarmMessage = {
      id: uuidv4(),
      from,
      to,
      content,
      type,
      timestamp: Date.now()
    };
    
    return message;
  }
}