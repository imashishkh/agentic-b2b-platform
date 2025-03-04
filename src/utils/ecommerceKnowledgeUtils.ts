import { KnowledgeResource } from "@/contexts/types";

/**
 * E-commerce specific knowledge utilities
 */

/**
 * Categorize an e-commerce resource based on its content and metadata
 * 
 * @param resource - The resource to categorize
 * @returns E-commerce specific category
 */
export function categorizeEcommerceResource(resource: KnowledgeResource): string {
  const combinedText = `${resource.title} ${resource.content} ${resource.description || ''}`.toLowerCase();
  
  if (combinedText.match(/product|catalog|item|sku|collection|merchandise|goods/i)) {
    return "Product Catalog";
  }
  
  if (combinedText.match(/payment|stripe|paypal|checkout|credit card|apple pay|google pay|transaction|gateway/i)) {
    return "Payment Solutions";
  }
  
  if (combinedText.match(/order|fulfillment|shipping|delivery|logistics|tracking|invoice|receipt/i)) {
    return "Order Management";
  }
  
  if (combinedText.match(/customer|account|profile|wishlist|loyalty|rewards|personalization/i)) {
    return "Customer Experience";
  }
  
  if (combinedText.match(/logistics|warehouse|inventory|shipping|carriers|3pl|supply chain/i)) {
    return "Logistics & Fulfillment";
  }
  
  if (combinedText.match(/security|compliance|pci|dss|gdpr|privacy|data protection|authentication/i)) {
    return "Security & Compliance";
  }
  
  if (combinedText.match(/design pattern|component|architecture|template|best practice|guideline/i)) {
    return "Design Patterns";
  }
  
  if (combinedText.match(/analytics|report|dashboard|metric|kpi|conversion|funnel|tracking/i)) {
    return "Analytics & Reporting";
  }
  
  return "Other";
}

/**
 * Extract product metadata from a resource
 * 
 * @param resource - The resource to extract metadata from
 * @returns Enhanced resource with product metadata
 */
export function extractProductMetadata(resource: KnowledgeResource): KnowledgeResource {
  const combinedText = `${resource.title} ${resource.content} ${resource.description || ''}`.toLowerCase();
  const enhancedResource = { ...resource };
  
  // Determine if resource is product related
  enhancedResource.productRelated = Boolean(
    combinedText.match(/product|item|sku|merchandise|goods/i)
  );
  
  // Extract price point if available
  const priceMatch = combinedText.match(/(budget|affordable|premium|luxury|high-end|low-cost|value)/i);
  if (priceMatch) {
    enhancedResource.pricePoint = priceMatch[0].toLowerCase();
  }
  
  // Extract market segment if available
  if (combinedText.match(/b2b|business-to-business|wholesale|enterprise/i)) {
    enhancedResource.marketSegment = "B2B";
  } else if (combinedText.match(/b2c|business-to-consumer|retail|consumer/i)) {
    enhancedResource.marketSegment = "B2C";
  } else if (combinedText.match(/d2c|direct-to-consumer/i)) {
    enhancedResource.marketSegment = "D2C";
  } else if (combinedText.match(/marketplace|multi-vendor|multi-seller/i)) {
    enhancedResource.marketSegment = "Marketplace";
  }
  
  // Extract catalog type if available
  if (combinedText.match(/physical|tangible/i)) {
    enhancedResource.catalogType = "Physical";
  } else if (combinedText.match(/digital|downloadable|virtual/i)) {
    enhancedResource.catalogType = "Digital";
  } else if (combinedText.match(/subscription|recurring/i)) {
    enhancedResource.catalogType = "Subscription";
  } else if (combinedText.match(/service|booking/i)) {
    enhancedResource.catalogType = "Service";
  }
  
  // Extract payment gateway information
  if (combinedText.match(/stripe/i)) {
    enhancedResource.paymentGateway = "Stripe";
  } else if (combinedText.match(/paypal/i)) {
    enhancedResource.paymentGateway = "PayPal";
  } else if (combinedText.match(/braintree/i)) {
    enhancedResource.paymentGateway = "Braintree";
  } else if (combinedText.match(/adyen/i)) {
    enhancedResource.paymentGateway = "Adyen";
  } else if (combinedText.match(/square/i)) {
    enhancedResource.paymentGateway = "Square";
  } else if (combinedText.match(/authorize\.net/i)) {
    enhancedResource.paymentGateway = "Authorize.net";
  }
  
  // Extract shipping options
  if (combinedText.match(/free shipping/i)) {
    enhancedResource.shippingOption = "Free Shipping";
  } else if (combinedText.match(/standard shipping/i)) {
    enhancedResource.shippingOption = "Standard Shipping";
  } else if (combinedText.match(/express|expedited|overnight/i)) {
    enhancedResource.shippingOption = "Express Shipping";
  } else if (combinedText.match(/international shipping/i)) {
    enhancedResource.shippingOption = "International Shipping";
  } else if (combinedText.match(/local pickup|in-store pickup/i)) {
    enhancedResource.shippingOption = "Local Pickup";
  }
  
  return enhancedResource;
}

