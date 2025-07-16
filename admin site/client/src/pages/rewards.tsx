import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { TrendingUp, Gift, Users, DollarSign } from "lucide-react";
import PointManager from "@/components/reward/PointManager";

interface RewardsProps {
  language: string;
  selectedCountry: string;
}

export default function Rewards({ language, selectedCountry }: RewardsProps) {
  const { t } = useTranslation(language as 'en' | 'bn');

  const { data: rewardStats, isLoading } = useQuery({
    queryKey: ['/api/reward-stats', selectedCountry],
    queryFn: () => fetch(`/api/reward-stats?country=${selectedCountry}`).then(res => res.json()),
  });

  const { data: customers } = useQuery({
    queryKey: ['/api/customers', selectedCountry],
    queryFn: () => fetch(`/api/customers?countryId=${selectedCountry}`).then(res => res.json()),
  });

  const { data: merchants } = useQuery({
    queryKey: ['/api/merchants', selectedCountry],
    queryFn: () => fetch(`/api/merchants?countryId=${selectedCountry}`).then(res => res.json()),
  });

  if (isLoading) {
    return <RewardsSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {language === 'bn' ? 'রিওয়ার্ড ব্যবস্থাপনা' : 'Reward Management'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'bn' 
              ? 'কমার্স রিওয়ার্ড সিস্টেম পরিচালনা করুন' 
              : 'Manage KOMARCE reward system and point distribution'
            }
          </p>
        </div>
        <Button>
          {language === 'bn' ? 'নতুন রিওয়ার্ড' : 'New Reward'}
        </Button>
      </div>

      {/* Reward System Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'bn' ? 'মোট রিওয়ার্ড নম্বর' : 'Total Reward Numbers'}
            </CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rewardStats?.totalRewardNumbers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {language === 'bn' ? 'গ্লোবাল ও লোকাল' : 'Global & Local'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'bn' ? 'সক্রিয় পয়েন্ট' : 'Active Points'}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rewardStats?.activePoints || 0}</div>
            <p className="text-xs text-muted-foreground">
              {language === 'bn' ? 'সঞ্চালনে আছে' : 'In circulation'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'bn' ? 'পেআউট সম্পন্ন' : 'Payouts Completed'}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rewardStats?.completedPayouts || 0}</div>
            <p className="text-xs text-muted-foreground">
              {language === 'bn' ? 'এই মাসে' : 'This month'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {language === 'bn' ? 'সক্রিয় কাস্টমার' : 'Active Customers'}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rewardStats?.activeCustomers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {language === 'bn' ? 'রিওয়ার্ড সহ' : 'With rewards'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Four-Tier Reward System */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'bn' ? 'চার-স্তরের রিওয়ার্ড সিস্টেম' : 'Four-Tier Reward System'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">800</div>
              <div className="text-sm text-gray-600">
                {language === 'bn' ? '১ম স্তর' : 'Tier 1'}
              </div>
              <Badge variant="secondary" className="mt-2">
                {language === 'bn' ? '৬ নম্বর' : '6 Numbers'}
              </Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">1500</div>
              <div className="text-sm text-gray-600">
                {language === 'bn' ? '২য় স্তর' : 'Tier 2'}
              </div>
              <Badge variant="secondary" className="mt-2">
                {language === 'bn' ? '৩০ নম্বর' : '30 Numbers'}
              </Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">3500</div>
              <div className="text-sm text-gray-600">
                {language === 'bn' ? '৩য় স্তর' : 'Tier 3'}
              </div>
              <Badge variant="secondary" className="mt-2">
                {language === 'bn' ? '১২০ নম্বর' : '120 Numbers'}
              </Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">32200</div>
              <div className="text-sm text-gray-600">
                {language === 'bn' ? '৪র্থ স্তর' : 'Tier 4'}
              </div>
              <Badge variant="secondary" className="mt-2">
                {language === 'bn' ? '৪৮০ নম্বর' : '480 Numbers'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Point Management */}
      <PointManager 
        language={language} 
        customers={customers || []} 
        merchants={merchants || []} 
      />

      {/* Recent Reward Activities */}
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'bn' ? 'সাম্প্রতিক রিওয়ার্ড কার্যক্রম' : 'Recent Reward Activities'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rewardStats?.recentActivities?.map((activity: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">
                    {language === 'bn' ? activity.descriptionBengali : activity.description}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(activity.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US')}
                  </div>
                </div>
                <Badge variant="outline">
                  {activity.points} {language === 'bn' ? 'পয়েন্ট' : 'points'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RewardsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
      
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}