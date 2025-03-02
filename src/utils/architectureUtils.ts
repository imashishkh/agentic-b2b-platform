
import { ArchitectureProposal } from '@/contexts/types';
import { ARCHITECTURE_PATTERNS, TECH_STACK_RECOMMENDATIONS } from '@/components/architecture/ArchitectureVisualizer';

/**
 * Recommends architectural patterns based on project requirements
 */
export const recommendArchitecturalPatterns = (
  requirements: string,
  existingArchitecture?: ArchitectureProposal
): { pattern: string; description: string; suitability: number }[] => {
  // Extract key terms from requirements to match against patterns
  const requirementsLower = requirements.toLowerCase();
  
  // Calculate suitability scores for each pattern
  return ARCHITECTURE_PATTERNS.map(pattern => {
    let suitability = 0;
    
    // Basic pattern matching based on keywords
    if (requirementsLower.includes(pattern.name.toLowerCase())) {
      suitability += 3;
    }
    
    if (requirementsLower.includes(pattern.suitableFor.toLowerCase())) {
      suitability += 2;
    }
    
    // Check for specific architectural considerations
    if (pattern.name === "Microservices" && 
        (requirementsLower.includes("scale") || 
         requirementsLower.includes("distributed") ||
         requirementsLower.includes("independent"))) {
      suitability += 2;
    }
    
    if (pattern.name === "Monolithic" && 
        (requirementsLower.includes("simple") || 
         requirementsLower.includes("mvp") ||
         requirementsLower.includes("quick"))) {
      suitability += 2;
    }
    
    if (pattern.name === "Serverless" && 
        (requirementsLower.includes("event") || 
         requirementsLower.includes("function") ||
         requirementsLower.includes("cloud"))) {
      suitability += 2;
    }
    
    if (pattern.name === "Event-Driven" && 
        (requirementsLower.includes("real-time") || 
         requirementsLower.includes("notification") ||
         requirementsLower.includes("message"))) {
      suitability += 2;
    }
    
    if (pattern.name === "Layered Architecture" && 
        (requirementsLower.includes("enterprise") || 
         requirementsLower.includes("corporate") ||
         requirementsLower.includes("large"))) {
      suitability += 2;
    }
    
    if (pattern.name === "JAMstack" && 
        (requirementsLower.includes("content") || 
         requirementsLower.includes("static") ||
         requirementsLower.includes("blog"))) {
      suitability += 2;
    }
    
    // Return the pattern with its calculated suitability
    return {
      pattern: pattern.name,
      description: pattern.description,
      suitability
    };
  }).sort((a, b) => b.suitability - a.suitability);
};

/**
 * Recommends technology stack based on application type and requirements
 */
export const recommendTechnologyStack = (
  appType: string,
  requirements: string
): { 
  frontend: string[];
  backend: string[];
  database: string[];
  devops: string[];
} => {
  // Default empty recommendations
  const recommendations = {
    frontend: [],
    backend: [],
    database: [],
    devops: []
  };
  
  // Match app type to predefined recommendations
  const appTypeLower = appType.toLowerCase();
  
  // Determine the application type from predefined categories
  let matchedType = "e-commerce"; // Default
  
  if (appTypeLower.includes("e-commerce") || 
      appTypeLower.includes("ecommerce") || 
      appTypeLower.includes("shop") || 
      appTypeLower.includes("store")) {
    matchedType = "e-commerce";
  } 
  else if (appTypeLower.includes("content") || 
          appTypeLower.includes("cms") || 
          appTypeLower.includes("blog")) {
    matchedType = "content-management";
  }
  else if (appTypeLower.includes("business") || 
          appTypeLower.includes("saas") || 
          appTypeLower.includes("enterprise")) {
    matchedType = "business-saas";
  }
  else if (appTypeLower.includes("social") || 
          appTypeLower.includes("community") || 
          appTypeLower.includes("network")) {
    matchedType = "social-platform";
  }
  
  // Use matched type to get recommendations
  const typeRecommendations = TECH_STACK_RECOMMENDATIONS[matchedType as keyof typeof TECH_STACK_RECOMMENDATIONS];
  
  if (typeRecommendations) {
    return typeRecommendations;
  }
  
  return recommendations;
};

