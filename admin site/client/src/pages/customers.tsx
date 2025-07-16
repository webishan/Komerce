import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useTranslation } from "@/lib/i18n";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Search, Download, Filter, TrendingUp, Users, Award, Coins, UserPlus, Eye, Edit, Trash2 } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import AddCustomerForm from "@/components/forms/AddCustomerForm";

interface CustomersProps {
  language: string;
  selectedCountry: string;
}

export default function Customers({ language, selectedCountry }: CustomersProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation(language as any);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("registrationDate");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<any>(null);

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

  const { data: customers, isLoading: customersLoading, error, refetch } = useQuery({
    queryKey: ['/api/customers', selectedCountry !== 'global' ? selectedCountry : undefined],
    enabled: isAuthenticated,
    retry: false,
  });

  // Auto-refresh customers data periodically
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        refetch();
      }, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, refetch]);

  // Delete customer mutation
  const deleteCustomerMutation = useMutation({
    mutationFn: (customerId: number) => apiRequest("DELETE", `/api/customers/${customerId}`),
    onSuccess: () => {
      toast({
        title: language === 'bn' ? "সফল!" : "Success!",
        description: language === 'bn' ? "কাস্টমার সফলভাবে মুছে ফেলা হয়েছে" : "Customer deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: language === 'bn' ? "ত্রুটি!" : "Error!",
        description: error.message || (language === 'bn' ? "কাস্টমার মুছতে ব্যর্থ" : "Failed to delete customer"),
        variant: "destructive",
      });
    },
  });

  const handleViewCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setViewDialogOpen(true);
  };

  const handleEditCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setEditDialogOpen(true);
  };

  const handleDeleteCustomer = (customer: any) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      deleteCustomerMutation.mutate(customerToDelete.id);
    }
  };

  const { data: customerStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats', selectedCountry !== 'global' ? selectedCountry : undefined],
    enabled: isAuthenticated,
    retry: false,
  });

  // Handle API errors
  if (error && isUnauthorizedError(error as Error)) {
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
    return <CustomersSkeleton />;
  }

  // Filter and sort customers
  const filteredCustomers = (customers || []).filter((customer: any) => {
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    const email = customer.email?.toLowerCase() || "";
    const phone = customer.phone?.toLowerCase() || "";
    
    return fullName.includes(searchTerm.toLowerCase()) ||
           email.includes(searchTerm.toLowerCase()) ||
           phone.includes(searchTerm.toLowerCase());
  }).sort((a: any, b: any) => {
    switch (sortBy) {
      case "points":
        return (b.rewardPoints || 0) - (a.rewardPoints || 0);
      case "referrals":
        return (b.referralCount || 0) - (a.referralCount || 0);
      case "serialNumbers":
        return (b.serialNumbers || 0) - (a.serialNumbers || 0);
      case "balance":
        return Number(b.balance || 0) - Number(a.balance || 0);
      default:
        return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime();
    }
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US');
  };

  const formatCurrency = (amount: string | number) => {
    return `$${Number(amount || 0).toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("customers.title")}
          </h1>
          {language === 'bn' && (
            <p className="text-gray-500 font-bengali">গ্রাহক ব্যবস্থাপনা</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            {language === 'bn' ? 'রপ্তানি' : 'Export'}
          </Button>
          <AddCustomerForm language={language} selectedCountry={selectedCountry} />
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={language === 'bn' ? 'মোট গ্রাহক' : 'Total Customers'}
          titleBengali="মোট গ্রাহক"
          value={customerStats?.customers?.total || 0}
          change="+8.2%"
          changeType="positive"
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          language={language}
        />
        
        <StatsCard
          title={language === 'bn' ? 'মোট পয়েন্ট' : 'Total Points'}
          titleBengali="মোট পয়েন্ট"
          value={customerStats?.customers?.totalPoints ? `${(Number(customerStats.customers.totalPoints) / 1000000).toFixed(1)}M` : "0"}
          change="+15.3%"
          changeType="positive"
          icon={Award}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-100"
          language={language}
        />
        
        <StatsCard
          title={language === 'bn' ? 'মোট ব্যালেন্স' : 'Total Balance'}
          titleBengali="মোট ব্যালেন্স"
          value={customerStats?.customers?.totalBalance ? `$${(Number(customerStats.customers.totalBalance) / 1000).toFixed(0)}K` : "$0"}
          change="+12.1%"
          changeType="positive"
          icon={Coins}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          language={language}
        />
        
        <StatsCard
          title={language === 'bn' ? 'সক্রিয় গ্রাহক' : 'Active Customers'}
          titleBengali="সক্রিয় গ্রাহক"
          value={Math.floor((customerStats?.customers?.total || 0) * 0.85)}
          change="+5.7%"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          language={language}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder={language === 'bn' ? "গ্রাহক খুঁজুন..." : "Search customers..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="registrationDate">
                  {language === 'bn' ? 'নিবন্ধনের তারিখ' : 'Registration Date'}
                </SelectItem>
                <SelectItem value="points">
                  {language === 'bn' ? 'পয়েন্ট' : 'Points'}
                </SelectItem>
                <SelectItem value="referrals">
                  {language === 'bn' ? 'রেফারেল' : 'Referrals'}
                </SelectItem>
                <SelectItem value="serialNumbers">
                  {language === 'bn' ? 'ক্রমিক নং' : 'Serial Numbers'}
                </SelectItem>
                <SelectItem value="balance">
                  {language === 'bn' ? 'ব্যালেন্স' : 'Balance'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {filteredCustomers.length} {language === 'bn' ? 'গ্রাহক' : 'Customers'}
            </span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                {language === 'bn' ? 'ফিল্টার' : 'Filter'}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {customersLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'bn' ? 'গ্রাহক' : 'Customer'}</TableHead>
                  <TableHead>{language === 'bn' ? 'যোগাযোগ' : 'Contact'}</TableHead>
                  <TableHead>{language === 'bn' ? 'পয়েন্ট' : 'Points'}</TableHead>
                  <TableHead>{language === 'bn' ? 'রেফারেল' : 'Referrals'}</TableHead>
                  <TableHead>{language === 'bn' ? 'ক্রমিক নং' : 'Serial Numbers'}</TableHead>
                  <TableHead>{language === 'bn' ? 'ব্যালেন্স' : 'Balance'}</TableHead>
                  <TableHead>{language === 'bn' ? 'নিবন্ধনের তারিখ' : 'Registration'}</TableHead>
                  <TableHead>{language === 'bn' ? 'কার্যক্রম' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      {language === 'bn' ? 'কোন গ্রাহক পাওয়া যায়নি' : 'No customers found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer: any) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-gradient-to-br from-primary to-green-500 text-white">
                              {customer.firstName?.[0]}{customer.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">
                              {customer.firstName} {customer.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              ID: {customer.userId || customer.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm text-gray-900">{customer.email}</p>
                          <p className="text-sm text-gray-500">{customer.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Award className="w-4 h-4 text-amber-500" />
                          <span className="font-medium text-amber-700">
                            {(customer.rewardPoints || 0).toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {customer.referralCount || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {customer.serialNumbers || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-green-700">
                          ${customer.balance || '0.00'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {customer.registrationDate ? new Date(customer.registrationDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewCustomer(customer)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditCustomer(customer)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteCustomer(customer)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Customer Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {language === 'bn' ? 'কাস্টমার বিবরণ' : 'Customer Details'}
            </DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {language === 'bn' ? 'নাম' : 'Name'}
                  </label>
                  <p className="mt-1">{selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {language === 'bn' ? 'ইমেইল' : 'Email'}
                  </label>
                  <p className="mt-1">{selectedCustomer.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {language === 'bn' ? 'ফোন' : 'Phone'}
                  </label>
                  <p className="mt-1">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {language === 'bn' ? 'দেশ' : 'Country'}
                  </label>
                  <p className="mt-1">{selectedCustomer.country?.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {language === 'bn' ? 'পয়েন্ট' : 'Points'}
                  </label>
                  <p className="mt-1">{selectedCustomer.points || 0}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {language === 'bn' ? 'ব্যালেন্স' : 'Balance'}
                  </label>
                  <p className="mt-1">${selectedCustomer.balance || '0.00'}</p>
                </div>
              </div>
              {selectedCustomer.address && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    {language === 'bn' ? 'ঠিকানা' : 'Address'}
                  </label>
                  <p className="mt-1">{selectedCustomer.address}</p>
                  <p className="text-sm text-gray-500">
                    {selectedCustomer.city}, {selectedCustomer.district} {selectedCustomer.postcode}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'bn' ? 'কাস্টমার মুছে ফেলুন' : 'Delete Customer'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'bn' 
                ? 'আপনি কি নিশ্চিত যে আপনি এই কাস্টমারকে মুছে ফেলতে চান? এই ক্রিয়াটি পূর্বাবস্থায় ফেরানো যাবে না।'
                : 'Are you sure you want to delete this customer? This action cannot be undone.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteCustomerMutation.isPending}
            >
              {deleteCustomerMutation.isPending 
                ? (language === 'bn' ? 'মুছে ফেলা হচ্ছে...' : 'Deleting...') 
                : (language === 'bn' ? 'মুছে ফেলুন' : 'Delete')
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CustomersSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32 mt-2" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      
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

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-48" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
