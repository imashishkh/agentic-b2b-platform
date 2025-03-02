
/**
 * This file contains common prompt templates that can be used by different agents
 */

// Suggestions for common user actions after initial project analysis
export const getProjectAnalysisSuggestions = () => {
  return {
    title: "Project Next Steps",
    description: "Choose an action to continue developing your project",
    options: [
      {
        id: "1",
        label: "Create Architecture Proposal",
        message: "Create a technical architecture proposal for our e-commerce system",
        icon: "database"
      },
      {
        id: "2",
        label: "Develop Testing Strategy",
        message: "Propose a comprehensive testing strategy for our project",
        icon: "check-circle"
      },
      {
        id: "3",
        label: "Show Project Timeline",
        message: "Show me a visual timeline of our project phases and milestones",
        icon: "calendar"
      },
      {
        id: "4",
        label: "Task Visualization",
        message: "Create a Gantt chart to visualize our project tasks and dependencies",
        icon: "bar-chart"
      }
    ]
  };
};

// Suggestions for knowledge base enhancement
export const getKnowledgeBaseSuggestions = () => {
  return {
    title: "Knowledge Base Enhancement",
    description: "Add resources to your project knowledge base",
    options: [
      {
        id: "1",
        label: "Add Technical Documentation",
        message: "I want to add technical documentation to our knowledge base",
        icon: "book-open"
      },
      {
        id: "2",
        label: "Add Industry Standards",
        message: "I want to add industry standards and best practices to our knowledge base",
        icon: "check-circle"
      },
      {
        id: "3",
        label: "Add Security Resources",
        message: "I want to add security guidelines and resources to our knowledge base",
        icon: "shield"
      },
      {
        id: "4",
        label: "Add Competitor Analysis",
        message: "I want to add competitor analysis to our knowledge base",
        icon: "users"
      }
    ]
  };
};

// Suggestions for architecture development
export const getArchitectureSuggestions = () => {
  return {
    title: "Architecture Development",
    description: "Refine your project's architecture",
    options: [
      {
        id: "1",
        label: "Database Schema Design",
        message: "Create a database schema design for our e-commerce platform",
        icon: "database"
      },
      {
        id: "2",
        label: "Frontend Component Structure",
        message: "Propose a component structure for our frontend application",
        icon: "layout"
      },
      {
        id: "3",
        label: "API Design",
        message: "Design the RESTful API structure for our application",
        icon: "code"
      },
      {
        id: "4",
        label: "Authentication Flow",
        message: "Design an authentication and authorization flow for our application",
        icon: "shield"
      }
    ]
  };
};

// Suggestions for project timeline management
export const getTimelineSuggestions = () => {
  return {
    title: "Timeline Management",
    description: "Manage your project timeline",
    options: [
      {
        id: "1",
        label: "Add Project Milestone",
        message: "Add an important milestone to our project timeline",
        icon: "milestone"
      },
      {
        id: "2",
        label: "View Critical Path",
        message: "Show me the critical path of tasks in our project",
        icon: "bar-chart"
      },
      {
        id: "3",
        label: "Adjust Task Dependencies",
        message: "I need to adjust some task dependencies in our project",
        icon: "clock"
      },
      {
        id: "4",
        label: "Generate Timeline Report",
        message: "Generate a report of our current project timeline status",
        icon: "file-code"
      }
    ]
  };
};

// Suggestions for GitHub integration
export const getGitHubSuggestions = () => {
  return {
    title: "GitHub Integration",
    description: "Set up and manage your GitHub repository",
    options: [
      {
        id: "1",
        label: "Connect Repository",
        message: "I want to connect my GitHub repository to this project",
        icon: "git-branch"
      },
      {
        id: "2",
        label: "Set Up Branching Strategy",
        message: "Recommend a branching strategy for our GitHub repository",
        icon: "git-branch"
      },
      {
        id: "3",
        label: "Configure CI/CD Pipeline",
        message: "Help me set up a CI/CD pipeline for our repository",
        icon: "check-circle"
      },
      {
        id: "4",
        label: "Create Repository Structure",
        message: "Create a recommended file and folder structure for our repository",
        icon: "folder"
      }
    ]
  };
};
