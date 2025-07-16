import {
  Merchant,
  Customer,
  Wallet,
  PointTransaction,
  CashbackTransaction,
  WalletTransaction,
  Product,
  type IMerchant,
  type ICustomer,
  type IWallet,
  type IPointTransaction,
  type ICashbackTransaction,
  type IWalletTransaction,
  type IProduct,
} from "@shared/schema";
import { connectDB } from "./db";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { FallbackStorage } from "./fallback-storage";

export interface IStorage {
  // Merchant operations
  createMerchant(merchant: Partial<IMerchant>): Promise<any>;
  getMerchant(id: string): Promise<any>;
  getMerchantByMobile(mobile: string): Promise<any>;
  getMerchantByEmail(email: string): Promise<any>;
  updateMerchant(id: string, updates: Partial<IMerchant>): Promise<any>;
  authenticateMerchant(mobile: string, password: string): Promise<any>;
  
  // Customer operations
  createCustomer(customer: Partial<ICustomer>): Promise<any>;
  getCustomer(id: string): Promise<any>;
  getCustomerByMobile(mobile: string): Promise<any>;
  getMerchantCustomers(merchantId: string): Promise<any[]>;
  
  // Wallet operations
  createWallet(wallet: Partial<IWallet>): Promise<any>;
  getMerchantWallets(merchantId: string): Promise<any[]>;
  getWalletByType(merchantId: string, walletType: string): Promise<any>;
  updateWalletBalance(walletId: string, amount: string): Promise<any>;
  
  // Point transaction operations
  createPointTransaction(transaction: Partial<IPointTransaction>): Promise<any>;
  getMerchantPointTransactions(merchantId: string, limit?: number): Promise<any[]>;
  getPointTransactionStats(merchantId: string): Promise<{
    totalDistributed: number;
    todayDistributed: number;
    monthlyDistributed: number;
  }>;
  
  // Cashback transaction operations
  createCashbackTransaction(transaction: Partial<ICashbackTransaction>): Promise<any>;
  getMerchantCashbackTransactions(merchantId: string, limit?: number): Promise<any[]>;
  getCashbackStats(merchantId: string): Promise<{
    totalCashback: number;
    instant15Cashback: number;
    referral2Cashback: number;
    royalty1Cashback: number;
  }>;
  
  // Wallet transaction operations
  createWalletTransaction(transaction: Partial<IWalletTransaction>): Promise<any>;
  getMerchantWalletTransactions(merchantId: string, limit?: number): Promise<any[]>;
  
  // Product operations
  createProduct(product: Partial<IProduct>): Promise<any>;
  getMerchantProducts(merchantId: string): Promise<any[]>;
  updateProduct(id: string, updates: Partial<IProduct>): Promise<any>;
  
  // Analytics operations
  getMerchantDashboardStats(merchantId: string): Promise<{
    loyaltyPoints: number;
    totalCashback: number;
    balance: number;
    customers: number;
    todayPoints: number;
    monthlyPoints: number;
    referralCount: number;
    referralCommission: number;
  }>;
  
  // Referral operations
  getReferredMerchants(merchantId: string): Promise<any[]>;
}

export class MongoStorage implements IStorage {
  constructor() {
    this.initializeDemoData();
  }

  private async initializeDemoData() {
    try {
      await connectDB();
    } catch (error) {
      console.log('Database connection failed, using fallback data');
      return;
    }
    
    // Check if demo merchant exists
    const existingMerchant = await Merchant.findOne({ mobile: "9876543210" });
    if (existingMerchant) {
      return; // Demo data already exists
    }

    // Create demo merchant
    const hashedPassword = await bcrypt.hash("password123", 10);
    const demoMerchant = await Merchant.create({
      mobile: "9876543210",
      email: "demo@komarce.com",
      password: hashedPassword,
      firstName: "Demo",
      lastName: "Merchant",
      businessName: "Demo Store",
      businessType: "Retail",
      businessAddress: "123 Main St, City",
      referralCode: "DEMO123",
      isActive: true,
      totalEarnings: 0,
      totalReferrals: 0
    });

    // Create demo wallets
    await Promise.all([
      Wallet.create({
        merchantId: demoMerchant._id,
        walletType: "reward",
        balance: "5000",
        currency: "points"
      }),
      Wallet.create({
        merchantId: demoMerchant._id,
        walletType: "income",
        balance: "2500.50",
        currency: "INR"
      }),
      Wallet.create({
        merchantId: demoMerchant._id,
        walletType: "komarce",
        balance: "1000.00",
        currency: "INR"
      })
    ]);

    // Create demo customers
    const customers = await Promise.all([
      Customer.create({
        mobile: "9876543211",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        totalRewardPoints: 150,
        rewardNumber: "1",
        registeredByMerchant: demoMerchant._id
      }),
      Customer.create({
        mobile: "9876543212",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        totalRewardPoints: 75,
        rewardNumber: "1",
        registeredByMerchant: demoMerchant._id
      })
    ]);

    // Create demo transactions
    await Promise.all([
      PointTransaction.create({
        merchantId: demoMerchant._id,
        customerId: customers[0]._id,
        points: 150,
        transactionType: "distribute",
        description: "Welcome bonus",
        status: "completed"
      }),
      CashbackTransaction.create({
        merchantId: demoMerchant._id,
        amount: "22.50",
        cashbackType: "instant15",
        description: "15% cashback on point distribution",
        status: "completed"
      })
    ]);

    console.log("Demo data initialized successfully");
  }