/**
 * Creates a new architectural proposal
 */
export const createArchitectureProposal = (
  title: string,
  description: string,
  appType: string = "e-commerce",
  requirements: string = ""
): ArchitectureProposal => {
  // Generate a unique ID
  const id = `arch-${Date.now()}`;
  
  // Get pattern recommendations
  const patternRecommendations = recommendArchitecturalPatterns(requirements);
  const recommendedPattern = patternRecommendations[0]; // Top recommendation
  
  // Get tech stack recommendations
  const techRecommendations = recommendTechnologyStack(appType, requirements);
  
  // Create basic components based on pattern
  const components = generateBasicComponents(recommendedPattern.pattern, appType);
  
  // Create relationships between components
  const relationships = generateComponentRelationships(components);
  
  return {
    id,
    name: title,
    title,
    type: "architecture",
    description,
    technologies: [
      ...techRecommendations.frontend.slice(0, 2),
      ...techRecommendations.backend.slice(0, 2),
      ...techRecommendations.database.slice(0, 1)
    ],
    approved: false,
    components,
    relationships,
    dateCreated: new Date().toISOString(),
    status: "proposed",
    pattern: recommendedPattern.pattern,
    patternDescription: recommendedPattern.description,
    appType,
    techRecommendations
  };
};

/**
 * Generates basic architectural components based on pattern and app type
 */
const generateBasicComponents = (pattern: string, appType: string): any[] => {
  // Default component set
  const baseComponents = [
    {
      id: "frontend",
      name: "Frontend Application",
      type: "UI",
      description: "User interface and client-side application",
      technologies: []
    },
    {
      id: "backend",
      name: "Backend Server",
      type: "API",
      description: "Server-side application and API endpoints",
      technologies: []
    },
    {
      id: "database",
      name: "Database",
      type: "Database",
      description: "Primary data storage",
      technologies: []
    }
  ];
  
  // Get tech recommendations to populate technologies
  const techRecommendations = recommendTechnologyStack(appType, "");
  
  // Add technologies to components
  baseComponents[0].technologies = techRecommendations.frontend.slice(0, 3);
  baseComponents[1].technologies = techRecommendations.backend.slice(0, 3);
  baseComponents[2].technologies = techRecommendations.database.slice(0, 2);
  
  // Additional components based on pattern
  if (pattern === "Microservices") {
    // Add microservice-specific components
    return [
      ...baseComponents,
      {
        id: "auth-service",
        name: "Authentication Service",
        type: "Service",
        description: "Handles user authentication and authorization",
        technologies: techRecommendations.backend.slice(0, 2)
      },
      {
        id: "product-service",
        name: "Product Service",
        type: "Service",
        description: "Manages product catalog and inventory",
        technologies: techRecommendations.backend.slice(0, 2)
      },
      {
        id: "order-service",
        name: "Order Service",
        type: "Service",
        description: "Processes customer orders",
        technologies: techRecommendations.backend.slice(0, 2)
      },
      {
        id: "api-gateway",
        name: "API Gateway",
        type: "Gateway",
        description: "Routes requests to appropriate microservices",
        technologies: ["API Gateway", "Nginx"]
      }
    ];
  } 
  else if (pattern === "Serverless") {
    // Add serverless-specific components
    return [
      baseComponents[0],
      {
        id: "auth-function",
        name: "Auth Function",
        type: "Function",
        description: "Authentication serverless function",
        technologies: ["AWS Lambda", "Azure Functions"]
      },
      {
        id: "api-function",
        name: "API Function",
        type: "Function",
        description: "Core API serverless function",
        technologies: ["AWS Lambda", "Azure Functions"]
      },
      baseComponents[2],
      {
        id: "storage",
        name: "Object Storage",
        type: "Storage",
        description: "Cloud storage for static assets",
        technologies: ["S3", "Blob Storage"]
      }
    ];
  }
  else if (pattern === "Event-Driven") {
    // Add event-driven specific components
    return [
      ...baseComponents,
      {
        id: "event-bus",
        name: "Event Bus",
        type: "Messaging",
        description: "Handles event routing between services",
        technologies: ["Kafka", "RabbitMQ"]
      },
      {
        id: "notification-service",
        name: "Notification Service",
        type: "Service",
        description: "Sends notifications to users",
        technologies: techRecommendations.backend.slice(0, 1)
      }
    ];
  }
  
  // Default to base components for other patterns
  return baseComponents;
};

