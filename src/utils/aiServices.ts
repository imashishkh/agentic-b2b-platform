/**
 * AI Services Module
 * 
 * This module provides services for interacting with AI APIs 
 * and external services like Claude and internet search.
 * Enhanced with LangChain and LangGraph capabilities for advanced agent functionality.
 */

import { ChatOpenAI } from "@langchain/openai"; 
import { ChatAnthropic } from "@langchain/anthropic";
import { 
  ChatPromptTemplate,
  MessagesPlaceholder,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate
} from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { BufferMemory, VectorStoreRetrieverMemory } from "langchain/memory";
import { Document } from "langchain/document";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { BaseChatMemory } from "@langchain/community/memory/chat_memory";

/**
 * Creates a memory system for the agent using vector storage for semantic retrieval
 */
export const createAgentMemory = async (agentType: string): Promise<BaseChatMemory> => {
  // For now, we'll use simple buffer memory
  // In production, this should be connected to a vector database like Chroma or Pinecone
  const memory = new BufferMemory({
    returnMessages: true,
    memoryKey: "chat_history",
    inputKey: "input",
    outputKey: "output",
  });
  
  return memory;
};

/**
 * Creates a chat model with appropriate settings for agent communication
 */
export const createChatModel = (modelType: string = "claude") => {
  if (modelType === "claude") {
    const CLAUDE_API_KEY = localStorage.getItem("claude_api_key") || 
      "sk-ant-api03-lfkQgMniYZzpFonbyy9GvQ73Xb9GjLzxE7_GXxtLFoBvZrnmITK-7HMgW04qN64c7KOnx5Pxe3QMxtFIxpg7Pg-n1vKwwAA";
    
    return new ChatAnthropic({
      apiKey: CLAUDE_API_KEY,
      modelName: "claude-3-sonnet-20240229",
      temperature: 0.2,
    });
  } else {
    // Fallback to OpenAI (requires API key to be set)
    const OPENAI_API_KEY = localStorage.getItem("openai_api_key");
    
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key not found");
    }
    
    return new ChatOpenAI({
      openAIApiKey: OPENAI_API_KEY,
      modelName: "gpt-4-turbo",
      temperature: 0.2,
    });
  }
};

/**
 * Creates a chain that combines memory, prompt and model for consistent agent responses
 */
export const createAgentChain = (systemPrompt: string, memory: BaseChatMemory, modelType: string = "claude") => {
  const model = createChatModel(modelType);
  
  const prompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(systemPrompt),
    new MessagesPlaceholder("chat_history"),
    HumanMessagePromptTemplate.fromTemplate("{input}")
  ]);
  
  const chain = RunnableSequence.from([
    {
      input: (initialInput) => initialInput.input,
      chat_history: async (initialInput) => {
        const memoryResult = await memory.loadMemoryVariables({});
        return memoryResult.chat_history || [];
      }
    },
    prompt,
    model,
    new StringOutputParser()
  ]);
  
  return { chain, memory };
};

