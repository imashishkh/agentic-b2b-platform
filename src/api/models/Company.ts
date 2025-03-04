import mongoose, { Schema, Document } from 'mongoose';

// Interface representing a company document in MongoDB
export interface ICompany extends Document {
  name: string;
  companyType: 'manufacturer' | 'distributor' | 'buyer';
  email: string;
  phone?: string;
  website?: string;
  logo?: string;
  description?: string;
  establishedYear?: number;
  employeeCount?: number;
  annualRevenue?: string;
  isVerified: boolean;
  verificationDocuments: string[];
  certifications: {
    name: string;
    issuer: string;
    validUntil: Date;
    documentUrl: string;
  }[];
  exportMarkets: string[];
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
  bankDetails?: {
    bankName: string;
    accountHolder: string;
    accountNumber: string;
    swiftCode: string;
    bankAddress: string;
    isVerified: boolean;
  };
  paymentTerms?: {
    acceptedMethods: string[];
    standardTerms: string;
    customTerms?: string;
  };
  currencies: {
    primary: string;
    accepted: string[];
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for the company model
const CompanySchema: Schema = new Schema(
  {
    name: { 
      type: String, 
      required: true,
      index: true
    },
    companyType: { 
      type: String, 
      required: true, 
      enum: ['manufacturer', 'distributor', 'buyer']
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true 
    },
    phone: { type: String },
    website: { type: String },
    logo: { type: String },
    description: { type: String },
    establishedYear: { type: Number },
    employeeCount: { type: Number },
    annualRevenue: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationDocuments: [{ type: String }],
    certifications: [{
      name: { type: String, required: true },
      issuer: { type: String, required: true },
      validUntil: { type: Date },
      documentUrl: { type: String },
    }],
    exportMarkets: [{ type: String }],
    socialProfiles: [{
      platform: { type: String, required: true },
      url: { type: String, required: true },
    }],
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
    },
    contactInformation: {
      primaryContact: {
        name: { type: String, required: true },
        position: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
      },
      additionalContacts: [{
        name: { type: String, required: true },
        position: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
      }],
    },
    bankDetails: {
      bankName: { type: String },
      accountHolder: { type: String },
      accountNumber: { type: String },
      swiftCode: { type: String },
      bankAddress: { type: String },
      isVerified: { type: Boolean, default: false },
    },
    paymentTerms: {
      acceptedMethods: [{ type: String }],
      standardTerms: { type: String },
      customTerms: { type: String },
    },
    currencies: {
      primary: { type: String, default: 'USD' },
      accepted: [{ type: String }],
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
CompanySchema.index({ name: 'text' });
CompanySchema.index({ companyType: 1 });
CompanySchema.index({ 'location.country': 1 });
CompanySchema.index({ isVerified: 1 });
CompanySchema.index({ isActive: 1 });

// Create and export the model
export default mongoose.model<ICompany>('Company', CompanySchema);