/**
 * Generates relationships between components
 */
const generateComponentRelationships = (components: any[]): any[] => {
  const relationships: any[] = [];
  
  // Map component IDs
  const componentMap = components.reduce((map, component) => {
    map[component.id] = component;
    return map;
  }, {} as Record<string, any>);
  
  // Create basic relationships based on common patterns
  if (componentMap["frontend"] && componentMap["backend"]) {
    relationships.push({
      source: "frontend",
      target: "backend",
      type: "consumes"
    });
  }
  
  if (componentMap["backend"] && componentMap["database"]) {
    relationships.push({
      source: "backend",
      target: "database",
      type: "persists data in"
    });
  }
  
  // Add microservices relationships
  if (componentMap["api-gateway"]) {
    relationships.push({
      source: "frontend",
      target: "api-gateway",
      type: "requests via"
    });
    
    ["auth-service", "product-service", "order-service"].forEach(serviceId => {
      if (componentMap[serviceId]) {
        relationships.push({
          source: "api-gateway",
          target: serviceId,
          type: "routes to"
        });
        
        relationships.push({
          source: serviceId,
          target: "database",
          type: "reads/writes"
        });
      }
    });
  }
  
  // Add serverless relationships
  if (componentMap["auth-function"] && componentMap["api-function"]) {
    relationships.push({
      source: "frontend",
      target: "auth-function",
      type: "authenticates via"
    });
    
    relationships.push({
      source: "frontend",
      target: "api-function",
      type: "requests data from"
    });
    
    relationships.push({
      source: "api-function",
      target: "database",
      type: "queries"
    });
    
    if (componentMap["storage"]) {
      relationships.push({
        source: "frontend",
        target: "storage",
        type: "loads assets from"
      });
    }
  }
  
  // Add event-driven relationships
  if (componentMap["event-bus"]) {
    relationships.push({
      source: "backend",
      target: "event-bus",
      type: "publishes events to"
    });
    
    if (componentMap["notification-service"]) {
      relationships.push({
        source: "event-bus",
        target: "notification-service",
        type: "triggers"
      });
    }
  }
  
  return relationships;
};

/**
 * Generates a diagram in text format (ASCII art-like) for a given proposal
 * Note: This is a placeholder for actual diagram generation in future
 */
export const generateTextDiagram = (proposal: ArchitectureProposal): string => {
  const components = proposal.components || [];
  const relationships = proposal.relationships || [];
  
  if (!components.length) {
    return "No components to diagram";
  }
  
  let diagram = "ARCHITECTURE DIAGRAM\n";
  diagram += "===================\n\n";
  
  // Add components
  components.forEach(comp => {
    diagram += `[${comp.name} (${comp.type})]\n`;
  });
  
  diagram += "\nRelationships:\n";
  
  // Add relationships
  relationships.forEach(rel => {
    const source = components.find(c => c.id === rel.source);
    const target = components.find(c => c.id === rel.target);
    
    if (source && target) {
      diagram += `${source.name} --${rel.type}--> ${target.name}\n`;
    }
  });
  
  return diagram;
};
