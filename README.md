
# DevManager AI: Your AI Project Management Assistant

![DevManager](https://img.shields.io/badge/DevManager-AI-coral)
![LangChain.js](https://img.shields.io/badge/LangChain.js-Agents-blue)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Latest-38b2ac)

## Table of Contents
- [Introduction](#introduction)
- [What is DevManager AI?](#what-is-devmanager-ai)
- [Getting Started](#getting-started)
- [Features](#features)
- [AI Agents System](#ai-agents-system)
  - [Manager Agent](#manager-agent)
  - [Frontend Agent](#frontend-agent)
  - [Backend Agent](#backend-agent)
  - [Database Agent](#database-agent)
  - [DevOps Agent](#devops-agent)
  - [UX Agent](#ux-agent)
- [User Flow](#user-flow)
- [Knowledge Base System](#knowledge-base-system)
- [Performance Monitoring](#performance-monitoring)
- [Architecture Design](#architecture-design)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Introduction

DevManager AI is an intelligent project management assistant that helps you plan, develop, and manage software projects through natural language conversation. Built with advanced AI technology, DevManager understands your project requirements and guides you through the development process with specialized expertise.

## What is DevManager AI?

Imagine having an entire team of software development experts available to chat with at any time. That's DevManager AI! It combines multiple AI agents with specialized knowledge to help you:

- Plan your software projects
- Break down complex tasks
- Design system architecture
- Create documentation
- Monitor performance
- Ensure security best practices
- Coordinate different aspects of development

The system uses a conversational interface where you can upload project requirements, ask questions, and get detailed guidance from AI agents specializing in different areas of software development.

## Getting Started

1. **Chat Interface**: Start by typing your question or uploading a project requirements document in the chat interface.

2. **AI Analysis**: DevManager will analyze your input and respond with helpful information, suggestions, or follow-up questions.

3. **Specialized Help**: Depending on your questions, specialized agents (Frontend, Backend, etc.) will provide targeted expertise.

4. **Visual Tools**: Use the sidebar to access performance metrics, documentation generation, and other helpful tools.

## Features

### Recently Updated Features

- **Enhanced UI**: Improved chat interface with better spacing and cleaner design
- **Collapsible Sidebar Sections**: Better organization of tools and resources
- **Performance Metrics Display**: Visual representation of application performance
- **Knowledge Base Management**: Easy way to add and access project resources
- **Documentation Generator**: Automated creation of various documentation types

### Core Features

- **Natural Language Project Planning**: Describe your project in plain language
- **Task Breakdown and Assignment**: Automatically split projects into manageable tasks
- **Architecture Design Assistance**: Get recommendations for system structure
- **Performance Optimization**: Identify and fix performance bottlenecks
- **Security Review**: Automated security checks for your code
- **Knowledge Base**: Store and retrieve project-related resources
- **GitHub Integration**: Connect with your GitHub repositories
- **Documentation Generation**: Create technical, API, and user documentation

## AI Agents System

DevManager uses a hierarchical system of specialized AI agents to provide comprehensive assistance:

### Manager Agent

**Role**: The "boss" agent that coordinates the entire project
**Capabilities**:
- Process requirement documents
- Break down projects into tasks
- Assign work to specialized agents
- Create project timelines and milestones
- Provide technical oversight
- Coordinate cross-functional teams
- Make architectural decisions
- Ensure best practices

**Files**: 
- `src/agents/ManagerAgent.ts` - Core implementation
- `src/agents/manager/` - Specialized functionality modules

### Frontend Agent

**Role**: Expert in user interfaces and frontend development
**Capabilities**:
- Design UI/UX components
- Implement React code
- Create responsive layouts
- Optimize frontend performance
- Suggest best practices for UI development
- Review frontend code
- Recommend component structures

**Files**:
- `src/agents/FrontendAgent.ts`

### Backend Agent

**Role**: Expert in server-side development
**Capabilities**:
- Design API endpoints
- Implement server-side logic
- Ensure secure authentication
- Optimize backend performance
- Suggest database interactions
- Handle data processing
- Manage middleware

**Files**:
- `src/agents/BackendAgent.ts`

### Database Agent

**Role**: Expert in data modeling and storage
**Capabilities**:
- Design database schemas
- Optimize queries
- Plan data migrations
- Ensure data integrity
- Recommend database technologies
- Implement caching strategies
- Review data access patterns

**Files**:
- `src/agents/DatabaseAgent.ts`

### DevOps Agent

**Role**: Expert in deployment and infrastructure
**Capabilities**:
- Set up GitHub repositories
- Design CI/CD pipelines
- Configure deployment processes
- Monitor system health
- Optimize infrastructure
- Handle containerization
- Implement cloud services

**Files**:
- `src/agents/DevOpsAgent.ts`

### UX Agent

**Role**: Expert in user experience design
**Capabilities**:
- Create user flows
- Design information architecture
- Improve accessibility
- Test usability
- Create wireframes
- Implement design patterns
- Optimize user journeys

**Files**:
- `src/agents/UXAgent.ts`

## User Flow

The DevManager system follows a structured user flow designed to maximize productivity:

1. **Project Initialization**
   - Upload a markdown file with project requirements
   - DevManager parses and organizes the information into structured data

2. **Project Analysis & Task Assignment**
   - Visual presentation of tasks, milestones, and dependencies
   - Automatic task assignment to specialized agents
   - Initial prioritization based on technical dependencies
   - User approval or adjustment of tasks

3. **Knowledge Base Enhancement**
   - Request and index relevant documentation:
     - Technology stack documentation
     - Industry standards
     - Competitor analysis
     - Security compliance requirements

4. **Architecture Planning**
   - System architecture proposal with input from specialized agents
   - Database schema design
   - Visual sitemap and user flow diagrams
   - Component libraries and framework recommendations

5. **Testing Strategy Development**
   - Comprehensive testing approach including:
     - Unit testing framework
     - Integration testing methodology
     - End-to-end testing for critical user journeys
     - Performance benchmarks
     - Security testing protocols

6. **Resource Collection**
   - Identification of required components based on sitemap
   - Analysis of reference materials
   - Extraction of design patterns and principles
   - Project scope refinement

7. **Documentation Planning**
   - API documentation format
   - Component documentation approach
   - User guides and technical documentation
   - Code commenting standards

8. **Performance Monitoring Setup**
   - Performance monitoring tools and metrics
   - Benchmark establishment
   - Integrated monitoring strategy

9. **User Feedback Integration**
   - Mechanisms for collecting user feedback
   - Incorporation into development process
   - Continuous improvement cycle

10. **Repository Setup**
    - GitHub repository configuration
    - Branch structure
    - CI/CD pipeline setup

11. **Security Review Planning**
    - Security checkpoints throughout development
    - Protocols for handling sensitive data
    - Regular vulnerability assessments

12. **Development Execution**
    - Specialized agents begin development work
    - Regular progress updates
    - File creation and repository management

13. **Development Checkpoints**
    - Progress demonstrations
    - Automated testing
    - Security reviews
    - Documentation updates
    - User feedback incorporation

14. **Performance Optimization**
    - Metric evaluation
    - Code and infrastructure optimization
    - Performance improvement verification

15. **Final Security Audit**
    - Comprehensive security review
    - Vulnerability remediation
    - Security best practices confirmation

16. **Documentation Finalization**
    - Technical documentation completion
    - API documentation finalization
    - User guide creation
    - Maintenance guidelines establishment

17. **Project Delivery**
    - Deployment to staging environment
    - Final review and acceptance testing
    - Production deployment
    - Handover process

18. **Maintenance Plan**
    - Ongoing monitoring strategy
    - Update schedule
    - Performance optimization roadmap

## Knowledge Base System

The Knowledge Base is a central repository for all project-related information:

- **Resource Categories**: Frontend, Backend, Database, DevOps, UX
- **Resource Types**: Documentation, code examples, best practices, tutorials
- **Search Functionality**: Find relevant resources based on keywords
- **Relevance Scoring**: Resources are ranked by relevance to your queries
- **Automatic Recommendations**: System suggests resources based on current context

Access the Knowledge Base through the sidebar or by asking questions about specific technologies or concepts.

## Performance Monitoring

DevManager includes tools to track and optimize your application's performance:

- **Performance Metrics**: Track key indicators like loading times and response speed
- **Monitoring Tools**: Recommendations for tools to monitor your application
- **Benchmarking**: Compare your app's performance against industry standards
- **Optimization Tips**: Get actionable advice to improve performance

Access performance tools through the sidebar's "Performance" section.

## Architecture Design

Get help designing your system architecture:

- **Architecture Patterns**: Recommendations for system structure (microservices, monolithic, etc.)
- **Component Design**: Help with designing individual system components
- **Technology Selection**: Advice on choosing the right technologies
- **Visualization**: Visual representations of your system architecture
- **Dependency Management**: Plan component dependencies and interactions

## Technology Stack

DevManager AI is built using modern web technologies:

### Frontend
- **React**: UI component library (v18.3.1)
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Reusable UI component system
- **Recharts**: Data visualization library
- **React Query**: Data fetching and state management

### AI and Natural Language Processing
- **LangChain.js**: Framework for building AI agents
- **Transformers.js**: Text processing and understanding
- **OpenAI API**: Advanced natural language capabilities

### Development Tools
- **Vite**: Fast development server and build tool
- **ESLint**: Code quality checking
- **TypeScript**: Static type checking

## Project Structure

The codebase is organized into a modular structure:

```
src/
├── agents/                   # AI agent implementations
│   ├── BaseAgent.ts          # Base agent class
│   ├── ManagerAgent.ts       # Main coordination agent
│   ├── FrontendAgent.ts      # Frontend specialist
│   ├── BackendAgent.ts       # Backend specialist
│   ├── DatabaseAgent.ts      # Database specialist
│   ├── DevOpsAgent.ts        # DevOps specialist
│   ├── UXAgent.ts            # UX specialist
│   ├── manager/              # Manager agent specialized modules
│   └── AgentTypes.ts         # Agent type definitions
├── components/               # React components
│   ├── ui/                   # Generic UI components
│   ├── chat/                 # Chat interface components
│   ├── knowledge/            # Knowledge base components
│   ├── project/              # Project management components
│   ├── architecture/         # Architecture visualization
│   ├── testing/              # Testing strategy components
│   └── github/               # GitHub integration components
├── contexts/                 # React contexts
│   ├── ChatContext.tsx       # Chat state management
│   └── types.ts              # Type definitions
├── utils/                    # Utility functions
│   ├── knowledgeRelevance.ts # Knowledge relevance scoring
│   ├── markdownParser.ts     # Parse markdown documents
│   └── architectureUtils.ts  # Architecture helper functions
└── hooks/                    # Custom React hooks
```

## Contributing

Contributions are welcome! To contribute to DevManager AI:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

Please follow our coding standards and include tests for new features.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**DevManager AI** - Your intelligent project management assistant that speaks your language.
