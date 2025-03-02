import { BaseAgent } from './BaseAgent';
import { AgentType, CodeGenerationCapabilities, CodeEvaluation, CodeIssue } from './AgentTypes';
import { generateCode, generateEcommerceComponent, generateDatabaseSchema, checkSecurity } from '@/utils/aiServices';

/**
 * E-commerce specific agent that handles code generation for e-commerce projects
 */
export class EcommerceAgent extends BaseAgent implements CodeGenerationCapabilities {
  name: string;
  title: string;
  description: string;
  expertise: string[];
  
  constructor() {
    super(AgentType.ECOMMERCE);
    this.name = "E-commerce Expert";
    this.title = "E-commerce Development Specialist";
    this.description = "Specializes in e-commerce architecture, component design, and best practices";
    this.expertise = [
      "E-commerce workflows",
      "Shopping cart systems",
      "Payment integrations",
      "Product catalog design",
      "Order management",
      "E-commerce security & compliance"
    ];
  }
  
  /**
   * Check if this agent can handle the given message
   */
  canHandle(message: string): boolean {
    const ecommerceKeywords = [
      "shopping cart", "checkout", "payment", "product", "order", "catalog",
      "e-commerce", "ecommerce", "shop", "store", "customer", "inventory",
      "pricing", "discount", "coupon", "shipping", "tax", "cart", "wishlist"
    ];
    
    const lowercaseMessage = message.toLowerCase();
    return ecommerceKeywords.some(keyword => lowercaseMessage.includes(keyword));
  }
  
  /**
   * Generate a response for e-commerce related questions
   */
  async generateResponse(message: string, previousMessages: string[] = []): Promise<string> {
    console.log("EcommerceAgent: Generating response");
    
    // Determine if the message is asking about code generation
    if (this.isCodeGenerationRequest(message)) {
      return this.handleCodeGenerationRequest(message);
    }
    
    // For non-code generation requests, use the base response generation
    // with e-commerce specific compliance guidance
    const baseResponse = await super.generateResponse(message, previousMessages);
    return this.enhanceWithComplianceGuidance(baseResponse, 'e-commerce');
  }
  
  /**
   * Check if a message is requesting code generation
   */
  private isCodeGenerationRequest(message: string): boolean {
    const codeKeywords = [
      "generate", "create", "build", "code", "implement", "develop",
      "example", "component", "function", "class", "schema"
    ];
    
    const lowercaseMessage = message.toLowerCase();
    return codeKeywords.some(keyword => lowercaseMessage.includes(keyword));
  }
  
  /**
   * Handle code generation requests
   */
  private async handleCodeGenerationRequest(message: string): Promise<string> {
    // Analyze the message to determine what type of code to generate
    const { codeType, language, requirements } = this.analyzeCodeRequest(message);
    
    try {
      let generatedCode = "";
      
      if (codeType === "component") {
        const componentType = this.extractComponentType(message);
        generatedCode = await this.generateComponentCode(componentType, requirements);
      } else if (codeType === "schema" || codeType === "database") {
        const entityType = this.extractEntityType(message);
        const databaseType = this.extractDatabaseType(message) || "PostgreSQL";
        generatedCode = await this.generateSchemaCode(entityType, requirements, databaseType);
      } else {
        generatedCode = await this.generateCode(requirements, language, codeType);
      }
      
      // Evaluate the generated code for quality and security
      const evaluation = await this.evaluateCode(generatedCode, language);
      
      // Format the response with the generated code and evaluation
      return this.formatCodeResponse(generatedCode, evaluation, codeType, language);
    } catch (error) {
      console.error("Error generating code:", error);
      return "I apologize, but I encountered an error while generating code. Please try again with more specific requirements.";
    }
  }
  
  /**
   * Analyze a code request to determine its parameters
   */
  private analyzeCodeRequest(message: string): { codeType: string; language: string; requirements: string } {
    const lowercaseMessage = message.toLowerCase();
    
    // Determine code type
    let codeType = "component"; // Default to component
    if (lowercaseMessage.includes("database") || lowercaseMessage.includes("schema")) {
      codeType = "schema";
    } else if (lowercaseMessage.includes("api") || lowercaseMessage.includes("endpoint")) {
      codeType = "api";
    } else if (lowercaseMessage.includes("function") || lowercaseMessage.includes("utility")) {
      codeType = "utility";
    } else if (lowercaseMessage.includes("hook")) {
      codeType = "hook";
    }
    
    // Determine language
    let language = "typescript/react"; // Default to TypeScript React
    if (lowercaseMessage.includes("javascript")) {
      language = lowercaseMessage.includes("react") ? "javascript/react" : "javascript";
    } else if (lowercaseMessage.includes("typescript")) {
      language = lowercaseMessage.includes("react") ? "typescript/react" : "typescript";
    } else if (lowercaseMessage.includes("python")) {
      language = "python";
    } else if (lowercaseMessage.includes("sql") || lowercaseMessage.includes("postgresql")) {
      language = "postgresql";
    } else if (lowercaseMessage.includes("mongodb") || lowercaseMessage.includes("nosql")) {
      language = "mongodb";
    }
    
    // Extract requirements (the whole message is the requirement)
    const requirements = message;
    
    return { codeType, language, requirements };
  }
  