/**
 * Generate product recommendations based on a query and existing resources
 * 
 * @param query - The user query to base recommendations on
 * @param resources - The available resources
 * @returns Array of recommended resources with relevance scores
 */
export function generateProductRecommendations(
  query: string, 
  resources: KnowledgeResource[]
): KnowledgeResource[] {
  const queryLower = query.toLowerCase();
  
  return resources
    .filter(resource => resource.productRelated)
    .map(resource => {
      const relevanceScore = calculateProductRelevanceScore(queryLower, resource);
      return {
        ...resource,
        calculatedScore: relevanceScore
      };
    })
    .sort((a, b) => (b.calculatedScore || 0) - (a.calculatedScore || 0))
    .slice(0, 5); // Return top 5 recommendations
}

/**
 * Calculate a product's relevance score for a given query
 * 
 * @param query - The query to calculate relevance for
 * @param resource - The resource to score
 * @returns Relevance score between 0-1
 */
function calculateProductRelevanceScore(query: string, resource: KnowledgeResource): number {
  let score = 0;
  const maxScore = 5;
  
  // Check title match
  if (resource.title.toLowerCase().includes(query)) {
    score += 2;
  }
  
  // Check category match
  if (resource.category?.toLowerCase().includes(query)) {
    score += 1;
  }
  
  // Check content match
  if (resource.content?.toLowerCase().includes(query)) {
    score += 1;
  }
  
  // Check tags match
  if (resource.tags?.some(tag => tag.toLowerCase().includes(query))) {
    score += 1;
  }
  
  // Normalize score to 0-1 range
  return score / maxScore;
}

/**
 * Find related products based on a given product resource
 * 
 * @param product - The product resource to find relations for
 * @param resources - The available resources
 * @returns Array of related product resources
 */
export function findRelatedProducts(
  product: KnowledgeResource,
  resources: KnowledgeResource[]
): KnowledgeResource[] {
  // Don't include the original product in results
  const otherResources = resources.filter(res => res.id !== product.id);
  
  return otherResources
    .filter(resource => resource.productRelated)
    .map(resource => {
      const affinityScore = calculateProductAffinityScore(product, resource);
      return {
        ...resource,
        calculatedScore: affinityScore
      };
    })
    .filter(resource => (resource.calculatedScore || 0) > 0.3) // Only include resources with decent affinity
    .sort((a, b) => (b.calculatedScore || 0) - (a.calculatedScore || 0))
    .slice(0, 3); // Return top 3 related products
}

/**
 * Calculate affinity score between two product resources
 * 
 * @param product1 - First product
 * @param product2 - Second product
 * @returns Affinity score between 0-1
 */
export function calculateProductAffinityScore(
  product1: KnowledgeResource,
  product2: KnowledgeResource
): number {
  let score = 0;
  const maxScore = 5;
  
  // Same category
  if (product1.category === product2.category) {
    score += 1;
  }
  
  // Same price point
  if (product1.pricePoint && product1.pricePoint === product2.pricePoint) {
    score += 1;
  }
  
  // Same market segment
  if (product1.marketSegment && product1.marketSegment === product2.marketSegment) {
    score += 1;
  }
  
  // Same catalog type
  if (product1.catalogType && product1.catalogType === product2.catalogType) {
    score += 1;
  }
  
  // Same payment gateway
  if (product1.paymentGateway && product1.paymentGateway === product2.paymentGateway) {
    score += 0.5;
  }
  
  // Same shipping option
  if (product1.shippingOption && product1.shippingOption === product2.shippingOption) {
    score += 0.5;
  }
  
  // Shared tags
  if (product1.tags && product2.tags) {
    const sharedTags = product1.tags.filter(tag => product2.tags?.includes(tag));
    if (sharedTags.length > 0) {
      score += sharedTags.length > 2 ? 1 : 0.5;
    }
  }
  
  // Normalize score to 0-1 range
  return score / maxScore;
}

/**
 * Generate recommendations based on development stage
 * 
 * @param stage - The current development stage
 * @param resources - Available knowledge resources
 * @returns Recommended resources for the current stage
 */
export function getResourcesByDevelopmentStage(
  stage: string,
  resources: KnowledgeResource[]
): KnowledgeResource[] {
  const stageLower = stage.toLowerCase();
  
  // Define keywords for different development stages
  const stageKeywords: Record<string, string[]> = {
    'planning': ['architecture', 'planning', 'requirements', 'specification', 'design pattern', 'best practice'],
    'design': ['ui', 'ux', 'wireframe', 'mockup', 'prototype', 'figma', 'design system', 'component'],
    'development': ['component', 'implementation', 'code', 'pattern', 'library', 'framework', 'api'],
    'testing': ['test', 'qa', 'quality', 'testing strategy', 'test plan', 'unit test', 'integration test'],
    'deployment': ['deploy', 'ci/cd', 'pipeline', 'infrastructure', 'hosting', 'cloud', 'docker'],
    'maintenance': ['monitor', 'logging', 'debug', 'performance', 'optimization', 'security']
  };
  
  // Determine which stage keywords to use
  const keywords = Object.keys(stageKeywords).find(key => stageLower.includes(key))
    ? stageKeywords[Object.keys(stageKeywords).find(key => stageLower.includes(key)) as string]
    : stageKeywords['planning']; // Default to planning stage
  
  // Calculate relevance scores based on the stage keywords
  const scoredResources = resources.map(resource => {
    const combinedText = `${resource.title} ${resource.content} ${resource.description || ''}`.toLowerCase();
    
    let score = 0;
    keywords.forEach(keyword => {
      if (combinedText.includes(keyword)) {
        score += 1;
      }
    });
    
    // Normalize score
    const normalizedScore = score / keywords.length;
    
    return {
      ...resource,
      calculatedScore: normalizedScore
    };
  });
  
  // Return resources relevant to the stage
  return scoredResources
    .filter(resource => (resource.calculatedScore || 0) > 0.2)
    .sort((a, b) => (b.calculatedScore || 0) - (a.calculatedScore || 0))
    .slice(0, 5);
}

