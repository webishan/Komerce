import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { RewardEngine } from "./services/rewardEngine";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard/stats', isAuthenticated, async (req: any, res) => {
    try {
      const countryId = req.query.countryId ? parseInt(req.query.countryId as string) : undefined;
      const stats = await storage.getDashboardStats(countryId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  app.get('/api/dashboard/country-performance', isAuthenticated, async (req: any, res) => {
    try {
      const performance = await storage.getCountryPerformance();
      res.json(performance);
    } catch (error) {
      console.error("Error fetching country performance:", error);
      res.status(500).json({ message: "Failed to fetch country performance" });
    }
  });

  // Country routes
  app.get('/api/countries', isAuthenticated, async (req, res) => {
    try {
      const countries = await storage.getCountries();
      res.json(countries);
    } catch (error) {
      console.error("Error fetching countries:", error);
      res.status(500).json({ message: "Failed to fetch countries" });
    }
  });

  // Merchant routes
  app.get('/api/merchants', isAuthenticated, async (req: any, res) => {
    try {
      const countryId = req.query.countryId ? parseInt(req.query.countryId as string) : undefined;
      const merchants = await storage.getMerchants(countryId);
      res.json(merchants);
    } catch (error) {
      console.error("Error fetching merchants:", error);
      res.status(500).json({ message: "Failed to fetch merchants" });
    }
  });

  app.post('/api/merchants', isAuthenticated, async (req: any, res) => {
    try {
      const merchantData = {
        ...req.body,
        userId: req.user.id, // Get user ID from authenticated session
      };
      const merchant = await storage.createMerchant(merchantData);
      res.status(201).json(merchant);
    } catch (error) {
      console.error("Error creating merchant:", error);
      res.status(500).json({ message: "Failed to create merchant" });
    }
  });

  app.get('/api/merchants/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const merchant = await storage.getMerchantById(id);
      if (!merchant) {
        return res.status(404).json({ message: "Merchant not found" });
      }
      res.json(merchant);
    } catch (error) {
      console.error("Error fetching merchant:", error);
      res.status(500).json({ message: "Failed to fetch merchant" });
    }
  });

  app.post('/api/merchants', isAuthenticated, async (req: any, res) => {
    try {
      const merchantData = req.body;
      const merchant = await storage.createMerchant(merchantData);
      res.status(201).json(merchant);
    } catch (error) {
      console.error("Error creating merchant:", error);
      res.status(500).json({ message: "Failed to create merchant" });
    }
  });

  app.get('/api/merchants/tier/:tier', isAuthenticated, async (req: any, res) => {
    try {
      const tier = req.params.tier;
      const countryId = req.query.countryId ? parseInt(req.query.countryId as string) : undefined;
      const merchants = await storage.getMerchantsByTier(tier, countryId);
      res.json(merchants);
    } catch (error) {
      console.error("Error fetching merchants by tier:", error);
      res.status(500).json({ message: "Failed to fetch merchants by tier" });
    }
  });

  // Customer routes
  app.get('/api/customers', isAuthenticated, async (req: any, res) => {
    try {
      const countryId = req.query.countryId ? parseInt(req.query.countryId as string) : undefined;
      const customers = await storage.getCustomers(countryId);
      res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.post('/api/customers', isAuthenticated, async (req: any, res) => {
    try {
      console.log("Customer creation request body:", req.body);
      const customerData = {
        ...req.body,
        // Convert date string to Date object if provided
        dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined,
        // Generate unique referral code
        referralCode: `CUS${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      };
      console.log("Processed customer data:", customerData);
      const customer = await storage.createCustomer(customerData);
      console.log("Created customer:", customer);
      res.status(201).json(customer);
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(500).json({ message: "Failed to create customer", error: error.message });
    }
  });

  // Analytics routes
  app.get('/api/analytics/daily', isAuthenticated, async (req: any, res) => {
    try {
      const countryId = req.query.countryId ? parseInt(req.query.countryId as string) : undefined;
      const timeRange = req.query.timeRange || '30d';
      
      // Generate daily analytics data
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const dailyAnalytics = {
        newCustomers: Math.floor(Math.random() * 50) + 10,
        newCustomersChange: `+${Math.floor(Math.random() * 20) + 5}%`,
        pointsEarned: Math.floor(Math.random() * 5000) + 1000,
        pointsChange: `+${Math.floor(Math.random() * 15) + 3}%`,
        transactions: Math.floor(Math.random() * 200) + 50,
        transactionsChange: `+${Math.floor(Math.random() * 25) + 8}%`,
        revenue: Math.floor(Math.random() * 10000) + 2000,
        revenueChange: `+${Math.floor(Math.random() * 30) + 10}%`,
        dailyStats: Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return {
            date: date.toLocaleDateString(),
            customers: Math.floor(Math.random() * 30) + 5,
            growth: Math.floor(Math.random() * 20) - 5
          };
        }).reverse()
      };
      
      res.json(dailyAnalytics);
    } catch (error) {
      console.error("Error fetching daily analytics:", error);
      res.status(500).json({ message: "Failed to fetch daily analytics" });
    }
  });

  app.get('/api/analytics/stats', isAuthenticated, async (req: any, res) => {
    try {
      const countries = await storage.getCountries();
      const countryStats = countries.map(country => ({
        name: country.name,
        flag: country.flag,
        customers: Math.floor(Math.random() * 500) + 100,
        percentage: Math.floor(Math.random() * 40) + 10
      }));
      
      res.json({ countryStats });
    } catch (error) {
      console.error("Error fetching analytics stats:", error);
      res.status(500).json({ message: "Failed to fetch analytics stats" });
    }
  });

  // Point management routes
  app.post('/api/points/add', isAuthenticated, async (req: any, res) => {
    try {
      const { customerId, points, merchantId } = req.body;
      const result = await RewardEngine.processPointAccumulation(customerId, points, merchantId);
      res.json(result);
    } catch (error) {
      console.error("Error adding points:", error);
      res.status(500).json({ message: "Failed to add points" });
    }
  });

  app.post('/api/daily-login', isAuthenticated, async (req: any, res) => {
    try {
      const { customerId } = req.body;
      const reward = await RewardEngine.processDailyLoginReward(customerId);
      res.json({ reward });
    } catch (error) {
      console.error("Error processing daily login:", error);
      res.status(500).json({ message: "Failed to process daily login" });
    }
  });

  app.post('/api/transfer-balance', isAuthenticated, async (req: any, res) => {
    try {
      const { customerId, amount } = req.body;
      const result = await RewardEngine.transferToBalance(customerId, amount);
      res.json(result);
    } catch (error) {
      console.error("Error transferring balance:", error);
      res.status(500).json({ message: "Failed to transfer balance" });
    }
  });

  app.get('/api/customers/top/serial-numbers', isAuthenticated, async (req: any, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const countryId = req.query.countryId ? parseInt(req.query.countryId as string) : undefined;
      const customers = await storage.getTopCustomersBySerialNumbers(limit, countryId);
      res.json(customers);
    } catch (error) {
      console.error("Error fetching top customers by serial numbers:", error);
      res.status(500).json({ message: "Failed to fetch top customers by serial numbers" });
    }
  });

  app.get('/api/customers/top/referrals', isAuthenticated, async (req: any, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const countryId = req.query.countryId ? parseInt(req.query.countryId as string) : undefined;
      const customers = await storage.getTopCustomersByReferrals(limit, countryId);
      res.json(customers);
    } catch (error) {
      console.error("Error fetching top customers by referrals:", error);
      res.status(500).json({ message: "Failed to fetch top customers by referrals" });
    }
  });

  // Customer CRUD routes
  app.get('/api/customers/:id', isAuthenticated, async (req: any, res) => {
    try {
      const customerId = parseInt(req.params.id);
      const customer = await storage.getCustomerById(customerId);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      console.error("Error fetching customer:", error);
      res.status(500).json({ message: "Failed to fetch customer" });
    }
  });

  app.put('/api/customers/:id', isAuthenticated, async (req: any, res) => {
    try {
      const customerId = parseInt(req.params.id);
      const updateData = {
        ...req.body,
        dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined,
      };
      const customer = await storage.updateCustomer(customerId, updateData);
      res.json(customer);
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(500).json({ message: "Failed to update customer" });
    }
  });

  app.delete('/api/customers/:id', isAuthenticated, async (req: any, res) => {
    try {
      const customerId = parseInt(req.params.id);
      await storage.deleteCustomer(customerId);
      res.json({ message: "Customer deleted successfully" });
    } catch (error) {
      console.error("Error deleting customer:", error);
      res.status(500).json({ message: "Failed to delete customer" });
    }
  });

  // Reward transaction routes
  app.get('/api/rewards/transactions', isAuthenticated, async (req: any, res) => {
    try {
      const customerId = req.query.customerId ? parseInt(req.query.customerId as string) : undefined;
      const merchantId = req.query.merchantId ? parseInt(req.query.merchantId as string) : undefined;
      const transactions = await storage.getRewardTransactions(customerId, merchantId);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching reward transactions:", error);
      res.status(500).json({ message: "Failed to fetch reward transactions" });
    }
  });

  // Withdrawal routes
  app.get('/api/withdrawals', isAuthenticated, async (req: any, res) => {
    try {
      const status = req.query.status as string;
      const countryId = req.query.countryId ? parseInt(req.query.countryId as string) : undefined;
      const withdrawals = await storage.getWithdrawals(status, countryId);
      res.json(withdrawals);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      res.status(500).json({ message: "Failed to fetch withdrawals" });
    }
  });

  app.post('/api/withdrawals', isAuthenticated, async (req: any, res) => {
    try {
      const withdrawalData = req.body;
      const withdrawal = await storage.createWithdrawal(withdrawalData);
      res.status(201).json(withdrawal);
    } catch (error) {
      console.error("Error creating withdrawal:", error);
      res.status(500).json({ message: "Failed to create withdrawal" });
    }
  });

  app.patch('/api/withdrawals/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const withdrawal = await storage.updateWithdrawal(id, updates);
      res.json(withdrawal);
    } catch (error) {
      console.error("Error updating withdrawal:", error);
      res.status(500).json({ message: "Failed to update withdrawal" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