  /**
   * Extract the component type from a message
   */
  private extractComponentType(message: string): string {
    const componentKeywords = [
      "product card", "product list", "product detail", "cart", "checkout",
      "payment form", "order summary", "navigation", "search", "filter",
      "user profile", "login", "registration", "wishlist", "review"
    ];
    
    const lowercaseMessage = message.toLowerCase();
    
    for (const keyword of componentKeywords) {
      if (lowercaseMessage.includes(keyword)) {
        return keyword.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("");
      }
    }
    
    // Default to ProductComponent if no specific component type is found
    return "ProductComponent";
  }
  
  /**
   * Extract the entity type from a message
   */
  private extractEntityType(message: string): string {
    const entityKeywords = [
      "product", "order", "user", "customer", "cart", "category", 
      "review", "payment", "shipping", "inventory", "discount"
    ];
    
    const lowercaseMessage = message.toLowerCase();
    
    for (const keyword of entityKeywords) {
      if (lowercaseMessage.includes(keyword)) {
        return keyword.charAt(0).toUpperCase() + keyword.slice(1);
      }
    }
    
    // Default to Product if no specific entity type is found
    return "Product";
  }
  
  /**
   * Extract the database type from a message
   */
  private extractDatabaseType(message: string): string | null {
    const databaseKeywords: { [key: string]: string } = {
      "postgresql": "PostgreSQL",
      "postgres": "PostgreSQL",
      "mysql": "MySQL",
      "mongodb": "MongoDB",
      "nosql": "MongoDB",
      "sql server": "SQL Server",
      "sqlite": "SQLite"
    };
    
    const lowercaseMessage = message.toLowerCase();
    
    for (const [keyword, dbType] of Object.entries(databaseKeywords)) {
      if (lowercaseMessage.includes(keyword)) {
        return dbType;
      }
    }
    
    return null;
  }
  
  /**
   * Format a code response with evaluation results
   */
  private formatCodeResponse(
    code: string, 
    evaluation: CodeEvaluation, 
    codeType: string, 
    language: string
  ): string {
    let response = `## Generated ${codeType.charAt(0).toUpperCase() + codeType.slice(1)} Code (${language})\n\n`;
    
    // Format code with syntax highlighting
    response += "```" + (language.includes("/") ? language.split("/")[0] : language) + "\n";
    response += code + "\n";
    response += "```\n\n";
    
    // Add evaluation results if there are any issues
    if (!evaluation.isValid || evaluation.suggestions.length > 0 || evaluation.securityConcerns.length > 0) {
      response += "## Code Evaluation\n\n";
      
      if (!evaluation.isValid && evaluation.issues.length > 0) {
        response += "### Issues\n\n";
        for (const issue of evaluation.issues) {
          response += `- **${issue.severity.toUpperCase()}**: ${issue.message}`;
          if (issue.line) {
            response += ` (Line ${issue.line})`;
          }
          response += "\n";
        }
        response += "\n";
      }
      
      if (evaluation.suggestions.length > 0) {
        response += "### Suggestions\n\n";
        for (const suggestion of evaluation.suggestions) {
          response += `- ${suggestion}\n`;
        }
        response += "\n";
      }
      
      if (evaluation.securityConcerns.length > 0) {
        response += "### Security Considerations\n\n";
        for (const concern of evaluation.securityConcerns) {
          response += `- ${concern}\n`;
        }
        response += "\n";
      }
      
      if (evaluation.performanceNotes.length > 0) {
        response += "### Performance Notes\n\n";
        for (const note of evaluation.performanceNotes) {
          response += `- ${note}\n`;
        }
        response += "\n";
      }
    }
    
    // Add e-commerce usage instructions
    response += "## Usage\n\n";
    if (codeType === "component") {
      response += "This component can be integrated into your e-commerce application by:\n\n";
      response += "1. Saving it to a file in your components directory\n";
      response += "2. Importing it where needed\n";
      response += "3. Passing the required props\n\n";
      
      response += "You may need to adjust this component to work with your state management solution and API endpoints.";
    } else if (codeType === "schema") {
      response += "This schema can be implemented in your database by:\n\n";
      response += "1. Running the migration/schema creation script\n";
      response += "2. Ensuring proper indices for optimal query performance\n";
      response += "3. Setting up proper relationships with other entities\n\n";
      
      response += "Consider adding appropriate validation and business rules in your application layer.";
    } else if (codeType === "api") {
      response += "This API endpoint can be implemented by:\n\n";
      response += "1. Adding it to your routes/controllers\n";
      response += "2. Implementing proper authentication and authorization\n";
      response += "3. Adding input validation and error handling\n\n";
      
      response += "Ensure you've properly secured the endpoint and validated all inputs.";
    }
    
    return response;
  }
  
  // Implement CodeGenerationCapabilities interface methods
  
  /**
   * Generate code based on a prompt
   */
  async generateCode(prompt: string, language: string, type: string, context?: string): Promise<string> {
    try {
      return await generateCode(prompt, language, type, context);
    } catch (error) {
      console.error("Error in generateCode:", error);
      throw error;
    }
  }
  
