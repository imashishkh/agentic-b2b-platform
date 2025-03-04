# Project Guide for AI Agents

## Project Overview
This is a B2B E-commerce platform focused on connecting Indian manufacturers and distributors with global buyers. The platform will incorporate advanced AI features, robust international trade capabilities, and a user-friendly interface designed specifically for B2B commerce.

## Key Commands

### Development
- Build: `npm run build`
- Development server: `npm run dev`
- Testing: `npm run test`
- Linting: `npm run lint`
- Type checking: `npm run typecheck`

### Git Workflow
- Current repo: `https://github.com/imashishkh/agentic-b2b-platform.git`
- All implementations should follow a clean, maintainable coding style
- Use descriptive commit messages following conventional commits format

## Design Guidelines

### UI Component Best Practices
1. Follow the UI Components style guide carefully
2. When multiple versions of a component exist, use intelligent merging or mixing approaches
3. Maintain consistent design language throughout the application
4. All components should be fully responsive and mobile-friendly
5. Ensure proper accessibility implementations (ARIA attributes, keyboard navigation)
6. Components should be modular and reusable
7. Prefer styled-components or Tailwind CSS for styling

### Code Style Requirements
1. Use TypeScript for all components and utilities
2. Implement proper type definitions
3. Write clean, maintainable code with appropriate comments
4. Follow React best practices (proper hooks usage, component structure)
5. Optimize for performance (memoization, code splitting)
6. Implement comprehensive error handling

## Inter-Agent Collaboration Guidelines

1. Manager Agent: Responsible for task coordination, requirements analysis, and assigning tasks to specialized agents
2. Frontend Agent: Implement UI components, user interactions, responsive design
3. Backend Agent: Create API endpoints, database models, business logic
4. Database Agent: Design database schema, optimize queries, handle data migrations
5. DevOps Agent: Setup deployment pipelines, security configurations, monitoring
6. UX Agent: User experience flow, accessibility, usability improvements

All agents should:
- Think deeply and analyze requirements before implementation
- Communicate intentions and approaches before executing code changes
- Ensure their implementations integrate well with other components
- Follow the roadmap and timeline from the project documentation
- Consider scalability, security, and maintainability in all decisions

## Important Project Requirements
- International trade and compliance features
- Multi-currency support
- AI-powered features including product recommendations and fraud detection
- Secure payment processing with escrow capabilities
- Comprehensive trust and verification systems
- Mobile-first responsive design
- Sustainable commerce features

## Development Priorities
1. Start with core marketplace functionality
2. Build seller and buyer dashboards
3. Implement authentication and user management
4. Create product catalog and search functionality
5. Develop order management and checkout flow
6. Add advanced AI features like recommendations and fraud detection