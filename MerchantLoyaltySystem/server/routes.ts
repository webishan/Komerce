import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session ";
import { storage } from "./storage";
import { 
  loginSchema, 
  pointTransferSchema, 
  walletTransferSchema,
  profileSchema,
  Customer,
  type IMerchant 
} from "@shared/schema";
import { z } from "zod";
import { Types } from "mongoose";
import Stripe from "stripe";

// Extend Express session to include merchant ID
declare module "express-session" {
  interface SessionData {
    merchantId?: string;
  }
}

// Middleware to check if merchant is authenticated
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.session.merchantId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Initialize Stripe (optional, only if keys are provided)
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || "komarce-secret-key-mongodb",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { mobile, password } = loginSchema.parse(req.body);
      
      const merchant = await storage.authenticateMerchant(mobile, password);
      if (!merchant) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      req.session.merchantId = merchant._id ? merchant._id.toString() : merchant.id;
      
      // Return merchant data without password (handle both Mongoose documents and plain objects)
      const merchantData = typeof merchant.toObject === 'function' ? merchant.toObject() : { ...merchant };
      delete merchantData.password;
      res.json({ merchant: merchantData });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const merchant = await storage.getMerchant(req.session.merchantId!);
      if (!merchant) {
        return res.status(404).json({ message: "Merchant not found" });
      }
      
      // Return merchant data without password (handle both Mongoose documents and plain objects)
      const merchantData = typeof merchant.toObject === 'function' ? merchant.toObject() : { ...merchant };
      delete merchantData.password;
      res.json({ merchant: merchantData });
    } catch (error) {
      console.error("Get merchant error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Dashboard routes
  app.get("/api/dashboard/stats", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getMerchantDashboardStats(req.session.merchantId!);
      res.json(stats);
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Wallet routes
  app.get("/api/wallets", requireAuth, async (req, res) => {
    try {
      const wallets = await storage.getMerchantWallets(req.session.merchantId!);
      res.json(wallets);
    } catch (error) {
      console.error("Get wallets error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/wallets/transfer", requireAuth, async (req, res) => {
    try {
      const { fromWalletType, toWalletType, amount, description } = walletTransferSchema.parse(req.body);
      
      const merchantId = req.session.merchantId!;
      const fromWallet = await storage.getWalletByType(merchantId, fromWalletType);
      const toWallet = await storage.getWalletByType(merchantId, toWalletType);
      
      if (!fromWallet || !toWallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      
      const transferAmount = parseFloat(amount);
      const fromBalance = parseFloat(fromWallet.balance);
      
      if (fromBalance < transferAmount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      
      const newFromBalance = (fromBalance - transferAmount).toString();
      const newToBalance = (parseFloat(toWallet.balance) + transferAmount).toString();
      
      // Update wallet balances
      await Promise.all([
        storage.updateWalletBalance((fromWallet._id as any).toString(), newFromBalance),
        storage.updateWalletBalance((toWallet._id as any).toString(), newToBalance)
      ]);
      
      // Create transaction record
      await storage.createWalletTransaction({
        merchantId: merchantId,
        walletId: fromWallet._id,
        amount: amount,
        transactionType: "transfer",
        balanceBefore: fromWallet.balance,
        balanceAfter: newFromBalance,
        description: description || `Transfer to ${toWalletType} wallet`,
        status: "completed"
      });
      
      res.json({ message: "Transfer completed successfully" });
    } catch (error) {
      console.error("Wallet transfer error:", error);
      res.status(400).json({ message: "Invalid transfer request" });
    }
  });

  // Point transaction routes
  app.post("/api/points/transfer", requireAuth, async (req, res) => {
    try {
      const { customerMobile, points, description } = pointTransferSchema.parse(req.body);
      
      const merchantId = req.session.merchantId!;
      let customer = await storage.getCustomerByMobile(customerMobile);
      
      // Create customer if doesn't exist
      if (!customer) {
        customer = await storage.createCustomer({
          mobile: customerMobile,
          totalRewardPoints: 0,
          registeredByMerchant: merchantId
        });
      }
      
      // Update customer's total points
      const newTotalPoints = customer.totalRewardPoints + points;
      const rewardNumber = Math.floor(newTotalPoints / 1500).toString();
      
      await Promise.all([
        Customer.findByIdAndUpdate(customer._id, {
          totalRewardPoints: newTotalPoints,
          rewardNumber: rewardNumber
        }),
        storage.createPointTransaction({
          merchantId: merchantId,
          customerId: customer._id,
          points: points,
          transactionType: "distribute",
          description: description || "Points transfer",
          status: "completed"
        })
      ]);
      
      // Calculate and create cashback (15% of points as cashback)
      const cashbackAmount = (points * 0.15).toFixed(2);
      await storage.createCashbackTransaction({
        merchantId: merchantId,
        amount: cashbackAmount,
        cashbackType: "instant15",
        description: "15% instant cashback on point distribution",
        status: "completed"
      });
      
      // Update merchant's income wallet
      const incomeWallet = await storage.getWalletByType(merchantId, "income");
      if (incomeWallet) {
        const newBalance = (parseFloat(incomeWallet.balance) + parseFloat(cashbackAmount)).toString();
        await storage.updateWalletBalance((incomeWallet._id as any).toString(), newBalance);
      }
      
      res.json({ message: "Points transferred successfully", cashback: cashbackAmount });
    } catch (error) {
      console.error("Point transfer error:", error);
      res.status(400).json({ message: "Invalid point transfer request" });
    }
  });

  app.get("/api/points/transactions", requireAuth, async (req, res) => {
    try {
      const transactions = await storage.getMerchantPointTransactions(req.session.merchantId!);
      res.json(transactions);
    } catch (error) {
      console.error("Get point transactions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Customer routes
  app.get("/api/customers", requireAuth, async (req, res) => {
    try {
      const customers = await storage.getMerchantCustomers(req.session.merchantId!);
      res.json(customers);
    } catch (error) {
      console.error("Get customers error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Cashback routes
  app.get("/api/cashback/transactions", requireAuth, async (req, res) => {
    try {
      const transactions = await storage.getMerchantCashbackTransactions(req.session.merchantId!);
      res.json(transactions);
    } catch (error) {
      console.error("Get cashback transactions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/cashback/stats", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getCashbackStats(req.session.merchantId!);
      res.json(stats);
    } catch (error) {
      console.error("Get cashback stats error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Profile routes
  app.get("/api/profile", requireAuth, async (req, res) => {
    try {
      const merchant = await storage.getMerchant(req.session.merchantId!);
      if (!merchant) {
        return res.status(404).json({ message: "Merchant not found" });
      }
      
      const { password: _, ...merchantData } = merchant.toObject();
      res.json(merchantData);
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/profile", requireAuth, async (req, res) => {
    try {
      const updates = profileSchema.parse(req.body);
      
      const merchant = await storage.updateMerchant(req.session.merchantId!, updates);
      if (!merchant) {
        return res.status(404).json({ message: "Merchant not found" });
      }
      
      const { password: _, ...merchantData } = merchant.toObject();
      res.json(merchantData);
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(400).json({ message: "Invalid profile update request" });
    }
  });

  // Referral routes
  app.get("/api/referrals", requireAuth, async (req, res) => {
    try {
      const referrals = await storage.getReferredMerchants(req.session.merchantId!);
      res.json(referrals);
    } catch (error) {
      console.error("Get referrals error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Stripe payment routes (if Stripe is available)
  if (stripe) {
    app.post("/api/create-payment-intent", requireAuth, async (req, res) => {
      try {
        const { amount } = req.body;
        
        const paymentIntent = await stripe!.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: "inr",
          metadata: {
            merchantId: req.session.merchantId!
          }
        });
        
        res.json({ clientSecret: paymentIntent.client_secret });
      } catch (error) {
        console.error("Payment intent error:", error);
        res.status(500).json({ message: "Error creating payment intent" });
      }
    });
  }

  // Wallet transaction routes
  app.get("/api/wallet-transactions", requireAuth, async (req, res) => {
    try {
      const transactions = await storage.getMerchantWalletTransactions(req.session.merchantId!);
      res.json(transactions);
    } catch (error) {
      console.error("Get wallet transactions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}