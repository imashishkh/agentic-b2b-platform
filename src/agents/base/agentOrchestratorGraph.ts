/**
 * Agent Orchestrator using LangGraph
 * 
 * This module implements a graph-based workflow for orchestrating multiple agents
 * using LangGraph. It enables:
 * - State-based workflows
 * - Parallel agent operations
 * - Conditional branching between agents
 * - Persistent memory across sessions
 */

import { StateGraph, END } from "@langchain/langgraph";
import { RunnableLambda } from "@langchain/core/runnables";
import { AgentType } from "../AgentTypes";
import { createAgentChain, createAgentMemory } from "@/utils/aiServices";
import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";
import { DynamicTool } from "@langchain/core/tools";
import { z } from "zod";

/**
 * State interface for the agent graph
 */
interface AgentGraphState {
  messages: any[];
  agentOutputs: Record<string, any>;
  currentAgent: AgentType | null;
  error?: string;
  finalResponse?: string;
}

/**
 * Tools available to each agent type
 */
const getAgentTools = (agentType: AgentType) => {
  // Common tools available to all agents
  const commonTools = [
    new DynamicTool({
      name: "search_knowledge_base",
      description: "Search the knowledge base for relevant information",
      schema: z.object({
        query: z.string().describe("The search query to find information"),
      }),
      func: async ({ query }) => {
        console.log(`Searching knowledge base for: ${query}`);
        // In a real implementation, this would query a vector database
        return `Here is relevant information for "${query}" from the knowledge base.`;
      },
    }),
    new DynamicTool({
      name: "get_project_context",
      description: "Get context about the current project",
      schema: z.object({}),
      func: async () => {
        return `This is a B2B e-commerce platform focused on connecting Indian manufacturers with global buyers.`;
      },
    }),
  ];

  // Agent-specific tools
  switch (agentType) {
    case AgentType.FRONTEND:
      return [
        ...commonTools,
        new DynamicTool({
          name: "generate_ui_component",
          description: "Generate UI component code",
          schema: z.object({
            component_type: z.string().describe("Type of UI component to generate"),
            requirements: z.string().describe("Requirements for the component"),
          }),
          func: async ({ component_type, requirements }) => {
            console.log(`Generating ${component_type} component`);
            // This would call a code generation service
            return `Generated ${component_type} component based on requirements: ${requirements}`;
          },
        }),
      ];
    case AgentType.BACKEND:
      return [
        ...commonTools,
        new DynamicTool({
          name: "generate_api_endpoint",
          description: "Generate API endpoint code",
          schema: z.object({
            endpoint_path: z.string().describe("The API endpoint path"),
            functionality: z.string().describe("What the endpoint should do"),
          }),
          func: async ({ endpoint_path, functionality }) => {
            console.log(`Generating API endpoint for ${endpoint_path}`);
            return `Generated API endpoint code for ${endpoint_path} to handle ${functionality}`;
          },
        }),
      ];
    case AgentType.DATABASE:
      return [
        ...commonTools,
        new DynamicTool({
          name: "generate_database_schema",
          description: "Generate database schema for an entity",
          schema: z.object({
            entity_name: z.string().describe("Name of the entity"),
            fields: z.string().describe("Description of fields needed"),
          }),
          func: async ({ entity_name, fields }) => {
            console.log(`Generating database schema for ${entity_name}`);
            return `Generated schema for ${entity_name} with fields: ${fields}`;
          },
        }),
      ];
    // Add more tools for other agent types...
    default:
      return commonTools;
  }
};

/**
 * System prompts for each agent type
 */
