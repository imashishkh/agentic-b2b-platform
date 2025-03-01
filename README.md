
# DevManager AI with LangChain.js

![DevManager](https://img.shields.io/badge/DevManager-AI-coral)
![LangChain.js](https://img.shields.io/badge/LangChain.js-Agents-blue)

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Architecture Overview](#architecture-overview)
- [Agent Implementation](#agent-implementation)
  - [DevManager Agent](#devmanager-agent)
  - [E-commerce Domain Knowledge](#e-commerce-domain-knowledge)
  - [Agent Tools](#agent-tools)
- [Tools Implementation](#tools-implementation)
  - [Markdown Parser Tool](#markdown-parser-tool)
  - [Claude Integration](#claude-integration)
  - [Internet Search Tool](#internet-search-tool)
- [E-commerce Planning Framework](#e-commerce-planning-framework)
  - [System Architecture](#system-architecture)
  - [Frontend Components](#frontend-components)
  - [Backend Services](#backend-services)
  - [Database Schema](#database-schema)
- [Development Roadmap](#development-roadmap)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project implements a DevManager AI agent using LangChain.js to guide users through the development process of an e-commerce platform. The agent combines specialized domain knowledge with multiple tools to help plan, structure, and develop e-commerce applications.

Key features:
- Interactive conversational interface for requirements gathering
- Markdown parsing for project documentation and task management
- Integration with Claude AI for enhanced reasoning
- Internet search capabilities for up-to-date information
- Structured approach to e-commerce development planning

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm/yarn/pnpm
- API keys for:
  - LangChain.js (if using their API services)
  - Claude AI (Anthropic)
  - Search API (if implementing real search functionality)

### Installation

1. Clone this repository
```bash
git clone <repository-url>
cd devmanager-agent
```

2. Install dependencies
```bash
npm install
```

3. Add the necessary API keys to your environment variables
```bash
# Create a .env file in the root directory
touch .env

# Add your API keys to the .env file
VITE_CLAUDE_API_KEY=your_claude_api_key
VITE_SEARCH_API_KEY=your_search_api_key
```

4. Start the development server
```bash
npm run dev
```

## Architecture Overview

The application follows a modular architecture:

1. **LangChain.js Agent Layer**: Core agent implementation using LangChain.js
2. **Tools Layer**: Specialized tools for markdown parsing, API integrations, and search
3. **UI Layer**: React components for chat interface and interaction
4. **State Management**: Manages conversation context and user preferences
5. **API Services**: Wrapper services for external API integrations

## Agent Implementation

### DevManager Agent

The DevManager agent is built using LangChain.js's agent framework. It combines:

```typescript
import { Agent, createOpenAIToolsAgent } from "langchain/agents";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory } from "langchain/memory";
import { AgentExecutor } from "langchain/agents/executor";
import { StructuredTool } from "langchain/tools";

// Define tools
const tools = [markdownParserTool, claudeApiTool, internetSearchTool];

// Create the agent model
const model = new ChatOpenAI({
  temperature: 0.2,
  modelName: "gpt-4",
});

// Create the agent with tools
const agent = createOpenAIToolsAgent({
  llm: model,
  tools: tools,
  prompt: DEV_MANAGER_PROMPT,
});

// Create memory to store chat history
const memory = new BufferMemory({
  memoryKey: "chat_history",
  returnMessages: true,
});

// Create agent executor
const agentExecutor = new AgentExecutor({
  agent,
  tools,
  memory,
  verbose: true,
});

// Execute agent tasks
const result = await agentExecutor.invoke({
  input: userMessage,
});
```

### E-commerce Domain Knowledge

The agent is pre-trained with specialized knowledge about e-commerce development:

1. **Frontend Architecture**: Modern React patterns for e-commerce UIs
2. **Backend Services**: Payment processing, inventory management, user authentication
3. **Database Design**: Product catalogs, user profiles, order management
4. **Development Process**: Agile methodologies specialized for e-commerce
5. **Best Practices**: Security, scalability, and maintainability concerns

This knowledge is incorporated via system prompts and pre-defined responses to common development questions.

### Agent Tools

The agent utilizes several tools through LangChain.js's tool integration:

1. **Markdown Parser**: Converts project documentation into structured tasks
2. **Claude API**: Enhances reasoning capabilities for complex questions
3. **Internet Search**: Retrieves up-to-date information about technologies and best practices

## Tools Implementation

### Markdown Parser Tool

The markdown parser tool extracts structured information from markdown files:

```typescript
import { StructuredTool } from "langchain/tools";

const markdownParserTool = new StructuredTool({
  name: "markdown_parser",
  description: "Parse markdown content into structured task data",
  schema: z.object({
    markdown: z.string().describe("The markdown content to parse"),
  }),
  func: async ({ markdown }) => {
    // Implementation to parse markdown into categories and tasks
    const tasks = [];
    let currentCategory = "General";
    let currentItems = [];
    
    markdown.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('# ')) {
        if (currentItems.length > 0) {
          tasks.push({ category: currentCategory, items: [...currentItems] });
          currentItems = [];
        }
        currentCategory = trimmedLine.substring(2);
      } 
      else if (trimmedLine.startsWith('## ')) {
        if (currentItems.length > 0) {
          tasks.push({ category: currentCategory, items: [...currentItems] });
          currentItems = [];
        }
        currentCategory = trimmedLine.substring(3);
      }
      else if (trimmedLine.startsWith('- ') || trimmedLine.match(/^\d+\. /)) {
        const taskContent = trimmedLine.replace(/^- /, '').replace(/^\d+\. /, '');
        currentItems.push(taskContent);
      }
    });
    
    if (currentItems.length > 0) {
      tasks.push({ category: currentCategory, items: [...currentItems] });
    }
    
    return JSON.stringify(tasks);
  },
});
```

### Claude Integration

Integration with Claude AI via Anthropic's API:

```typescript
import { StructuredTool } from "langchain/tools";
import { Anthropic } from "langchain/llms/anthropic";

const claudeApiTool = new StructuredTool({
  name: "claude_api",
  description: "Ask Claude AI for e-commerce development advice and insights",
  schema: z.object({
    prompt: z.string().describe("The question or prompt to send to Claude"),
  }),
  func: async ({ prompt }) => {
    const model = new Anthropic({
      modelName: "claude-3-opus-20240229",
      anthropicApiKey: process.env.VITE_CLAUDE_API_KEY,
    });
    
    const result = await model.invoke(
      `You are an e-commerce development expert. ${prompt}`
    );
    
    return result;
  },
});
```

### Internet Search Tool

Implementation of an internet search tool:

```typescript
import { StructuredTool } from "langchain/tools";

const internetSearchTool = new StructuredTool({
  name: "internet_search",
  description: "Search the internet for up-to-date information on e-commerce development",
  schema: z.object({
    query: z.string().describe("The search query"),
  }),
  func: async ({ query }) => {
    // In a real implementation, you would connect to a search API
    // For example, using SerpAPI, Google Custom Search, or similar
    
    // This is a placeholder for the actual implementation
    try {
      const response = await fetch(`https://api.searchapi.com/search?q=${encodeURIComponent(query)}&api_key=${process.env.VITE_SEARCH_API_KEY}`);
      const data = await response.json();
      return JSON.stringify(data.results);
    } catch (error) {
      return "Error: Could not complete the search. Please try again later.";
    }
  },
});
```

## E-commerce Planning Framework

### System Architecture

The DevManager agent guides users through planning a modern e-commerce architecture:

1. **Microservices Architecture**
   - Product Catalog Service
   - User Authentication Service
   - Order Processing Service
   - Payment Processing Service
   - Inventory Management Service
   - Analytics Service

2. **API Gateway Layer**
   - Request routing
   - Rate limiting
   - Authentication/Authorization
   - Request/Response transformation

3. **Frontend Architecture**
   - React-based SPA
   - Server-Side Rendering (SSR) options
   - Mobile responsiveness
   - Progressive Web App capabilities

4. **Infrastructure Planning**
   - Cloud provider selection
   - Containerization strategy
   - CI/CD pipeline
   - Monitoring and logging

### Frontend Components

Core e-commerce UI components:

1. **Product Display Components**
   - Product cards
   - Product detail pages
   - Image galleries
   - Product variants
   - Availability indicators

2. **Shopping Components**
   - Shopping cart
   - Wishlist
   - Recently viewed
   - Related products
   - Checkout process

3. **User Account Components**
   - Registration/Login
   - Profile management
   - Order history
   - Payment methods
   - Address book

4. **Search and Navigation**
   - Search bar with autocomplete
   - Faceted search
   - Category navigation
   - Breadcrumbs
   - Sorting and filtering

### Backend Services

Essential backend services for e-commerce:

1. **Authentication Service**
   - User registration
   - Login/Logout
   - Password recovery
   - OAuth integrations
   - JWT management

2. **Product Catalog Service**
   - Product creation and management
   - Category management
   - Pricing rules
   - Discount management
   - Inventory tracking

3. **Order Processing Service**
   - Order creation
   - Order status management
   - Fulfillment processing
   - Returns and refunds
   - Order notifications

4. **Payment Service**
   - Payment provider integrations
   - Transaction processing
   - Fraud detection
   - Subscription management
   - Invoice generation

### Database Schema

Recommended database structure:

1. **Users Collection**
   - Basic profile information
   - Authentication data
   - Preferences
   - Permissions

2. **Products Collection**
   - Product details
   - Categories
   - Variants
   - Pricing
   - Inventory

3. **Orders Collection**
   - Order details
   - Line items
   - Shipping information
   - Payment details
   - Order status

4. **Payments Collection**
   - Transaction records
   - Payment methods
   - Billing addresses
   - Payment status

## Development Roadmap

A typical e-commerce development roadmap:

### Phase 1: Foundation
- User authentication system
- Basic product catalog
- Simple shopping cart
- Checkout process with a single payment method
- Order management

### Phase 2: Enhanced Features
- Product reviews and ratings
- Wish lists
- Product recommendations
- Multiple payment methods
- Enhanced search functionality

### Phase 3: Advanced Capabilities
- Personalization
- Analytics dashboard
- Inventory management
- Discount and promotion engine
- Multi-language support

### Phase 4: Scaling
- Performance optimization
- Mobile app development
- Advanced analytics
- A/B testing framework
- Internationalization

## Contributing

Contributions are welcome! Please read the contributing guidelines before submitting a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