  async createMerchant(merchant: Partial<IMerchant>): Promise<IMerchant> {
    await connectDB();
    
    if (merchant.password) {
      merchant.password = await bcrypt.hash(merchant.password, 10);
    }

    const newMerchant = await Merchant.create(merchant);
    
    // Create default wallets for new merchant
    await Promise.all([
      Wallet.create({
        merchantId: newMerchant._id,
        walletType: "reward",
        balance: "0",
        currency: "points"
      }),
      Wallet.create({
        merchantId: newMerchant._id,
        walletType: "income",
        balance: "0",
        currency: "INR"
      }),
      Wallet.create({
        merchantId: newMerchant._id,
        walletType: "komarce",
        balance: "0",
        currency: "INR"
      })
    ]);

    return newMerchant;
  }

  async getMerchant(id: string): Promise<IMerchant | null> {
    await connectDB();
    return await Merchant.findById(id);
  }

  async getMerchantByMobile(mobile: string): Promise<IMerchant | null> {
    await connectDB();
    return await Merchant.findOne({ mobile });
  }

  async getMerchantByEmail(email: string): Promise<IMerchant | null> {
    await connectDB();
    return await Merchant.findOne({ email });
  }

  async updateMerchant(id: string, updates: Partial<IMerchant>): Promise<IMerchant | null> {
    await connectDB();
    return await Merchant.findByIdAndUpdate(id, updates, { new: true });
  }

