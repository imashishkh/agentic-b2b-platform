#!/bin/bash

# B2B E-commerce Platform Project Setup Script
# This script prepares the development environment for the B2B e-commerce platform

# Exit on error
set -e

echo "=== B2B E-commerce Platform Project Setup ==="
echo "Setting up project environment..."

# Check for required tools
command -v git >/dev/null 2>&1 || { echo "Error: git is required but not installed. Aborting."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Error: Node.js is required but not installed. Aborting."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "Error: npm is required but not installed. Aborting."; exit 1; }

# Create project directory
mkdir -p agentic-b2b-platform
cd agentic-b2b-platform

# Initialize git repository
if [ ! -d ".git" ]; then
  echo "Initializing Git repository..."
  git init
  git remote add origin https://github.com/imashishkh/agentic-b2b-platform.git
fi

# Set up Next.js with TypeScript and Tailwind CSS
echo "Setting up Next.js with TypeScript and Tailwind CSS..."
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Install additional dependencies
echo "Installing additional dependencies..."
npm install --save \
  @hello-pangea/dnd \
  framer-motion \
  next-themes \
  react-hook-form \
  zod \
  @hookform/resolvers \
  axios \
  swr \
  date-fns \
  recharts \
  uuid \
  class-variance-authority \
  clsx \
  tailwind-merge \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-slot \
  @radix-ui/react-dialog \
  @radix-ui/react-tabs \
  @radix-ui/react-tooltip \
  @radix-ui/react-avatar \
  @radix-ui/react-checkbox \
  @radix-ui/react-label \
  @radix-ui/react-select \
  @radix-ui/react-navigation-menu \
  lucide-react

# Install development dependencies
echo "Installing development dependencies..."
npm install --save-dev \
  @tailwindcss/typography \
  @types/uuid \
  eslint-plugin-tailwindcss \
  prettier \
  prettier-plugin-tailwindcss \
  husky \
  lint-staged \
  @storybook/react

# Set up project structure
echo "Creating project directory structure..."
mkdir -p \
  src/components/ui \
  src/components/layout \
  src/components/auth \
  src/components/marketplace \
  src/components/dashboard \
  src/components/common \
  src/hooks \
  src/lib \
  src/services \
  src/types \
  src/utils \
  src/styles \
  src/pages/api

# Copy project documentation files
echo "Copying project documentation..."
cp ../agent-instructions.md .
cp ../implementation-plan.md .
cp ../ManagerAgent.md .
cp ../FrontendAgent.md .
cp ../BackendAgent.md .
cp ../DatabaseAgent.md .
cp ../UXAgent.md .
cp ../DevOpsAgent.md .
cp ../CLAUDE.md .

# Create project README
echo "Creating README.md..."
cat > README.md << 'EOL'
# B2B E-commerce Platform

An advanced B2B e-commerce platform connecting Indian manufacturers and distributors with global buyers. The platform features AI-powered recommendations, comprehensive trust verification systems, and robust international trade capabilities.

## Features

- User authentication and role-based access
- Product catalog with advanced search
- RFQ (Request for Quote) system
- Order management and tracking
- Secure payment processing with escrow
- International shipping and customs documentation
- AI-powered product recommendations
- Trust scoring and verification systems
- Analytics and reporting dashboards
- Multi-currency and multi-language support

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/imashishkh/agentic-b2b-platform.git
   cd agentic-b2b-platform
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

- `npm run build`: Build the production application
- `npm run dev`: Start the development server
- `npm run lint`: Run ESLint
- `npm run typecheck`: Run TypeScript type checking
- `npm run test`: Run tests

## Architecture

The platform follows a modern web application architecture:

- Next.js for server-side rendering and API routes
- TypeScript for type safety and developer experience
- Tailwind CSS for styling
- SWR for data fetching and caching
- PostgreSQL for data storage (via prisma)

## Contributing

1. Create a feature branch: `git checkout -b feature/my-new-feature`
2. Commit your changes: `git commit -m 'Add some feature'`
3. Push to the branch: `git push origin feature/my-new-feature`
4. Submit a pull request

EOL

# Set up ESLint configuration
echo "Configuring ESLint..."
cat > .eslintrc.json << 'EOL'
{
  "extends": [
    "next/core-web-vitals",
    "plugin:tailwindcss/recommended",
    "prettier"
  ],
  "plugins": ["tailwindcss"],
  "rules": {
    "react/no-unescaped-entities": "off",
    "tailwindcss/no-custom-classname": "off"
  }
}
EOL

# Set up Prettier configuration
echo "Configuring Prettier..."
cat > .prettierrc << 'EOL'
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
EOL

# Set up husky and lint-staged
echo "Configuring husky and lint-staged..."
cat > .lintstagedrc.json << 'EOL'
{
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{css,scss,md,json}": ["prettier --write"]
}
EOL

# Set up Git hooks
echo "Setting up Git hooks..."
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"

# Create initial commit
echo "Creating initial commit..."
git add .
git commit -m "Initial project setup" || true

echo "=== Setup Complete ==="
echo "Next steps:"
echo "1. Review the project structure and documentation"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Begin implementing the components in src/components/ui"
echo "4. Follow the implementation plan to build out features"
echo ""
echo "Refer to CLAUDE.md and agent-instructions.md for development guidelines."