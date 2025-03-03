/**
 * EcommerceSwarm - Specializes the SwarmCoordinator for e-commerce use cases
 */
import { v4 as uuidv4 } from 'uuid';
import { SwarmCoordinator } from './SwarmCoordinator';
import { SwarmConfig, SwarmState, AgentNode, AgentEdge } from './types';
import { AgentType } from '../AgentTypes';

/**
 * A swarm configuration optimized for B2B e-commerce development
 */
export class EcommerceSwarm {
  private swarmCoordinator: SwarmCoordinator;

  /**
   * Create a new EcommerceSwarm with the standard B2B e-commerce configuration
   */
  constructor() {
    // Create the B2B e-commerce swarm configuration
    const config = this.createB2BEcommerceConfig();
    
    // Initialize the swarm coordinator with this configuration
    this.swarmCoordinator = new SwarmCoordinator(config);
  }

  /**
   * Create a standard configuration for B2B e-commerce development
   * @returns A SwarmConfig optimized for B2B e-commerce
   */
  private createB2BEcommerceConfig(): SwarmConfig {
    // Define the agent nodes
    const nodes: AgentNode[] = [
      {
        id: 'manager',
        type: AgentType.MANAGER,
        name: 'Project Manager',
        description: 'Coordinates all agents and assigns tasks',
        capabilities: [
          'task coordination',
          'resource allocation',
          'requirement analysis',
          'progress tracking'
        ]
      },
      {
        id: 'ecommerce',
        type: AgentType.ECOMMERCE,
        name: 'E-commerce Expert',
        description: 'Specialized in e-commerce development patterns and best practices',
        capabilities: [
          'product management',
          'catalog design',
          'order processing',
          'payment integration',
          'b2b workflows',
          'bulk ordering',
          'quote management',
          'contract pricing',
          'RFQ processing'
        ]
      },
      {
        id: 'frontend',
        type: AgentType.FRONTEND,
        name: 'Frontend Developer',
        description: 'Creates user interfaces and frontend components',
        capabilities: [
          'UI development',
          'component design',
          'responsive layouts',
          'React development',
          'state management'
        ]
      },
      {
        id: 'backend',
        type: AgentType.BACKEND,
        name: 'Backend Developer',
        description: 'Develops API endpoints and business logic',
        capabilities: [
          'API design',
          'middleware development',
          'authentication systems',
          'integration services',
          'data processing'
        ]
      },
      {
        id: 'database',
        type: AgentType.DATABASE,
        name: 'Database Designer',
        description: 'Designs and optimizes database schemas',
        capabilities: [
          'schema design',
          'data modeling',
          'query optimization',
          'database scaling',
          'data integrity'
        ]
      },
      {
        id: 'ux',
        type: AgentType.UX,
        name: 'UX Designer',
        description: 'Focuses on user experience and interface design',
        capabilities: [
          'user research',
          'wireframing',
          'prototyping',
          'usability testing',
          'interaction design'
        ]
      },
      {
        id: 'devops',
        type: AgentType.DEVOPS,
        name: 'DevOps Engineer',
        description: 'Handles deployment and infrastructure',
        capabilities: [
          'CI/CD pipelines',
          'cloud infrastructure',
          'performance monitoring',
          'scaling strategies',
          'security implementation'
        ]
      }
    ];

    // Define the connections between agents
    const edges: AgentEdge[] = [
      // Manager delegates to all specialists
      { source: 'manager', target: 'ecommerce', relationship: 'delegates' },
      { source: 'manager', target: 'frontend', relationship: 'delegates' },
      { source: 'manager', target: 'backend', relationship: 'delegates' },
      { source: 'manager', target: 'database', relationship: 'delegates' },
      { source: 'manager', target: 'ux', relationship: 'delegates' },
      { source: 'manager', target: 'devops', relationship: 'delegates' },
      
      // All specialists report back to manager
      { source: 'ecommerce', target: 'manager', relationship: 'reports' },
      { source: 'frontend', target: 'manager', relationship: 'reports' },
      { source: 'backend', target: 'manager', relationship: 'reports' },
      { source: 'database', target: 'manager', relationship: 'reports' },
      { source: 'ux', target: 'manager', relationship: 'reports' },
      { source: 'devops', target: 'manager', relationship: 'reports' },
      
      // E-commerce agent collaborates with all technical specialists
      { source: 'ecommerce', target: 'frontend', relationship: 'collaborates' },
      { source: 'ecommerce', target: 'backend', relationship: 'collaborates' },
      { source: 'ecommerce', target: 'database', relationship: 'collaborates' },
      { source: 'ecommerce', target: 'ux', relationship: 'collaborates' },
      
      // Frontend collaborations
      { source: 'frontend', target: 'ux', relationship: 'collaborates' },
      { source: 'frontend', target: 'backend', relationship: 'collaborates' },
      
      // Backend collaborations
      { source: 'backend', target: 'database', relationship: 'collaborates' },
      { source: 'backend', target: 'devops', relationship: 'collaborates' },
      
      // UX collaborates with frontend
      { source: 'ux', target: 'frontend', relationship: 'collaborates' },
      
      // DevOps collaborates with backend and database
      { source: 'devops', target: 'backend', relationship: 'collaborates' },
      { source: 'devops', target: 'database', relationship: 'collaborates' }
    ];

    // Create the initial state
    const initialState: Partial<SwarmState> = {
      memory: {
        // B2B e-commerce specific domain knowledge
        b2bEcommerceRequirements: [
          'Multiple user roles (buyer, approver, admin)',
          'Custom catalog and pricing per customer',
          'Bulk ordering capabilities',
          'Quote request system',
          'Contract-based pricing',
          'Order approval workflows',
          'Company account management',
          'Credit line management',
          'Invoice and purchase order generation'
        ],
        
        // Technical patterns relevant to B2B e-commerce
        technicalPatterns: {
          authentication: 'Role-based access control with company hierarchies',
          catalog: 'Dynamic catalogs with contract-specific pricing',
          checkout: 'Multi-step approval process for purchases',
          pricing: 'Contract-based pricing with volume discounts',
          integration: 'ERP and procurement system integrations'
        }
      }
    };

    // Return the complete configuration
    return {
      id: uuidv4(),
      name: 'B2B E-commerce Development Swarm',
      description: 'A collaborative agent swarm optimized for B2B e-commerce platform development',
      nodes,
      edges,
      initialState
    };
  }

  /**
   * Process a user request through the swarm
   * @param message The user's message or request
   * @returns The response from the agent swarm
   */
  public async processRequest(message: string) {
    return this.swarmCoordinator.run(message);
  }

  /**
   * Get the swarm coordinator instance
   */
  public getCoordinator() {
    return this.swarmCoordinator;
  }
}