  /**
   * Generate component code for e-commerce
   */
  async generateComponentCode(componentType: string, requirements: string, framework?: string): Promise<string> {
    try {
      return await generateEcommerceComponent(componentType, requirements, framework);
    } catch (error) {
      console.error("Error in generateComponentCode:", error);
      throw error;
    }
  }
  
  /**
   * Generate database schema code
   */
  async generateSchemaCode(entityType: string, requirements: string, databaseType?: string): Promise<string> {
    try {
      return await generateDatabaseSchema(entityType, requirements, databaseType);
    } catch (error) {
      console.error("Error in generateSchemaCode:", error);
      throw error;
    }
  }
  
  /**
   * Evaluate code quality and security
   */
  async evaluateCode(code: string, language: string): Promise<CodeEvaluation> {
    try {
      // Check for security issues
      const securityCheckResult = await checkSecurity(code);
      const securityIssues = this.parseSecurityCheckResult(securityCheckResult);
      
      // Basic code evaluation for now
      const evaluation: CodeEvaluation = {
        isValid: securityIssues.length === 0,
        issues: securityIssues.map(issue => ({
          severity: 'warning',
          message: issue
        })),
        suggestions: this.generateSuggestions(code, language),
        securityConcerns: securityIssues,
        performanceNotes: this.generatePerformanceNotes(code, language)
      };
      
      return evaluation;
    } catch (error) {
      console.error("Error evaluating code:", error);
      
      // Return a default evaluation when there's an error
      return {
        isValid: true,
        issues: [],
        suggestions: [],
        securityConcerns: ["Could not perform security analysis."],
        performanceNotes: []
      };
    }
  }
  
  /**
   * Parse security check result string into array of issues
   */
  private parseSecurityCheckResult(result: string): string[] {
    // This is a simplified parser for the security check result
    // In reality, you'd want to parse the structured output
    if (!result || result.includes("No obvious security issues detected")) {
      return [];
    }
    
    const issues: string[] = [];
    const lines = result.split("\n");
    
    for (const line of lines) {
      if (line.startsWith("- ") && !line.includes("recommendation")) {
        issues.push(line.replace("- ", ""));
      }
    }
    
    return issues;
  }
  
  /**
   * Generate suggestions for improving code
   */
  private generateSuggestions(code: string, language: string): string[] {
    const suggestions: string[] = [];
    
    // Check for TODO comments
    if (code.includes("TODO") || code.includes("FIXME")) {
      suggestions.push("Replace any TODO or FIXME comments with actual implementations");
    }
    
    // Check for console.log statements
    if (code.includes("console.log") && (language.includes("javascript") || language.includes("typescript"))) {
      suggestions.push("Remove console.log statements in production code");
    }
    
    // Check for hardcoded values that should be configurable
    if ((code.includes("http://") || code.includes("https://")) && 
        !code.includes("process.env") && !code.includes("import.meta.env")) {
      suggestions.push("Consider moving hardcoded URLs to environment variables");
    }
    
    // Add e-commerce specific suggestions
    if (code.includes("price") || code.includes("amount") || code.includes("total")) {
      suggestions.push("Ensure proper decimal handling for monetary values");
    }
    
    if (language.includes("react") && code.includes("useState") && 
        (code.includes("cart") || code.includes("product"))) {
      suggestions.push("Consider using a more robust state management solution for cart state");
    }
    
    return suggestions;
  }
  
  /**
   * Generate performance notes for the code
   */
  private generatePerformanceNotes(code: string, language: string): string[] {
    const notes: string[] = [];
    
    // React-specific performance notes
    if (language.includes("react")) {
      if (code.includes("useEffect") && !code.includes("useCallback") && 
          (code.includes("fetch") || code.includes("axios"))) {
        notes.push("Consider using useCallback for functions passed to useEffect to prevent unnecessary re-renders");
      }
      
      if (code.includes("map(") && code.includes("key={") && 
          (code.includes("index}") || code.includes("i}"))) {
        notes.push("Avoid using array indices as React keys when mapping over items");
      }
      
      if (code.includes("useState") && code.includes("map(") && 
          code.includes("filter(") && !code.includes("useMemo")) {
        notes.push("Consider using useMemo for expensive computations like filtering and mapping");
      }
    }
    
    // Database-specific performance notes
    if (language.includes("sql") || language === "postgresql" || language === "mysql") {
      if (code.includes("SELECT *") && !code.includes("LIMIT")) {
        notes.push("Specify required columns instead of using SELECT * and consider adding a LIMIT clause");
      }
      
      if (!code.includes("CREATE INDEX") && 
          (code.includes("WHERE") || code.includes("JOIN"))) {
        notes.push("Consider adding appropriate indices for columns used in WHERE clauses and JOINs");
      }
    }
    
    // MongoDB-specific performance notes
    if (language === "mongodb") {
      if (code.includes("find(") && !code.includes("projection") && !code.includes("limit")) {
        notes.push("Use projections to limit returned fields and consider adding limits to queries");
      }
    }
    
    return notes;
  }
}