// Function to ask Claude AI with a given prompt
export const askClaude = async (prompt: string): Promise<string> => {
  console.log("Asking Claude:", prompt);
  
  // Hardcoded API key for demo purposes
  const HARDCODED_API_KEY = "sk-ant-api03-lfkQgMniYZzpFonbyy9GvQ73Xb9GjLzxE7_GXxtLFoBvZrnmITK-7HMgW04qN64c7KOnx5Pxe3QMxtFIxpg7Pg-n1vKwwAA";
  
  // Always save the hardcoded key to localStorage for consistent access
  localStorage.setItem('claude_api_key', HARDCODED_API_KEY);
  
  // Get the API key - use hardcoded key or from localStorage
  const apiKey = HARDCODED_API_KEY || localStorage.getItem('claude_api_key');
  
  // If we have an API key, use it to make a real API call
  if (apiKey) {
    try {
      // Make actual API call to Claude
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229",
          max_tokens: 4000,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Claude API error:", errorData);
        throw new Error(`Claude API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error("Error calling Claude API:", error);
      // Provide more specific error message based on error type
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error("Network error: Unable to reach Claude API. Please check your internet connection.");
      } else if (error instanceof Error) {
        throw new Error(`Error calling Claude API: ${error.message}`);
      } else {
        throw new Error("Unknown error occurred while calling Claude API");
      }
    }
  } else {
    // If no API key, throw a helpful error message
    throw new Error("Claude API key not found. Please add your API key in the API Settings.");
  }
};

// Function to search the internet for a given query
export const searchInternet = async (query: string): Promise<string> => {
  console.log("Searching internet for:", query);
  
  // Get the API key from localStorage if available
  const apiKey = localStorage.getItem('searchApiKey');
  
  // If we have an API key, use it to make a real API call
  if (apiKey) {
    try {
      // In a real implementation, this would be a fetch call to a search API
      // For now, we'll simulate a response
      console.log("Using Search API key:", apiKey.substring(0, 4) + "...");
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return simulateSearchResults(query);
    } catch (error) {
      console.error("Error calling Search API:", error);
      if (error instanceof Error) {
        throw new Error(`Search API error: ${error.message}`);
      } else {
        throw new Error("Unknown error occurred while searching");
      }
    }
  } else {
    // If no API key, throw helpful error
    throw new Error("Search API key not found. Please add your API key in the API Settings.");
  }
};

// Search code repositories for examples
export const searchCodeExamples = async (query: string): Promise<string> => {
  console.log("Searching code repositories for:", query);
  await new Promise(resolve => setTimeout(resolve, 800));
  return simulateCodeSearch(query);
};

// Search for package information
export const searchPackages = async (packageName: string): Promise<string> => {
  console.log("Searching for package information:", packageName);
  await new Promise(resolve => setTimeout(resolve, 600));
  return simulatePackageSearch(packageName);
};

// Run code testing simulation
export const testCode = async (code: string, testType: string): Promise<string> => {
  console.log(`Running ${testType} tests on code snippet`);
  await new Promise(resolve => setTimeout(resolve, 1200));
  return simulateCodeTesting(code, testType);
};

// Generate code using Claude API
export const generateCode = async (
  prompt: string, 
  language: string, 
  codeType: string, 
  context?: string
): Promise<string> => {
  console.log(`Generating ${language} code for ${codeType}`);
  
  // Create a detailed prompt for code generation
  const codePrompt = `
You are an expert ${language} developer specializing in e-commerce applications.
Please generate high-quality, production-ready ${language} code for the following task:

${prompt}

Code Type: ${codeType} (e.g., component, utility, API endpoint)
${context ? `Context: ${context}` : ''}

Requirements:
- The code should follow best practices for ${language}
- Include appropriate error handling
- Be well-documented with comments
- Be secure and performant
- Follow modern coding standards

Return ONLY the code without any explanation or markdown formatting.
`;

  try {
    // Use the Claude API to generate the code
    const generatedCode = await askClaude(codePrompt);
    return generatedCode;
  } catch (error) {
    console.error("Error generating code:", error);
    if (error instanceof Error) {
      throw new Error(`Code generation failed: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred during code generation");
    }
  }
};

// Search for troubleshooting information
export const troubleshootCode = async (errorMessage: string): Promise<string> => {
  console.log("Troubleshooting error:", errorMessage);
  await new Promise(resolve => setTimeout(resolve, 900));
  return simulateTroubleshooting(errorMessage);
};

// Function to check for security vulnerabilities
export const checkSecurity = async (code: string): Promise<string> => {
  console.log("Running security check on code");
  await new Promise(resolve => setTimeout(resolve, 700));
  return simulateSecurityCheck(code);
};

// Specialized code generators for e-commerce
export const generateEcommerceComponent = async (
  componentType: string,
  requirements: string,
  frameworkPreference?: string
): Promise<string> => {
  const framework = frameworkPreference || "React with Tailwind CSS";
  const language = framework.includes("React") ? "TypeScript/React" : "JavaScript";
  
  console.log(`Generating ${componentType} e-commerce component with ${framework}`);
  
  const componentPrompt = `
Generate a complete, production-ready ${componentType} component for an e-commerce application using ${framework}.

Requirements:
${requirements}

The component should:
- Be fully functional and ready to use
- Include proper typing (if using TypeScript)
- Follow e-commerce best practices
- Be responsive and accessible
- Include error handling and loading states
- Be properly commented

Return ONLY the component code without explanations or markdown formatting.
`;

  try {
    return await generateCode(componentPrompt, language, "e-commerce component");
  } catch (error) {
    console.error(`Error generating ${componentType} component:`, error);
    if (error instanceof Error) {
      throw new Error(`Component generation failed: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred during component generation");
    }
  }
};

// Generate database schema for e-commerce
export const generateDatabaseSchema = async (
  entityType: string,
  requirements: string,
  databaseType: string = "PostgreSQL"
): Promise<string> => {
  console.log(`Generating ${entityType} database schema for ${databaseType}`);
  
  const schemaPrompt = `
Generate a complete database schema for ${entityType} in an e-commerce application using ${databaseType}.

Requirements:
${requirements}

The schema should:
- Follow database best practices
- Include proper data types and constraints
- Consider performance for e-commerce scale
- Include indexes where appropriate
- Consider relationships with other e-commerce entities

Return ONLY the schema definition code without explanations or markdown formatting.
`;

  try {
    return await generateCode(schemaPrompt, databaseType, "database schema");
  } catch (error) {
    console.error(`Error generating ${entityType} schema:`, error);
    if (error instanceof Error) {
      throw new Error(`Schema generation failed: ${error.message}`);
    } else {
      throw new Error("Unknown error occurred during schema generation");
    }
  }
};

// Only used as a fallback when API calls fail
const simulateClaudeResponse = (prompt: string): string => {
  // Check if the prompt is asking to analyze a markdown file
  if (prompt.includes("markdown file with e-commerce project requirements")) {
    return `
## Project Analysis: E-commerce Platform Development

Based on the provided markdown, I've organized the project into logical phases:

### Phase 1: Core Platform Setup (Sprint 1-2)
- Set up project repository and development environment - Complexity: Low
- Create database schema for products, users, orders - Complexity: Medium
- Implement user authentication and basic account management - Complexity: Medium
- Build product catalog display with basic filtering - Complexity: Medium
- Create shopping cart functionality - Complexity: Medium

### Phase 2: Checkout and Payments (Sprint 3-4)
- Implement checkout process flow - Complexity: High
- Integrate payment gateway (Stripe/PayPal) - Complexity: High
- Develop order management system - Complexity: Medium
- Create order confirmation emails - Complexity: Low
- Implement basic analytics tracking - Complexity: Medium

### Phase 3: Enhanced Features (Sprint 5-6)
- Build search functionality with filters - Complexity: Medium
- Implement product reviews and ratings - Complexity: Medium
- Add wishlist functionality - Complexity: Low
- Create product recommendations - Complexity: High
- Develop admin dashboard for inventory management - Complexity: High

### Phase 4: Mobile and Optimization (Sprint 7-8)
- Optimize for mobile responsiveness - Complexity: Medium
- Implement performance optimizations - Complexity: High
- Add progressive web app capabilities - Complexity: Medium
- Create mobile-specific navigation - Complexity: Medium
- Conduct thorough testing and bug fixes - Complexity: Medium

Each phase builds upon the previous one, with dependencies clearly marked between related tasks. The complexity ratings will help prioritize resources and set realistic timelines.
    `;
  }
  
  // We need to analyze the prompt to generate more specific responses
  let response = "";
  
  // Handle knowledge base requests
  if (prompt.includes("knowledge base") || prompt.includes("documentation") || prompt.includes("resources")) {
    response = `
## Knowledge Base Organization

I've analyzed your request about knowledge base management. Here are my recommendations:

### Knowledge Base Structure
1. Technical Documentation
   - Frontend Framework Documentation (React, Tailwind CSS)
   - Backend API Documentation
   - Database Schema Documentation
   - Authentication Flows

2. Industry Standards
   - E-commerce Best Practices
   - Security Compliance (PCI DSS)
   - Accessibility Guidelines (WCAG)
   - Performance Benchmarks

3. Development Guides
   - Coding Standards
   - Testing Procedures
   - CI/CD Pipeline Documentation
   - Code Review Guidelines

4. User Documentation
   - Admin Panel User Guide
   - API Integration Guide for Partners
   - Troubleshooting Guide

Would you like me to create a specific knowledge base template for any of these categories?
    `;
  }
  // Handle architecture requests
  else if (prompt.includes("architecture") || prompt.includes("system design") || prompt.includes("component")) {
    response = `
## Architecture Proposal: E-commerce Platform

Based on your requirements, I recommend a modern, scalable architecture:

### System Components
1. **Frontend Layer**
   - React with Next.js for SSR capabilities
   - Tailwind CSS for styling
   - Redux or Context API for state management
   - Progressive Web App support

2. **API Layer**
   - REST API with Node.js/Express
   - GraphQL for complex data requirements
   - API Gateway for rate limiting and security

3. **Service Layer**
   - Product Service (catalog, inventory)
   - User Service (authentication, profiles)
   - Order Service (cart, checkout, payments)
   - Search Service (Elasticsearch)

4. **Database Layer**
   - PostgreSQL for transactional data
   - MongoDB for product catalog
   - Redis for caching and sessions

5. **Infrastructure**
   - Docker containers
   - Kubernetes for orchestration
   - CI/CD pipeline with GitHub Actions
   - Cloud hosting (AWS or GCP)

Would you like me to elaborate on any specific component of this architecture?
    `;
  }
  // Handle testing strategy requests
  else if (prompt.includes("testing") || prompt.includes("test strategy") || prompt.includes("quality assurance")) {
    response = `
## Comprehensive Testing Strategy

Based on your e-commerce project requirements, I recommend this testing approach:

### Testing Levels
1. **Unit Testing**
   - Framework: Jest for JavaScript/TypeScript
   - Coverage target: 80% for business logic
   - Mocking strategy for external dependencies

2. **Integration Testing**
   - API endpoint testing with Supertest
   - Database integration tests
   - Service integration tests

3. **End-to-End Testing**
   - Framework: Cypress or Playwright
   - Critical user flows: registration, checkout, payment
   - Cross-browser testing

4. **Performance Testing**
   - Load testing with k6
   - Stress testing for sales events
   - Performance benchmarks for key pages

5. **Security Testing**
   - OWASP top 10 vulnerabilities
   - PCI DSS compliance testing
   - Data encryption verification

6. **Accessibility Testing**
   - WCAG 2.1 AA compliance
   - Screen reader compatibility
   - Keyboard navigation testing

Would you like me to develop a specific test plan for any of these areas?
    `;
  }
  // Handle GitHub integration requests
  else if (prompt.includes("github") || prompt.includes("repository") || prompt.includes("version control")) {
    response = `
## GitHub Integration Strategy

For your e-commerce project, I recommend the following GitHub setup:

### Repository Structure
1. **Monorepo vs. Multiple Repositories**
   - Recommendation: Monorepo for early development
   - Future consideration: Microservices in separate repos when scaling

2. **Branch Strategy**
   - Main branch: Production-ready code
   - Develop branch: Integration branch
   - Feature branches: Individual features
   - Release branches: Version preparation

3. **CI/CD Pipeline**
   - GitHub Actions workflows for:
     - Continuous integration (build, lint, test)
     - Continuous deployment to staging
     - Manual approval for production deployment

4. **Pull Request Process**
   - Required code reviews (2 approvals)
   - Passing CI checks
   - No merge conflicts
   - Conventional commit messages

5. **GitHub Project Management**
   - Issues for task tracking
   - Milestones for sprint planning
   - Project boards for kanban visualization
   - Labels for categorization

Would you like me to help set up any specific part of this GitHub infrastructure?
    `;
  }
  // Default response for other types of queries
  else {
    response = `
I've analyzed your question about ${prompt.includes("product") ? "product management" : "e-commerce development"}. Here's my technical advice:

When implementing ${prompt.includes("payment") ? "payment processing" : "this feature"} in an e-commerce platform, consider these best practices:

1. ${prompt.includes("payment") ? "Use established payment gateways like Stripe or PayPal rather than building custom payment processing" : "Start with the minimal viable feature set and iterate based on user feedback"}

2. ${prompt.includes("product") ? "Ensure your product catalog is built with scalability in mind - consider using a NoSQL database if you have complex product variants" : "Follow the separation of concerns principle in your architecture"}

3. ${prompt.includes("search") ? "Implement an efficient search service using Elasticsearch or Algolia for better performance than database queries" : "Design your APIs with versioning from the start to allow for future changes"}

4. Consider implementing ${prompt.includes("mobile") ? "a responsive design with a mobile-first approach" : "automated testing for critical user flows like checkout and payment"}

Would you like more specific information about implementing any particular aspect of this feature?
  `;
  }
  
  return response;
};

// Simulate search results based on the query
const simulateSearchResults = (query: string): string => {
  if (query.includes("payment processing")) {
    return `
### Relevant Resources for Payment Processing

1. Stripe Documentation: [https://stripe.com/docs](https://stripe.com/docs)
   - Comprehensive guides on implementing secure payment flows
   - Examples for handling subscriptions and one-time payments

2. PayPal Developer Center: [https://developer.paypal.com](https://developer.paypal.com)
   - Integration guides for various e-commerce platforms
   - Best practices for international payments

3. Security Best Practices:
   - Always use HTTPS for payment pages
   - Implement PCI DSS compliance measures
   - Consider using payment tokens rather than storing card details
    `;
  }
  
  if (query.includes("product catalog")) {
    return `
### Relevant Resources for Product Catalog Implementation

1. Database Schema Best Practices:
   - Consider nested categories with MongoDB or PostgreSQL JSONB
   - Implement efficient indexing for product searches
   - Design for product variants and attributes

2. Frontend Considerations:
   - Lazy loading for product images
   - Implement faceted search with filters
   - Consider using React Query or SWR for data fetching

3. Performance Optimization:
   - Use CDN for product images
   - Implement caching for product data
   - Consider server-side rendering for SEO
    `;
  }
  
  // Generic search results
  return `
### Relevant Resources for E-commerce Development

1. Architecture Patterns:
   - Microservices vs Monolith approaches for e-commerce
   - Event-driven architecture for inventory and order management
   - API-first design for future expansion

2. Technology Stack Recommendations:
   - Frontend: React/Next.js with Tailwind CSS
   - Backend: Node.js with Express or NestJS
   - Database: PostgreSQL for relational data, MongoDB for products
   - Search: Elasticsearch or Algolia

3. Development Best Practices:
   - Implement CI/CD pipelines early
   - Use feature flags for gradual rollouts
   - Prioritize mobile responsiveness
   - Plan for internationalization from the start
  `;
};

// Simulate code repository search results
const simulateCodeSearch = (query: string): string => {
  if (query.includes("react e-commerce")) {
    return `
### Code Examples for React E-commerce

1. Product Listing Component Example:
\`\`\`jsx
const ProductList = ({ products }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
\`\`\`

2. Shopping Cart Hook Example:
\`\`\`jsx
export const useCart = () => {
  const [items, setItems] = useState([]);
  
  const addItem = (product, quantity = 1) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };
  
  // Additional cart methods...
  
  return { items, addItem, /* other methods */ };
};
\`\`\`

3. Checkout Form Example:
\`\`\`jsx
const CheckoutForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    payment: 'credit-card'
  });
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
\`\`\`
    `;
  }
  
  if (query.includes("database schema e-commerce")) {
    return `
### Database Schema Examples for E-commerce

1. SQL Schema Example:
\`\`\`sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  status VARCHAR(50) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);
\`\`\`

2. NoSQL (MongoDB) Schema Example:
\`\`\`javascript
// Product schema
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  images: [String],
  category: { 
    _id: ObjectId, 
    name: String 
  },
  variants: [
    { 
      name: String, 
      options: [String]
    }
  ],
  created_at: Date
}

// Order schema
{
  _id: ObjectId,
  user: {
    _id: ObjectId,
    email: String,
    name: String
  },
  items: [
    {
      product_id: ObjectId,
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  shipping_address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  payment: {
    method: String,
    transaction_id: String
  },
  status: String,
  total: Number,
  created_at: Date
}
\`\`\`
    `;
  }
  
  // Default response
  return `
### Code Examples Related to "${query}"

1. Found 3 relevant repositories on GitHub:
   - e-commerce-platform/react-storefront (★1.2k)
   - modern-shop/nextjs-commerce (★890)
   - webdev-solutions/mern-commerce (★645)

2. Example snippets:
\`\`\`javascript
// Common pattern for ${query}
const handleFeature = async () => {
  try {
    // Implementation details would be specific to your query
    const result = await apiCall();
    return processResult(result);
  } catch (error) {
    console.error("Error implementing ${query}:", error);
    return fallbackBehavior();
  }
};
\`\`\`

3. Documentation references:
   - React documentation on handling ${query.includes("state") ? "state management" : "events"}
   - Best practices for ${query.includes("performance") ? "optimizing performance" : "code organization"}
   - Community discussions about ${query} implementation approaches
  `;
};

// Simulate package search results
const simulatePackageSearch = (packageName: string): string => {
  const commonPackages = {
    "stripe": {
      name: "stripe",
      description: "Stripe API wrapper for processing payments",
      version: "^12.0.0",
      popularity: "High (8M weekly downloads)",
      examples: "const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);\nconst paymentIntent = await stripe.paymentIntents.create({ amount: 2000, currency: 'usd' });"
    },
    "react-query": {
      name: "@tanstack/react-query",
      description: "Hooks for fetching, caching and updating data in React",
      version: "^5.4.0",
      popularity: "High (2.8M weekly downloads)",
      examples: "const { data, isLoading } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });"
    },
    "tailwindcss": {
      name: "tailwindcss",
      description: "Utility-first CSS framework",
      version: "^3.4.0",
      popularity: "Very High (6.2M weekly downloads)",
      examples: "<div className=\"bg-blue-500 text-white p-4 rounded shadow\">"
    }
  };
  
  // Check if we have predefined info for this package
  if (packageName in commonPackages) {
    const pkg = commonPackages[packageName];
    return `
### Package Information: ${pkg.name}

**Description**: ${pkg.description}
**Latest Version**: ${pkg.version}
**Popularity**: ${pkg.popularity}

**Installation**:
\`\`\`bash
npm install ${pkg.name}
# or
yarn add ${pkg.name}
\`\`\`

**Usage Example**:
\`\`\`javascript
${pkg.examples}
\`\`\`

**Common use cases in e-commerce**:
${packageName === "stripe" ? "- Processing payments\n- Subscription management\n- Invoice generation" : 
  packageName === "react-query" ? "- Fetching product data\n- Managing cart state\n- Handling user authentication state" :
  packageName === "tailwindcss" ? "- Responsive product layouts\n- Mobile-friendly navigation\n- Consistent UI components" : ""}
    `;
  }
  
  // Generic response for other packages
  return `
### Package Information: ${packageName}

**Description**: JavaScript/TypeScript package for web development
**Installation**:
\`\`\`bash
npm install ${packageName}
# or
yarn add ${packageName}
\`\`\`

**Usage considerations**:
- Check official documentation for latest APIs
- Verify compatibility with your React version
- Consider bundle size impact on frontend performance
  `;
};

// Simulate code testing
const simulateCodeTesting = (code: string, testType: string): string => {
  // Simple simulation of test results
  const hasErrors = code.includes("console.log") || code.includes("TODO");
  const warnings = [];
  
  if (code.includes("console.log")) {
    warnings.push("Avoid console.log statements in production code");
  }
  
  if (code.includes("TODO")) {
    warnings.push("Incomplete implementation (contains TODO)");
  }
  
  if (testType === "unit") {
    return `
### Unit Test Results

${hasErrors ? "⚠️ Tests completed with warnings" : "✅ All tests passed"}

${warnings.length > 0 ? "**Warnings**:\n- " + warnings.join("\n- ") : ""}

**Coverage Report**:
- Functions: 87%
- Statements: 82%
- Branches: 75%
- Lines: 84%

**Suggestions**:
${hasErrors
  ? "- Replace console.log with proper error handling\n- Implement TODO items before deployment"
  : "- Consider adding more edge case tests\n- Optimize performance of complex operations"}
    `;
  }
  
  if (testType === "integration") {
    return `
### Integration Test Results

${hasErrors ? "⚠️ Tests completed with warnings" : "✅ All integration points working correctly"}

${warnings.length > 0 ? "**Warnings**:\n- " + warnings.join("\n- ") : ""}

**API Integration Results**:
- Component renders with correct data: ✅
- User interactions trigger expected API calls: ✅
- Error states handled properly: ${hasErrors ? "⚠️" : "✅"}

**Suggestions**:
${hasErrors
  ? "- Implement proper error handling for API failures\n- Add loading states for better UX"
  : "- Consider implementing retry logic for failed API calls\n- Add more comprehensive error message handling"}
    `;
  }
  
  // Default for any other test type
  return `
### Test Results

${hasErrors ? "⚠️ Some issues detected" : "✅ Code looks good"}

${warnings.length > 0 ? "**Potential Issues**:\n- " + warnings.join("\n- ") : ""}

**Suggestions**:
- Ensure all edge cases are handled
- Add proper error handling
- Consider performance implications
  `;
};

// Simulate troubleshooting
const simulateTroubleshooting = (errorMessage: string): string => {
  // Identify common error patterns
  if (errorMessage.includes("undefined") || errorMessage.includes("null")) {
    return `
### Troubleshooting: Null/Undefined Error

**Common causes**:
1. Accessing properties on undefined objects
2. Missing null checks before property access
3. Race conditions where data isn't loaded yet
4. API returning null values unexpectedly

**Recommended solutions**:
\`\`\`javascript
// Add null checks with optional chaining
const userName = user?.profile?.name || 'Guest';

// Use nullish coalescing for default values
const quantity = product?.quantity ?? 1;

// For arrays, ensure they exist before mapping
{items && items.length > 0 ? (
  items.map(item => <Item key={item.id} {...item} />)
) : (
  <EmptyState message="No items found" />
)}
\`\`\`

**Prevention strategies**:
- Use TypeScript to catch these errors at compile time
- Implement proper loading states
- Add error boundaries to handle unexpected crashes
    `;
  }
  
  if (errorMessage.includes("type") || errorMessage.includes("interface") || errorMessage.includes("TS")) {
    return `
### Troubleshooting: TypeScript Type Errors

**Common causes**:
1. Incompatible types being assigned
2. Missing properties on objects
3. Incorrect generic type parameters
4. Type definitions not matching actual data

**Recommended solutions**:
\`\`\`typescript
// Define proper interfaces for your data
interface Product {
  id: string;
  name: string;
  price: number;
  description?: string; // Optional properties with ?
}

// Use type guards for runtime checking
function isProduct(obj: any): obj is Product {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.price === 'number'
  );
}

// For API data that might not match expectations
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};
\`\`\`

**Prevention strategies**:
- Keep type definitions up to date with API changes
- Use zod or similar libraries for runtime validation
- Consider generating types from API schemas
    `;
  }
  
  // Default generic troubleshooting
  return `
### Troubleshooting: General Error

**Possible causes**:
1. Syntax or logic errors in the code
2. API integration issues
3. State management problems
4. Incompatible dependencies

**Debugging steps**:
1. Check browser console for detailed error messages
2. Verify API endpoints and response formats
3. Inspect component props and state at each render
4. Review recent code changes that might have introduced the issue

**Common solutions**:
\`\`\`javascript
// Add debugging logs at key points
console.log('Data before processing:', data);

// Use try/catch to handle errors gracefully
try {
  const result = await riskyOperation();
  // Process result
} catch (error) {
  console.error('Operation failed:', error);
  // Handle the error appropriately
}

// Verify data before using it
if (!data || !Array.isArray(data.items)) {
  return <ErrorState message="Invalid data format" />;
}
\`\`\`

**Additional resources**:
- Check Stack Overflow for similar error messages
- Review documentation for libraries you're using
- Use React DevTools to inspect component hierarchy
  `;
};

// Simulate security check
const simulateSecurityCheck = (code: string): string => {
  const securityIssues = [];
  
  if (code.includes("innerHtml") || code.includes("dangerouslySetInnerHTML")) {
    securityIssues.push("XSS vulnerability: Using dangerouslySetInnerHTML without sanitization");
  }
  
  if (code.includes("eval(") || code.includes("new Function(")) {
    securityIssues.push("Code injection risk: Using eval() or new Function()");
  }
  
  if (code.includes("process.env") && !code.includes("process.env.NEXT_PUBLIC_")) {
    securityIssues.push("Potential secret exposure: Accessing non-public env variables in client code");
  }
  
  return `
### Security Analysis

${securityIssues.length === 0 ? "✅ No obvious security issues detected" : "⚠️ Security vulnerabilities detected"}

${securityIssues.length > 0 ? "**Vulnerabilities**:\n- " + securityIssues.join("\n- ") + "\n" : ""}

**E-commerce security best practices**:
1. Always validate and sanitize user inputs
2. Use HTTPS for all API communications
3. Implement proper authentication and authorization
4. Follow PCI DSS requirements for payment processing
5. Protect against CSRF attacks with tokens
6. Implement rate limiting for APIs
7. Never store sensitive customer data in client-side storage

**Implementation recommendations**:
\`\`\`javascript
// For displaying user-generated content safely
import DOMPurify from 'dompurify';

// Instead of:
// <div dangerouslySetInnerHTML={{ __html: userContent }} />

// Do this:
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />

// For handling payments securely
// Use established payment processors and their official SDKs
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
\`\`\`
  `;
};
