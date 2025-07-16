import { Express } from "express";
import { storage } from "../storage";
import { isAuthenticated } from "../replitAuth";

export function registerRewardRoutes(app: Express) {
  // Get reward statistics
  app.get("/api/reward-stats", isAuthenticated, async (req, res) => {
    try {
      const country = req.query.country as string;
      const countryId = country && country !== 'global' ? parseInt(country) : undefined;

      // Get basic reward statistics
      const rewardStats = {
        totalRewardNumbers: 0,
        activePoints: 0,
        completedPayouts: 0,
        activeCustomers: 0,
        recentActivities: []
      };

      // Get customers with reward data
      const customers = await storage.getCustomers(countryId);
      
      rewardStats.totalRewardNumbers = customers.reduce((sum, customer) => 
        sum + (customer.globalRewardNumbers || 0) + (customer.localRewardNumbers || 0), 0
      );
      
      rewardStats.activePoints = customers.reduce((sum, customer) => 
        sum + parseFloat(customer.accumulatedPoints || "0"), 0
      );
      
      rewardStats.activeCustomers = customers.filter(customer => 
        parseFloat(customer.accumulatedPoints || "0") > 0
      ).length;

      // Mock recent activities for now - in real implementation, get from pointTransactions table
      rewardStats.recentActivities = [
        {
          description: "Customer earned 1500 points for reaching Tier 2",
          descriptionBengali: "গ্রাহক ২য় স্তরে পৌঁছানোর জন্য ১৫০০ পয়েন্ট অর্জন করেছেন",
          points: 1500,
          createdAt: new Date().toISOString()
        },
        {
          description: "Merchant distributed 800 points to customer",
          descriptionBengali: "মার্চেন্ট গ্রাহককে ৮০০ পয়েন্ট বিতরণ করেছেন",
          points: 800,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];

      res.json(rewardStats);
    } catch (error) {
      console.error("Error fetching reward stats:", error);
      res.status(500).json({ error: "Failed to fetch reward statistics" });
    }
  });

  // Get reward number distribution
  app.get("/api/reward-numbers", isAuthenticated, async (req, res) => {
    try {
      const country = req.query.country as string;
      const countryId = country && country !== 'global' ? parseInt(country) : undefined;

      const customers = await storage.getCustomers(countryId);
      
      const distribution = {
        tier1: customers.filter(c => (c.globalRewardNumbers || 0) >= 6).length,
        tier2: customers.filter(c => (c.globalRewardNumbers || 0) >= 30).length,
        tier3: customers.filter(c => (c.globalRewardNumbers || 0) >= 120).length,
        tier4: customers.filter(c => (c.globalRewardNumbers || 0) >= 480).length,
      };

      res.json(distribution);
    } catch (error) {
      console.error("Error fetching reward numbers:", error);
      res.status(500).json({ error: "Failed to fetch reward number distribution" });
    }
  });

  // Get point transactions history
  app.get("/api/point-transactions", isAuthenticated, async (req, res) => {
    try {
      const country = req.query.country as string;
      const type = req.query.type as string;
      const limit = parseInt(req.query.limit as string) || 50;

      // Mock data for now - in real implementation, query pointTransactions table
      const transactions = [
        {
          id: 1,
          customerId: 1,
          merchantId: 1,
          type: "purchase",
          points: 100,
          description: "Purchase reward points",
          descriptionBengali: "ক্রয় পুরস্কার পয়েন্ট",
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          customerId: 2,
          merchantId: null,
          type: "daily_login",
          points: 50,
          description: "Daily login bonus",
          descriptionBengali: "দৈনিক লগইন বোনাস",
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];

      res.json(transactions);
    } catch (error) {
      console.error("Error fetching point transactions:", error);
      res.status(500).json({ error: "Failed to fetch point transactions" });
    }
  });
}