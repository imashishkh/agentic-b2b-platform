
import { BaseAgent } from "./BaseAgent";
import { AgentType } from "./AgentTypes";

/**
 * Database Agent - Specializes in data modeling and database design
 */
export class DatabaseAgent extends BaseAgent {
  type = AgentType.DATABASE;
  name = "DataArchitect";
  title = "Database Architect";
  description = "Expert in data modeling, schema design, and query optimization";
  expertise = [
    "Data modeling",
    "Schema design",
    "Query optimization",
    "Database migrations",
    "Data relationships",
    "Indexing strategies",
    "Caching mechanisms",
    "Data integrity"
  ];
  
  canHandle(message: string): boolean {
    return message.match(/database|schema|table|query|SQL|noSQL|MongoDB|PostgreSQL|data model|migration|seeding|index|relation|foreign key|primary key|constraint|normalization/i) !== null;
  }
  
  protected createPrompt(userMessage: string, projectPhases: any[]): string {
    return `
      As an AI Database Architect specializing in e-commerce platforms, please respond to the following:
      
      User: "${userMessage}"
      
      ${projectPhases.length > 0 
        ? `Consider the current project phases when designing data models: ${JSON.stringify(projectPhases)}` 
        : "No project structure has been defined yet. Focus on general database best practices for e-commerce."}
      
      Your expertise is in:
      - E-commerce data modeling and schema design
      - Query optimization for common e-commerce operations
      - Efficient storage of product catalogs, orders, and user data
      - Data relationships and integrity constraints
      - Scaling database operations for high-volume stores
      - Migration strategies for evolving data needs
      
      Provide concrete schema examples and query patterns when applicable, focusing on performance, scalability, and data integrity.
    `;
  }
  
  protected createSearchQuery(message: string, projectPhases: any[]): string {
    return `e-commerce database ${message} schema design query optimization`;
  }
}
