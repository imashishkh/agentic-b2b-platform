
import { toast } from "sonner";

// Types for GitHub operations
export interface GitHubAuth {
  token: string;
}

export interface GitHubRepo {
  id: string;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  default_branch: string;
  owner: {
    login: string;
  };
  created_at: string;
  updated_at: string;
  private: boolean;
}

export interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  html_url: string;
  author: {
    name: string;
    date: string;
  };
}

export interface GitHubPR {
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: string;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
  };
}

export interface WorkflowFile {
  name: string;
  content: string;
}

export interface GitHubError {
  message: string;
  documentation_url?: string;
}

class GitHubService {
  private token: string | null = null;
  private baseUrl = 'https://api.github.com';
  
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('github_token', token);
    return this.validateToken();
  }
  
  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('github_token');
    }
    return this.token;
  }
  
  clearToken() {
    this.token = null;
    localStorage.removeItem('github_token');
  }
  
  async validateToken(): Promise<boolean> {
    try {
      const response = await this.fetchAPI('/user');
      return response.status === 200;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
  
  private async fetchAPI(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getToken();
    
    if (!token) {
      throw new Error('GitHub token not set');
    }
    
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      const errorData = await response.json() as GitHubError;
      throw new Error(errorData.message || `GitHub API error: ${response.status}`);
    }
    
    return response;
  }
  
  async getCurrentUser() {
    const response = await this.fetchAPI('/user');
    return await response.json();
  }
  
  async listRepositories(page = 1, perPage = 10): Promise<GitHubRepo[]> {
    const response = await this.fetchAPI(`/user/repos?page=${page}&per_page=${perPage}&sort=updated`);
    return await response.json();
  }
  
  async getRepository(owner: string, repo: string): Promise<GitHubRepo> {
    const response = await this.fetchAPI(`/repos/${owner}/${repo}`);
    return await response.json();
  }
  
  async createRepository(name: string, description: string, isPrivate = false): Promise<GitHubRepo> {
    const response = await this.fetchAPI('/user/repos', {
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        private: isPrivate,
        auto_init: true
      })
    });
    
    return await response.json();
  }
  
  async listBranches(owner: string, repo: string): Promise<GitHubBranch[]> {
    const response = await this.fetchAPI(`/repos/${owner}/${repo}/branches`);
    return await response.json();
  }
  
  async createBranch(owner: string, repo: string, branchName: string, fromBranch: string): Promise<GitHubBranch> {
    // Get the SHA of the latest commit on the source branch
    const sourceBranchData = await this.fetchAPI(`/repos/${owner}/${repo}/branches/${fromBranch}`);
    const sourceBranch = await sourceBranchData.json();
    const sha = sourceBranch.commit.sha;
    
    // Create a new reference (branch)
    const response = await this.fetchAPI(`/repos/${owner}/${repo}/git/refs`, {
      method: 'POST',
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha
      })
    });
    
    // Return branch info
    return this.getBranch(owner, repo, branchName);
  }
  
  async getBranch(owner: string, repo: string, branch: string): Promise<GitHubBranch> {
    const response = await this.fetchAPI(`/repos/${owner}/${repo}/branches/${branch}`);
    return await response.json();
  }
  
  async listCommits(owner: string, repo: string, branch: string): Promise<GitHubCommit[]> {
    const response = await this.fetchAPI(`/repos/${owner}/${repo}/commits?sha=${branch}`);
    return await response.json();
  }
  
  async createPullRequest(owner: string, repo: string, title: string, head: string, base: string, body: string): Promise<GitHubPR> {
    const response = await this.fetchAPI(`/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        head,
        base,
        body
      })
    });
    
    return await response.json();
  }
  
  async listPullRequests(owner: string, repo: string, state = 'open'): Promise<GitHubPR[]> {
    const response = await this.fetchAPI(`/repos/${owner}/${repo}/pulls?state=${state}`);
    return await response.json();
  }
  
  async setupCiCdWorkflow(owner: string, repo: string, workflowFiles: WorkflowFile[]): Promise<boolean> {
    try {
      // Create .github/workflows directory if it doesn't exist
      for (const file of workflowFiles) {
        await this.createOrUpdateFile(
          owner,
          repo,
          `.github/workflows/${file.name}`,
          `Add CI/CD workflow: ${file.name}`,
          file.content
        );
      }
      return true;
    } catch (error) {
      console.error('Error setting up CI/CD workflow:', error);
      return false;
    }
  }
  
  // Create an e-commerce repository with starter files
  async createEcommerceRepository(
    name: string, 
    description: string, 
    type: 'ecommerce-react' | 'ecommerce-api',
    isPrivate = true
  ): Promise<GitHubRepo> {
    try {
      // Create the repository
      console.log(`Creating ${type} repository: ${name}`);
      const repo = await this.createRepository(name, description, isPrivate);
      const owner = (await this.getCurrentUser()).login;
      
      // Add template files based on type
      if (type === 'ecommerce-react') {
        await this.populateEcommerceReactRepo(owner, name);
      } else if (type === 'ecommerce-api') {
        await this.populateEcommerceApiRepo(owner, name);
      }
      
      // Set up CI/CD workflow
      const workflowType = type === 'ecommerce-react' ? 'react' : 'node';
      const workflowFiles = this.generateWorkflowFiles(workflowType);
      await this.setupCiCdWorkflow(owner, name, workflowFiles);
      
      toast.success(`Created ${type} repository: ${name}`);
      return repo;
    } catch (error) {
      console.error('Error creating e-commerce repository:', error);
      if (error instanceof Error) {
        toast.error(`Failed to create repository: ${error.message}`);
      } else {
        toast.error('Failed to create repository');
      }
      throw error;
    }
  }
  
  // Populate a React e-commerce repository with template files
  private async populateEcommerceReactRepo(owner: string, repo: string): Promise<void> {
    try {
      // Add README
      await this.createOrUpdateFile(
        owner,
        repo,
        'README.md',
        'Add README',
        `# E-commerce React Application\n\nA full-featured e-commerce application built with React, Tailwind CSS, and Stripe integration.\n\n## Features\n\n- Product catalog\n- Shopping cart\n- User authentication\n- Checkout process\n- Payment processing\n- Order management\n\n## Getting Started\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\``
      );
      
      // Add template files
      for (const [path, content] of Object.entries(ecommerceFileTemplates.react)) {
        await this.createOrUpdateFile(
          owner,
          repo,
          path,
          `Add ${path}`,
          content
        );
      }
    } catch (error) {
      console.error('Error populating e-commerce React repository:', error);
      throw error;
    }
  }
  
  // Populate a Node.js API e-commerce repository with template files
  private async populateEcommerceApiRepo(owner: string, repo: string): Promise<void> {
    try {
      // Add README
      await this.createOrUpdateFile(
        owner,
        repo,
        'README.md',
        'Add README',
        `# E-commerce API\n\nA full-featured e-commerce API built with Node.js, Express, and MongoDB.\n\n## Features\n\n- Product management\n- User authentication and authorization\n- Shopping cart functionality\n- Order processing\n- Payment integration\n\n## Getting Started\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\``
      );
      
      // Add template files
      for (const [path, content] of Object.entries(ecommerceFileTemplates.node)) {
        await this.createOrUpdateFile(
          owner,
          repo,
          path,
          `Add ${path}`,
          content
        );
      }
    } catch (error) {
      console.error('Error populating e-commerce API repository:', error);
      throw error;
    }
  }
  
  // Add a generated code file to a repository
  async addGeneratedCode(
    owner: string, 
    repo: string, 
    filePath: string, 
    code: string, 
    commitMessage: string,
    branch = 'main'
  ): Promise<boolean> {
    try {
      await this.createOrUpdateFile(
        owner,
        repo,
        filePath,
        commitMessage,
        code
      );
      toast.success(`Added ${filePath} to ${owner}/${repo}`);
      return true;
    } catch (error) {
      console.error('Error adding generated code:', error);
      if (error instanceof Error) {
        toast.error(`Failed to add code: ${error.message}`);
      } else {
        toast.error('Failed to add code');
      }
      return false;
    }
  }
  
  async createOrUpdateFile(owner: string, repo: string, path: string, message: string, content: string): Promise<any> {
    // Check if file already exists
    let sha = '';
    try {
      const existingFile = await this.fetchAPI(`/repos/${owner}/${repo}/contents/${path}`);
      const fileData = await existingFile.json();
      sha = fileData.sha;
    } catch (error) {
      // File doesn't exist, that's fine
    }
    
    // Create or update the file
    const response = await this.fetchAPI(`/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: btoa(content), // Base64 encode the content
        sha: sha || undefined
      })
    });
    
    return await response.json();
  }
  
  // Helper to generate CI/CD workflow files for common use cases
  generateWorkflowFiles(type: 'react' | 'node' | 'static'): WorkflowFile[] {
    const files: WorkflowFile[] = [];
    
    if (type === 'react') {
      files.push({
        name: 'react-ci.yml',
        content: `
name: React CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install Dependencies
      run: npm ci
    
    - name: Check Linting
      run: npm run lint || true
    
    - name: Build
      run: npm run build
    
    - name: Test
      run: npm test || true
    
    - name: Upload Build Artifact
      if: github.event_name == 'push' && github.ref == 'refs/heads/main'
      uses: actions/upload-artifact@v3
      with:
        name: build
        path: dist/
`.trim()
      });
    } else if (type === 'node') {
      files.push({
        name: 'node-ci.yml',
        content: `
name: Node.js CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install Dependencies
      run: npm ci
    
    - name: Lint
      run: npm run lint || true
    
    - name: Test
      run: npm test || true
`.trim()
      });
    } else if (type === 'static') {
      files.push({
        name: 'static-deploy.yml',
        content: `
name: Deploy Static Website

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install Dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to GitHub Pages
      uses: JamesIves/github-pages-deploy-action@v4
      with:
        folder: dist
`.trim()
      });
    }
    
    return files;
  }
}

export const githubService = new GitHubService();

// Repository templates for quick start
export const repositoryTemplates = [
  {
    id: 'react-app',
    name: 'React Application',
    description: 'Basic React application with GitHub Actions CI/CD',
    workflowType: 'react',
    branchStrategy: [
      { name: 'main', description: 'Production branch' },
      { name: 'develop', description: 'Development branch' },
      { name: 'feature/*', description: 'Feature branches' }
    ]
  },
  {
    id: 'node-api',
    name: 'Node.js API',
    description: 'Node.js API with testing and deployment workflows',
    workflowType: 'node',
    branchStrategy: [
      { name: 'main', description: 'Production branch' },
      { name: 'develop', description: 'Development branch' },
      { name: 'feature/*', description: 'Feature branches' }
    ]
  },
  {
    id: 'static-site',
    name: 'Static Website',
    description: 'Static website with GitHub Pages deployment',
    workflowType: 'static',
    branchStrategy: [
      { name: 'main', description: 'Production branch' },
      { name: 'content', description: 'Content updates' }
    ]
  },
  {
    id: 'ecommerce-react',
    name: 'E-commerce React Application',
    description: 'Full e-commerce application with React, Tailwind CSS, and Stripe integration',
    workflowType: 'react',
    branchStrategy: [
      { name: 'main', description: 'Production branch' },
      { name: 'develop', description: 'Development branch' },
      { name: 'feature/*', description: 'Feature branches' }
    ]
  },
  {
    id: 'ecommerce-api',
    name: 'E-commerce API',
    description: 'Backend API for e-commerce with product, cart, and payment endpoints',
    workflowType: 'node',
    branchStrategy: [
      { name: 'main', description: 'Production branch' },
      { name: 'develop', description: 'Development branch' },
      { name: 'feature/*', description: 'Feature branches' }
    ]
  }
];

// E-commerce specific file templates
export const ecommerceFileTemplates = {
  // React frontend templates
  react: {
    'src/components/products/ProductCard.tsx': `
import React from 'react';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-medium text-lg">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-2">{product.description}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="font-bold">\${product.price.toFixed(2)}</span>
          <button 
            onClick={() => addToCart(product)} 
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
    `,
    'src/hooks/useCart.ts': `
import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity?: number;
}

interface CartItem extends Product {
  quantity: number;
}

export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  const addToCart = (product: Product, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, { ...product, quantity }];
    });
  };
  
  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => {
    setItems([]);
  };
  
  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };
  
  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount
  };
};
    `
  },
  
  // Node.js backend templates
  node: {
    'models/Product.js': `
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price must be positive']
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  stock: {
    type: Number,
    required: [true, 'Product stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  images: [String],
  ratings: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
    `,
    'routes/productRoutes.js': `
const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), createProduct);