/**
 * Generate documentation template for a component based on its type
 * 
 * @param componentName - Name of the component
 * @param componentType - Type of the component
 * @param description - Optional description
 * @returns Markdown documentation template
 */
export function generateComponentDocTemplate(
  componentName: string,
  componentType: string,
  description?: string
): string {
  const componentTypeLower = componentType.toLowerCase();
  
  // Base template parts
  const header = `# ${componentName}\n\n`;
  const descriptionSection = `## Description\n\n${description || 'A reusable e-commerce component.'}\n\n`;
  const usageSection = `## Usage\n\n\`\`\`tsx\nimport { ${componentName} } from '@/components';\n\nexport default function MyPage() {\n  return (\n    <${componentName} />\n  );\n}\n\`\`\`\n\n`;
  
  // Component-specific sections based on type
  let specificSections = '';
  
  if (componentTypeLower.includes('product')) {
    specificSections = `## Props\n\n| Prop | Type | Description | Default |\n| --- | --- | --- | --- |\n| product | Product | Product object to display | required |\n| variant | 'default' \\| 'compact' \\| 'detailed' | Display variant | 'default' |\n| onAddToCart | (product: Product) => void | Callback when Add to Cart is clicked | undefined |\n| onWishlistToggle | (product: Product) => void | Callback when Wishlist is toggled | undefined |\n\n## Examples\n\n### Default Product Card\n\`\`\`tsx\n<${componentName} product={product} />\n\`\`\`\n\n### Product with Variant\n\`\`\`tsx\n<${componentName} product={product} variant="detailed" />\n\`\`\`\n\n`;
  } else if (componentTypeLower.includes('cart')) {
    specificSections = `## Props\n\n| Prop | Type | Description | Default |\n| --- | --- | --- | --- |\n| items | CartItem[] | Array of cart items | [] |\n| onUpdateQuantity | (id: string, quantity: number) => void | Callback to update item quantity | required |\n| onRemoveItem | (id: string) => void | Callback to remove item | required |\n| showTotals | boolean | Whether to show cart totals | true |\n\n## Examples\n\n### Basic Cart\n\`\`\`tsx\n<${componentName} items={cartItems} onUpdateQuantity={updateQuantity} onRemoveItem={removeItem} />\n\`\`\`\n\n### Cart with Hidden Totals\n\`\`\`tsx\n<${componentName} items={cartItems} onUpdateQuantity={updateQuantity} onRemoveItem={removeItem} showTotals={false} />\n\`\`\`\n\n`;
  } else if (componentTypeLower.includes('checkout')) {
    specificSections = `## Props\n\n| Prop | Type | Description | Default |\n| --- | --- | --- | --- |\n| cart | Cart | Cart object with items | required |\n| shippingOptions | ShippingOption[] | Available shipping options | [] |\n| paymentMethods | PaymentMethod[] | Available payment methods | [] |\n| onSubmit | (orderData: OrderData) => void | Submit order callback | required |\n\n## Examples\n\n### Standard Checkout\n\`\`\`tsx\n<${componentName} cart={cart} shippingOptions={shippingOptions} paymentMethods={paymentMethods} onSubmit={handleOrder} />\n\`\`\`\n\n`;
  } else if (componentTypeLower.includes('payment')) {
    specificSections = `## Props\n\n| Prop | Type | Description | Default |\n| --- | --- | --- | --- |\n| amount | number | Payment amount | required |\n| currency | string | Currency code | 'USD' |\n| providers | string[] | Payment providers to display | ['card', 'paypal'] |\n| onPaymentComplete | (result: PaymentResult) => void | Payment completion callback | required |\n\n## Examples\n\n### Basic Payment Form\n\`\`\`tsx\n<${componentName} amount={99.99} onPaymentComplete={handlePaymentComplete} />\n\`\`\`\n\n### Custom Payment Form\n\`\`\`tsx\n<${componentName} amount={99.99} currency="EUR" providers={['card', 'paypal', 'apple-pay']} onPaymentComplete={handlePaymentComplete} />\n\`\`\`\n\n`;
  } else {
    specificSections = `## Props\n\n| Prop | Type | Description | Default |\n| --- | --- | --- | --- |\n| className | string | Additional CSS classes | '' |\n\n## Examples\n\n### Basic Usage\n\`\`\`tsx\n<${componentName} />\n\`\`\`\n\n### With Custom Class\n\`\`\`tsx\n<${componentName} className="custom-class" />\n\`\`\`\n\n`;
  }
  
  const accessibilitySection = `## Accessibility\n\n- Follows WCAG 2.1 guidelines for accessibility\n- Supports keyboard navigation\n- Includes appropriate ARIA attributes\n- Has adequate color contrast\n\n`;
  
  const bestPracticesSection = `## Best Practices\n\n- Use consistent styling with your design system\n- Provide meaningful feedback for user interactions\n- Ensure responsive behavior on all device sizes\n- Implement error handling for edge cases\n\n`;
  
  // Combine all sections
  return header + descriptionSection + usageSection + specificSections + accessibilitySection + bestPracticesSection;
}