const getAgentSystemPrompt = (agentType: AgentType): string => {
  const basePrompt = `You are a specialized AI agent for e-commerce platform development. 
You have deep expertise in your domain and collaborate with other specialized agents.
Always provide well-reasoned, professional responses.`;

  switch (agentType) {
    case AgentType.MANAGER:
      return `${basePrompt}
You are the Manager Agent responsible for coordinating other specialized agents.
Your tasks include:
- Analyzing requirements and breaking them down into tasks
- Assigning tasks to appropriate specialized agents
- Ensuring coherent integration of work from different agents
- Providing high-level architectural guidance
- Making final decisions when conflicts arise`;

    case AgentType.FRONTEND:
      return `${basePrompt}
You are the Frontend Agent specializing in UI/UX development.
Your expertise includes:
- React with TypeScript
- Tailwind CSS for styling
- Responsive design principles
- Accessibility best practices
- Frontend state management
- Modern UI component architecture`;

    case AgentType.BACKEND:
      return `${basePrompt}
You are the Backend Agent specializing in server-side development.
Your expertise includes:
- RESTful API design
- Authentication and authorization
- Business logic implementation
- Performance optimization
- Error handling and logging
- Security best practices`;

    case AgentType.DATABASE:
      return `${basePrompt}
You are the Database Agent specializing in data modeling and storage.
Your expertise includes:
- Database schema design
- Query optimization
- Data relationships
- Migration strategies
- Data validation
- Both SQL and NoSQL databases`;

    case AgentType.DEVOPS:
      return `${basePrompt}
You are the DevOps Agent specializing in deployment and infrastructure.
Your expertise includes:
- CI/CD pipelines
- Cloud infrastructure
- Docker containerization
- Kubernetes orchestration
- Monitoring and logging
- Security hardening`;

    case AgentType.UX:
      return `${basePrompt}
You are the UX Agent specializing in user experience design.
Your expertise includes:
- User flow design
- Usability best practices
- Information architecture
- Interaction design
- Accessibility compliance
- User research interpretation`;

    case AgentType.ECOMMERCE:
      return `${basePrompt}
You are the E-commerce Agent specializing in e-commerce functionality.
Your expertise includes:
- Product catalog design
- Shopping cart implementation
- Checkout processes
- Payment gateway integration
- Order management systems
- Inventory tracking`;

    default:
      return basePrompt;
  }
};

/**
 * Creates a specialized agent for a specific domain
 */
export const createSpecializedAgent = async (agentType: AgentType) => {
  const systemPrompt = getAgentSystemPrompt(agentType);
  const memory = await createAgentMemory(agentType);
  const tools = getAgentTools(agentType);
  
  const model = createStructuredChatAgent({
    llm: createChatModel(),
    tools,
    systemMessage: systemPrompt,
  });
  
  return AgentExecutor.fromAgentAndTools({
    agent: model,
    tools,
    verbose: true,
  });
};

/**
 * Define agent selection logic
 */
const routeToAgent = (state: AgentGraphState) => {
  const lastMessage = state.messages[state.messages.length - 1];
  const content = lastMessage.content.toLowerCase();
  
  // Simple routing logic - in a real implementation this would be more sophisticated
  if (content.includes("design") || content.includes("ui") || content.includes("interface")) {
    return AgentType.FRONTEND;
  } else if (content.includes("api") || content.includes("server") || content.includes("endpoint")) {
    return AgentType.BACKEND;
  } else if (content.includes("database") || content.includes("schema") || content.includes("data model")) {
    return AgentType.DATABASE;
  } else if (content.includes("deploy") || content.includes("infrastructure") || content.includes("pipeline")) {
    return AgentType.DEVOPS;
  } else if (content.includes("user experience") || content.includes("usability") || content.includes("user flow")) {
    return AgentType.UX;
  } else if (content.includes("product") || content.includes("cart") || content.includes("checkout")) {
    return AgentType.ECOMMERCE;
  } else {
    // Default to manager agent for coordination
    return AgentType.MANAGER;
  }
};

/**
 * Creates the orchestration graph for multi-agent workflows
 */
