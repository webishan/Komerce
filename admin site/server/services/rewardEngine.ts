import { db } from "../db";
import { customers, rewardNumbers, pointTransactions, vatServiceCharges } from "../../shared/schema";
import { eq, and, count, sum } from "drizzle-orm";

export class RewardEngine {
  
  // Core reward logic: When accumulated points reach 1500, convert to reward number
  static async processPointAccumulation(customerId: number, newPoints: number, merchantId?: number) {
    const customer = await db.select().from(customers).where(eq(customers.id, customerId)).limit(1);
    if (!customer.length) throw new Error("Customer not found");
    
    const currentPoints = parseFloat(customer[0].accumulatedPoints || "0");
    const newTotal = currentPoints + newPoints;
    
    // Record the point transaction
    await db.insert(pointTransactions).values({
      customerId,
      merchantId,
      type: "purchase",
      points: newPoints.toString(),
      description: `Earned ${newPoints} points from purchase`,
      descriptionBengali: `ক্রয় থেকে ${newPoints} পয়েন্ট অর্জিত`,
    });
    
    // Check if points reach 1500 threshold for reward number generation
    if (newTotal >= 1500) {
      const rewardNumbersToGenerate = Math.floor(newTotal / 1500);
      const remainingPoints = newTotal % 1500;
      
      // Generate reward numbers
      for (let i = 0; i < rewardNumbersToGenerate; i++) {
        await this.generateRewardNumber(customerId);
      }
      
      // Update customer with remaining points
      await db.update(customers)
        .set({ 
          accumulatedPoints: remainingPoints.toString(),
          globalRewardNumbers: customer[0].globalRewardNumbers + rewardNumbersToGenerate
        })
        .where(eq(customers.id, customerId));
    } else {
      // Just update accumulated points
      await db.update(customers)
        .set({ accumulatedPoints: newTotal.toString() })
        .where(eq(customers.id, customerId));
    }
    
    return { newTotal, rewardNumbersGenerated: Math.floor(newTotal / 1500) };
  }
  
  // Generate global reward number and start four-tier reward process
  static async generateRewardNumber(customerId: number) {
    // Get next global reward number
    const globalCount = await db.select({ count: count() }).from(rewardNumbers);
    const nextGlobalNumber = (globalCount[0]?.count || 0) + 1;
    
    // Create reward number record
    const rewardNumber = await db.insert(rewardNumbers).values({
      customerId,
      globalNumber: nextGlobalNumber,
      countryId: null, // Global number
      tier1Reward: "800.00",
      tier2Reward: "1500.00", 
      tier3Reward: "3500.00",
      tier4Reward: "32200.00",
      completedTiers: 0,
      currentTierProgress: 0,
    }).returning();
    
    // Check and process tier rewards based on global count
    await this.checkTierRewards(rewardNumber[0].id, nextGlobalNumber);
    
    return rewardNumber[0];
  }
  
  // Process four-tier reward system based on global numbers
  static async checkTierRewards(rewardNumberId: number, globalNumber: number) {
    const rewardRecord = await db.select().from(rewardNumbers)
      .where(eq(rewardNumbers.id, rewardNumberId)).limit(1);
    
    if (!rewardRecord.length) return;
    
    const reward = rewardRecord[0];
    const customer = await db.select().from(customers)
      .where(eq(customers.id, reward.customerId)).limit(1);
    
    if (!customer.length) return;
    
    // Four-tier system: 6, 30, 120, 480 global numbers trigger rewards
    const tierThresholds = [
      { threshold: 6, reward: 800, tier: 1 },
      { threshold: 30, reward: 1500, tier: 2 },
      { threshold: 120, reward: 3500, tier: 3 },
      { threshold: 480, reward: 32200, tier: 4 }
    ];
    
    for (const tierInfo of tierThresholds) {
      if (globalNumber >= tierInfo.threshold && reward.completedTiers < tierInfo.tier) {
        await this.processTierReward(reward, tierInfo, customer[0]);
      }
    }
  }
  
