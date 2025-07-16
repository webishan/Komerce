import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Wallet, ArrowUpDown, Plus, Download, CreditCard, TrendingUp, Send, History } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import WalletCard from "@/components/dashboard/wallet-card";
import TransactionTable from "@/components/dashboard/transaction-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const walletTransferSchema = z.object({
  fromWalletType: z.enum(["reward_point", "income", "komarce"]),
  toWalletType: z.enum(["reward_point", "income", "komarce"]),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  description: z.string().optional(),
});

type WalletTransferForm = z.infer<typeof walletTransferSchema>;

export default function Wallets() {
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wallets, isLoading: walletsLoading } = useQuery({
    queryKey: ["/api/wallets"],
  });

  const { data: walletTransactions, isLoading: walletTransactionsLoading } = useQuery({
    queryKey: ["/api/wallet-transactions"],
  });

  const form = useForm<WalletTransferForm>({
    resolver: zodResolver(walletTransferSchema),
    defaultValues: {
      fromWalletType: "income",
      toWalletType: "komarce",
      amount: 0,
      description: "",
    },
  });

  const transferMutation = useMutation({
    mutationFn: async (data: WalletTransferForm) => {
      const response = await apiRequest("POST", "/api/wallets/transfer", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallet-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      
      toast({
        title: "Transfer completed successfully!",
        description: "Your wallet balance has been updated.",
      });
      
      form.reset();
      setIsTransferOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Transfer failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: WalletTransferForm) => {
    transferMutation.mutate(data);
  };

  const getWalletByType = (type: string) => {
    return wallets?.find((w: any) => w.walletType === type);
  };

  const rewardWallet = getWalletByType("reward_point");
  const incomeWallet = getWalletByType("income");
  const komarceWallet = getWalletByType("komarce");

  const walletOptions = [
    { value: "reward_point", label: "Reward Point Wallet" },
    { value: "income", label: "Income Wallet" },
    { value: "komarce", label: "Komarce Wallet" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-hidden">
        <Header />
        
        <main className="p-6 overflow-y-auto h-full">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Wallet Management</h1>
            <p className="text-gray-600">Manage your three-wallet system and track all transactions</p>
          </div>

          {/* Wallet Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <WalletCard
              title="Reward Point Wallet"
              balance={rewardWallet?.balance || "0"}
              description="Available Points for Distribution"
              icon={Send}
              type="reward"
              details={[
                {
                  label: "Total Purchased",
                  value: rewardWallet?.totalIn || "0",
                },
                {
                  label: "Total Distributed",
                  value: rewardWallet?.totalOut || "0",
                },
                {
                  label: "Available Balance",
                  value: rewardWallet?.balance || "0",
                },
              ]}
              actions={[
                {
                  label: "Purchase Points",
                  onClick: () => {},
                  variant: "default",
                },
              ]}
              loading={walletsLoading}
            />

            <WalletCard
              title="Income Wallet"
              balance={`৳${incomeWallet?.balance || "0"}`}
              description="Total Cashback Earnings"
              icon={TrendingUp}
              type="income"
              details={[
                {
                  label: "15% Instant Cashback",
                  value: "৳5,200",
                },
                {
                  label: "2% Referral Commission",
                  value: "৳1,240",
                },
                {
                  label: "1% Royalty Bonus",
                  value: "৳2,010",
                },
              ]}
              actions={[
                {
                  label: "Transfer to Komarce",
                  onClick: () => setIsTransferOpen(true),
                  variant: "default",
                },
              ]}
              loading={walletsLoading}
            />

            <WalletCard
              title="Komarce Wallet"
              balance={`৳${komarceWallet?.balance || "0"}`}
              description="Available for Withdrawal"
              icon={Wallet}
              type="komarce"
              details={[
                {
                  label: "Total Received",
                  value: `৳${komarceWallet?.totalIn || "0"}`,
                },
                {
                  label: "Total Withdrawn",
                  value: `৳${komarceWallet?.totalOut || "0"}`,
                },
                {
                  label: "Available Balance",
                  value: `৳${komarceWallet?.balance || "0"}`,
                },
              ]}
              actions={[
                {
                  label: "Add Balance",
                  onClick: () => {},
                  variant: "default",
                },
                {
                  label: "Withdraw",
                  onClick: () => {},
                  variant: "outline",
                },
              ]}
              loading={walletsLoading}
            />
          </div>

          {/* Wallet Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full btn-primary">
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      Transfer Between Wallets
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Transfer Funds</DialogTitle>
                    </DialogHeader>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="fromWalletType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>From Wallet</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select source wallet" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {walletOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="toWalletType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>To Wallet</FormLabel>
                              <FormControl>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select destination wallet" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {walletOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="Enter amount"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description (Optional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter transfer description"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex space-x-3">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsTransferOpen(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            className="flex-1"
                            disabled={transferMutation.isPending}
                          >
                            {transferMutation.isPending ? "Transferring..." : "Transfer"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                
                <Button className="w-full btn-secondary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Balance
                </Button>
                
                <Button className="w-full btn-accent">
                  <Download className="w-4 h-4 mr-2" />
                  Withdraw Funds
                </Button>
                
                <Button className="w-full" variant="outline">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payment Methods
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wallet Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Total Asset Value</span>
                      <span className="font-bold text-xl text-komarce-purple">
                        ৳{(
                          parseFloat(incomeWallet?.balance || "0") + 
                          parseFloat(komarceWallet?.balance || "0")
                        ).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Combined wallet balance</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Reward Points</span>
                      <span className="font-medium">{rewardWallet?.balance || "0"}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Income Balance</span>
                      <span className="font-medium">৳{incomeWallet?.balance || "0"}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Komarce Balance</span>
                      <span className="font-medium">৳{komarceWallet?.balance || "0"}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">VAT & Service Charge</span>
                      <span className="font-medium text-red-600">12.5%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Applied on transfers from Income Wallet
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Bank Transfer</h4>
                    <CreditCard className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">Direct bank account transfer</p>
                  <Button size="sm" className="mt-3 w-full" variant="outline">
                    Configure
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">bKash</h4>
                    <div className="w-5 h-5 bg-pink-500 rounded" />
                  </div>
                  <p className="text-sm text-gray-600">Mobile financial service</p>
                  <Button size="sm" className="mt-3 w-full" variant="outline">
                    Configure
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Nagad</h4>
                    <div className="w-5 h-5 bg-orange-500 rounded" />
                  </div>
                  <p className="text-sm text-gray-600">Mobile financial service</p>
                  <Button size="sm" className="mt-3 w-full" variant="outline">
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Wallet Transactions */}
          <TransactionTable
            transactions={walletTransactions || []}
            title="Recent Wallet Transactions"
            loading={walletTransactionsLoading}
          />
        </main>
      </div>
    </div>
  );
}
