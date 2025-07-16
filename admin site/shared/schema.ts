import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  decimal,
  boolean,
  serial,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { enum: ["super_admin", "country_admin", "manager"] }).default("manager"),
  country: varchar("country", { enum: ["global", "bangladesh", "malaysia", "uae", "philippines"] }).default("global"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const countries = pgTable("countries", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 3 }).unique().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  flag: varchar("flag", { length: 10 }),
  currency: varchar("currency", { length: 3 }),
  isActive: boolean("is_active").default(true),
});

export const merchants = pgTable("merchants", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  countryId: integer("country_id").references(() => countries.id),
  
  // Business Details
  businessType: varchar("business_type", { enum: ["merchant", "e_merchant"] }).default("merchant"),
  tier: varchar("tier", { 
    enum: ["regular", "star", "double_star", "triple_star", "executive", "senior_executive", "manager", "co_founder"] 
  }).default("regular"),
  status: varchar("status", { enum: ["active", "inactive", "pending"] }).default("pending"),
  
  // Financial Data
  totalSales: decimal("total_sales", { precision: 15, scale: 2 }).default("0"),
  loyaltyPoints: decimal("loyalty_points", { precision: 15, scale: 2 }).default("0"),
  totalCashback: decimal("total_cashback", { precision: 15, scale: 2 }).default("0"),
  pointsDistributed: integer("points_distributed").default(0),
  balance: decimal("balance", { precision: 15, scale: 2 }).default("0"),
  
  // Referral System
  referralCode: varchar("referral_code", { length: 50 }).unique(),
  referredBy: integer("referred_by"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").unique(),
  
  // Personal Information
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }).unique().notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  bloodGroup: varchar("blood_group", { length: 5 }),
  
  // Address Information
  address: text("address"),
  countryId: integer("country_id").references(() => countries.id),
  city: varchar("city", { length: 100 }),
  district: varchar("district", { length: 100 }),
  postcode: varchar("postcode", { length: 20 }),
  
  // KOMARCE Reward System
  accumulatedPoints: decimal("accumulated_points", { precision: 15, scale: 2 }).default("0"),
  globalRewardNumbers: integer("global_reward_numbers").default(0),
  localRewardNumbers: integer("local_reward_numbers").default(0),
  totalRewards: decimal("total_rewards", { precision: 15, scale: 2 }).default("0"),
  balance: decimal("balance", { precision: 15, scale: 2 }).default("0"),
  
  // Referral System
  referralCode: varchar("referral_code", { length: 50 }).unique(),
  referredBy: integer("referred_by"),
  referralCount: integer("referral_count").default(0),
  
  // Login Tracking
  dailyLoginCount: integer("daily_login_count").default(0),
  lastLoginDate: timestamp("last_login_date"),
  totalLoginCount: integer("total_login_count").default(0),
  
  registrationDate: timestamp("registration_date").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const rewardTransactions = pgTable("reward_transactions", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  merchantId: integer("merchant_id").references(() => merchants.id),
  type: varchar("type", { enum: ["earn", "redeem", "transfer"] }).notNull(),
  points: integer("points").notNull(),
  description: text("description"),
  status: varchar("status", { enum: ["pending", "completed", "cancelled"] }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const withdrawals = pgTable("withdrawals", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  userType: varchar("user_type", { enum: ["customer", "merchant"] }).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  status: varchar("status", { enum: ["pending", "approved", "rejected", "completed"] }).default("pending"),
  requestedAt: timestamp("requested_at").defaultNow(),
  processedAt: timestamp("processed_at"),
  notes: text("notes"),
});

export const coFounders = pgTable("co_founders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  countryId: integer("country_id").references(() => countries.id),
  role: varchar("role", { length: 100 }),
  joinDate: timestamp("join_date").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  countryId: integer("country_id").references(() => countries.id),
  department: varchar("department", { length: 100 }),
  position: varchar("position", { length: 100 }),
  permissions: jsonb("permissions"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const systemSettings = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).unique().notNull(),
  value: jsonb("value"),
  description: text("description"),
  countryId: integer("country_id").references(() => countries.id),
  updatedBy: varchar("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// KOMARCE Reward Number System
export const rewardNumbers = pgTable("reward_numbers", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id).notNull(),
  globalNumber: integer("global_number").notNull(),
  localNumber: integer("local_number"),
  countryId: integer("country_id").references(() => countries.id),
  
  // Four-tier reward system (800, 1500, 3500, 32200)
  tier1Reward: decimal("tier1_reward", { precision: 10, scale: 2 }).default("800.00"),
  tier2Reward: decimal("tier2_reward", { precision: 10, scale: 2 }).default("1500.00"),
  tier3Reward: decimal("tier3_reward", { precision: 10, scale: 2 }).default("3500.00"),
  tier4Reward: decimal("tier4_reward", { precision: 10, scale: 2 }).default("32200.00"),
  
  // Tracking completion
  completedTiers: integer("completed_tiers").default(0),
  currentTierProgress: integer("current_tier_progress").default(0),
  
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Point Transactions for detailed tracking
export const pointTransactions = pgTable("point_transactions", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  merchantId: integer("merchant_id").references(() => merchants.id),
  
  type: varchar("type", { 
    enum: ["purchase", "daily_login", "referral", "reward_payout", "stepup_reward", "infinity_reward", "affiliate_reward", "ripple_reward"] 
  }).notNull(),
  
  points: decimal("points", { precision: 15, scale: 2 }).notNull(),
  description: text("description"),
  descriptionBengali: text("description_bengali"),
  
  // Reference for reward tracking
  rewardNumberId: integer("reward_number_id").references(() => rewardNumbers.id),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// VAT and Service Charge tracking
export const vatServiceCharges = pgTable("vat_service_charges", {
  id: serial("id").primaryKey(),
  transactionId: varchar("transaction_id").notNull(),
  transactionType: varchar("transaction_type", { enum: ["withdrawal", "reward_payout", "cashback"] }).notNull(),
  
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  vatAmount: decimal("vat_amount", { precision: 15, scale: 2 }).notNull(),
  serviceChargeAmount: decimal("service_charge_amount", { precision: 15, scale: 2 }).notNull(),
  totalDeduction: decimal("total_deduction", { precision: 15, scale: 2 }).notNull(),
  
  rate: decimal("rate", { precision: 5, scale: 2 }).default("12.50"), // 12.5%
  countryId: integer("country_id").references(() => countries.id),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  merchants: many(merchants),
  coFounders: many(coFounders),
  staff: many(staff),
}));

export const countriesRelations = relations(countries, ({ many }) => ({
  merchants: many(merchants),
  customers: many(customers),
  coFounders: many(coFounders),
  staff: many(staff),
  systemSettings: many(systemSettings),
}));

export const merchantsRelations = relations(merchants, ({ one, many }) => ({
  country: one(countries, {
    fields: [merchants.countryId],
    references: [countries.id],
  }),
  rewardTransactions: many(rewardTransactions),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  country: one(countries, {
    fields: [customers.countryId],
    references: [countries.id],
  }),
  rewardTransactions: many(rewardTransactions),
}));

export const rewardTransactionsRelations = relations(rewardTransactions, ({ one }) => ({
  customer: one(customers, {
    fields: [rewardTransactions.customerId],
    references: [customers.id],
  }),
  merchant: one(merchants, {
    fields: [rewardTransactions.merchantId],
    references: [merchants.id],
  }),
}));

// Insert and Select schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertMerchantSchema = createInsertSchema(merchants);
export const selectMerchantSchema = createSelectSchema(merchants);

export const insertCustomerSchema = createInsertSchema(customers);
export const selectCustomerSchema = createSelectSchema(customers);

export const insertRewardTransactionSchema = createInsertSchema(rewardTransactions);
export const selectRewardTransactionSchema = createSelectSchema(rewardTransactions);

export const insertWithdrawalSchema = createInsertSchema(withdrawals);
export const selectWithdrawalSchema = createSelectSchema(withdrawals);

// Types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;

export type InsertMerchant = z.infer<typeof insertMerchantSchema>;
export type Merchant = z.infer<typeof selectMerchantSchema>;

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = z.infer<typeof selectCustomerSchema>;

export type InsertRewardTransaction = z.infer<typeof insertRewardTransactionSchema>;
export type RewardTransaction = z.infer<typeof selectRewardTransactionSchema>;

export type InsertWithdrawal = z.infer<typeof insertWithdrawalSchema>;
export type Withdrawal = z.infer<typeof selectWithdrawalSchema>;

export const selectCountrySchema = createSelectSchema(countries);
export const selectCoFounderSchema = createSelectSchema(coFounders);
export const selectStaffSchema = createSelectSchema(staff);
export const selectSystemSettingSchema = createSelectSchema(systemSettings);

export type Country = z.infer<typeof selectCountrySchema>;
export type CoFounder = z.infer<typeof selectCoFounderSchema>;
export type Staff = z.infer<typeof selectStaffSchema>;
export type SystemSetting = z.infer<typeof selectSystemSettingSchema>;
