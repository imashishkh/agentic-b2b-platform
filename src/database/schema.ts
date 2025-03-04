/**
 * Database Schema Definition for B2B E-commerce Platform
 * 
 * This file defines the database schema for the B2B e-commerce platform
 * connecting Indian manufacturers with global buyers.
 */

export interface DBUser {
  id: string;
  email: string;
  companyName: string;
  companyType: 'manufacturer' | 'distributor' | 'buyer';
  country: string;
  verified: boolean;
  verificationDocuments: string[]; // URLs to verification documents
  createdAt: Date;
  updatedAt: Date;
}

export interface DBCompanyProfile {
  id: string;
  userId: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  establishedYear: number;
  employeeCount: number;
  annualRevenue: string;
  certifications: {
    name: string;
    issuer: string;
    validUntil: Date;
    documentUrl: string;
  }[];
  exportMarkets: string[]; // List of countries
  socialProfiles: {
    platform: string;
    url: string;
  }[];
  location: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  contactInformation: {
    primaryContact: {
      name: string;
      position: string;
      email: string;
      phone: string;
    };
    additionalContacts: {
      name: string;
      position: string;
      email: string;
      phone: string;
    }[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface DBProduct {
  id: string;
  manufacturerId: string;
  name: string;
  description: string;
  detailedDescription: string;
  price: {
    amount: number;
    currency: string;
    priceModel: 'fixed' | 'range' | 'negotiable';
    minPrice?: number;
    maxPrice?: number;
  };
  category: string;
  subCategory: string;
  images: string[];
  specifications: Record<string, string>;
  certifications: {
    name: string;
    issuer: string;
    documentUrl: string;
  }[];
  customizationOptions: {
    name: string;
    options: string[];
    hasAdditionalCost: boolean;
  }[];
  inventory: {
    available: number;
    minimumOrderQuantity: number;
    maximumOrderQuantity?: number;
    leadTime: {
      min: number;
      max: number;
      unit: 'days' | 'weeks' | 'months';
    };
  };
  shipping: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
      unit: 'cm' | 'inch';
    };
    shippingOptions: {
      method: string;
      locations: string[];
      estimatedDelivery: {
        min: number;
        max: number;
        unit: 'days' | 'weeks';
      };
    }[];
  };
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface DBInquiry {
  id: string;
  buyerId: string;
  items: {
    productId: string;
    quantity: number;
    customizations?: Record<string, string>;
  }[];
  message: string;
  status: 'pending' | 'responded' | 'negotiating' | 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface DBQuote {
  id: string;
  inquiryId: string;
  manufacturerId: string;
  buyerId: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    customizations?: Record<string, string>;
  }[];
  subtotal: number;
  taxes: number;
  shippingCost: number;
  totalAmount: number;
  currency: string;
  validUntil: Date;
  paymentTerms: string;
  shippingTerms: string;
  additionalTerms: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted';
  createdAt: Date;
  updatedAt: Date;
}

export interface DBOrder {
  id: string;
  quoteId?: string;
  buyerId: string;
  sellerId: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    customizations?: Record<string, string>;
  }[];
  pricing: {
    subtotal: number;
    taxes: number;
    shippingCost: number;
    otherFees: number;
    discount: number;
    totalAmount: number;
    currency: string;
  };
  paymentDetails: {
    method: string;
    status: 'pending' | 'partial' | 'complete' | 'refunded';
    transactions: {
      id: string;
      amount: number;
      currency: string;
      date: Date;
      status: 'pending' | 'completed' | 'failed' | 'refunded';
    }[];
  };
  fulfillment: {
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingMethod: string;
    trackingNumber?: string;
    trackingUrl?: string;
    estimatedDelivery?: Date;
    actualDelivery?: Date;
    shippingAddress: {
      name: string;
      company: string;
      address: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phone: string;
    };
  };
  documents: {
    type: 'invoice' | 'packingSlip' | 'customsDeclaration' | 'other';
    url: string;
    createdAt: Date;
  }[];
  notes: {
    content: string;
    createdBy: string;
    createdAt: Date;
    isPrivate: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DBMessage {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  attachments: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  readAt?: Date;
  createdAt: Date;
}

export interface DBConversation {
  id: string;
  participants: string[];
  relatedEntityType?: 'inquiry' | 'quote' | 'order';
  relatedEntityId?: string;
  lastMessageAt: Date;
  createdAt: Date;
}

// For handling the multi-currency support
export interface DBExchangeRate {
  id: string;
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  updatedAt: Date;
}

// For tracking international compliance and trade regulations
export interface DBTradeCompliance {
  id: string;
  countryPair: string[]; // [originCountry, destinationCountry]
  productCategory: string;
  requiredDocuments: string[];
  restrictions: string[];
  tariffCodes: {
    code: string;
    description: string;
    rate: number;
  }[];
  updatedAt: Date;
}

// For storing reviews and ratings
export interface DBReview {
  id: string;
  reviewerId: string;
  entityType: 'product' | 'company';
  entityId: string;
  rating: number;
  content: string;
  images?: string[];
  verifiedPurchase: boolean;
  createdAt: Date;
  updatedAt: Date;
}