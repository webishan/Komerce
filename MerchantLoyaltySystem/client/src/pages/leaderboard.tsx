import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Star, Crown, Medal, TrendingUp, Award, Users, Target } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";

export default function Leaderboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedMetric, setSelectedMetric] = useState("points");
  const { merchant } = useAuth();

  const { data: dashboardStats, isLoading: dashboardStatsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  // Mock leaderboard data - in real app this would come from API
  const leaderboardData = [
    {
      id: 1,
      name: "Ahmed Hassan",
      referralId: "M001",
      rank: 1,
      points: 15420,
      customers: 247,
      revenue: 45600,
      badge: "Co-Founder",
      change: "+5",
      avatar: "AH",
      isCurrentUser: merchant?.referralId === "M001",
    },
    {
      id: 2,
      name: "Sarah Khan",
      referralId: "M002",
      rank: 2,
      points: 14250,
      customers: 198,
      revenue: 38900,
      badge: "Regional Manager",
      change: "+2",
      avatar: "SK",
      isCurrentUser: false,
    },
    {
      id: 3,
      name: "Mohammad Ali",
      referralId: "M003",
      rank: 3,
      points: 13890,
      customers: 176,
      revenue: 35200,
      badge: "Business Manager",
      change: "-1",
      avatar: "MA",
      isCurrentUser: false,
    },
    {
      id: 4,
      name: "Fatima Rahman",
      referralId: "M004",
      rank: 4,
      points: 12500,
      customers: 165,
      revenue: 32800,
      badge: "Super Star Merchant",
      change: "+3",
      avatar: "FR",
      isCurrentUser: false,
    },
    {
      id: 5,
      name: "Omar Sheikh",
      referralId: "M005",
      rank: 5,
      points: 11800,
      customers: 142,
      revenue: 28600,
      badge: "Star Merchant",
      change: "0",
      avatar: "OS",
      isCurrentUser: false,
    },
    {
      id: 6,
      name: "Rashida Begum",
      referralId: "M006",
      rank: 6,
      points: 10900,
      customers: 134,
      revenue: 26400,
      badge: "Star Merchant",
      change: "+1",
      avatar: "RB",
      isCurrentUser: false,
    },
    {
      id: 7,
      name: "Karim Uddin",
      referralId: "M007",
      rank: 7,
      points: 10200,
      customers: 118,
      revenue: 24200,
      badge: "Star Merchant",
      change: "-2",
      avatar: "KU",
      isCurrentUser: false,
    },
    {
      id: 8,
      name: "Nasir Ahmed",
      referralId: "M008",
      rank: 8,
      points: 9850,
      customers: 102,
      revenue: 22100,
      badge: "Merchant",
      change: "+4",
      avatar: "NA",
      isCurrentUser: false,
    },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-500" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Co-Founder":
        return "bg-purple-100 text-purple-800";
      case "Regional Manager":
        return "bg-blue-100 text-blue-800";
      case "Business Manager":
        return "bg-green-100 text-green-800";
      case "Super Star Merchant":
        return "bg-yellow-100 text-yellow-800";
      case "Star Merchant":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getChangeColor = (change: string) => {
    if (change.startsWith("+")) return "text-green-600";
    if (change.startsWith("-")) return "text-red-600";
    return "text-gray-600";
  };

  const currentUserRank = leaderboardData.find(item => item.isCurrentUser)?.rank || 0;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-hidden">
        <Header />
        
        <main className="p-6 overflow-y-auto h-full">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Merchant Leaderboard</h1>
            <p className="text-gray-600">Compare your performance with other merchants and track your ranking</p>
          </div>

          {/* Current User Status */}
          <Card className="mb-8 bg-gradient-to-br from-komarce-purple to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Your Current Ranking</h3>
                    <p className="text-blue-100">
                      {merchant?.firstName} {merchant?.lastName} • {merchant?.referralId}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">#{currentUserRank}</div>
                  <p className="text-blue-100">Current Position</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">This Week</SelectItem>
                <SelectItem value="monthly">This Month</SelectItem>
                <SelectItem value="quarterly">This Quarter</SelectItem>
                <SelectItem value="yearly">This Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="points">Points Distributed</SelectItem>
                <SelectItem value="customers">Customer Count</SelectItem>
                <SelectItem value="revenue">Revenue Generated</SelectItem>
                <SelectItem value="referrals">Referral Count</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="w-full sm:w-auto">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Trends
            </Button>
          </div>

          {/* Leaderboard Tabs */}
          <Tabs defaultValue="global" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="global">Global Leaderboard</TabsTrigger>
              <TabsTrigger value="regional">Regional Ranking</TabsTrigger>
              <TabsTrigger value="category">Category Leaders</TabsTrigger>
            </TabsList>

            <TabsContent value="global" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Global Merchant Leaderboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboardData.map((merchant) => (
                      <div
                        key={merchant.id}
                        className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                          merchant.isCurrentUser 
                            ? "bg-komarce-purple bg-opacity-10 border-komarce-purple" 
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              {getRankIcon(merchant.rank)}
                              <span className="font-bold text-lg">{merchant.rank}</span>
                            </div>
                            
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="font-bold">
                                {merchant.avatar}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-semibold">{merchant.name}</h4>
                                {merchant.isCurrentUser && (
                                  <Badge className="bg-komarce-purple text-white">You</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{merchant.referralId}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-8">
                            <div className="text-center">
                              <p className="font-bold text-lg text-komarce-purple">
                                {merchant.points.toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-600">Points</p>
                            </div>
                            
                            <div className="text-center">
                              <p className="font-bold text-lg text-komarce-emerald">
                                {merchant.customers}
                              </p>
                              <p className="text-sm text-gray-600">Customers</p>
                            </div>
                            
                            <div className="text-center">
                              <p className="font-bold text-lg text-komarce-amber">
                                ৳{merchant.revenue.toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-600">Revenue</p>
                            </div>
                            
                            <div className="text-center">
                              <Badge className={getBadgeColor(merchant.badge)}>
                                {merchant.badge}
                              </Badge>
                              <p className={`text-sm font-medium ${getChangeColor(merchant.change)}`}>
                                {merchant.change}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="regional" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Regional Ranking - Dhaka</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboardData.slice(0, 5).map((merchant) => (
                      <div
                        key={merchant.id}
                        className={`p-4 rounded-lg border ${
                          merchant.isCurrentUser 
                            ? "bg-komarce-purple bg-opacity-10 border-komarce-purple" 
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {getRankIcon(merchant.rank)}
                            <Avatar className="w-10 h-10">
                              <AvatarFallback>{merchant.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">{merchant.name}</h4>
                              <p className="text-sm text-gray-600">Dhaka Region</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-komarce-purple">
                              {merchant.points.toLocaleString()} pts
                            </p>
                            <Badge className={getBadgeColor(merchant.badge)}>
                              {merchant.badge}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="category" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Star className="w-5 h-5 mr-2 text-komarce-amber" />
                      Top Point Distributors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {leaderboardData.slice(0, 3).map((merchant, index) => (
                        <div key={merchant.id} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-komarce-purple rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">#{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{merchant.name}</p>
                            <p className="text-xs text-gray-600">{merchant.points.toLocaleString()} points</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Users className="w-5 h-5 mr-2 text-komarce-emerald" />
                      Customer Champions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {leaderboardData
                        .sort((a, b) => b.customers - a.customers)
                        .slice(0, 3)
                        .map((merchant, index) => (
                          <div key={merchant.id} className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-komarce-emerald rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">#{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{merchant.name}</p>
                              <p className="text-xs text-gray-600">{merchant.customers} customers</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <Target className="w-5 h-5 mr-2 text-komarce-amber" />
                      Revenue Leaders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {leaderboardData
                        .sort((a, b) => b.revenue - a.revenue)
                        .slice(0, 3)
                        .map((merchant, index) => (
                          <div key={merchant.id} className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-komarce-amber rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">#{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{merchant.name}</p>
                              <p className="text-xs text-gray-600">৳{merchant.revenue.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Achievement Badges */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Achievement Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg">
                  <div className="flex items-center justify-center w-12 h-12 bg-yellow-500 rounded-full mb-3">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-yellow-800">Top Performer</h4>
                  <p className="text-sm text-yellow-700">Rank in top 10</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-blue-800">Customer Magnet</h4>
                  <p className="text-sm text-blue-700">100+ customers</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full mb-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-green-800">Growth Champion</h4>
                  <p className="text-sm text-green-700">+50% growth</p>
                </div>
                
                <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-full mb-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-purple-800">Loyalty Master</h4>
                  <p className="text-sm text-purple-700">10K+ points</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
