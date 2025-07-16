import { Schema, model, Document } from 'mongoose';
import { z } from 'zod';

// Merchant Schema
const merchantSchema = new Schema({
  mobile: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  businessName: { type: String },
  businessType: { type: String },
  businessAddress: { type: String },
  isActive: { type: Boolean, default: true },
  referralCode: { type: String, unique: true },
  referredByMerchant: { type: Schema.Types.ObjectId, ref: 'Merchant' },
  totalEarnings: { type: Number, default: 0 },
  totalReferrals: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Customer Schema
const customerSchema = new Schema({
  mobile: { type: String, required: true, unique: true },
  email: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  isActive: { type: Boolean, default: true },
  totalRewardPoints: { type: Number, default: 0 },
  rewardNumber: { type: String },
  registeredByMerchant: { type: Schema.Types.ObjectId, ref: 'Merchant' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Wallet Schema
const walletSchema = new Schema({
  merchantId: { type: Schema.Types.ObjectId, ref: 'Merchant', required: true },
  walletType: { type: String, required: true }, // 'reward', 'income', 'komarce'
  balance: { type: String, default: '0' },
  currency: { type: String, default: 'INR' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Point Transaction Schema
const pointTransactionSchema = new Schema({
  merchantId: { type: Schema.Types.ObjectId, ref: 'Merchant', required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
  points: { type: Number, required: true },
  transactionType: { type: String, required: true }, // 'distribute', 'redeem', 'transfer'
  description: { type: String },
  status: { type: String, default: 'completed' },
  amount: { type: String },
  referenceId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Cashback Transaction Schema
const cashbackTransactionSchema = new Schema({
  merchantId: { type: Schema.Types.ObjectId, ref: 'Merchant', required: true },
  amount: { type: String, required: true },
  cashbackType: { type: String, required: true }, // 'instant15', 'referral2', 'royalty1'
  description: { type: String },
  status: { type: String, default: 'completed' },
  sourceTransactionId: { type: Schema.Types.ObjectId },
  sourceReferralId: { type: Schema.Types.ObjectId },
  createdAt: { type: Date, default: Date.now }
});

// Wallet Transaction Schema
const walletTransactionSchema = new Schema({
  merchantId: { type: Schema.Types.ObjectId, ref: 'Merchant', required: true },
  walletId: { type: Schema.Types.ObjectId, ref: 'Wallet', required: true },
  amount: { type: String, required: true },
  transactionType: { type: String, required: true }, // 'credit', 'debit', 'transfer'
  balanceBefore: { type: String, required: true },
  balanceAfter: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: 'completed' },
  referenceId: { type: String },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

// Product Schema
const productSchema = new Schema({
  merchantId: { type: Schema.Types.ObjectId, ref: 'Merchant', required: true },
  name: { type: String, required: true },
  description: { type: String },
  dpPrice: { type: String }, // Distributor Price
  tpPrice: { type: String }, // Trade Price
  mrpPrice: { type: String }, // MRP Price
  rewardPoints: { type: Number, default: 0 },
  category: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware for updating timestamps
merchantSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

customerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

walletSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for better performance
merchantSchema.index({ mobile: 1 });
merchantSchema.index({ email: 1 });
merchantSchema.index({ referralCode: 1 });
customerSchema.index({ mobile: 1 });
customerSchema.index({ registeredByMerchant: 1 });
walletSchema.index({ merchantId: 1, walletType: 1 });
pointTransactionSchema.index({ merchantId: 1, createdAt: -1 });
cashbackTransactionSchema.index({ merchantId: 1, createdAt: -1 });
walletTransactionSchema.index({ merchantId: 1, createdAt: -1 });

// Models
export const Merchant = model('Merchant', merchantSchema);
export const Customer = model('Customer', customerSchema);
export const Wallet = model('Wallet', walletSchema);
export const PointTransaction = model('PointTransaction', pointTransactionSchema);
export const CashbackTransaction = model('CashbackTransaction', cashbackTransactionSchema);
export const WalletTransaction = model('WalletTransaction', walletTransactionSchema);
export const Product = model('Product', productSchema);

// TypeScript interfaces
export interface IMerchant extends Document {
  mobile: string;
  email?: string | null;
  password: string;
  firstName?: string | null;
  lastName?: string | null;
  businessName?: string | null;
  businessType?: string | null;
  businessAddress?: string | null;
  isActive: boolean;
  referralCode?: string | null;
  referredByMerchant?: Schema.Types.ObjectId | null;
  totalEarnings: number;
  totalReferrals: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICustomer extends Document {
  mobile: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  isActive: boolean;
  totalRewardPoints: number;
  rewardNumber?: string | null;
  registeredByMerchant?: Schema.Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWallet extends Document {
  merchantId: Schema.Types.ObjectId;
  walletType: string;
  balance: string;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPointTransaction extends Document {
  merchantId: Schema.Types.ObjectId;
  customerId?: Schema.Types.ObjectId;
  points: number;
  transactionType: string;
  description?: string | null;
  status: string;
  amount?: string | null;
  referenceId?: string | null;
  createdAt: Date;
}

export interface ICashbackTransaction extends Document {
  merchantId: Schema.Types.ObjectId;
  amount: string;
  cashbackType: string;
  description?: string | null;
  status: string;
  sourceTransactionId?: Schema.Types.ObjectId;
  sourceReferralId?: Schema.Types.ObjectId;
  createdAt: Date;
}

export interface IWalletTransaction extends Document {
  merchantId: Schema.Types.ObjectId;
  walletId: Schema.Types.ObjectId;
  amount: string;
  transactionType: string;
  balanceBefore: string;
  balanceAfter: string;
  description?: string | null;
  status: string;
  referenceId?: string | null;
  metadata?: any;
  createdAt: Date;
}

export interface IProduct extends Document {
  merchantId: Schema.Types.ObjectId;
  name: string;
  description?: string | null;
  dpPrice?: string | null;
  tpPrice?: string | null;
  mrpPrice?: string | null;
  rewardPoints: number;
  category?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Zod validation schemas
export const loginSchema = z.object({
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const pointTransferSchema = z.object({
  customerMobile: z.string().min(10, 'Customer mobile number is required'),
  points: z.number().min(1, 'Points must be at least 1'),
  description: z.string().optional()
});

export const walletTransferSchema = z.object({
  fromWalletType: z.string().min(1, 'Source wallet is required'),
  toWalletType: z.string().min(1, 'Destination wallet is required'),
  amount: z.string().min(1, 'Amount is required'),
  description: z.string().optional()
});

export const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  businessName: z.string().optional(),
  businessType: z.string().optional(),
  businessAddress: z.string().optional()
});

// Export types for use in frontend
export type MerchantType = IMerchant;
export type CustomerType = ICustomer;
export type WalletType = IWallet;
export type PointTransactionType = IPointTransaction;
export type CashbackTransactionType = ICashbackTransaction;
export type WalletTransactionType = IWalletTransaction;
export type ProductType = IProduct;
export type LoginRequest = z.infer<typeof loginSchema>;
export type PointTransferRequest = z.infer<typeof pointTransferSchema>;
export type WalletTransferRequest = z.infer<typeof walletTransferSchema>;
export type ProfileRequest = z.infer<typeof profileSchema>;