/**
 * Find best practice recommendations based on a specific e-commerce area
 * 
 * @param area - The e-commerce area to find best practices for
 * @param resources - Available knowledge resources
 * @returns Resources with best practices for the specified area
 */
export function findBestPractices(
  area: string,
  resources: KnowledgeResource[]
): KnowledgeResource[] {
  const areaLower = area.toLowerCase();
  
  // Define best practice keywords for different e-commerce areas
  const bestPracticeKeywords: Record<string, string[]> = {
    'product': ['product display', 'product page', 'product catalog', 'product gallery', 'product search', 'product filtering'],
    'cart': ['shopping cart', 'cart page', 'mini cart', 'cart abandonment', 'cart recovery'],
    'checkout': ['checkout process', 'checkout page', 'one-page checkout', 'guest checkout', 'express checkout'],
    'payment': ['payment process', 'payment security', 'payment gateway', 'payment methods', 'credit card', 'digital wallet'],
    'shipping': ['shipping options', 'delivery methods', 'fulfillment', 'tracking', 'returns'],
    'security': ['pci compliance', 'gdpr', 'data protection', 'privacy', 'secure checkout'],
    'performance': ['page speed', 'loading time', 'optimization', 'caching', 'lazy loading'],
    'seo': ['product seo', 'ecommerce seo', 'schema markup', 'rich snippets', 'url structure'],
  };
  
  // Find the best match for the area
  const matchingArea = Object.keys(bestPracticeKeywords).find(key => areaLower.includes(key)) || 'product';
  const keywords = bestPracticeKeywords[matchingArea];
  
  // Filter resources that mention best practices and the specific area
  return resources
    .filter(resource => {
      const combinedText = `${resource.title} ${resource.content} ${resource.description || ''}`.toLowerCase();
      
      // Check if resource mentions best practices
      const hasBestPractices = combinedText.includes('best practice') || 
                              combinedText.includes('guideline') || 
                              combinedText.includes('recommendation');
      
      // Check if resource is related to the specific area
      const isAreaRelevant = keywords.some(keyword => combinedText.includes(keyword));
      
      return hasBestPractices && isAreaRelevant;
    })
    .slice(0, 5);
}

/**
 * Generate sample e-commerce resources to populate knowledge base
 * 
 * @returns Array of sample e-commerce knowledge resources
 */
