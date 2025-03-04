/**
 * Agent Tools Module
 * 
 * This module provides standardized tool definitions for agents using LangChain's
 * tool system. It enables agents to:
 * - Interact with external services
 * - Generate and analyze code
 * - Search for information
 * - Manage project resources
 */

import { DynamicTool, DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { AgentType } from "@/agents/AgentTypes";
import { 
  searchInternet, 
  searchCodeExamples, 
  searchPackages, 
  generateCode,
  testCode,
  checkSecurity,
  generateEcommerceComponent,
  generateDatabaseSchema,
  troubleshootCode
} from "./aiServices";
import { 
  searchAgentMemory, 
  saveToAgentMemory, 
  extractAndSaveEntities 
} from "./vectorMemory";

/**
 * Get common tools available to all agents
 */
export const getCommonTools = () => {
  return [
    // Search the internet
    new DynamicStructuredTool({
      name: "search_internet",
      description: "Search the internet for up-to-date information",
      schema: z.object({
        query: z.string().describe("The search query"),
      }),
      func: async ({ query }) => {
        try {
          return await searchInternet(query);
        } catch (error) {
          return `Error searching the internet: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
    
    // Search code examples
    new DynamicStructuredTool({
      name: "search_code_examples",
      description: "Search for code examples and patterns",
      schema: z.object({
        query: z.string().describe("The code concept to search for"),
      }),
      func: async ({ query }) => {
        try {
          return await searchCodeExamples(query);
        } catch (error) {
          return `Error searching code examples: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
    
    // Search for package information
    new DynamicStructuredTool({
      name: "search_package_info",
      description: "Get information about npm packages",
      schema: z.object({
        package_name: z.string().describe("The name of the package to search for"),
      }),
      func: async ({ package_name }) => {
        try {
          return await searchPackages(package_name);
        } catch (error) {
          return `Error searching package information: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
    
    // Search memory
    new DynamicStructuredTool({
      name: "search_memory",
      description: "Search the agent's memory for relevant information",
      schema: z.object({
        agent_type: z.string().describe("The type of agent whose memory to search"),
        query: z.string().describe("The search query"),
      }),
      func: async ({ agent_type, query }) => {
        try {
          const results = await searchAgentMemory(agent_type as AgentType, query);
          
          if (results.length === 0) {
            return "No relevant information found in memory.";
          }
          
          return results
            .map(doc => `${doc.pageContent}\n(Source: ${doc.metadata.type}, ${new Date(doc.metadata.timestamp).toLocaleString()})`)
            .join("\n\n");
        } catch (error) {
          return `Error searching memory: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
    
    // Get project information
    new DynamicTool({
      name: "get_project_info",
      description: "Get information about the e-commerce project",
      func: async () => {
        return `
This is a B2B E-commerce platform focused on connecting Indian manufacturers and distributors with global buyers. 

Key features include:
- International trade and compliance features
- Multi-currency support
- AI-powered features including product recommendations and fraud detection
- Secure payment processing with escrow capabilities
- Comprehensive trust and verification systems
- Mobile-first responsive design
- Sustainable commerce features

The platform is built using:
- React with TypeScript for frontend
- Node.js for backend
- PostgreSQL for database
- Modern component architecture with Tailwind CSS
        `;
      },
    }),
  ];
};

/**
 * Get tools specific to the Frontend agent
 */
export const getFrontendTools = () => {
  return [
    ...getCommonTools(),
    
    // Generate UI component
    new DynamicStructuredTool({
      name: "generate_ui_component",
      description: "Generate a UI component for e-commerce",
      schema: z.object({
        component_type: z.string().describe("The type of component to generate"),
        requirements: z.string().describe("Detailed requirements for the component"),
        framework: z.string().optional().describe("The framework to use (default: React with Tailwind)"),
      }),
      func: async ({ component_type, requirements, framework }) => {
        try {
          return await generateEcommerceComponent(component_type, requirements, framework);
        } catch (error) {
          return `Error generating component: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
    
    // Check component accessibility
    new DynamicStructuredTool({
      name: "check_accessibility",
      description: "Check UI component for accessibility issues",
      schema: z.object({
        component_code: z.string().describe("The component code to check"),
      }),
      func: async ({ component_code }) => {
        try {
          // This would be a real accessibility checker in production
          const hasAriaLabels = component_code.includes("aria-label");
          const hasAltTags = component_code.includes("alt=");
          const hasRoleAttributes = component_code.includes("role=");
          
          const issues = [];
          
          if (!hasAriaLabels) {
            issues.push("Missing aria-label attributes for interactive elements");
          }
          
          if (!hasAltTags && component_code.includes("<img")) {
            issues.push("Missing alt attributes for images");
          }
          
          if (!hasRoleAttributes) {
            issues.push("Consider adding role attributes for non-standard interactive elements");
          }
          
          return issues.length > 0
            ? `Accessibility issues found:\n- ${issues.join("\n- ")}`
            : "No major accessibility issues found.";
        } catch (error) {
          return `Error checking accessibility: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
    
    // Test responsiveness
    new DynamicStructuredTool({
      name: "test_responsiveness",
      description: "Check if a component is responsive",
      schema: z.object({
        component_code: z.string().describe("The component code to check"),
      }),
      func: async ({ component_code }) => {
        try {
          // This would connect to a real testing service in production
          const hasTailwindResponsive = 
            component_code.includes("sm:") || 
            component_code.includes("md:") || 
            component_code.includes("lg:") || 
            component_code.includes("xl:");
          
          const hasMediaQueries = component_code.includes("@media");
          
          if (!hasTailwindResponsive && !hasMediaQueries) {
            return "Warning: Component may not be responsive. No responsive classes or media queries detected.";
          }
          
          return "Component appears to include responsive design elements.";
        } catch (error) {
          return `Error testing responsiveness: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
  ];
};

/**
 * Get tools specific to the Backend agent
 */
export const getBackendTools = () => {
  return [
    ...getCommonTools(),
    
    // Generate API endpoint
    new DynamicStructuredTool({
      name: "generate_api_endpoint",
      description: "Generate code for an API endpoint",
      schema: z.object({
        endpoint_path: z.string().describe("The API endpoint path"),
        functionality: z.string().describe("What the endpoint should do"),
        language: z.string().optional().describe("The language/framework to use (default: Node.js/Express)"),
      }),
      func: async ({ endpoint_path, functionality, language = "TypeScript with Express" }) => {
        try {
          const prompt = `
Create a complete API endpoint for ${endpoint_path} that implements the following functionality:
${functionality}

Requirements:
- Use ${language}
- Include proper error handling
- Add appropriate validation
- Follow RESTful best practices
- Include comments explaining the code
`;
          return await generateCode(prompt, language, "API endpoint");
        } catch (error) {
          return `Error generating API endpoint: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
    
    // Check API security
    new DynamicStructuredTool({
      name: "check_api_security",
      description: "Check API endpoint for security vulnerabilities",
      schema: z.object({
        endpoint_code: z.string().describe("The API endpoint code to check"),
      }),
      func: async ({ endpoint_code }) => {
        try {
          return await checkSecurity(endpoint_code);
        } catch (error) {
          return `Error checking API security: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
    
    // Generate authentication code
    new DynamicStructuredTool({
      name: "generate_auth_code",
      description: "Generate authentication/authorization code",
      schema: z.object({
        auth_type: z.string().describe("The type of authentication (e.g., JWT, OAuth)"),
        requirements: z.string().describe("Specific requirements for the auth system"),
      }),
      func: async ({ auth_type, requirements }) => {
        try {
          const prompt = `
Create authentication code for a secure e-commerce API using ${auth_type} with these requirements:
${requirements}

Include:
- Complete implementation
- Proper error handling
- Security best practices
- Usage examples
`;
          return await generateCode(prompt, "TypeScript", "authentication");
        } catch (error) {
          return `Error generating authentication code: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
  ];
};

/**
 * Get tools specific to the Database agent
 */
export const getDatabaseTools = () => {
  return [
    ...getCommonTools(),
    
    // Generate database schema
    new DynamicStructuredTool({
      name: "generate_database_schema",
      description: "Generate a database schema for an entity",
      schema: z.object({
        entity_name: z.string().describe("The name of the entity"),
        fields: z.string().describe("Description of fields needed"),
        database_type: z.string().optional().describe("The database type (default: PostgreSQL)"),
      }),
      func: async ({ entity_name, fields, database_type = "PostgreSQL" }) => {
        try {
          return await generateDatabaseSchema(entity_name, fields, database_type);
        } catch (error) {
          return `Error generating schema: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
    
    // Optimize database query
    new DynamicStructuredTool({
      name: "optimize_query",
      description: "Optimize a database query for performance",
      schema: z.object({
        query: z.string().describe("The database query to optimize"),
        database_type: z.string().optional().describe("The database type (default: PostgreSQL)"),
      }),
      func: async ({ query, database_type = "PostgreSQL" }) => {
        try {
          // This would connect to a real query optimizer in production
          const prompt = `
Optimize this ${database_type} query for maximum performance:

${query}

Provide:
- Optimized query
- Explanation of changes
- Indexing recommendations
`;
          return await generateCode(prompt, database_type, "database optimization");
        } catch (error) {
          return `Error optimizing query: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
    
    // Generate migration
    new DynamicStructuredTool({
      name: "generate_migration",
      description: "Generate a database migration script",
      schema: z.object({
        changes: z.string().describe("Description of the changes needed"),
        database_type: z.string().optional().describe("The database type (default: PostgreSQL)"),
      }),
      func: async ({ changes, database_type = "PostgreSQL" }) => {
        try {
          const prompt = `
Create a database migration script for ${database_type} that makes these changes:
${changes}

Include:
- Up migration (apply changes)
- Down migration (rollback changes)
- Safe migration practices
`;
          return await generateCode(prompt, database_type, "database migration");
        } catch (error) {
          return `Error generating migration: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
  ];
};

/**
 * Get tools specific to the DevOps agent
 */
export const getDevOpsTools = () => {
  return [
    ...getCommonTools(),
    
    // Generate Docker configuration
    new DynamicStructuredTool({
      name: "generate_docker_config",
      description: "Generate Docker configuration files",
      schema: z.object({
        service_type: z.string().describe("The type of service to containerize"),
        requirements: z.string().describe("Specific requirements for the Docker setup"),
      }),
      func: async ({ service_type, requirements }) => {
        try {
          const prompt = `
Create Docker configuration files for a ${service_type} service with these requirements:
${requirements}

Include:
- Dockerfile
- Docker Compose configuration if needed
- Best practices for security and optimization
- Comments explaining key decisions
`;
          return await generateCode(prompt, "Docker", "configuration");
        } catch (error) {
          return `Error generating Docker configuration: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
    
    // Generate CI/CD pipeline
    new DynamicStructuredTool({
      name: "generate_cicd_pipeline",
      description: "Generate CI/CD pipeline configuration",
      schema: z.object({
        platform: z.string().describe("The CI/CD platform (e.g., GitHub Actions, Jenkins)"),
        requirements: z.string().describe("Specific requirements for the pipeline"),
      }),
      func: async ({ platform, requirements }) => {
        try {
          const prompt = `
Create a complete CI/CD pipeline configuration for ${platform} with these requirements:
${requirements}

Include:
- Build steps
- Test automation
- Deployment stages
- Security scanning
- Performance optimization
`;
          return await generateCode(prompt, platform, "CI/CD configuration");
        } catch (error) {
          return `Error generating CI/CD pipeline: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
    
    // Generate monitoring setup
    new DynamicStructuredTool({
      name: "generate_monitoring_config",
      description: "Generate monitoring and logging configuration",
      schema: z.object({
        tools: z.string().describe("The monitoring tools to use"),
        requirements: z.string().describe("Specific requirements for monitoring"),
      }),
      func: async ({ tools, requirements }) => {
        try {
          const prompt = `
Create a monitoring and logging configuration for an e-commerce platform using ${tools} with these requirements:
${requirements}

Include:
- Infrastructure monitoring
- Application performance monitoring
- Error tracking
- Alerting rules
- Dashboard setup
`;
          return await generateCode(prompt, "YAML/JSON", "monitoring configuration");
        } catch (error) {
          return `Error generating monitoring configuration: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
  ];
};

/**
 * Get tools specific to the UX agent
 */
export const getUXTools = () => {
  return [
    ...getCommonTools(),
    
    // Generate user flow
    new DynamicStructuredTool({
      name: "generate_user_flow",
      description: "Generate a user flow diagram description",
      schema: z.object({
        feature: z.string().describe("The feature or task to create a flow for"),
        user_type: z.string().describe("The type of user for this flow"),
      }),
      func: async ({ feature, user_type }) => {
        try {
          const prompt = `
Create a detailed user flow for a ${user_type} using the ${feature} feature in our e-commerce platform.

Include:
- Start and end points
- Decision points
- Actions and screens
- Error states
- Success criteria
`;
          // This would generate actual diagrams in production
          return await generateCode(prompt, "User flow", "UX design");
        } catch (error) {
          return `Error generating user flow: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
    
    // Generate usability test plan
    new DynamicStructuredTool({
      name: "generate_usability_test",
      description: "Generate a usability test plan",
      schema: z.object({
        feature: z.string().describe("The feature to test"),
        objectives: z.string().describe("The objectives of the usability test"),
      }),
      func: async ({ feature, objectives }) => {
        try {
          const prompt = `
Create a comprehensive usability test plan for the ${feature} feature with these objectives:
${objectives}

Include:
- Test objectives
- Participant criteria
- Test scenarios
- Task instructions
- Metrics to collect
- Analysis approach
`;
          return await generateCode(prompt, "Test plan", "UX research");
        } catch (error) {
          return `Error generating usability test plan: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
    
    // Generate accessibility guidelines
    new DynamicStructuredTool({
      name: "generate_accessibility_guidelines",
      description: "Generate accessibility guidelines for a feature",
      schema: z.object({
        feature: z.string().describe("The feature to provide guidelines for"),
      }),
      func: async ({ feature }) => {
        try {
          const prompt = `
Create specific accessibility guidelines for implementing the ${feature} feature in our e-commerce platform.

Include:
- WCAG compliance requirements
- Keyboard navigation
- Screen reader support
- Color contrast considerations
- Focus management
- Semantic markup
`;
          return await generateCode(prompt, "Accessibility", "UX design");
        } catch (error) {
          return `Error generating accessibility guidelines: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
  ];
};

/**
 * Get tools specific to the E-commerce agent
 */
export const getEcommerceTools = () => {
  return [
    ...getCommonTools(),
    
    // Generate product catalog structure
    new DynamicStructuredTool({
      name: "generate_product_catalog",
      description: "Generate a product catalog structure",
      schema: z.object({
        product_types: z.string().describe("The types of products to include"),
        special_requirements: z.string().optional().describe("Any special requirements"),
      }),
      func: async ({ product_types, special_requirements }) => {
        try {
          const prompt = `
Create a comprehensive product catalog structure for these product types:
${product_types}
${special_requirements ? `\nSpecial requirements: ${special_requirements}` : ""}

Include:
- Database schema
- API endpoints
- Frontend components
- Catalog features (filtering, sorting, etc.)
- SEO considerations
`;
          return await generateCode(prompt, "Product catalog", "e-commerce");
        } catch (error) {
          return `Error generating product catalog: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
    
    // Generate checkout process
    new DynamicStructuredTool({
      name: "generate_checkout_process",
      description: "Generate a checkout process implementation",
      schema: z.object({
        payment_methods: z.string().describe("Payment methods to support"),
        requirements: z.string().describe("Specific requirements for the checkout"),
      }),
      func: async ({ payment_methods, requirements }) => {
        try {
          const prompt = `
Create a complete checkout process implementation with these payment methods:
${payment_methods}

Additional requirements:
${requirements}

Include:
- User flow
- API endpoints
- Frontend components
- Payment processing logic
- Error handling and recovery
- Security considerations
`;
          return await generateCode(prompt, "Checkout process", "e-commerce");
        } catch (error) {
          return `Error generating checkout process: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
    
    // Generate order management system
    new DynamicStructuredTool({
      name: "generate_order_management",
      description: "Generate an order management system",
      schema: z.object({
        requirements: z.string().describe("Specific requirements for order management"),
      }),
      func: async ({ requirements }) => {
        try {
          const prompt = `
Create a complete order management system with these requirements:
${requirements}

Include:
- Database schema
- API endpoints
- Frontend components for order management
- Order status workflow
- Notification system
- Integration points with other systems
`;
          return await generateCode(prompt, "Order management", "e-commerce");
        } catch (error) {
          return `Error generating order management system: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
  ];
};

/**
 * Get tools specific to the Manager agent
 */
export const getManagerTools = () => {
  return [
    ...getCommonTools(),
    
    // Generate project plan
    new DynamicStructuredTool({
      name: "generate_project_plan",
      description: "Generate a project plan",
      schema: z.object({
        feature: z.string().describe("The feature to plan"),
        timeline: z.string().describe("The timeline constraints"),
      }),
      func: async ({ feature, timeline }) => {
        try {
          const prompt = `
Create a comprehensive project plan for implementing ${feature} within this timeline:
${timeline}

Include:
- Phase breakdown
- Task dependencies
- Resource allocation
- Risk assessment
- Success criteria
- Testing strategy
`;
          return await generateCode(prompt, "Project plan", "project management");
        } catch (error) {
          return `Error generating project plan: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
    
    // Analyze requirements
    new DynamicStructuredTool({
      name: "analyze_requirements",
      description: "Analyze and break down requirements",
      schema: z.object({
        requirements: z.string().describe("The requirements to analyze"),
      }),
      func: async ({ requirements }) => {
        try {
          const prompt = `
Analyze these requirements and break them down into well-defined tasks:
${requirements}

Provide:
- Task breakdown with complexity estimates
- Dependencies between tasks
- Suggested agent assignments
- Technical considerations
- Potential challenges
`;
          return await generateCode(prompt, "Requirements analysis", "project management");
        } catch (error) {
          return `Error analyzing requirements: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
    
    // Generate architecture diagram
    new DynamicStructuredTool({
      name: "generate_architecture",
      description: "Generate an architecture diagram description",
      schema: z.object({
        components: z.string().describe("The major components to include"),
        requirements: z.string().describe("The system requirements"),
      }),
      func: async ({ components, requirements }) => {
        try {
          const prompt = `
Create a comprehensive architecture diagram for a system with these components:
${components}

System requirements:
${requirements}

Include:
- Component relationships
- Data flow
- Interface definitions
- Technology choices
- Scalability considerations
`;
          // This would generate actual diagrams in production
          return await generateCode(prompt, "Architecture", "system design");
        } catch (error) {
          return `Error generating architecture: ${error instanceof Error ? error.message : String(error)}`;
        }
      },
    }),
  ];
};

/**
 * Get appropriate tools for a specific agent type
 */
export const getToolsForAgent = (agentType: AgentType) => {
  switch (agentType) {
    case AgentType.FRONTEND:
      return getFrontendTools();
    case AgentType.BACKEND:
      return getBackendTools();
    case AgentType.DATABASE:
      return getDatabaseTools();
    case AgentType.DEVOPS:
      return getDevOpsTools();
    case AgentType.UX:
      return getUXTools();
    case AgentType.ECOMMERCE:
      return getEcommerceTools();
    case AgentType.MANAGER:
      return getManagerTools();
    default:
      return getCommonTools();
  }
};