import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Search, Plus, Filter, Download, UserPlus, Star } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import StatsCard from "@/components/dashboard/stats-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: customers, isLoading: customersLoading } = useQuery({
    queryKey: ["/api/customers"],
  });

  const { data: dashboardStats, isLoading: dashboardStatsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: pointTransactions } = useQuery({
    queryKey: ["/api/points/transactions"],
  });

  // Filter customers based on search term and status
  const filteredCustomers = customers?.filter((customer: any) => {
    const matchesSearch = customer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.mobile?.includes(searchTerm) ||
                         customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && customer.isActive) ||
                         (filterStatus === "inactive" && !customer.isActive) ||
                         (filterStatus === "reward" && customer.rewardNumber);
    
    return matchesSearch && matchesStatus;
  }) || [];

  const getCustomerInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  const getCustomerPointsThisMonth = (customerId: number) => {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    
    return pointTransactions?.filter((transaction: any) => 
      transaction.customerId === customerId && 
      new Date(transaction.createdAt) >= thisMonth
    ).reduce((total: number, transaction: any) => total + transaction.points, 0) || 0;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-hidden">
        <Header />
        
        <main className="p-6 overflow-y-auto h-full">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Management</h1>
            <p className="text-gray-600">Manage your registered customers and track their activity</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Customers"
              value={customers?.length || 0}
              change="+12 new this month"
              changeType="positive"
              icon={Users}
              iconColor="bg-gradient-to-br from-komarce-purple to-purple-600"
              loading={customersLoading}
            />
            
            <StatsCard
              title="Active Customers"
              value={customers?.filter((c: any) => c.isActive).length || 0}
              change="95.2% activity rate"
              changeType="positive"
              icon={UserPlus}
              iconColor="bg-gradient-to-br from-komarce-emerald to-emerald-600"
              loading={customersLoading}
            />
            
            <StatsCard
              title="Reward Holders"
              value={customers?.filter((c: any) => c.rewardNumber).length || 0}
              change="Customers with reward numbers"
              icon={Star}
              iconColor="bg-gradient-to-br from-komarce-amber to-orange-600"
              loading={customersLoading}
            />
            
            <StatsCard
              title="This Month's Activity"
              value={pointTransactions?.length || 0}
              change="Point transactions"
              icon={Users}
              iconColor="bg-gradient-to-br from-purple-500 to-pink-600"
              loading={customersLoading}
            />
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Customer Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search customers by name, mobile, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Customers</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                    <SelectItem value="reward">Reward Holders</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
                
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Customer List */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Customer List ({filteredCustomers.length})</CardTitle>
                <Button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Customer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {customersLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Reward Number</TableHead>
                        <TableHead>This Month</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Registered</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <div className="text-gray-500">
                              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                              <p>No customers found</p>
                              <p className="text-sm">Try adjusting your search or filters</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCustomers.map((customer: any) => (
                          <TableRow key={customer.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="text-xs">
                                    {getCustomerInitials(customer.firstName, customer.lastName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {customer.firstName} {customer.lastName}
                                  </p>
                                  <p className="text-sm text-gray-600">ID: {customer.id}</p>
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div>
                                <p className="text-sm font-medium">{customer.mobile}</p>
                                {customer.email && (
                                  <p className="text-sm text-gray-600">{customer.email}</p>
                                )}
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="text-center">
                                <p className="font-bold text-komarce-purple">
                                  {customer.totalRewardPoints || 0}
                                </p>
                                <p className="text-xs text-gray-500">Total Points</p>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              {customer.rewardNumber ? (
                                <Badge className="bg-komarce-amber text-white">
                                  {customer.rewardNumber}
                                </Badge>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            
                            <TableCell>
                              <div className="text-center">
                                <p className="font-medium text-komarce-emerald">
                                  {getCustomerPointsThisMonth(customer.id)}
                                </p>
                                <p className="text-xs text-gray-500">Points</p>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <Badge 
                                variant={customer.isActive ? "default" : "secondary"}
                                className={customer.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                              >
                                {customer.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            
                            <TableCell>
                              <p className="text-sm">
                                {format(new Date(customer.createdAt), "MMM dd, yyyy")}
                              </p>
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline">
                                  View
                                </Button>
                                <Button size="sm" variant="outline">
                                  Send Points
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCustomers
                    .sort((a: any, b: any) => (b.totalRewardPoints || 0) - (a.totalRewardPoints || 0))
                    .slice(0, 5)
                    .map((customer: any, index: number) => (
                      <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-komarce-purple rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                            <p className="text-sm text-gray-600">{customer.mobile}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-komarce-purple">{customer.totalRewardPoints || 0}</p>
                          <p className="text-xs text-gray-500">Points</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">New This Month</span>
                    <span className="font-bold text-komarce-emerald">
                      {customers?.filter((c: any) => {
                        const createdThisMonth = new Date(c.createdAt) >= new Date(new Date().getFullYear(), new Date().getMonth(), 1);
                        return createdThisMonth;
                      }).length || 0}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active This Week</span>
                    <span className="font-bold text-komarce-purple">
                      {customers?.filter((c: any) => c.isActive).length || 0}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Reward Achievers</span>
                    <span className="font-bold text-komarce-amber">
                      {customers?.filter((c: any) => c.rewardNumber).length || 0}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Points</span>
                    <span className="font-bold text-gray-800">
                      {customers?.length > 0 
                        ? Math.round(customers.reduce((sum: number, c: any) => sum + (c.totalRewardPoints || 0), 0) / customers.length)
                        : 0
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