export function generateSampleEcommerceResources(): KnowledgeResource[] {
  return [
    {
      id: "ec-resource-medusa",
      title: "Medusa - Headless Commerce Platform",
      content: "Medusa is an open-source headless commerce platform designed for JavaScript developers. It provides a modular architecture with plugin system, REST APIs with GraphQL support, PostgreSQL database, and a microservices-friendly design with event-driven architecture. Key features include advanced product management, order management with complex fulfillment flows, inventory tracking across locations, flexible pricing rules, multi-region support, cart functionality with promotions, payment and shipping integrations. It's particularly strong for B2B with company accounts, hierarchical access, custom pricing, quote management, and purchase approval workflows. Its event-driven architecture is ideal for complex B2B workflows, and it offers better extensibility through plugins and service-based design.",
      category: "Design Patterns",
      tags: ["headless commerce", "e-commerce platform", "b2b", "javascript", "typescript", "medusa"],
      description: "An open-source headless commerce platform built with JavaScript/TypeScript, ideal for B2B requirements",
      url: "https://github.com/medusajs/medusa",
      productRelated: false,
      marketSegment: "B2B",
      dateAdded: new Date().toISOString()
    },
    {
      id: "ec-resource-1",
      title: "Product Catalog Best Practices",
      content: "Effective product catalogs should include high-quality images, detailed descriptions, clear pricing, availability indicators, and categorization. Consider using faceted search for large catalogs to help customers find products quickly. Implement customer reviews and ratings to build trust.",
      category: "Product Catalog",
      tags: ["products", "catalog", "best practices", "e-commerce"],
      description: "A comprehensive guide to organizing and displaying product catalogs effectively",
      url: "https://example.com/product-catalog-guide",
      productRelated: true,
      dateAdded: new Date().toISOString()
    },
    {
      id: "ec-resource-2",
      title: "Payment Gateway Integration Guide",
      content: "This guide covers integrating popular payment gateways including Stripe, PayPal, and Braintree. Implement secure checkout flows, handle payment errors gracefully, and ensure PCI compliance. Support multiple payment methods to increase conversion rates.",
      category: "Payment Solutions",
      tags: ["payment", "gateway", "integration", "stripe", "paypal"],
      description: "Step-by-step instructions for integrating payment gateways into e-commerce platforms",
      url: "https://example.com/payment-integration",
      productRelated: false,
      paymentGateway: "Stripe",
      dateAdded: new Date().toISOString()
    },
    {
      id: "ec-resource-3",
      title: "Optimizing Checkout Flow",
      content: "Minimize friction in the checkout process by implementing guest checkout, progress indicators, and address auto-completion. Limit form fields to essential information and provide clear error messages. Offer multiple payment options and transparent shipping costs.",
      category: "Customer Experience",
      tags: ["checkout", "conversion", "ux", "optimization"],
      description: "Strategies to reduce cart abandonment and increase conversion rates",
      url: "https://example.com/checkout-optimization",
      productRelated: false,
      dateAdded: new Date().toISOString()
    },
    {
      id: "ec-resource-4",
      title: "Order Management System Design",
      content: "Learn how to design a robust order management system that handles the complete order lifecycle from placement to fulfillment. Implement status tracking, inventory management, and efficient order processing workflows.",
      category: "Order Management",
      tags: ["orders", "fulfillment", "system design"],
      description: "Architecture and implementation details for e-commerce order management",
      url: "https://example.com/order-management-design",
      productRelated: false,
      dateAdded: new Date().toISOString()
    },
    {
      id: "ec-resource-5",
      title: "B2B E-commerce Platform Components",
      content: "B2B e-commerce platforms require specialized components like bulk ordering, quote systems, company accounts with hierarchical permissions, contract pricing, and reorder functionality. This guide covers essential components and implementation strategies.",
      category: "Product Catalog",
      tags: ["b2b", "wholesale", "components"],
      description: "Component guide for building B2B e-commerce solutions",
      url: "https://example.com/b2b-ecommerce-guide",
      productRelated: true,
      marketSegment: "B2B",
      catalogType: "Physical",
      dateAdded: new Date().toISOString()
    },
    {
      id: "ec-resource-6",
      title: "E-commerce Security Compliance Checklist",
      content: "Essential security measures for e-commerce platforms including PCI DSS compliance, data encryption, secure authentication, XSS protection, CSRF prevention, and privacy policy implementation. Regular security audits and vulnerability testing are recommended.",
      category: "Security & Compliance",
      tags: ["security", "compliance", "pci", "gdpr"],
      description: "Comprehensive checklist for ensuring e-commerce platform security",
      url: "https://example.com/ecommerce-security",
      productRelated: false,
      dateAdded: new Date().toISOString()
    },
    {
      id: "ec-resource-7",
      title: "Digital Product Delivery System",
      content: "Implementation guide for digital product sales including secure file storage, access control, download limitations, license key generation, and automatic delivery workflows. Supports various digital product types including software, ebooks, and media.",
      category: "Product Catalog",
      tags: ["digital products", "delivery", "downloads"],
      description: "Building systems for selling and delivering digital products",
      url: "https://example.com/digital-product-guide",
      productRelated: true,
      catalogType: "Digital",
      dateAdded: new Date().toISOString()
    },
    {
      id: "ec-resource-8",
      title: "Shipping & Fulfillment Integration Patterns",
      content: "Connect your e-commerce platform with shipping carriers and fulfillment services using these integration patterns. Includes real-time rate calculation, label generation, tracking integration, and fulfillment center APIs.",
      category: "Logistics & Fulfillment",
      tags: ["shipping", "fulfillment", "integration", "api"],
      description: "Patterns for integrating shipping and fulfillment services",
      url: "https://example.com/shipping-fulfillment",
      productRelated: false,
      shippingOption: "Standard Shipping",
      dateAdded: new Date().toISOString()
    },
    {
      id: "ec-resource-9",
      title: "E-commerce Analytics & Reporting",
      content: "Implement comprehensive analytics to track key e-commerce metrics including conversion rate, average order value, cart abandonment rate, and customer lifetime value. Build dashboards for real-time monitoring of sales performance.",
      category: "Analytics & Reporting",
      tags: ["analytics", "reporting", "metrics", "dashboards"],
      description: "Setting up analytics and reporting for e-commerce platforms",
      url: "https://example.com/ecommerce-analytics",
      productRelated: false,
      dateAdded: new Date().toISOString()
    },
    {
      id: "ec-resource-10",
      title: "Subscription Commerce Component Library",
      content: "Component library for implementing subscription-based e-commerce including subscription management, recurring billing, plan selection, upgrade/downgrade flows, and cancellation processes.",
      category: "Product Catalog",
      tags: ["subscription", "recurring", "billing", "components"],
      description: "Building blocks for subscription-based e-commerce systems",
      url: "https://example.com/subscription-components",
      productRelated: true,
      catalogType: "Subscription",
      dateAdded: new Date().toISOString()
    },
    {
      id: "ec-resource-medusa-api",
      title: "Medusa API Integration Guide",
      content: "Detailed guide for integrating with Medusa's API endpoints for B2B e-commerce applications. Covers authentication, product management, order processing, customer accounts, cart functionality, and B2B-specific features like company hierarchies, quote requests, and approval workflows. Includes code samples for common operations and best practices for extending the platform.",
      category: "Design Patterns",
      tags: ["headless commerce", "api", "medusa", "integration", "b2b"],
      description: "How to integrate and extend Medusa for B2B e-commerce applications",
      url: "https://docs.medusajs.com/api/admin",
      productRelated: false,
      marketSegment: "B2B",
      dateAdded: new Date().toISOString()
    },
    {
      id: "ec-resource-medusa-module",
      title: "Building Custom Modules with Medusa",
      content: "Step-by-step guide for creating custom modules to extend Medusa's functionality. Explains how to leverage Medusa's plugin architecture and service-based design to add custom business logic, integrations, and B2B capabilities. Includes examples for implementing quote management, approval workflows, and customer-specific pricing, which are essential for B2B e-commerce similar to Alibaba.com.",
      category: "Design Patterns",
      tags: ["medusa", "customization", "modules", "plugins", "b2b"],
      description: "How to extend Medusa with custom modules for B2B requirements",
      url: "https://docs.medusajs.com/development/plugins/create",
      productRelated: false,
      marketSegment: "B2B",
      dateAdded: new Date().toISOString()
    }
  ];
}