  // Process individual tier reward
  static async processTierReward(rewardNumber: any, tierInfo: any, customer: any) {
    const rewardAmount = tierInfo.reward;
    
    // Update reward number completion
    await db.update(rewardNumbers)
      .set({ 
        completedTiers: tierInfo.tier,
        currentTierProgress: tierInfo.threshold 
      })
      .where(eq(rewardNumbers.id, rewardNumber.id));
    
    // Process tier 4 special logic (32200 reward)
    if (tierInfo.tier === 4) {
      await this.processTier4Reward(customer, rewardAmount);
    } else {
      // Regular tier rewards (800, 1500, 3500)
      await this.addStepUpReward(customer.id, rewardAmount, tierInfo.tier);
    }
  }
  
  // Process Tier 4 (32200) - Special infinity reward logic
  static async processTier4Reward(customer: any, totalReward: number) {
    const shoppingVoucher = 6000; // 6000 for shopping vouchers
    const cashReward = totalReward - (shoppingVoucher * 2); // 32200 - 12000 = 20200
    
    // Add step-up reward
    await this.addStepUpReward(customer.id, cashReward, 4);
    
    // Generate 4 new global reward numbers (Infinity reward)
    for (let i = 0; i < 4; i++) {
      await this.generateRewardNumber(customer.id);
    }
    
    // Add shopping voucher record
    await this.addShoppingVoucher(customer.id, shoppingVoucher);
    
    // Record infinity reward transaction
    await db.insert(pointTransactions).values({
      customerId: customer.id,
      type: "infinity_reward",
      points: cashReward.toString(),
      description: `Infinity reward: ${cashReward} + 4 new reward numbers`,
      descriptionBengali: `ইনফিনিটি রিওয়ার্ড: ${cashReward} + ৪টি নতুন রিওয়ার্ড নম্বর`,
      rewardNumberId: null,
    });
  }
  
  // Add step-up reward to customer income
  static async addStepUpReward(customerId: number, amount: number, tier: number) {
    const customer = await db.select().from(customers).where(eq(customers.id, customerId)).limit(1);
    if (!customer.length) return;
    
    const currentRewards = parseFloat(customer[0].totalRewards || "0");
    const newTotal = currentRewards + amount;
    
    // Update customer total rewards
    await db.update(customers)
      .set({ totalRewards: newTotal.toString() })
      .where(eq(customers.id, customerId));
    
    // Record step-up reward transaction
    await db.insert(pointTransactions).values({
      customerId,
      type: "stepup_reward",
      points: amount.toString(),
      description: `Step-up reward Tier ${tier}: ${amount}`,
      descriptionBengali: `স্টেপ-আপ রিওয়ার্ড টায়ার ${tier}: ${amount}`,
    });
  }
  
  // Add shopping voucher
  static async addShoppingVoucher(customerId: number, amount: number) {
    // Record shopping voucher transaction
    await db.insert(pointTransactions).values({
      customerId,
      type: "reward_payout",
      points: amount.toString(),
      description: `Shopping voucher: ${amount}`,
      descriptionBengali: `শপিং ভাউচার: ${amount}`,
    });
  }
  
  // Process affiliate/referral rewards (5% of referred customer's points)
  static async processAffiliateReward(referrerId: number, referredCustomerId: number, pointsEarned: number) {
    const affiliateReward = Math.floor(pointsEarned * 0.05); // 5% commission
    
    if (affiliateReward > 0) {
      const referrer = await db.select().from(customers).where(eq(customers.id, referrerId)).limit(1);
      if (referrer.length) {
        const currentRewards = parseFloat(referrer[0].totalRewards || "0");
        
        await db.update(customers)
          .set({ totalRewards: (currentRewards + affiliateReward).toString() })
          .where(eq(customers.id, referrerId));
        
        // Record affiliate reward
        await db.insert(pointTransactions).values({
          customerId: referrerId,
          type: "affiliate_reward",
          points: affiliateReward.toString(),
          description: `Affiliate commission: 5% of ${pointsEarned} points`,
          descriptionBengali: `অ্যাফিলিয়েট কমিশন: ${pointsEarned} পয়েন্টের ৫%`,
        });
      }
    }
  }
  
