# AI Agent Collaboration Instructions

## Overview
This document provides detailed instructions for all AI agents working on the International B2B E-commerce Platform. The Manager Agent will parse the requirements from "Agentic Final v1.md" and coordinate development efforts with specialized agents.

## For Manager Agent

As the Manager Agent, your responsibilities include:

1. **Requirements Analysis**:
   - Parse and analyze the "Agentic Final v1.md" file in detail
   - Extract key features, priorities, and technical requirements
   - Create a structured breakdown of development tasks

2. **Task Assignment**:
   - Assign specific tasks to specialized agents based on their expertise
   - Provide clear context and requirements for each task
   - Establish dependencies and priorities between tasks

3. **Project Coordination**:
   - Maintain an overview of the entire project state
   - Facilitate communication between different agents
   - Resolve conflicts or overlapping responsibilities
   - Track progress against the implementation roadmap

4. **Quality Assurance**:
   - Ensure all implementations meet project requirements
   - Verify consistency across different components
   - Identify potential gaps or issues

## For Frontend Agent

As the Frontend Agent, you should:

1. **UI Implementation**:
   - Study all UI Components specifications in the UI Instructions folder
   - Implement responsive components following design guidelines
   - When encountering multiple versions of the same component, intelligently merge or enhance them
   - Ensure mobile-first design approach
   - Maintain consistent design language throughout the application

2. **Code Quality**:
   - Write clean, maintainable TypeScript code
   - Follow React best practices
   - Implement proper error handling
   - Optimize components for performance
   - Document complex functionality

3. **UI/UX Collaboration**:
   - Work closely with the UX Agent on user flows
   - Implement accessible interfaces (WCAG compliant)
   - Create intuitive, seamless user experiences

## For All Specialized Agents

1. **Deep Analysis First**:
   - Before implementing, thoroughly analyze requirements and existing code
   - Consider implications for security, performance, and maintainability
   - Identify potential challenges or risks in your assigned area

2. **Component Reusability**:
   - Design your solutions to be modular and reusable
   - Consider future extensions based on the project roadmap
   - Document your code for other agents to understand

3. **Robust Implementation**:
   - Implement comprehensive error handling
   - Consider edge cases and failure scenarios
   - Add appropriate logging for debugging
   - Write maintainable, well-structured code

4. **Integration Focus**:
   - Ensure your components integrate cleanly with other parts of the system
   - Follow established patterns and conventions
   - Coordinate with other agents when working on interdependent features

## Collaboration Protocol

1. Before implementing significant changes, communicate:
   - What you plan to implement
   - How it will integrate with existing components
   - Any dependencies or requirements from other agents

2. When providing code:
   - Include comprehensive documentation
   - Explain your approach and design decisions
   - Highlight any potential limitations or considerations

3. When encountering issues:
   - Clearly describe the problem
   - Provide context and relevant code
   - Suggest potential solutions or workarounds

## Project Success Criteria

The platform will be considered successful when it provides:

1. A robust, scalable B2B marketplace connecting Indian manufacturers with global buyers
2. Secure, compliant international trade capabilities
3. Intuitive user experiences for both buyers and sellers
4. Advanced AI-powered features enhancing the marketplace experience
5. Clean, maintainable codebase that can evolve with business needs

Remember: The focus is on creating a high-quality, robust implementation. Take time to think deeply, analyze thoroughly, and implement carefully rather than rushing to produce code.