  async authenticateMerchant(mobile: string, password: string): Promise<IMerchant | null> {
    await connectDB();
    const merchant = await Merchant.findOne({ mobile });
    if (!merchant || !merchant.password) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, merchant.password);
    return isValidPassword ? merchant : null;
  }

  async createCustomer(customer: Partial<ICustomer>): Promise<ICustomer> {
    await connectDB();
    
    // Calculate reward number based on total points
    const totalPoints = customer.totalRewardPoints || 0;
    const rewardNumber = Math.floor(totalPoints / 1500).toString();
    
    const customerData = {
      ...customer,
      rewardNumber
    };

    return await Customer.create(customerData);
  }

  async getCustomer(id: string): Promise<ICustomer | null> {
    await connectDB();
    return await Customer.findById(id);
  }

  async getCustomerByMobile(mobile: string): Promise<ICustomer | null> {
    await connectDB();
    return await Customer.findOne({ mobile });
  }

  async getMerchantCustomers(merchantId: string): Promise<ICustomer[]> {
    await connectDB();
    return await Customer.find({ registeredByMerchant: merchantId }).sort({ createdAt: -1 });
  }

  async createWallet(wallet: Partial<IWallet>): Promise<IWallet> {
    await connectDB();
    return await Wallet.create(wallet);
  }

  async getMerchantWallets(merchantId: string): Promise<IWallet[]> {
    await connectDB();
    return await Wallet.find({ merchantId }).sort({ createdAt: -1 });
  }

  async getWalletByType(merchantId: string, walletType: string): Promise<IWallet | null> {
    await connectDB();
    return await Wallet.findOne({ merchantId, walletType });
  }

  async updateWalletBalance(walletId: string, amount: string): Promise<IWallet | null> {
    await connectDB();
    return await Wallet.findByIdAndUpdate(walletId, { balance: amount }, { new: true });
  }

  async createPointTransaction(transaction: Partial<IPointTransaction>): Promise<IPointTransaction> {
    await connectDB();
    return await PointTransaction.create(transaction);
  }

  async getMerchantPointTransactions(merchantId: string, limit: number = 10): Promise<IPointTransaction[]> {
    await connectDB();
    return await PointTransaction.find({ merchantId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('customerId', 'firstName lastName mobile');
  }

  async getPointTransactionStats(merchantId: string): Promise<{
    totalDistributed: number;
    todayDistributed: number;
    monthlyDistributed: number;
  }> {
    await connectDB();
    
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const totalStats = await PointTransaction.aggregate([
      { $match: { merchantId: new Types.ObjectId(merchantId) } },
      {
        $group: {
          _id: null,
          totalDistributed: { $sum: "$points" },
          todayDistributed: {
            $sum: {
              $cond: [
                { $gte: ["$createdAt", startOfDay] },
                "$points",
                0
              ]
            }
          },
          monthlyDistributed: {
            $sum: {
              $cond: [
                { $gte: ["$createdAt", startOfMonth] },
                "$points",
                0
              ]
            }
          }
        }
      }
    ]);

    return totalStats[0] || { totalDistributed: 0, todayDistributed: 0, monthlyDistributed: 0 };
  }

  async createCashbackTransaction(transaction: Partial<ICashbackTransaction>): Promise<ICashbackTransaction> {
    await connectDB();
    return await CashbackTransaction.create(transaction);
  }

  async getMerchantCashbackTransactions(merchantId: string, limit: number = 10): Promise<ICashbackTransaction[]> {
    await connectDB();
    return await CashbackTransaction.find({ merchantId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async getCashbackStats(merchantId: string): Promise<{
    totalCashback: number;
    instant15Cashback: number;
    referral2Cashback: number;
    royalty1Cashback: number;
  }> {
    await connectDB();
    
    const stats = await CashbackTransaction.aggregate([
      { $match: { merchantId: new Types.ObjectId(merchantId) } },
      {
        $group: {
          _id: "$cashbackType",
          total: { $sum: { $toDouble: "$amount" } }
        }
      }
    ]);

    const result = {
      totalCashback: 0,
      instant15Cashback: 0,
      referral2Cashback: 0,
      royalty1Cashback: 0
    };

    stats.forEach(stat => {
      result.totalCashback += stat.total;
      
      switch (stat._id) {
        case 'instant15':
          result.instant15Cashback = stat.total;
          break;
        case 'referral2':
          result.referral2Cashback = stat.total;
          break;
        case 'royalty1':
          result.royalty1Cashback = stat.total;
          break;
      }
    });

    return result;
  }

  async createWalletTransaction(transaction: Partial<IWalletTransaction>): Promise<IWalletTransaction> {
    await connectDB();
    return await WalletTransaction.create(transaction);
  }

  async getMerchantWalletTransactions(merchantId: string, limit: number = 10): Promise<IWalletTransaction[]> {
    await connectDB();
    return await WalletTransaction.find({ merchantId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('walletId', 'walletType');
  }

  async createProduct(product: Partial<IProduct>): Promise<IProduct> {
    await connectDB();
    return await Product.create(product);
  }

  async getMerchantProducts(merchantId: string): Promise<IProduct[]> {
    await connectDB();
    return await Product.find({ merchantId }).sort({ createdAt: -1 });
  }

  async updateProduct(id: string, updates: Partial<IProduct>): Promise<IProduct | null> {
    await connectDB();
    return await Product.findByIdAndUpdate(id, updates, { new: true });
  }

  async getMerchantDashboardStats(merchantId: string): Promise<{
    loyaltyPoints: number;
    totalCashback: number;
    balance: number;
    customers: number;
    todayPoints: number;
    monthlyPoints: number;
    referralCount: number;
    referralCommission: number;
  }> {
    await connectDB();
    
    const [
      wallets,
      customers,
      pointStats,
      cashbackStats,
      referrals
    ] = await Promise.all([
      this.getMerchantWallets(merchantId),
      this.getMerchantCustomers(merchantId),
      this.getPointTransactionStats(merchantId),
      this.getCashbackStats(merchantId),
      this.getReferredMerchants(merchantId)
    ]);

    const rewardWallet = wallets.find(w => w.walletType === 'reward');
    const incomeWallet = wallets.find(w => w.walletType === 'income');

    return {
      loyaltyPoints: parseInt(rewardWallet?.balance || '0'),
      totalCashback: cashbackStats.totalCashback,
      balance: parseFloat(incomeWallet?.balance || '0'),
      customers: customers.length,
      todayPoints: pointStats.todayDistributed,
      monthlyPoints: pointStats.monthlyDistributed,
      referralCount: referrals.length,
      referralCommission: cashbackStats.referral2Cashback
    };
  }

  async getReferredMerchants(merchantId: string): Promise<IMerchant[]> {
    await connectDB();
    return await Merchant.find({ referredByMerchant: merchantId }).sort({ createdAt: -1 });
  }
}

// Use fallback storage by default, will be replaced if MongoDB is available
export const storage = new FallbackStorage();