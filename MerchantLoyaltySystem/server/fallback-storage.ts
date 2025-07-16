import { IStorage } from "./storage";
import bcrypt from "bcrypt";

// In-memory fallback storage for when MongoDB is not available
export class FallbackStorage implements IStorage {
  private merchants: any[] = [];
  private customers: any[] = [];
  private wallets: any[] = [];
  private pointTransactions: any[] = [];
  private cashbackTransactions: any[] = [];
  private walletTransactions: any[] = [];
  private products: any[] = [];

  constructor() {
    this.initializeDemoData();
  }

  private async initializeDemoData() {
    // Create demo merchant
    const hashedPassword = await bcrypt.hash("123456", 10);
    const demoMerchant = {
      _id: "demo123",
      mobile: "1234567890",
      password: hashedPassword,
      businessName: "Demo Store",
      businessType: "Retail",
      isActive: true,
      totalEarnings: 0,
      totalReferrals: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.merchants.push(demoMerchant);

    // Create demo wallets
    const walletTypes = ["reward", "income", "komarce"];
    walletTypes.forEach(type => {
      this.wallets.push({
        _id: `${type}_wallet_demo`,
        merchantId: "demo123",
        walletType: type,
        balance: type === "reward" ? "1000" : "500",
        currency: "INR",
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    // Create demo customer
    this.customers.push({
      _id: "customer_demo",
      mobile: "9876543210",
      firstName: "Demo",
      lastName: "Customer",
      totalRewardPoints: 1500,
      rewardNumber: "RWD001",
      isActive: true,
      registeredByMerchant: "demo123",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Demo data initialized in fallback storage');
  }

  async createMerchant(merchant: any): Promise<any> {
    const id = Date.now().toString();
    const newMerchant = {
      _id: id,
      ...merchant,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.merchants.push(newMerchant);
    return newMerchant;
  }

  async getMerchant(id: string): Promise<any> {
    return this.merchants.find(m => m._id === id) || null;
  }

  async getMerchantByMobile(mobile: string): Promise<any> {
    return this.merchants.find(m => m.mobile === mobile) || null;
  }

  async getMerchantByEmail(email: string): Promise<any> {
    return this.merchants.find(m => m.email === email) || null;
  }

  async updateMerchant(id: string, updates: any): Promise<any> {
    const merchant = this.merchants.find(m => m._id === id);
    if (merchant) {
      Object.assign(merchant, updates, { updatedAt: new Date() });
      return merchant;
    }
    return null;
  }

  async authenticateMerchant(mobile: string, password: string): Promise<any> {
    const merchant = await this.getMerchantByMobile(mobile);
    if (merchant && await bcrypt.compare(password, merchant.password)) {
      return merchant;
    }
    return null;
  }

  async createCustomer(customer: any): Promise<any> {
    const id = Date.now().toString();
    const newCustomer = {
      _id: id,
      ...customer,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.customers.push(newCustomer);
    return newCustomer;
  }

  async getCustomer(id: string): Promise<any> {
    return this.customers.find(c => c._id === id) || null;
  }

  async getCustomerByMobile(mobile: string): Promise<any> {
    return this.customers.find(c => c.mobile === mobile) || null;
  }

  async getMerchantCustomers(merchantId: string): Promise<any[]> {
    return this.customers.filter(c => c.registeredByMerchant === merchantId);
  }

  async createWallet(wallet: any): Promise<any> {
    const id = Date.now().toString();
    const newWallet = {
      _id: id,
      ...wallet,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.wallets.push(newWallet);
    return newWallet;
  }

  async getMerchantWallets(merchantId: string): Promise<any[]> {
    return this.wallets.filter(w => w.merchantId === merchantId);
  }

  async getWalletByType(merchantId: string, walletType: string): Promise<any> {
    return this.wallets.find(w => w.merchantId === merchantId && w.walletType === walletType) || null;
  }

  async updateWalletBalance(walletId: string, amount: string): Promise<any> {
    const wallet = this.wallets.find(w => w._id === walletId);
    if (wallet) {
      wallet.balance = amount;
      wallet.updatedAt = new Date();
      return wallet;
    }
    return null;
  }

  async createPointTransaction(transaction: any): Promise<any> {
    const id = Date.now().toString();
    const newTransaction = {
      _id: id,
      ...transaction,
      createdAt: new Date()
    };
    this.pointTransactions.push(newTransaction);
    return newTransaction;
  }

  async getMerchantPointTransactions(merchantId: string, limit: number = 10): Promise<any[]> {
    return this.pointTransactions
      .filter(t => t.merchantId === merchantId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async getPointTransactionStats(merchantId: string): Promise<any> {
    const transactions = this.pointTransactions.filter(t => t.merchantId === merchantId);
    const totalDistributed = transactions.reduce((sum, t) => sum + t.points, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTransactions = transactions.filter(t => new Date(t.createdAt) >= today);
    const todayDistributed = todayTransactions.reduce((sum, t) => sum + t.points, 0);
    
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthTransactions = transactions.filter(t => new Date(t.createdAt) >= monthStart);
    const monthlyDistributed = monthTransactions.reduce((sum, t) => sum + t.points, 0);
    
    return {
      totalDistributed,
      todayDistributed,
      monthlyDistributed
    };
  }

  async createCashbackTransaction(transaction: any): Promise<any> {
    const id = Date.now().toString();
    const newTransaction = {
      _id: id,
      ...transaction,
      createdAt: new Date()
    };
    this.cashbackTransactions.push(newTransaction);
    return newTransaction;
  }

  async getMerchantCashbackTransactions(merchantId: string, limit: number = 10): Promise<any[]> {
    return this.cashbackTransactions
      .filter(t => t.merchantId === merchantId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async getCashbackStats(merchantId: string): Promise<any> {
    const transactions = this.cashbackTransactions.filter(t => t.merchantId === merchantId);
    const totalCashback = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const instant15Cashback = transactions.filter(t => t.cashbackType === "instant15").reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const referral2Cashback = transactions.filter(t => t.cashbackType === "referral2").reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const royalty1Cashback = transactions.filter(t => t.cashbackType === "royalty1").reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    return {
      totalCashback,
      instant15Cashback,
      referral2Cashback,
      royalty1Cashback
    };
  }

  async createWalletTransaction(transaction: any): Promise<any> {
    const id = Date.now().toString();
    const newTransaction = {
      _id: id,
      ...transaction,
      createdAt: new Date()
    };
    this.walletTransactions.push(newTransaction);
    return newTransaction;
  }

  async getMerchantWalletTransactions(merchantId: string, limit: number = 10): Promise<any[]> {
    return this.walletTransactions
      .filter(t => t.merchantId === merchantId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async createProduct(product: any): Promise<any> {
    const id = Date.now().toString();
    const newProduct = {
      _id: id,
      ...product,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async getMerchantProducts(merchantId: string): Promise<any[]> {
    return this.products.filter(p => p.merchantId === merchantId);
  }

  async updateProduct(id: string, updates: any): Promise<any> {
    const product = this.products.find(p => p._id === id);
    if (product) {
      Object.assign(product, updates, { updatedAt: new Date() });
      return product;
    }
    return null;
  }

  async getMerchantDashboardStats(merchantId: string): Promise<any> {
    const wallets = await this.getMerchantWallets(merchantId);
    const rewardWallet = wallets.find(w => w.walletType === "reward");
    const incomeWallet = wallets.find(w => w.walletType === "income");
    const komarceWallet = wallets.find(w => w.walletType === "komarce");
    
    const pointStats = await this.getPointTransactionStats(merchantId);
    const cashbackStats = await this.getCashbackStats(merchantId);
    const customers = await this.getMerchantCustomers(merchantId);
    
    return {
      loyaltyPoints: parseFloat(rewardWallet?.balance || "0"),
      totalCashback: cashbackStats.totalCashback,
      balance: parseFloat(incomeWallet?.balance || "0") + parseFloat(komarceWallet?.balance || "0"),
      customers: customers.length,
      todayPoints: pointStats.todayDistributed,
      monthlyPoints: pointStats.monthlyDistributed,
      referralCount: 0,
      referralCommission: 0
    };
  }

  async getReferredMerchants(merchantId: string): Promise<any[]> {
    return this.merchants.filter(m => m.referredByMerchant === merchantId);
  }
}