export const createAgentOrchestratorGraph = async () => {
  // Initialize specialized agents
  const agents = {
    [AgentType.MANAGER]: await createSpecializedAgent(AgentType.MANAGER),
    [AgentType.FRONTEND]: await createSpecializedAgent(AgentType.FRONTEND),
    [AgentType.BACKEND]: await createSpecializedAgent(AgentType.BACKEND),
    [AgentType.DATABASE]: await createSpecializedAgent(AgentType.DATABASE),
    [AgentType.DEVOPS]: await createSpecializedAgent(AgentType.DEVOPS),
    [AgentType.UX]: await createSpecializedAgent(AgentType.UX),
    [AgentType.ECOMMERCE]: await createSpecializedAgent(AgentType.ECOMMERCE),
  };

  // Create the workflow graph
  const workflow = new StateGraph<AgentGraphState>({
    channels: {
      messages: {
        value: [] as any[],
        default: () => [],
      },
      agentOutputs: {
        value: {} as Record<string, any>,
        default: () => ({}),
      },
      currentAgent: {
        value: null as AgentType | null,
        default: () => null,
      },
      error: {
        value: undefined as string | undefined,
        default: () => undefined,
      },
      finalResponse: {
        value: undefined as string | undefined,
        default: () => undefined,
      },
    },
  });

  // Add nodes for each agent
  for (const agentType of Object.values(AgentType)) {
    workflow.addNode(agentType, new RunnableLambda({
      name: `${agentType}_agent`,
      func: async (state: AgentGraphState) => {
        try {
          const agent = agents[agentType as AgentType];
          const result = await agent.invoke({
            input: state.messages[state.messages.length - 1].content,
          });
          
          return {
            messages: [...state.messages, { role: "assistant", content: result.output }],
            agentOutputs: {
              ...state.agentOutputs,
              [agentType]: result,
            },
            currentAgent: agentType,
          };
        } catch (error) {
          console.error(`Error in ${agentType} agent:`, error);
          return {
            ...state,
            error: `Error in ${agentType} agent: ${error instanceof Error ? error.message : String(error)}`,
          };
        }
      },
    }));
  }

  // Add router node to determine which agent should handle the request
  workflow.addNode("router", new RunnableLambda({
    name: "agent_router",
    func: (state: AgentGraphState) => {
      const selectedAgent = routeToAgent(state);
      return { ...state, currentAgent: selectedAgent };
    },
  }));

  // Add final response node to format the response
  workflow.addNode("finalizer", new RunnableLambda({
    name: "response_finalizer",
    func: (state: AgentGraphState) => {
      // If we have an error, include it in the response
      if (state.error) {
        return {
          ...state,
          finalResponse: `I encountered an issue while processing your request: ${state.error}`
        };
      }

      // Get the latest message from the current agent
      const latestMessage = state.messages[state.messages.length - 1];
      
      // Format and return the final response
      return {
        ...state,
        finalResponse: latestMessage.content,
      };
    },
  }));

  // Define the edges in the graph
  workflow.setEntryPoint("router");
  
  // Route from router to appropriate agent
  for (const agentType of Object.values(AgentType)) {
    workflow.addConditionalEdge(
      "router",
      (state) => state.currentAgent === agentType,
      agentType as string
    );
  }
  
  // Connect all agents to the finalizer
  for (const agentType of Object.values(AgentType)) {
    workflow.addEdge(agentType as string, "finalizer");
  }
  
  // Connect finalizer to the end
  workflow.addEdge("finalizer", END);

  // Compile the graph
  const app = workflow.compile();
  
  return app;
};

/**
 * Process a user message through the agent orchestration graph
 */
export const processMessageWithAgentGraph = async (
  message: string, 
  previousMessages: any[] = []
) => {
  try {
    // Create or get the orchestrator graph
    const graph = await createAgentOrchestratorGraph();
    
    // Prepare the input state
    const inputState: AgentGraphState = {
      messages: [...previousMessages, { role: "user", content: message }],
      agentOutputs: {},
      currentAgent: null,
      finalResponse: undefined,
    };
    
    // Run the graph with the input state
    const result = await graph.invoke(inputState);
    
    // Return the final response
    return result.finalResponse || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Error processing message through agent graph:", error);
    return `I encountered an error while processing your message. ${error instanceof Error ? error.message : String(error)}`;
  }
};