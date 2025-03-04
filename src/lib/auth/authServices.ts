import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import User, { IUser } from '../../api/models/User';
import Company from '../../api/models/Company';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Should be in env variables
const JWT_EXPIRES_IN = '7d';
const RESET_TOKEN_EXPIRES = 3600000; // 1 hour

// Email Configuration
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@b2bplatform.com';
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.example.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_USER = process.env.EMAIL_USER || 'user';
const EMAIL_PASS = process.env.EMAIL_PASS || 'password';

// Interface for JWT payload
interface JwtPayload {
  id: string;
  email: string;
  role: string;
  companyId: string;
}

// Create email transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Register a new user
export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  companyId: string,
  role: 'admin' | 'manager' | 'buyer' | 'viewer'
): Promise<{ user: IUser; token: string }> => {
  try {
    // Check if company exists
    const company = await Company.findById(companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + RESET_TOKEN_EXPIRES);

    // Create new user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      companyId,
      role,
      verificationToken,
      verificationTokenExpiry,
      isVerified: false,
    });

    // Send verification email
    await sendVerificationEmail(user.email, verificationToken);

    // Generate JWT token
    const token = generateToken(user);

    return { user, token };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Login user
export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: IUser; token: string }> => {
  try {
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    return { user, token };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Verify user email
export const verifyEmail = async (token: string): Promise<boolean> => {
  try {
    // Find user by verification token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    // Update user verification status
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Request password reset
export const requestPasswordReset = async (email: string): Promise<boolean> => {
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if a user exists
      return false;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + RESET_TOKEN_EXPIRES);

    // Update user with reset token
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    // Send reset email
    await sendPasswordResetEmail(user.email, resetToken);

    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Reset password
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<boolean> => {
  try {
    // Find user by reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Change password
export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<boolean> => {
  try {
    // Find user by ID with password
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// JWT Authentication middleware
export const authenticate = async (
  req: Request & { user?: JwtPayload },
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is invalid' });
  }
};

// Role-based authorization middleware
export const authorize = (roles: string[]) => {
  return (req: Request & { user?: JwtPayload }, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    next();
  };
};

// Helper function to generate JWT token
const generateToken = (user: IUser): string => {
  const payload: JwtPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    companyId: user.companyId.toString(),
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Helper function to send verification email
const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${token}`;

  const mailOptions = {
    from: EMAIL_FROM,
    to: email,
    subject: 'Verify Your B2B Platform Account',
    html: `
      <h1>Verify Your Email</h1>
      <p>Thank you for registering with our B2B Platform. Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request this verification, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Helper function to send password reset email
const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${token}`;

  const mailOptions = {
    from: EMAIL_FROM,
    to: email,
    subject: 'Reset Your B2B Platform Password',
    html: `
      <h1>Reset Your Password</h1>
      <p>You requested a password reset. Please click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request this reset, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};