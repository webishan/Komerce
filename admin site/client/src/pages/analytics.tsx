import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Store,
  Award,
  DollarSign,
  Calendar,
  Download,
  Filter,
  Activity,
  Target,
  PieChart,
  LineChart
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";

interface AnalyticsProps {
  language: string;
  selectedCountry: string;
}

export default function Analytics({ language, selectedCountry }: AnalyticsProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation(language as any);
  const [timeRange, setTimeRange] = useState("30d");
  const [metricType, setMetricType] = useState("overview");

  // Daily analytics data query
  const { data: dailyAnalytics, isLoading: dailyLoading } = useQuery({
    queryKey: ['/api/analytics/daily', selectedCountry !== 'global' ? selectedCountry : undefined, timeRange],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: analyticsStats, isLoading: analyticsStatsLoading } = useQuery({
    queryKey: ['/api/analytics/stats', selectedCountry !== 'global' ? selectedCountry : undefined],
    enabled: isAuthenticated,
    retry: false,
  });

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

  // Handle API errors
  useEffect(() => {
    const handleError = () => {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    };

    if (!isAuthenticated && !isLoading) {
      handleError();
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !isAuthenticated) {
    return <AnalyticsSkeleton />;
  }

  const timeRangeOptions = [
    { value: "7d", label: language === 'bn' ? "৭ দিন" : "7 Days" },
    { value: "30d", label: language === 'bn' ? "৩০ দিন" : "30 Days" },
    { value: "90d", label: language === 'bn' ? "৯০ দিন" : "90 Days" },
    { value: "1y", label: language === 'bn' ? "১ বছর" : "1 Year" },
  ];

  const metricTypes = [
    { value: "overview", label: language === 'bn' ? "সংক্ষিপ্ত বিবরণ" : "Overview" },
    { value: "merchants", label: language === 'bn' ? "মার্চেন্ট" : "Merchants" },
    { value: "customers", label: language === 'bn' ? "গ্রাহক" : "Customers" },
    { value: "rewards", label: language === 'bn' ? "পুরস্কার" : "Rewards" },
    { value: "revenue", label: language === 'bn' ? "রাজস্ব" : "Revenue" },
  ];

  // Mock performance data for visualization
  const performanceMetrics = {
    growth: {
      merchants: 12.5,
      customers: 18.3,
      revenue: 24.7,
      points: 15.8
    },
    conversion: {
      signupToActive: 78.5,
      merchantApproval: 85.2,
      customerRetention: 68.9,
      pointRedemption: 42.3
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("common.analytics")}
          </h1>
          {language === 'bn' && (
            <p className="text-gray-500 font-bengali">বিশ্লেষণ এবং প্রতিবেদন</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={metricType} onValueChange={setMetricType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {metricTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            {language === 'bn' ? 'রপ্তানি' : 'Export'}
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={language === 'bn' ? 'মোট রাজস্ব' : 'Total Revenue'}
          titleBengali="মোট রাজস্ব"
          value="$2.4M"
          change="+24.7%"
          changeType="positive"
          icon={DollarSign}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          language={language}
        />
        
        <StatsCard
          title={language === 'bn' ? 'সক্রিয় ব্যবহারকারী' : 'Active Users'}
          titleBengali="সক্রিয় ব্যবহারকারী"
          value="1,234"
          change="+18.3%"
          changeType="positive"
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          language={language}
        />
        
        <StatsCard
          title={language === 'bn' ? 'রূপান্তর হার' : 'Conversion Rate'}
          titleBengali="রূপান্তর হার"
          value="78.5%"
          change="+5.2%"
          changeType="positive"
          icon={Target}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          language={language}
        />
        
        <StatsCard
          title={language === 'bn' ? 'গড় অর্ডার মূল্য' : 'Avg Order Value'}
          titleBengali="গড় অর্ডার মূল্য"
          value="$156"
          change="+8.9%"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-amber-600"
          iconBgColor="bg-amber-100"
          language={language}
        />
      </div>

      {/* Performance Charts and Country Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Metrics */}
        <Card className="border-gray-100">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              {language === 'bn' ? 'বৃদ্ধির হার' : 'Growth Metrics'}
            </CardTitle>
            {language === 'bn' && (
              <p className="text-sm text-gray-500 font-bengali">বৃদ্ধির মেট্রিক্স</p>
            )}
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Object.entries(performanceMetrics.growth).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">
                      {key === 'merchants' && (language === 'bn' ? 'মার্চেন্ট' : 'Merchants')}
                      {key === 'customers' && (language === 'bn' ? 'গ্রাহক' : 'Customers')}
                      {key === 'revenue' && (language === 'bn' ? 'রাজস্ব' : 'Revenue')}
                      {key === 'points' && (language === 'bn' ? 'পয়েন্ট' : 'Points')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="font-bold text-green-600">+{value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Metrics */}
        <Card className="border-gray-100">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              {language === 'bn' ? 'রূপান্তর মেট্রিক্স' : 'Conversion Metrics'}
            </CardTitle>
            {language === 'bn' && (
              <p className="text-sm text-gray-500 font-bengali">রূপান্তর হারের বিশ্লেষণ</p>
            )}
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Object.entries(performanceMetrics.conversion).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {key === 'signupToActive' && (language === 'bn' ? 'সাইনআপ থেকে সক্রিয়' : 'Signup to Active')}
                    {key === 'merchantApproval' && (language === 'bn' ? 'মার্চেন্ট অনুমোদন' : 'Merchant Approval')}
                    {key === 'customerRetention' && (language === 'bn' ? 'গ্রাহক ধরে রাখা' : 'Customer Retention')}
                    {key === 'pointRedemption' && (language === 'bn' ? 'পয়েন্ট রিডিম' : 'Point Redemption')}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                    <span className="font-medium text-blue-600 w-12 text-right">{value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers by Serial Numbers */}
        <Card className="border-gray-100">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
              <Award className="w-5 h-5 mr-2 text-amber-600" />
              {language === 'bn' ? 'শীর্ষ গ্রাহক (ক্রমিক নং)' : 'Top Customers (Serial Numbers)'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {dailyAnalytics?.dailyStats?.slice(0, 5).map((stat: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${index < 3 ? `bg-amber-500` : 'bg-gray-400'} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {stat.date}
                      </p>
                      <p className="text-sm text-gray-500">{language === 'bn' ? 'দৈনিক তথ্য' : 'Daily Data'}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    {stat.customers || 0}
                  </Badge>
                </div>
              )) || (
                <div className="text-center py-4 text-gray-500">
                  {language === 'bn' ? 'কোন তথ্য নেই' : 'No data available'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Customers by Referrals */}
        <Card className="border-gray-100">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
              <Users className="w-5 h-5 mr-2 text-purple-600" />
              {language === 'bn' ? 'শীর্ষ রেফারকারী' : 'Top Referrers'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {analyticsStats?.countryStats?.slice(0, 5).map((country: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${index < 3 ? `bg-purple-500` : 'bg-gray-400'} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                      {country.flag}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {country.name}
                      </p>
                      <p className="text-sm text-gray-500">{language === 'bn' ? 'দেশ' : 'Country'}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {country.customers || 0}
                  </Badge>
                </div>
              )) || (
                <div className="text-center py-4 text-gray-500">
                  {language === 'bn' ? 'কোন তথ্য নেই' : 'No data available'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Country Performance (Global Admin Only) */}
      {selectedCountry === 'global' && analyticsStats?.countryStats && (
        <Card className="border-gray-100">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              {language === 'bn' ? 'দেশভিত্তিক কর্মক্ষমতা' : 'Country Performance Analysis'}
            </CardTitle>
            {language === 'bn' && (
              <p className="text-sm text-gray-500 font-bengali">দেশভিত্তিক বিশ্লেষণ</p>
            )}
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analyticsStats.countryStats.map((country: any, index: number) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {country.name}
                      </h3>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        {language === 'bn' ? 'গ্রাহক' : 'Customers'}
                      </span>
                      <span className="font-medium">{country.customers?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        {language === 'bn' ? 'শতাংশ' : 'Percentage'}
                      </span>
                      <span className="font-medium text-blue-600">{country.percentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}


      {/* Quick Actions */}
      <Card className="border-gray-100">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
            <Activity className="w-5 h-5 mr-2 text-primary" />
            {language === 'bn' ? 'দ্রুত কার্যক্রম' : 'Quick Actions'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto flex-col py-4 bg-blue-50 hover:bg-blue-100 border-blue-200"
            >
              <LineChart className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">
                {language === 'bn' ? 'ট্রেন্ড বিশ্লেষণ' : 'Trend Analysis'}
              </span>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto flex-col py-4 bg-green-50 hover:bg-green-100 border-green-200"
            >
              <PieChart className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">
                {language === 'bn' ? 'বিভাগীয় রিপোর্ট' : 'Segment Report'}
              </span>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto flex-col py-4 bg-purple-50 hover:bg-purple-100 border-purple-200"
            >
              <Filter className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">
                {language === 'bn' ? 'কাস্টম ফিল্টার' : 'Custom Filter'}
              </span>
            </Button>

            <Button 
              variant="outline" 
              className="h-auto flex-col py-4 bg-amber-50 hover:bg-amber-100 border-amber-200"
            >
              <Calendar className="w-8 h-8 text-amber-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">
                {language === 'bn' ? 'সময়সূচী রিপোর্ট' : 'Schedule Report'}
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32 mt-2" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-24" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
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
