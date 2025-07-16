import { useQuery } from "@tanstack/react-query";
import { Coins, TrendingUp, Users, Percent, DollarSign, ArrowUpRight } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import StatsCard from "@/components/dashboard/stats-card";
import TransactionTable from "@/components/dashboard/transaction-table";
import ChartComponent from "@/components/dashboard/chart-component";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Cashback() {
  const { data: cashbackStats, isLoading: cashbackStatsLoading } = useQuery({
    queryKey: ["/api/cashback/stats"],
  });

  const { data: cashbackTransactions, isLoading: cashbackTransactionsLoading } = useQuery({
    queryKey: ["/api/cashback/transactions"],
  });

  const { data: dashboardStats, isLoading: dashboardStatsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  // Mock data for cashback breakdown chart
  const cashbackChartData = [
    { name: "15% Instant", value: cashbackStats?.instant15Cashback || 0 },
    { name: "2% Referral", value: cashbackStats?.referral2Cashback || 0 },
    { name: "1% Royalty", value: cashbackStats?.royalty1Cashback || 0 },
  ];

  // Mock data for monthly cashback trend
  const trendData = [
    { name: "Jan", value: 2400 },
    { name: "Feb", value: 1398 },
    { name: "Mar", value: 9800 },
    { name: "Apr", value: 3908 },
    { name: "May", value: 4800 },
    { name: "Jun", value: 3800 },
    { name: "Jul", value: 4300 },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-hidden">
        <Header />
        
        <main className="p-6 overflow-y-auto h-full">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cashback Management</h1>
            <p className="text-gray-600">Track and manage your cashback earnings from all sources</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Cashback"
              value={`৳${cashbackStats?.totalCashback || 0}`}
              change="+15.3% from last month"
              changeType="positive"
              icon={Coins}
              iconColor="bg-gradient-to-br from-komarce-emerald to-emerald-600"
              loading={cashbackStatsLoading}
            />
            
            <StatsCard
              title="15% Instant Cashback"
              value={`৳${cashbackStats?.instant15Cashback || 0}`}
              change="From point transfers"
              icon={TrendingUp}
              iconColor="bg-gradient-to-br from-komarce-purple to-purple-600"
              loading={cashbackStatsLoading}
            />
            
            <StatsCard
              title="2% Referral Commission"
              value={`৳${cashbackStats?.referral2Cashback || 0}`}
              change={`From ${dashboardStats?.referralCount || 0} referrals`}
              icon={Users}
              iconColor="bg-gradient-to-br from-komarce-amber to-orange-600"
              loading={cashbackStatsLoading}
            />
            
            <StatsCard
              title="1% Royalty Bonus"
              value={`৳${cashbackStats?.royalty1Cashback || 0}`}
              change="Monthly merchant bonus"
              icon={Percent}
              iconColor="bg-gradient-to-br from-purple-500 to-pink-600"
              loading={cashbackStatsLoading}
            />
          </div>

          {/* Cashback Breakdown and Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartComponent
              data={cashbackChartData}
              title="Cashback Breakdown"
              type="bar"
              loading={cashbackStatsLoading}
            />
            
            <ChartComponent
              data={trendData}
              title="Monthly Cashback Trend"
              type="line"
              loading={cashbackStatsLoading}
            />
          </div>

          {/* Cashback Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-8 h-8 bg-komarce-purple bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                    <TrendingUp className="w-4 h-4 text-komarce-purple" />
                  </div>
                  Instant Cashback (15%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-komarce-purple mb-2">
                  ৳{cashbackStats?.instant15Cashback || 0}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Earned from point transfers to customers
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>This Month</span>
                    <span className="font-medium">৳2,850</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Average Daily</span>
                    <span className="font-medium">৳95</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-8 h-8 bg-komarce-amber bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                    <Users className="w-4 h-4 text-komarce-amber" />
                  </div>
                  Referral Commission (2%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-komarce-amber mb-2">
                  ৳{cashbackStats?.referral2Cashback || 0}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  From {dashboardStats?.referralCount || 0} referred merchants
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Active Referrals</span>
                    <span className="font-medium">{dashboardStats?.referralCount || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Commission Rate</span>
                    <span className="font-medium">2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <div className="w-8 h-8 bg-komarce-emerald bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                    <Percent className="w-4 h-4 text-komarce-emerald" />
                  </div>
                  Royalty Bonus (1%)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-komarce-emerald mb-2">
                  ৳{cashbackStats?.royalty1Cashback || 0}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Monthly share from all merchants
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Your Share</span>
                    <span className="font-medium">1%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Distribution</span>
                    <span className="font-medium">Monthly</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cashback Incentives */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Merchant Incentive Program</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Star Merchant</h4>
                    <Badge variant="secondary">Current</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Achieve 1,000 points distribution monthly
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Progress</span>
                    <span className="text-sm font-medium">750/1,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-komarce-purple h-2 rounded-full" style={{ width: "75%" }} />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Super Star Merchant</h4>
                    <Badge variant="outline">Next</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Achieve 2,000 points distribution monthly
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bonus</span>
                    <span className="text-sm font-medium">+5% Cashback</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">Co-Founder</h4>
                    <Badge variant="outline">Premium</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Exclusive partnership benefits
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Revenue Share</span>
                    <span className="text-sm font-medium">14%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* VAT & Service Charges */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>VAT & Service Charges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Gross Cashback</p>
                      <p className="text-sm text-gray-600">Before deductions</p>
                    </div>
                    <p className="font-bold text-lg">৳{cashbackStats?.totalCashback || 0}</p>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-red-700">VAT & Service Charge</p>
                      <p className="text-sm text-red-600">12.5% deduction</p>
                    </div>
                    <p className="font-bold text-lg text-red-700">
                      -৳{((cashbackStats?.totalCashback || 0) * 0.125).toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-700">Net Balance</p>
                      <p className="text-sm text-green-600">Available for withdrawal</p>
                    </div>
                    <p className="font-bold text-lg text-green-700">
                      ৳{((cashbackStats?.totalCashback || 0) * 0.875).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full btn-primary">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Transfer to Komarce Wallet
                </Button>
                
                <Button className="w-full btn-secondary">
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Withdraw Balance
                </Button>
                
                <Button className="w-full" variant="outline">
                  <Coins className="w-4 h-4 mr-2" />
                  View Detailed Report
                </Button>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Next Payment</p>
                  <p className="font-medium">৳{((cashbackStats?.totalCashback || 0) * 0.875).toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Available for withdrawal</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Cashback Transactions */}
          <TransactionTable
            transactions={cashbackTransactions || []}
            title="Recent Cashback Transactions"
            loading={cashbackTransactionsLoading}
          />
        </main>
      </div>
    </div>
  );
}
