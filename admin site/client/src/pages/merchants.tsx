import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, Filter, Download } from "lucide-react";
import AddMerchantForm from "@/components/forms/AddMerchantForm";

interface MerchantsProps {
  language: string;
  selectedCountry: string;
}

export default function Merchants({ language, selectedCountry }: MerchantsProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation(language as any);
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

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

  const { data: merchants, isLoading: merchantsLoading, error } = useQuery({
    queryKey: ['/api/merchants', selectedCountry !== 'global' ? selectedCountry : undefined],
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
    return <MerchantsSkeleton />;
  }

  const tierConfig = {
    regular: { label: "Regular", labelBengali: "নিয়মিত", color: "bg-gray-100 text-gray-800" },
    star: { label: "Star ⭐", labelBengali: "স্টার ⭐", color: "bg-green-100 text-green-800" },
    double_star: { label: "Double Star ⭐⭐", labelBengali: "ডাবল স্টার ⭐⭐", color: "bg-blue-100 text-blue-800" },
    triple_star: { label: "Triple Star ⭐⭐⭐", labelBengali: "ট্রিপল স্টার ⭐⭐⭐", color: "bg-yellow-100 text-yellow-800" },
    executive: { label: "Executive 👑", labelBengali: "এক্সিকিউটিভ 👑", color: "bg-purple-100 text-purple-800" },
  };

  const typeConfig = {
    merchant: { label: "Merchant", labelBengali: "মার্চেন্ট" },
    e_merchant: { label: "E-Merchant", labelBengali: "ই-মার্চেন্ট" },
  };

  const statusConfig = {
    active: { label: "Active", labelBengali: "সক্রিয়", color: "bg-green-100 text-green-800" },
    inactive: { label: "Inactive", labelBengali: "নিষ্ক্রিয়", color: "bg-red-100 text-red-800" },
    pending: { label: "Pending", labelBengali: "অপেক্ষমান", color: "bg-yellow-100 text-yellow-800" },
  };

  // Filter merchants
  const filteredMerchants = (merchants || []).filter((merchant: any) => {
    const matchesSearch = merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         merchant.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = tierFilter === "all" || merchant.tier === tierFilter;
    const matchesType = typeFilter === "all" || merchant.type === typeFilter;
    
    return matchesSearch && matchesTier && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("merchants.title")}
          </h1>
          {language === 'bn' && (
            <p className="text-gray-500 font-bengali">মার্চেন্ট ব্যবস্থাপনা</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <AddMerchantForm language={language} selectedCountry={selectedCountry} />
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder={language === 'bn' ? "মার্চেন্ট খুঁজুন..." : "Search merchants..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                {Object.entries(tierConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {language === 'bn' ? config.labelBengali : config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(typeConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {language === 'bn' ? config.labelBengali : config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Merchants Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredMerchants.length} {language === 'bn' ? 'মার্চেন্ট' : 'Merchants'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {merchantsLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === 'bn' ? 'নাম' : 'Name'}</TableHead>
                  <TableHead>{language === 'bn' ? 'ইমেইল' : 'Email'}</TableHead>
                  <TableHead>{language === 'bn' ? 'ধরন' : 'Type'}</TableHead>
                  <TableHead>{language === 'bn' ? 'স্তর' : 'Tier'}</TableHead>
                  <TableHead>{language === 'bn' ? 'অবস্থা' : 'Status'}</TableHead>
                  <TableHead>{language === 'bn' ? 'মোট বিক্রয়' : 'Total Sales'}</TableHead>
                  <TableHead>{language === 'bn' ? 'কার্যক্রম' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMerchants.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      {language === 'bn' ? 'কোন মার্চেন্ট পাওয়া যায়নি' : 'No merchants found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMerchants.map((merchant: any) => (
                    <TableRow key={merchant.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{merchant.name}</p>
                          <p className="text-sm text-gray-500">{merchant.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{merchant.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {language === 'bn' ? 
                            typeConfig[merchant.type as keyof typeof typeConfig]?.labelBengali :
                            typeConfig[merchant.type as keyof typeof typeConfig]?.label
                          }
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={tierConfig[merchant.tier as keyof typeof tierConfig]?.color}
                        >
                          {language === 'bn' ? 
                            tierConfig[merchant.tier as keyof typeof tierConfig]?.labelBengali :
                            tierConfig[merchant.tier as keyof typeof tierConfig]?.label
                          }
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={statusConfig[merchant.status as keyof typeof statusConfig]?.color}
                        >
                          {language === 'bn' ? 
                            statusConfig[merchant.status as keyof typeof statusConfig]?.labelBengali :
                            statusConfig[merchant.status as keyof typeof statusConfig]?.label
                          }
                        </Badge>
                      </TableCell>
                      <TableCell>
                        ${Number(merchant.totalSales || 0).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            {language === 'bn' ? 'দেখুন' : 'View'}
                          </Button>
                          <Button variant="outline" size="sm">
                            {language === 'bn' ? 'সম্পাদনা' : 'Edit'}
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
    </div>
  );
}

function MerchantsSkeleton() {
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
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-48" />
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
