import mongoose, { Schema, Document } from 'mongoose';

// Interface representing a product document in MongoDB
export interface IProduct extends Document {
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
  manufacturerId: mongoose.Types.ObjectId;
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
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for the product model
const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String, required: true },
    detailedDescription: { type: String, required: true },
    price: {
      amount: { type: Number, required: true },
      currency: { type: String, required: true, default: 'USD' },
      priceModel: { 
        type: String, 
        required: true, 
        enum: ['fixed', 'range', 'negotiable'],
        default: 'fixed'
      },
      minPrice: { type: Number },
      maxPrice: { type: Number },
    },
    manufacturerId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Company', 
      required: true,
      index: true
    },
    category: { type: String, required: true, index: true },
    subCategory: { type: String, required: true, index: true },
    images: [{ type: String }],
    specifications: { type: Map, of: String },
    certifications: [{
      name: { type: String, required: true },
      issuer: { type: String, required: true },
      documentUrl: { type: String },
    }],
    customizationOptions: [{
      name: { type: String, required: true },
      options: [{ type: String }],
      hasAdditionalCost: { type: Boolean, default: false },
    }],
    inventory: {
      available: { type: Number, required: true, default: 0 },
      minimumOrderQuantity: { type: Number, required: true, default: 1 },
      maximumOrderQuantity: { type: Number },
      leadTime: {
        min: { type: Number, required: true },
        max: { type: Number, required: true },
        unit: { 
          type: String, 
          required: true, 
          enum: ['days', 'weeks', 'months'],
          default: 'days'
        },
      },
    },
    shipping: {
      weight: { type: Number, required: true },
      dimensions: {
        length: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        unit: { 
          type: String, 
          required: true, 
          enum: ['cm', 'inch'],
          default: 'cm'
        },
      },
      shippingOptions: [{
        method: { type: String, required: true },
        locations: [{ type: String }],
        estimatedDelivery: {
          min: { type: Number, required: true },
          max: { type: Number, required: true },
          unit: { 
            type: String, 
            required: true, 
            enum: ['days', 'weeks'],
            default: 'days'
          },
        },
      }],
    },
    isActive: { type: Boolean, default: true },
  },
  { 
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes for efficient queries
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, subCategory: 1 });
ProductSchema.index({ 'price.amount': 1 });
ProductSchema.index({ isActive: 1 });

// Create and export the model
export default mongoose.model<IProduct>('Product', ProductSchema);