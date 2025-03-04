import mongoose, { Schema, Document } from 'mongoose';

// Interface representing an order document in MongoDB
export interface IOrder extends Document {
  buyerId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  quoteId?: mongoose.Types.ObjectId;
  orderNumber: string;
  items: {
    productId: mongoose.Types.ObjectId;
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
  status: 'draft' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
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
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    isPrivate: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

// Schema for the order model
const OrderSchema: Schema = new Schema(
  {
    buyerId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Company', 
      required: true,
      index: true
    },
    sellerId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Company', 
      required: true,
      index: true
    },
    quoteId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Quote'
    },
    orderNumber: { 
      type: String, 
      required: true, 
      unique: true,
      index: true
    },
    items: [{
      productId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
      },
      name: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      unitPrice: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
      customizations: { type: Map, of: String },
    }],
    pricing: {
      subtotal: { type: Number, required: true },
      taxes: { type: Number, required: true, default: 0 },
      shippingCost: { type: Number, required: true, default: 0 },
      otherFees: { type: Number, required: true, default: 0 },
      discount: { type: Number, required: true, default: 0 },
      totalAmount: { type: Number, required: true },
      currency: { type: String, required: true, default: 'USD' },
    },
    status: { 
      type: String, 
      required: true,
      enum: ['draft', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'draft',
      index: true
    },
    paymentDetails: {
      method: { type: String, required: true },
      status: { 
        type: String, 
        required: true,
        enum: ['pending', 'partial', 'complete', 'refunded'],
        default: 'pending'
      },
      transactions: [{
        id: { type: String, required: true },
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
        date: { type: Date, required: true },
        status: { 
          type: String, 
          required: true,
          enum: ['pending', 'completed', 'failed', 'refunded']
        },
      }],
    },
    fulfillment: {
      status: { 
        type: String, 
        required: true,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
      },
      shippingMethod: { type: String, required: true },
      trackingNumber: { type: String },
      trackingUrl: { type: String },
      estimatedDelivery: { type: Date },
      actualDelivery: { type: Date },
      shippingAddress: {
        name: { type: String, required: true },
        company: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true },
      },
    },
    documents: [{
      type: { 
        type: String, 
        required: true,
        enum: ['invoice', 'packingSlip', 'customsDeclaration', 'other']
      },
      url: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    }],
    notes: [{
      content: { type: String, required: true },
      createdBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
      },
      createdAt: { type: Date, default: Date.now },
      isPrivate: { type: Boolean, default: false },
    }],
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

// Generate a unique order number before saving
OrderSchema.pre<IOrder>('save', async function(next) {
  // Only generate a number if this is a new order
  if (this.isNew) {
    // Get current date components
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    // Find the highest order number for this month
    const lastOrder = await this.constructor.findOne({
      orderNumber: new RegExp(`^ORD-${year}${month}`)
    }).sort('-orderNumber');
    
    let sequence = 1;
    if (lastOrder) {
      // Extract the sequence number from the last order number
      const lastSequence = parseInt(lastOrder.orderNumber.split('-')[2]);
      if (!isNaN(lastSequence)) {
        sequence = lastSequence + 1;
      }
    }
    
    // Format the order number
    this.orderNumber = `ORD-${year}${month}-${sequence.toString().padStart(4, '0')}`;
  }
  next();
});

// Indexes for efficient queries
OrderSchema.index({ buyerId: 1, status: 1 });
OrderSchema.index({ sellerId: 1, status: 1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ 'fulfillment.status': 1 });
OrderSchema.index({ 'paymentDetails.status': 1 });

// Create and export the model
export default mongoose.model<IOrder>('Order', OrderSchema);