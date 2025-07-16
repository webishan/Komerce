import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useTranslation } from "@/lib/i18n";
import StatsCard from "@/components/dashboard/StatsCard";
import CountryPerformance from "@/components/dashboard/CountryPerformance";
import MerchantTiers from "@/components/dashboard/MerchantTiers";
import CustomerLeaderboard from "@/components/dashboard/CustomerLeaderboard";
import RecentActivities from "@/components/dashboard/RecentActivities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Store,
  Users,
  Award,
  DollarSign,
  Plus,
  BarChart3,
  Settings,
  Gift,
} from "lucide-react";

interface DashboardProps {
  language: string;
  selectedCountry: string;
}

export default function Dashboard({ language, selectedCountry }: DashboardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation(language as any);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Dashboard stats query
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['/api/dashboard/stats', selectedCountry !== 'global' ? selectedCountry : undefined],
    enabled: isAuthenticated,
    retry: false,
  });

  // Country performance query
  const { data: countryPerformance, isLoading: countryLoading } = useQuery({
    queryKey: ['/api/dashboard/country-performance'],
    enabled: isAuthenticated && selectedCountry === 'global',
    retry: false,
  });

  // Top customers queries
  const { data: topCustomersBySN } = useQuery({
    queryKey: ['/api/customers/top/serial-numbers', { limit: 3, countryId: selectedCountry !== 'global' ? selectedCountry : undefined }],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: topCustomersByReferrals } = useQuery({
    queryKey: ['/api/customers/top/referrals', { limit: 3, countryId: selectedCountry !== 'global' ? selectedCountry : undefined }],
    enabled: isAuthenticated,
    retry: false,
  });

  // Handle API errors
  if (statsError && isUnauthorizedError(statsError as Error)) {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Logging in again...",
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 500);
    return null;
  }

  if (isLoading || !isAuthenticated) {
    return <DashboardSkeleton />;
  }

  // Mock recent activities (in a real app, this would come from API)
  const recentActivities = [
    {
      id: '1',
      description: 'New merchant registered',
      descriptionBengali: 'নতুন মার্চেন্ট নিবন্ধিত',
      time: '2 minutes ago',
      timeBengali: '২ মিনিট আগে',
      type: 'success' as const,
    },
    {
      id: '2', 
      description: '1500 points redeemed',
      descriptionBengali: '১৫০০ পয়েন্ট রিডিম',
      time: '5 minutes ago',
      timeBengali: '৫ মিনিট আগে',
      type: 'info' as const,
    },
    {
      id: '3',
      description: 'Customer withdrawal approved',
      descriptionBengali: 'গ্রাহক উত্তোলন অনুমোদিত',
      time: '10 minutes ago', 
      timeBengali: '১০ মিনিট আগে',
      type: 'warning' as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={t("dashboard.globalMerchants")}
          titleBengali="গ্লোবাল মার্চেন্ট"
          value={stats?.merchants?.total || 0}
          change="+12.5%"
          changeType="positive"
          icon={Store}
          iconColor="text-primary"
          iconBgColor="bg-primary/10"
          language={language}
        />
        
        <StatsCard
          title={t("dashboard.globalCustomers")}
          titleBengali="গ্লোবাল গ্রাহক"
          value={stats?.customers?.total || 0}
          change="+8.2%"
          changeType="positive"
          icon={Users}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          language={language}
        />
        
        <StatsCard
          title={t("dashboard.rewardPoints")}
          titleBengali="পুরস্কার পয়েন্ট"
          value={stats?.rewards?.totalPoints ? `${(stats.rewards.totalPoints / 1000000).toFixed(1)}M` : "0"}
          change="+24.3%"
          changeType="positive"
          icon={Award}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-100"
          language={language}
        />
        
        <StatsCard
          title={t("dashboard.withdrawals")}
          titleBengali="উত্তোলন"
          value={stats?.withdrawals?.totalAmount ? `$${(Number(stats.withdrawals.totalAmount) / 1000).toFixed(0)}K` : "$0"}
          change="+5.4%"
          changeType="positive"
          icon={DollarSign}
          iconColor="text-red-600"
          iconBgColor="bg-red-100"
          language={language}
        />
      </div>

      {/* Country Performance & Merchant Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {selectedCountry === 'global' && countryPerformance && (
          <CountryPerformance
            data={countryPerformance}
            language={language}
          />
        )}
        
        <MerchantTiers
          data={stats?.merchants}
          language={language}
        />
      </div>

      {/* Customer Leaderboards & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CustomerLeaderboard
          title={t("dashboard.topCustomers")}
          titleBengali="শীর্ষ গ্রাহক (ক্রমিক নং)"
          data={topCustomersBySN || []}
          language={language}
          valueKey="serialNumbers"
          colorScheme="blue"
        />
        
        <CustomerLeaderboard
          title={t("dashboard.topReferrers")}
          titleBengali="শীর্ষ রেফারকারী"
          data={topCustomersByReferrals || []}
          language={language}
          valueKey="referralCount"
          colorScheme="purple"
        />
        
        <RecentActivities
          data={recentActivities}
          language={language}
        />
      </div>

      {/* Reward System & VAT Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* VAT & Service Charge Summary */}
        <Card className="border-gray-100">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {t("dashboard.vatServiceCharge")}
            </CardTitle>
            {language === 'bn' && (
              <p className="text-sm text-gray-500 font-bengali">ভ্যাট ও সেবা চার্জ</p>
            )}
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">$12,456</p>
                <p className="text-sm text-gray-600">Total VAT</p>
                <p className="text-xs text-gray-500 font-bengali">মোট ভ্যাট</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">$8,234</p>
                <p className="text-sm text-gray-600">Service Charge</p>
                <p className="text-xs text-gray-500 font-bengali">সেবা চার্জ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reward System Tiers */}
        <Card className="border-gray-100">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {t("dashboard.rewardSystemTiers")}
            </CardTitle>
            {language === 'bn' && (
              <p className="text-sm text-gray-500 font-bengali">পুরস্কার সিস্টেম স্তর</p>
            )}
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                { tier: 4, points: "32,200", emoji: "👑", color: "yellow" },
                { tier: 3, points: "3,500", emoji: "💎", color: "purple" },
                { tier: 2, points: "1,500", emoji: "🏆", color: "blue" },
                { tier: 1, points: "800", emoji: "🥉", color: "green" },
              ].map((reward) => (
                <div key={reward.tier} className={`bg-gradient-to-r from-${reward.color}-50 to-${reward.color}-100 p-4 rounded-lg border border-${reward.color}-200`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Tier {reward.tier} {reward.tier === 4 ? '(Highest)' : ''}
                      </p>
                      <p className="text-sm text-gray-600">{reward.points} Points</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{reward.emoji}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 font-bengali">
                <strong>নোট:</strong> ১৫০০ পয়েন্ট হলেই রিওয়ার্ড নাম্বার তৈরি হবে
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Note: Reward number generated at 1500 points
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-gray-100">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {t("dashboard.quickActions")}
          </CardTitle>
          {language === 'bn' && (
            <p className="text-sm text-gray-500 font-bengali">দ্রুত কার্যক্রম</p>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto flex-col py-4 bg-primary/5 hover:bg-primary/10 border-primary/20"
            >
              <Plus className="w-8 h-8 text-primary mb-2" />
              <span className="text-sm font-medium text-gray-900">Add Merchant</span>
              <span className="text-xs text-gray-500 font-bengali">মার্চেন্ট যোগ</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto flex-col py-4 bg-green-50 hover:bg-green-100 border-green-200"
            >
              <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">View Reports</span>
              <span className="text-xs text-gray-500 font-bengali">রিপোর্ট দেখুন</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto flex-col py-4 bg-amber-50 hover:bg-amber-100 border-amber-200"
            >
              <Gift className="w-8 h-8 text-amber-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Manage Points</span>
              <span className="text-xs text-gray-500 font-bengali">পয়েন্ট ব্যবস্থাপনা</span>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto flex-col py-4 bg-red-50 hover:bg-red-100 border-red-200"
            >
              <Settings className="w-8 h-8 text-red-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Settings</span>
              <span className="text-xs text-gray-500 font-bengali">সেটিংস</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-12 w-12 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional skeleton elements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="border-gray-100">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <Skeleton key={j} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
