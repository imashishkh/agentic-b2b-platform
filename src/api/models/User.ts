import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

// Interface representing a user document in MongoDB
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyId: mongoose.Types.ObjectId;
  role: 'admin' | 'manager' | 'buyer' | 'viewer';
  isActive: boolean;
  lastLogin?: Date;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  preferences: {
    language: string;
    currency: string;
    notifications: {
      email: boolean;
      inApp: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Schema for the user model
const UserSchema: Schema = new Schema(
  {
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true,
      index: true 
    },
    password: { 
      type: String, 
      required: true,
      minlength: 8,
      select: false // Don't return password by default in queries
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    companyId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Company', 
      required: true,
      index: true
    },
    role: { 
      type: String, 
      required: true, 
      enum: ['admin', 'manager', 'buyer', 'viewer'],
      default: 'buyer' 
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Date },
    preferences: {
      language: { type: String, default: 'en' },
      currency: { type: String, default: 'USD' },
      notifications: {
        email: { type: Boolean, default: true },
        inApp: { type: Boolean, default: true },
      }
    }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        delete ret.verificationToken;
        delete ret.verificationTokenExpiry;
        delete ret.resetPasswordToken;
        delete ret.resetPasswordExpiry;
        return ret;
      }
    } 
  }
);

// Hash password before saving to database
UserSchema.pre<IUser>('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    // Use bcrypt to compare the provided password with the stored hash
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Indexes for efficient queries
UserSchema.index({ email: 1 });
UserSchema.index({ companyId: 1, role: 1 });
UserSchema.index({ isActive: 1 });

// Create and export the model
export default mongoose.model<IUser>('User', UserSchema);