/**
 * Generate API integration templates for e-commerce documentation
 * 
 * @param apiType - Type of API integration
 * @returns Documentation template for the API integration
 */
export function generateApiDocTemplate(apiType: string): string {
  const apiTypeLower = apiType.toLowerCase();
  
  // Common header for all API documentation
  const header = `# ${apiType} API Integration\n\n`;
  
  let content = '';
  
  if (apiTypeLower.includes('payment')) {
    content = String.raw`## Overview

This document outlines how to integrate with payment gateways for processing transactions in your e-commerce application.

## Supported Payment Providers

- Stripe
- PayPal
- Braintree
- Square
- Adyen

## Integration Steps

1. **Account Setup**
   - Create an account with your chosen payment provider
   - Generate API keys from the developer dashboard
   - Configure webhook endpoints

2. **Environment Configuration**
   - Store API keys securely in environment variables
   - Configure different keys for development and production

3. **API Implementation**

\`\`\`typescript
// Example Stripe integration
import Stripe from 'stripe';

// Initialize with API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

// Create a payment intent
export async function createPayment(amount: number, currency: string = 'usd') {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    return {
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    };
  } catch (error) {
    console.error('Payment creation failed:', error);
    throw new Error('Payment processing failed');
  }
}
\`\`\`

4. **Frontend Implementation**

\`\`\`tsx
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Load Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'https://example.com/order/confirmation',
      },
    });
    
    if (result.error) {
      console.error(result.error.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe}>Pay Now</button>
    </form>
  );
}

export function PaymentWrapper({ clientSecret }) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  );
}
\`\`\`

## Webhook Handling

\`\`\`typescript
// Example webhook handler for Stripe
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

export async function handleWebhook(req, res) {
  const signature = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await updateOrderStatus(paymentIntent.id, 'paid');
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await updateOrderStatus(failedPayment.id, 'failed');
        break;
      default:
        console.log("Unhandled event type: " + event.type);
    }
    
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(400).send(\`Webhook Error: \${err.message}\`);
  }
}
\`\`\`

## Security Considerations

- Never log or expose API keys
- Validate all payment amounts server-side
- Store payment methods using tokenization
- Implement 3D Secure for regions requiring SCA
- Follow PCI DSS compliance requirements

## Testing

- Use test API keys for development
- Test various payment scenarios including declines
- Simulate webhook events for order status flows
- Verify error handling and user feedback
`;
  } else if (apiTypeLower.includes('product') || apiTypeLower.includes('catalog')) {
    content = String.raw`## Overview

This document outlines how to integrate with product catalog APIs for managing and displaying products in your e-commerce application.

## API Endpoints

### Product Retrieval

\`\`\`typescript
// Get all products with pagination
export async function getProducts(page = 1, limit = 20) {
  const response = await fetch(\`/api/products?page=\${page}&limit=\${limit}\`);
  return response.json();
}

// Get a single product by ID
export async function getProduct(id: string) {
  const response = await fetch(\`/api/products/\${id}\`);
  return response.json();
}

// Search products
export async function searchProducts(query: string) {
  const response = await fetch(\`/api/products/search?q=\${encodeURIComponent(query)}\`);
  return response.json();
}
\`\`\`

### Product Management

\`\`\`typescript
// Create a new product
export async function createProduct(productData: ProductData) {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  return response.json();
}

// Update a product
export async function updateProduct(id: string, productData: Partial<ProductData>) {
  const response = await fetch(\`/api/products/\${id}\`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  return response.json();
}

// Delete a product
export async function deleteProduct(id: string) {
  const response = await fetch(\`/api/products/\${id}\`, {
    method: 'DELETE',
  });
  return response.json();
}
\`\`\`

## Data Models

\`\`\`typescript
export interface ProductData {
  id?: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  inventory: number;
  images: string[];
  categories: string[];
  tags: string[];
  attributes: {
    [key: string]: string;
  };
  variants?: ProductVariant[];
  status: 'draft' | 'active' | 'archived';
  metadata?: Record<string, any>;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  inventory: number;
  attributes: {
    [key: string]: string;
  };
  image?: string;
}
\`\`\`

## Implementation Example

### Product Listing Component

\`\`\`tsx
import { useEffect, useState } from 'react';
import { getProducts } from '../api/products';

export function ProductListing() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await getProducts(page);
        setProducts(data.products);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, [page]);
  
  if (loading) return <div>Loading products...</div>;
  
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      <Pagination 
        currentPage={page}
        onPageChange={setPage}
        totalPages={10} // Get from API response
      />
    </div>
  );
}
\`\`\`

## Caching Strategies

- Implement Redis or in-memory cache for frequently accessed products
- Use stale-while-revalidate pattern for product listings
- Set appropriate cache TTLs based on update frequency
- Invalidate cache on product updates

## Performance Optimization

- Optimize image delivery with responsive images and CDN
- Use pagination and infinite scroll for large catalogs
- Implement server-side filtering and sorting
- Consider GraphQL for complex data requirements with minimal overfetching

## Error Handling

- Provide meaningful error messages to users
- Implement retry logic for transient failures
- Log detailed errors for debugging
- Gracefully degrade UI when API is unavailable
`;
  } else if (apiTypeLower.includes('shipping') || apiTypeLower.includes('fulfillment')) {
    content = String.raw`## Overview

This document outlines how to integrate with shipping and fulfillment APIs for calculating shipping rates, tracking packages, and managing fulfillment in your e-commerce application.

## Supported Shipping Providers

- USPS
- UPS
- FedEx
- DHL
- ShipStation
- ShipBob
- EasyPost

## API Integration

### Rate Calculation

\`\`\`typescript
// Calculate shipping rates
export async function calculateShippingRates(
  destination: Address,
  items: CartItem[],
  serviceTypes?: string[]
) {
  // Calculate package dimensions and weight
  const { weight, dimensions } = calculatePackageSize(items);
  
  const response = await fetch('/api/shipping/rates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      destination,
      weight,
      dimensions,
      serviceTypes,
    }),
  });
  
  return response.json();
}

// Helper function to estimate package size
function calculatePackageSize(items: CartItem[]) {
  let totalWeight = 0;
  
  items.forEach(item => {
    totalWeight += (item.weight || 0) * item.quantity;
  });
  
  // Simple box dimension estimation based on item count
  // In a real implementation, you would use actual product dimensions
  const dimensions = {
    length: 10,
    width: 8,
    height: items.length * 2,
  };
  
  return {
    weight: totalWeight,
    dimensions,
  };
}
\`\`\`

### Shipping Label Generation

\`\`\`typescript
// Generate shipping label
export async function generateShippingLabel(
  orderId: string,
  shippingMethod: string,
  destination: Address,
  returnAddress: Address,
  packages: PackageInfo[]
) {
  const response = await fetch('/api/shipping/labels', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      orderId,
      shippingMethod,
      destination,
      returnAddress,
      packages,
    }),
  });
  
  return response.json();
}
\`\`\`

### Package Tracking

\`\`\`typescript
// Get tracking information
export async function getTrackingInfo(trackingNumber: string, carrier: string) {
  const response = await fetch(\`/api/shipping/tracking?number=\${trackingNumber}&carrier=\${carrier}\`);
  return response.json();
}
\`\`\`

## Data Models

\`\`\`typescript
export interface Address {
  name: string;
  company?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface PackageInfo {
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  items: {
    product_id: string;
    quantity: number;
  }[];
}

export interface ShippingRate {
  id: string;
  carrier: string;
  service: string;
  rate: number;
  currency: string;
  estimated_days: number;
  guaranteed_delivery?: boolean;
}

export interface ShippingLabel {
  id: string;
  tracking_number: string;
  carrier: string;
  service: string;
  label_url: string;
  tracking_url: string;
  created_at: string;
}

export interface TrackingInfo {
  carrier: string;
  tracking_number: string;
  status: string;
  estimated_delivery: string;
  events: TrackingEvent[];
}

export interface TrackingEvent {
  timestamp: string;
  location: string;
  description: string;
  status: string;
}
\`\`\`

## Implementation Example

### Shipping Options Component

\`\`\`tsx
import { useEffect, useState } from 'react';
import { calculateShippingRates } from '../api/shipping';

export function ShippingOptions({ 
  cart, 
  destination, 
  onSelectShipping 
}) {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRate, setSelectedRate] = useState(null);
  
  useEffect(() => {
    async function loadRates() {
      if (!destination.zip) return;
      
      try {
        setLoading(true);
        const data = await calculateShippingRates(
          destination, 
          cart.items
        );
        setRates(data.rates);
        
        // Auto-select cheapest option
        if (data.rates.length > 0) {
          const cheapest = data.rates.reduce((prev, curr) => 
            prev.rate < curr.rate ? prev : curr
          );
          setSelectedRate(cheapest);
          onSelectShipping(cheapest);
        }
      } catch (error) {
        console.error('Failed to load shipping rates:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadRates();
  }, [destination, cart.items]);
  
  if (loading) return <div>Calculating shipping options...</div>;
  
  return (
    <div className="shipping-options">
      <h3>Select Shipping Method</h3>
      {rates.length === 0 ? (
        <p>No shipping options available for this destination</p>
      ) : (
        <div className="options-list">
          {rates.map(rate => (
            <div 
              key={rate.id}
              className={\`option \${selectedRate?.id === rate.id ? 'selected' : ''}\`}
              onClick={() => {
                setSelectedRate(rate);
                onSelectShipping(rate);
              }}
            >
              <div className="carrier">{rate.carrier} - {rate.service}</div>
              <div className="delivery">
                Estimated delivery: {rate.estimated_days} days
              </div>
              <div className="price">\${rate.rate.toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
\`\`\`

## Fulfillment Workflow

1. **Order Received**
   - Validate shipping address
   - Reserve inventory

2. **Payment Confirmed**
   - Generate picking slip
   - Notify fulfillment team

3. **Order Packed**
   - Calculate final package dimensions and weight
   - Generate shipping label
   - Update inventory

4. **Shipment Created**
   - Record tracking information
   - Notify customer with tracking details

5. **Delivery Updates**
   - Poll carrier API for tracking updates
   - Send notifications for major status changes

## Best Practices

- Offer multiple shipping options at different price points
- Provide accurate delivery time estimates
- Consider free shipping thresholds to increase AOV
- Implement address validation to reduce delivery issues
- Include tracking information in order confirmation emails
- Support international shipping with customs documentation
`;
  } else {
    // Default generic API docs
    content = String.raw`## Overview

This document outlines how to integrate with e-commerce APIs in your application.

## Authentication

All API requests require authentication using API keys or OAuth tokens.

\`\`\`typescript
// Example API client setup
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.example.com/v1',
  headers: {
    'Authorization': \`Bearer \${process.env.API_KEY}\`,
    'Content-Type': 'application/json'
  }
});

// Example API request
export async function fetchData(endpoint: string, params = {}) {
  try {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    throw new Error('Failed to fetch data');
  }
}
\`\`\`

## Error Handling

The API returns standard HTTP status codes and error messages in the following format:

\`\`\`json
{
  "error": {
    "code": "invalid_request",
    "message": "The request was invalid",
    "details": [
      "Parameter 'id' is required"
    ]
  }
}
\`\`\`

Implement robust error handling in your applications:

\`\`\`typescript
try {
  const data = await apiClient.post('/orders', orderData);
  // Process successful response
} catch (error) {
  if (error.response) {
    // The request was made and the server responded with an error status
    console.error('Error response:', error.response.data);
    
    // Handle specific error codes
    switch (error.response.status) {
      case 400:
        // Handle validation errors
        break;
      case 401:
        // Handle authentication errors
        break;
      case 403:
        // Handle permission errors
        break;
      case 404:
        // Handle not found errors
        break;
      case 429:
        // Handle rate limiting
        break;
      case 500:
        // Handle server errors
        break;
      default:
        // Handle other errors
    }
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
  } else {
    // Something happened in setting up the request
    console.error('Request error:', error.message);
  }
}
\`\`\`

## Rate Limiting

The API enforces rate limits to ensure fair usage. Current limits are:

- 100 requests per minute per API key
- 5,000 requests per day per API key

When you exceed the rate limit, the API will respond with a 429 Too Many Requests status code.

## Pagination

For endpoints that return lists of items, pagination is supported using the following parameters:

- \`page\`: Page number (starts at 1)
- \`limit\`: Number of items per page (default 20, max 100)

Response includes pagination metadata:

\`\`\`json
{
  "data": [...],
  "pagination": {
    "total": 547,
    "pages": 28,
    "current_page": 2,
    "per_page": 20,
    "next_page": 3,
    "prev_page": 1
  }
}
\`\`\`

## Webhooks

Subscribe to events using webhooks to receive real-time notifications:

1. Create a webhook endpoint in your application
2. Register the endpoint in the API dashboard
3. Implement signature verification for security

\`\`\`typescript
// Example webhook handler
export async function handleWebhook(req, res) {
  const signature = req.headers['x-signature'];
  
  // Verify the signature
  if (!verifySignature(req.body, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  const event = req.body;
  
  // Handle different event types
  switch (event.type) {
    case 'order.created':
      await processNewOrder(event.data);
      break;
    case 'order.updated':
      await updateOrderStatus(event.data);
      break;
    // Handle other event types
    default:
      console.log("Unhandled event type: " + event.type);
  }
  
  // Acknowledge receipt of the webhook
  res.status(200).send('Webhook received');
}

// Verify webhook signature
function verifySignature(payload, signature, secret) {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(JSON.stringify(payload)).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(digest),
    Buffer.from(signature)
  );
}
\`\`\`

## Best Practices

- Store API keys securely in environment variables
- Implement retry logic with exponential backoff for failed requests
- Cache frequently accessed data to reduce API calls
- Handle webhook events idempotently to prevent duplicate processing
- Use appropriate error handling and logging
- Consider using a typed API client for better development experience
`;
  }
  
  return header + content;
}