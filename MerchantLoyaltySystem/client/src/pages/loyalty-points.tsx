import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Gift, QrCode, Send, History, TrendingUp } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import StatsCard from "@/components/dashboard/stats-card";
import TransactionTable from "@/components/dashboard/transaction-table";
import ChartComponent from "@/components/dashboard/chart-component";
import PointTransferModal from "@/components/dashboard/point-transfer-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LoyaltyPoints() {
  const [isPointTransferOpen, setIsPointTransferOpen] = useState(false);
  const [distributionMode, setDistributionMode] = useState("manual");

  const { data: pointStats, isLoading: pointStatsLoading } = useQuery({
    queryKey: ["/api/points/stats"],
  });

  const { data: pointTransactions, isLoading: pointTransactionsLoading } = useQuery({
    queryKey: ["/api/points/transactions"],
  });

  const { data: wallets, isLoading: walletsLoading } = useQuery({
    queryKey: ["/api/wallets"],
  });

  const rewardWallet = wallets?.find((w: any) => w.walletType === "reward_point");

  // Mock chart data for point distribution
  const chartData = [
    { name: "Mon", value: 120 },
    { name: "Tue", value: 190 },
    { name: "Wed", value: 300 },
    { name: "Thu", value: 250 },
    { name: "Fri", value: 400 },
    { name: "Sat", value: 350 },
    { name: "Sun", value: 280 },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-hidden">
        <Header />
        
        <main className="p-6 overflow-y-auto h-full">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Loyalty Points Management</h1>
            <p className="text-gray-600">Manage your reward points and track distribution</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Available Points"
              value={rewardWallet?.balance || 0}
              change="+5.2% from last week"
              changeType="positive"
              icon={Gift}
              iconColor="bg-gradient-to-br from-komarce-purple to-purple-600"
              loading={walletsLoading}
            />
            
            <StatsCard
              title="Total Distributed"
              value={pointStats?.totalDistributed || 0}
              change="+12.5% from last month"
              changeType="positive"
              icon={Send}
              iconColor="bg-gradient-to-br from-komarce-emerald to-emerald-600"
              loading={pointStatsLoading}
            />
            
            <StatsCard
              title="Today's Distribution"
              value={pointStats?.todayDistributed || 0}
              change="Points distributed today"
              icon={TrendingUp}
              iconColor="bg-gradient-to-br from-komarce-amber to-orange-600"
              loading={pointStatsLoading}
            />
            
            <StatsCard
              title="Monthly Total"
              value={pointStats?.monthlyDistributed || 0}
              change="This month's total"
              icon={History}
              iconColor="bg-gradient-to-br from-purple-500 to-pink-600"
              loading={pointStatsLoading}
            />
          </div>

          {/* Point Distribution Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Point Distribution</CardTitle>
                    <div className="flex items-center space-x-3">
                      <Select value={distributionMode} onValueChange={setDistributionMode}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual Mode</SelectItem>
                          <SelectItem value="automatic">Automatic Mode</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        variant="outline"
                        onClick={() => setIsPointTransferOpen(true)}
                      >
                        <QrCode className="w-4 h-4 mr-2" />
                        QR Transfer
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ChartComponent
                    data={chartData}
                    title="Weekly Point Distribution"
                    type="bar"
                    loading={pointStatsLoading}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Distribution Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Distribution Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full btn-primary"
                  onClick={() => setIsPointTransferOpen(true)}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Points
                </Button>
                
                <Button className="w-full btn-secondary">
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code Transfer
                </Button>
                
                <Button className="w-full btn-accent">
                  <Gift className="w-4 h-4 mr-2" />
                  Purchase Points
                </Button>
                
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Distribution Settings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Current Mode:</span>
                      <span className="font-medium capitalize">{distributionMode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Min Points:</span>
                      <span className="font-medium">1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Points:</span>
                      <span className="font-medium">10,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Point Purchase History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Purchase History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">1,000 Points</p>
                      <p className="text-sm text-gray-600">Jan 15, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">৳1,000</p>
                      <p className="text-sm text-green-600">Completed</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">2,500 Points</p>
                      <p className="text-sm text-gray-600">Jan 10, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">৳2,500</p>
                      <p className="text-sm text-green-600">Completed</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">5,000 Points</p>
                      <p className="text-sm text-gray-600">Jan 5, 2024</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">৳5,000</p>
                      <p className="text-sm text-green-600">Completed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Points Purchased</span>
                    <span className="font-bold text-komarce-purple">25,000</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Points Distributed</span>
                    <span className="font-bold text-komarce-emerald">
                      {pointStats?.totalDistributed || 0}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Remaining Points</span>
                    <span className="font-bold text-komarce-amber">
                      {rewardWallet?.balance || 0}
                    </span>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Efficiency Rate</span>
                      <span className="font-bold text-green-600">95.2%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
