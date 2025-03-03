/**
 * SwarmFactory - Factory for creating different types of agent swarms
 */
import { EcommerceSwarm } from './EcommerceSwarm';
import { SwarmCoordinator } from './SwarmCoordinator';
import { SwarmConfig } from './types';

/**
 * Factory class for creating different types of agent swarms
 */
export class SwarmFactory {
  /**
   * Create a B2B e-commerce agent swarm
   * @returns A new EcommerceSwarm instance
   */
  public static createEcommerceSwarm(): EcommerceSwarm {
    return new EcommerceSwarm();
  }

  /**
   * Create a custom agent swarm with a specific configuration
   * @param config The swarm configuration
   * @returns A new SwarmCoordinator instance
   */
  public static createCustomSwarm(config: SwarmConfig): SwarmCoordinator {
    return new SwarmCoordinator(config);
  }
}