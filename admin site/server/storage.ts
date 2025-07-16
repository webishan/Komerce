import {
  users,
  merchants,
  customers,
  countries,
  rewardTransactions,
  withdrawals,
  coFounders,
  staff,
  systemSettings,
  type User,
  type UpsertUser,
  type Merchant,
  type InsertMerchant,
  type Customer,
  type InsertCustomer,
  type Country,
  type RewardTransaction,
  type Withdrawal,
  type CoFounder,
  type Staff,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sum, count, sql, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Country operations
  getCountries(): Promise<Country[]>;
  getCountryById(id: number): Promise<Country | undefined>;
  
  // Merchant operations
  getMerchants(countryId?: number): Promise<Merchant[]>;
  getMerchantById(id: number): Promise<Merchant | undefined>;
  createMerchant(merchant: InsertMerchant): Promise<Merchant>;
  updateMerchant(id: number, updates: Partial<InsertMerchant>): Promise<Merchant>;
  getMerchantsByTier(tier: string, countryId?: number): Promise<Merchant[]>;
  getMerchantStats(countryId?: number): Promise<any>;
  
  // Customer operations
  getCustomers(countryId?: number): Promise<Customer[]>;
  getCustomerById(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, updates: Partial<InsertCustomer>): Promise<Customer>;
  deleteCustomer(id: number): Promise<void>;
  getTopCustomersBySerialNumbers(limit?: number, countryId?: number): Promise<Customer[]>;
  getTopCustomersByReferrals(limit?: number, countryId?: number): Promise<Customer[]>;
  getCustomerStats(countryId?: number): Promise<any>;
  
  // Reward operations
  getRewardTransactions(customerId?: number, merchantId?: number): Promise<RewardTransaction[]>;
  createRewardTransaction(transaction: any): Promise<RewardTransaction>;
  getRewardStats(countryId?: number): Promise<any>;
  
  // Withdrawal operations
  getWithdrawals(status?: string, countryId?: number): Promise<Withdrawal[]>;
  createWithdrawal(withdrawal: any): Promise<Withdrawal>;
  updateWithdrawal(id: number, updates: any): Promise<Withdrawal>;
  getWithdrawalStats(countryId?: number): Promise<any>;
  
  // Dashboard stats
  getDashboardStats(countryId?: number): Promise<any>;
  getCountryPerformance(): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Country operations
  async getCountries(): Promise<Country[]> {
    return await db.select().from(countries).where(eq(countries.isActive, true));
  }

  async getCountryById(id: number): Promise<Country | undefined> {
    const [country] = await db.select().from(countries).where(eq(countries.id, id));
    return country;
  }

  // Merchant operations
  async getMerchants(countryId?: number): Promise<Merchant[]> {
    const query = db.select().from(merchants);
    if (countryId) {
      return await query.where(eq(merchants.countryId, countryId));
    }
    return await query;
  }

  async getMerchantById(id: number): Promise<Merchant | undefined> {
    const [merchant] = await db.select().from(merchants).where(eq(merchants.id, id));
    return merchant;
  }

  async createMerchant(merchant: InsertMerchant): Promise<Merchant> {
    const [newMerchant] = await db.insert(merchants).values(merchant).returning();
    return newMerchant;
  }

  async updateMerchant(id: number, updates: Partial<InsertMerchant>): Promise<Merchant> {
    const [updatedMerchant] = await db
      .update(merchants)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(merchants.id, id))
      .returning();
    return updatedMerchant;
  }

  async getMerchantsByTier(tier: string, countryId?: number): Promise<Merchant[]> {
    const conditions = [eq(merchants.tier, tier as any)];
    if (countryId) {
      conditions.push(eq(merchants.countryId, countryId));
    }
    return await db.select().from(merchants).where(conditions.length === 1 ? conditions[0] : and(...conditions));
  }

  async getMerchantStats(countryId?: number): Promise<any> {
    const baseQuery = db.select({
      tier: merchants.tier,
      count: count(),
    }).from(merchants);
    
    if (countryId) {
      baseQuery.where(eq(merchants.countryId, countryId));
    }
    
    const tierStats = await baseQuery.groupBy(merchants.tier);
    
    const totalQuery = db.select({ total: count() }).from(merchants);
    if (countryId) {
      totalQuery.where(eq(merchants.countryId, countryId));
    }
    const [{ total }] = await totalQuery;

    return {
      total,
      byTier: tierStats.reduce((acc, stat) => {
        if (stat.tier) {
          acc[stat.tier] = stat.count;
        }
        return acc;
      }, {} as Record<string, number>),
    };
  }

  // Customer operations
  async getCustomers(countryId?: number): Promise<Customer[]> {
    const query = db.select().from(customers);
    if (countryId) {
      return await query.where(eq(customers.countryId, countryId));
    }
    return await query;
  }

  async getCustomerById(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  async updateCustomer(id: number, updates: Partial<InsertCustomer>): Promise<Customer> {
    const [updatedCustomer] = await db
      .update(customers)
      .set(updates)
      .where(eq(customers.id, id))
      .returning();
    return updatedCustomer;
  }

  async deleteCustomer(id: number): Promise<void> {
    await db
      .delete(customers)
      .where(eq(customers.id, id));
  }

  async getTopCustomersBySerialNumbers(limit = 10, countryId?: number): Promise<Customer[]> {
    if (countryId) {
      return await db.select().from(customers)
        .where(eq(customers.countryId, countryId))
        .orderBy(desc(customers.globalRewardNumbers))
        .limit(limit);
    }
    return await db.select().from(customers)
      .orderBy(desc(customers.globalRewardNumbers))
      .limit(limit);
  }

  async getTopCustomersByReferrals(limit = 10, countryId?: number): Promise<Customer[]> {
    if (countryId) {
      return await db.select().from(customers)
        .where(eq(customers.countryId, countryId))
        .orderBy(desc(customers.referralCount))
        .limit(limit);
    }
    return await db.select().from(customers)
      .orderBy(desc(customers.referralCount))
      .limit(limit);
  }

  async getCustomerStats(countryId?: number): Promise<any> {
    const baseQuery = db.select({ 
      total: count(),
      totalPoints: sum(customers.accumulatedPoints),
      totalBalance: sum(customers.balance)
    }).from(customers);
    
    if (countryId) {
      baseQuery.where(eq(customers.countryId, countryId));
    }
    
    const [stats] = await baseQuery;
    return stats;
  }

  // Reward operations
  async getRewardTransactions(customerId?: number, merchantId?: number): Promise<RewardTransaction[]> {
    const conditions = [];
    if (customerId) conditions.push(eq(rewardTransactions.customerId, customerId));
    if (merchantId) conditions.push(eq(rewardTransactions.merchantId, merchantId));
    
    if (conditions.length > 0) {
      return await db.select().from(rewardTransactions)
        .where(and(...conditions))
        .orderBy(desc(rewardTransactions.createdAt));
    }
    
    return await db.select().from(rewardTransactions)
      .orderBy(desc(rewardTransactions.createdAt));
  }

  async createRewardTransaction(transaction: any): Promise<RewardTransaction> {
    const [newTransaction] = await db.insert(rewardTransactions).values(transaction).returning();
    return newTransaction;
  }

  async getRewardStats(countryId?: number): Promise<any> {
    // This would need a complex join with customers/merchants to filter by country
    const [stats] = await db.select({
      totalTransactions: count(),
      totalPoints: sum(rewardTransactions.points),
    }).from(rewardTransactions);
    
    return stats;
  }

  // Withdrawal operations
  async getWithdrawals(status?: string, countryId?: number): Promise<Withdrawal[]> {
    if (status) {
      return await db.select().from(withdrawals)
        .where(eq(withdrawals.status, status as any))
        .orderBy(desc(withdrawals.requestedAt));
    }
    return await db.select().from(withdrawals)
      .orderBy(desc(withdrawals.requestedAt));
    
    return await db.select().from(withdrawals)
      .orderBy(desc(withdrawals.requestedAt));
  }

  async createWithdrawal(withdrawal: any): Promise<Withdrawal> {
    const [newWithdrawal] = await db.insert(withdrawals).values(withdrawal).returning();
    return newWithdrawal;
  }

  async updateWithdrawal(id: number, updates: any): Promise<Withdrawal> {
    const [updatedWithdrawal] = await db
      .update(withdrawals)
      .set({ ...updates, processedAt: new Date() })
      .where(eq(withdrawals.id, id))
      .returning();
    return updatedWithdrawal;
  }

  async getWithdrawalStats(countryId?: number): Promise<any> {
    const [stats] = await db.select({
      total: count(),
      totalAmount: sum(withdrawals.amount),
      pending: count(sql`CASE WHEN ${withdrawals.status} = 'pending' THEN 1 END`),
      completed: count(sql`CASE WHEN ${withdrawals.status} = 'completed' THEN 1 END`),
    }).from(withdrawals);
    
    return stats;
  }

  // Dashboard stats
  async getDashboardStats(countryId?: number): Promise<any> {
    const merchantStats = await this.getMerchantStats(countryId);
    const customerStats = await this.getCustomerStats(countryId);
    const rewardStats = await this.getRewardStats(countryId);
    const withdrawalStats = await this.getWithdrawalStats(countryId);

    return {
      merchants: merchantStats,
      customers: customerStats,
      rewards: rewardStats,
      withdrawals: withdrawalStats,
    };
  }

  async getCountryPerformance(): Promise<any[]> {
    const countryStats = await db
      .select({
        countryId: customers.countryId,
        customerCount: count(customers.id),
        totalBalance: sum(customers.balance),
        totalPoints: sum(customers.accumulatedPoints),
      })
      .from(customers)
      .groupBy(customers.countryId);

    // Join with country names
    const performance = [];
    for (const stat of countryStats) {
      if (stat.countryId) {
        const country = await this.getCountryById(stat.countryId);
        performance.push({
          ...stat,
          country,
        });
      }
    }

    return performance;
  }
}

export const storage = new DatabaseStorage();