  // Process ripple rewards (when referred customer gets step-up rewards)
  static async processRippleReward(referrerId: number, stepUpAmount: number, tier: number) {
    const rippleRewards = [0, 50, 100, 150, 700]; // Tier 1-4 ripple rewards
    const rippleAmount = rippleRewards[tier] || 0;
    
    if (rippleAmount > 0) {
      const referrer = await db.select().from(customers).where(eq(customers.id, referrerId)).limit(1);
      if (referrer.length) {
        const currentRewards = parseFloat(referrer[0].totalRewards || "0");
        
        await db.update(customers)
          .set({ totalRewards: (currentRewards + rippleAmount).toString() })
          .where(eq(customers.id, referrerId));
        
        // Record ripple reward
        await db.insert(pointTransactions).values({
          customerId: referrerId,
          type: "ripple_reward",
          points: rippleAmount.toString(),
          description: `Ripple reward from Tier ${tier}: ${rippleAmount}`,
          descriptionBengali: `রিপল রিওয়ার্ড টায়ার ${tier} থেকে: ${rippleAmount}`,
        });
      }
    }
  }
  
  // Daily login reward (100-200 points)
  static async processDailyLoginReward(customerId: number) {
    const loginReward = Math.floor(Math.random() * 101) + 100; // 100-200 random points
    
    const customer = await db.select().from(customers).where(eq(customers.id, customerId)).limit(1);
    if (!customer.length) return;
    
    // Update daily login count
    const newLoginCount = (customer[0].dailyLoginCount || 0) + 1;
    await db.update(customers)
      .set({ 
        dailyLoginCount: newLoginCount,
        lastLoginDate: new Date(),
      })
      .where(eq(customers.id, customerId));
    
    // Add login reward to accumulated points
    await this.processPointAccumulation(customerId, loginReward);
    
    // Record daily login transaction
    await db.insert(pointTransactions).values({
      customerId,
      type: "daily_login",
      points: loginReward.toString(),
      description: `Daily login reward: ${loginReward} points`,
      descriptionBengali: `দৈনিক লগইন রিওয়ার্ড: ${loginReward} পয়েন্ট`,
    });
    
    return loginReward;
  }
  
  // Transfer from income to balance wallet (with 12.5% VAT/Service charge)
  static async transferToBalance(customerId: number, amount: number) {
    const vatRate = 0.125; // 12.5%
    const vatAmount = amount * vatRate;
    const netAmount = amount - vatAmount;
    
    const customer = await db.select().from(customers).where(eq(customers.id, customerId)).limit(1);
    if (!customer.length) throw new Error("Customer not found");
    
    const currentRewards = parseFloat(customer[0].totalRewards || "0");
    const currentBalance = parseFloat(customer[0].balance || "0");
    
    if (currentRewards < amount) {
      throw new Error("Insufficient reward balance");
    }
    
    // Update customer balances
    await db.update(customers)
      .set({ 
        totalRewards: (currentRewards - amount).toString(),
        balance: (currentBalance + netAmount).toString()
      })
      .where(eq(customers.id, customerId));
    
    // Record VAT/Service charge
    await db.insert(vatServiceCharges).values({
      transactionId: `TRANSFER_${Date.now()}`,
      transactionType: "reward_payout",
      amount: amount.toString(),
      vatAmount: vatAmount.toString(),
      serviceChargeAmount: "0.00",
      totalDeduction: vatAmount.toString(),
      rate: "12.50",
      countryId: customer[0].countryId,
    });
    
    return { netAmount, vatAmount };
  }
  
  // Merchant cashback system
  static async processMerchantCashback(merchantId: number, pointsDistributed: number) {
    const instantCashback = pointsDistributed * 0.15; // 15% instant cashback
    
    // Record merchant cashback (implementation would depend on merchant schema)
    await db.insert(pointTransactions).values({
      customerId: null,
      merchantId,
      type: "reward_payout",
      points: instantCashback.toString(),
      description: `Merchant instant cashback: 15% of ${pointsDistributed} points`,
      descriptionBengali: `মার্চেন্ট তাৎক্ষণিক ক্যাশব্যাক: ${pointsDistributed} পয়েন্টের ১৫%`,
    });
    
    return instantCashback;
  }
}