import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Gift, Coins, Wallet, Users, Plus, CreditCard, NotebookPen } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import StatsCard from "@/components/dashboard/stats-card";
import WalletCard from "@/components/dashboard/wallet-card";
import TransactionTable from "@/components/dashboard/transaction-table";
import ChartComponent from "@/components/dashboard/chart-component";
import PointTransferModal from "@/components/dashboard/point-transfer-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const [isPointTransferOpen, setIsPointTransferOpen] = useState(false);

  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: wallets, isLoading: walletsLoading } = useQuery({
    queryKey: ["/api/wallets"],
  });

  const { data: pointTransactions, isLoading: pointTransactionsLoading } = useQuery({
    queryKey: ["/api/points/transactions"],
  });

  const { data: pointStats, isLoading: pointStatsLoading } = useQuery({
    queryKey: ["/api/points/stats"],
  });

  // Mock chart data for demonstration
  const chartData = [
    { name: "Jan", value: 4000, points: 2400, cashback: 600 },
    { name: "Feb", value: 3000, points: 1398, cashback: 420 },
    { name: "Mar", value: 2000, points: 9800, cashback: 1470 },
    { name: "Apr", value: 2780, points: 3908, cashback: 586 },
    { name: "May", value: 1890, points: 4800, cashback: 720 },
    { name: "Jun", value: 2390, points: 3800, cashback: 570 },
    { name: "Jul", value: 3490, points: 4300, cashback: 645 },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-hidden">
        <Header />
        
        <main className="p-6 overflow-y-auto h-full">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Loyalty Points"
              value={dashboardStats?.loyaltyPoints || 0}
              change="+12.5% from last month"
              changeType="positive"
              icon={Gift}
              iconColor="bg-gradient-to-br from-komarce-purple to-purple-600"
              loading={statsLoading}
            />
            
            <StatsCard
              title="Total Cashback"
              value={`৳${dashboardStats?.totalCashback || 0}`}
              change="+8.2% from last month"
              changeType="positive"
              icon={Coins}
              iconColor="bg-gradient-to-br from-komarce-emerald to-emerald-600"
              loading={statsLoading}
            />
            
            <StatsCard
              title="Balance"
              value={`৳${dashboardStats?.balance || 0}`}
              change="After VAT & Service Charge"
              icon={Wallet}
              iconColor="bg-gradient-to-br from-komarce-amber to-orange-600"
              loading={statsLoading}
            />
            
            <StatsCard
              title="Registered Customers"
              value={dashboardStats?.customers || 0}
              change="+18 new this week"
              changeType="positive"
              icon={Users}
              iconColor="bg-gradient-to-br from-purple-500 to-pink-600"
              loading={statsLoading}
            />
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Point Distribution Chart */}
            <div className="lg:col-span-2">
              <ChartComponent
                data={chartData}
                title="Point Distribution Trend"
                type="line"
                loading={pointStatsLoading}
              />
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Points Distributed Today</p>
                  <p className="text-2xl font-bold text-komarce-purple mt-1">
                    {pointStats?.todayDistributed || 0}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 text-sm">Monthly Total</p>
                  <p className="text-2xl font-bold text-komarce-emerald mt-1">
                    {pointStats?.monthlyDistributed || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full btn-primary"
                    onClick={() => setIsPointTransferOpen(true)}
                  >
                    <NotebookPen className="w-4 h-4 mr-2" />
                    Transfer Points
                  </Button>
                  <Button className="w-full btn-secondary">
                    <Plus className="w-4 h-4 mr-2" />
                    Purchase Points
                  </Button>
                  <Button className="w-full btn-accent">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Withdraw Balance
                  </Button>
                </CardContent>
              </Card>

              {/* Referral Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Referral Program</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Referred Merchants</span>
                    <span className="font-bold text-komarce-purple">
                      {dashboardStats?.referralCount || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Commission Earned</span>
                    <span className="font-bold text-komarce-emerald">
                      ৳{dashboardStats?.referralCommission || 0}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Your Referral Link</p>
                    <div className="flex items-center justify-between">
                      <code className="text-xs bg-white px-2 py-1 rounded">
                        komarce.com/ref/M001
                      </code>
                      <Button size="sm" variant="ghost">
                        Copy
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Wallets Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <WalletCard
              title="Reward Point Wallet"
              balance={wallets?.find((w: any) => w.walletType === "reward_point")?.balance || "0"}
              description="Available Points"
              icon={Gift}
              type="reward"
              details={[
                {
                  label: "Distributed",
                  value: wallets?.find((w: any) => w.walletType === "reward_point")?.totalOut || "0",
                },
                {
                  label: "Remaining",
                  value: wallets?.find((w: any) => w.walletType === "reward_point")?.balance || "0",
                },
              ]}
              loading={walletsLoading}
            />

            <WalletCard
              title="Income Wallet"
              balance={`৳${wallets?.find((w: any) => w.walletType === "income")?.balance || "0"}`}
              description="Total Income"
              icon={Coins}
              type="income"
              details={[
                { label: "15% Cashback", value: "৳5,200" },
                { label: "2% Referral", value: "৳1,240" },
                { label: "1% Royalty", value: "৳2,010" },
              ]}
              loading={walletsLoading}
            />

            <WalletCard
              title="Komarce Wallet"
              balance={`৳${wallets?.find((w: any) => w.walletType === "komarce")?.balance || "0"}`}
              description="Available Balance"
              icon={Wallet}
              type="komarce"
              actions={[
                {
                  label: "Add Balance",
                  onClick: () => {},
                  variant: "default",
                },
              ]}
              loading={walletsLoading}
            />
          </div>

          {/* Recent Transactions */}
          <TransactionTable
            transactions={pointTransactions || []}
            title="Recent Point Transactions"
            loading={pointTransactionsLoading}
          />
        </main>
      </div>

      <PointTransferModal
        isOpen={isPointTransferOpen}
        onClose={() => setIsPointTransferOpen(false)}
      />
    </div>
  );
}