router.route('/featured')
  .get(getFeaturedProducts);

router.route('/:id')
  .get(getProductById)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;
    `
  },
  
  // Database schemas
  database: {
    'postgresql': `
-- Products Table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  parent_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  role VARCHAR(20) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  shipping_address TEXT,
  billing_address TEXT,
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
    `,
    'mongodb': `
// Product Schema
db.createCollection('products', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'price', 'category'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'Product name - required'
        },
        description: {
          bsonType: 'string',
          description: 'Product description'
        },
        price: {
          bsonType: 'number',
          minimum: 0,
          description: 'Product price - required and must be positive'
        },
        category: {
          bsonType: 'objectId',
          description: 'Category ID - required'
        },
        images: {
          bsonType: 'array',
          items: {
            bsonType: 'string'
          }
        },
        stock: {
          bsonType: 'int',
          minimum: 0,
          description: 'Product stock quantity'
        },
        variants: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            required: ['name', 'options'],
            properties: {
              name: {
                bsonType: 'string'
              },
              options: {
                bsonType: 'array',
                items: {
                  bsonType: 'string'
                }
              }
            }
          }
        },
        createdAt: {
          bsonType: 'date'
        }
      }
    }
  }
});

// Create indexes
db.products.createIndex({ name: 1 });
db.products.createIndex({ category: 1 });
db.products.createIndex({ price: 1 });
db.products.createIndex({ "variants.name": 1 });

// Orders collection
db.createCollection('orders', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['user', 'items', 'total', 'status'],
      properties: {
        user: {
          bsonType: 'objectId'
        },
        items: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            required: ['product', 'quantity', 'price'],
            properties: {
              product: {
                bsonType: 'objectId'
              },
              name: {
                bsonType: 'string'
              },
              quantity: {
                bsonType: 'int',
                minimum: 1
              },
              price: {
                bsonType: 'number',
                minimum: 0
              }
            }
          }
        },
        total: {
          bsonType: 'number',
          minimum: 0
        },
        status: {
          bsonType: 'string',
          enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
        },
        shippingAddress: {
          bsonType: 'object',
          required: ['street', 'city', 'state', 'zip', 'country'],
          properties: {
            street: { bsonType: 'string' },
            city: { bsonType: 'string' },
            state: { bsonType: 'string' },
            zip: { bsonType: 'string' },
            country: { bsonType: 'string' }
          }
        },
        createdAt: {
          bsonType: 'date'
        }
      }
    }
  }
});

// Create indexes for orders
db.orders.createIndex({ user: 1 });
db.orders.createIndex({ "items.product": 1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ createdAt: 1 });
    `
  }
};
