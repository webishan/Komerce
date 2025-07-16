import { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Settings, Percent, Users, Gift, TrendingUp, Store, UserCheck, Handshake } from "lucide-react";

interface SettingsProps {
  language: string;
  selectedCountry: string;
}

export default function SystemSettings({ language, selectedCountry }: SettingsProps) {
  const { t } = useTranslation(language as any);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [settingsToSave, setSettingsToSave] = useState<any>(null);

  // Global Commission & Percentage Settings
  const [globalSettings, setGlobalSettings] = useState({
    vatServiceCharge: 12.5,
    affiliateCommission: 5.0,
    rippleRewardPercentage: 2.5,
    instantCashbackRate: 1.5,
    profitSharePercentage: 10.0,
    partnershipCommission: 15.0
  });

  // Customer Benefits Settings
  const [customerBenefits, setCustomerBenefits] = useState({
    stepUpReward: {
      tier1: 800,
      tier2: 1500,
      tier3: 3500,
      tier4: 32200,
      enabled: true
    },
    infinityReward: {
      percentage: 2.0,
      enabled: true
    },
    affiliateReward: {
      percentage: 5.0,
      enabled: true
    },
    rippleReward: {
      percentage: 2.5,
      maxLevels: 3,
      enabled: true
    },
    shoppingVoucher: {
      minPurchase: 1000,
      voucherPercentage: 10.0,
      enabled: true
    }
  });

  // Merchant Settings
  const [merchantSettings, setMerchantSettings] = useState({
    instantCashback: {
      percentage: 1.5,
      enabled: true
    },
    affiliateCashback: {
      percentage: 3.0,
      enabled: true
    },
    profitShareCashback: {
      percentage: 10.0,
      enabled: true
    },
    shoppingVoucher: {
      percentage: 8.0,
      enabled: true
    },
    rankIncentive: {
      bronze: 1000,
      silver: 2500,
      gold: 5000,
      platinum: 10000,
      enabled: true
    }
  });

  // Co-founder Settings
  const [coFounderSettings, setCoFounderSettings] = useState({
    instantCashback: {
      percentage: 2.5,
      enabled: true
    },
    affiliateCashback: {
      percentage: 5.0,
      enabled: true
    },
    profitShareCashback: {
      percentage: 15.0,
      enabled: true
    },
    shoppingVoucher: {
      percentage: 12.0,
      enabled: true
    },
    rankIncentive: {
      founder: 25000,
      coFounder: 50000,
      enabled: true
    },
    partnershipCommission: {
      level1: 15.0,
      level2: 10.0,
      level3: 5.0,
      enabled: true
    }
  });

  const handleSaveSettings = (section: string, data: any) => {
    setSettingsToSave({ section, data });
    setShowConfirmDialog(true);
  };

  const confirmSaveSettings = () => {
    if (!confirmPassword) {
      alert(language === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Please confirm password');
      return;
    }
    
    // TODO: Implement actual password verification and settings save
    console.log('Saving settings:', settingsToSave);
    setShowConfirmDialog(false);
    setConfirmPassword("");
    setSettingsToSave(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'bn' ? 'সিস্টেম সেটিংস' : 'System Settings'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'bn' 
              ? 'কমিশন এবং পুরস্কার সিস্টেম পরিচালনা করুন' 
              : 'Manage commission and reward system configurations'
            }
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {selectedCountry === 'global' ? (language === 'bn' ? 'গ্লোবাল' : 'Global') : selectedCountry}
        </Badge>
      </div>

      <Tabs defaultValue="global" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="global" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            {language === 'bn' ? 'গ্লোবাল' : 'Global'}
          </TabsTrigger>
          <TabsTrigger value="customer" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {language === 'bn' ? 'গ্রাহক' : 'Customer'}
          </TabsTrigger>
          <TabsTrigger value="merchant" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            {language === 'bn' ? 'মার্চেন্ট' : 'Merchant'}
          </TabsTrigger>
          <TabsTrigger value="cofounder" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            {language === 'bn' ? 'কো-ফাউন্ডার' : 'Co-Founder'}
          </TabsTrigger>
        </TabsList>

        {/* Global Commission & Percentage Settings */}
        <TabsContent value="global" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5" />
                {language === 'bn' ? 'গ্লোবাল কমিশন ও শতাংশ সেটিংস' : 'Global Commission & Percentage Settings'}
              </CardTitle>
              <CardDescription>
                {language === 'bn' 
                  ? 'সিস্টেমের মূল কমিশন এবং শতাংশের হার নির্ধারণ করুন'
                  : 'Configure core commission rates and percentages for the system'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vatServiceCharge">
                    {language === 'bn' ? 'ভ্যাট/সার্ভিস চার্জ (%)' : 'VAT/Service Charge (%)'}
                  </Label>
                  <Input
                    id="vatServiceCharge"
                    type="number"
                    value={globalSettings.vatServiceCharge}
                    onChange={(e) => setGlobalSettings({
                      ...globalSettings,
                      vatServiceCharge: parseFloat(e.target.value)
                    })}
                    step="0.1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="affiliateCommission">
                    {language === 'bn' ? 'অ্যাফিলিয়েট কমিশন (%)' : 'Affiliate Commission (%)'}
                  </Label>
                  <Input
                    id="affiliateCommission"
                    type="number"
                    value={globalSettings.affiliateCommission}
                    onChange={(e) => setGlobalSettings({
                      ...globalSettings,
                      affiliateCommission: parseFloat(e.target.value)
                    })}
                    step="0.1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rippleRewardPercentage">
                    {language === 'bn' ? 'রিপল রিওয়ার্ড (%)' : 'Ripple Reward (%)'}
                  </Label>
                  <Input
                    id="rippleRewardPercentage"
                    type="number"
                    value={globalSettings.rippleRewardPercentage}
                    onChange={(e) => setGlobalSettings({
                      ...globalSettings,
                      rippleRewardPercentage: parseFloat(e.target.value)
                    })}
                    step="0.1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instantCashbackRate">
                    {language === 'bn' ? 'ইনস্ট্যান্ট ক্যাশব্যাক (%)' : 'Instant Cashback (%)'}
                  </Label>
                  <Input
                    id="instantCashbackRate"
                    type="number"
                    value={globalSettings.instantCashbackRate}
                    onChange={(e) => setGlobalSettings({
                      ...globalSettings,
                      instantCashbackRate: parseFloat(e.target.value)
                    })}
                    step="0.1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="profitSharePercentage">
                    {language === 'bn' ? 'প্রফিট শেয়ার (%)' : 'Profit Share (%)'}
                  </Label>
                  <Input
                    id="profitSharePercentage"
                    type="number"
                    value={globalSettings.profitSharePercentage}
                    onChange={(e) => setGlobalSettings({
                      ...globalSettings,
                      profitSharePercentage: parseFloat(e.target.value)
                    })}
                    step="0.1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="partnershipCommission">
                    {language === 'bn' ? 'পার্টনারশিপ কমিশন (%)' : 'Partnership Commission (%)'}
                  </Label>
                  <Input
                    id="partnershipCommission"
                    type="number"
                    value={globalSettings.partnershipCommission}
                    onChange={(e) => setGlobalSettings({
                      ...globalSettings,
                      partnershipCommission: parseFloat(e.target.value)
                    })}
                    step="0.1"
                  />
                </div>
              </div>
              
              <Button 
                onClick={() => handleSaveSettings('global', globalSettings)}
                className="w-full"
              >
                {language === 'bn' ? 'গ্লোবাল সেটিংস সংরক্ষণ করুন' : 'Save Global Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Benefits */}
        <TabsContent value="customer" className="space-y-6">
          <div className="grid gap-6">
            {/* Step Up Reward */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {language === 'bn' ? 'স্টেপ-আপ রিওয়ার্ড' : 'Step-up Reward'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'টিয়ার ১' : 'Tier 1'}</Label>
                    <Input
                      type="number"
                      value={customerBenefits.stepUpReward.tier1}
                      onChange={(e) => setCustomerBenefits({
                        ...customerBenefits,
                        stepUpReward: {
                          ...customerBenefits.stepUpReward,
                          tier1: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'টিয়ার ২' : 'Tier 2'}</Label>
                    <Input
                      type="number"
                      value={customerBenefits.stepUpReward.tier2}
                      onChange={(e) => setCustomerBenefits({
                        ...customerBenefits,
                        stepUpReward: {
                          ...customerBenefits.stepUpReward,
                          tier2: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'টিয়ার ৩' : 'Tier 3'}</Label>
                    <Input
                      type="number"
                      value={customerBenefits.stepUpReward.tier3}
                      onChange={(e) => setCustomerBenefits({
                        ...customerBenefits,
                        stepUpReward: {
                          ...customerBenefits.stepUpReward,
                          tier3: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'টিয়ার ৪' : 'Tier 4'}</Label>
                    <Input
                      type="number"
                      value={customerBenefits.stepUpReward.tier4}
                      onChange={(e) => setCustomerBenefits({
                        ...customerBenefits,
                        stepUpReward: {
                          ...customerBenefits.stepUpReward,
                          tier4: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Other Customer Benefits */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'bn' ? 'ইনফিনিটি রিওয়ার্ড' : 'Infinity Reward'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'শতাংশ (%)' : 'Percentage (%)'}</Label>
                    <Input
                      type="number"
                      value={customerBenefits.infinityReward.percentage}
                      onChange={(e) => setCustomerBenefits({
                        ...customerBenefits,
                        infinityReward: {
                          ...customerBenefits.infinityReward,
                          percentage: parseFloat(e.target.value)
                        }
                      })}
                      step="0.1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{language === 'bn' ? 'শপিং ভাউচার' : 'Shopping Voucher'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'সর্বনিম্ন ক্রয়' : 'Minimum Purchase'}</Label>
                    <Input
                      type="number"
                      value={customerBenefits.shoppingVoucher.minPurchase}
                      onChange={(e) => setCustomerBenefits({
                        ...customerBenefits,
                        shoppingVoucher: {
                          ...customerBenefits.shoppingVoucher,
                          minPurchase: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'ভাউচার শতাংশ (%)' : 'Voucher Percentage (%)'}</Label>
                    <Input
                      type="number"
                      value={customerBenefits.shoppingVoucher.voucherPercentage}
                      onChange={(e) => setCustomerBenefits({
                        ...customerBenefits,
                        shoppingVoucher: {
                          ...customerBenefits.shoppingVoucher,
                          voucherPercentage: parseFloat(e.target.value)
                        }
                      })}
                      step="0.1"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button 
              onClick={() => handleSaveSettings('customer', customerBenefits)}
              className="w-full"
            >
              {language === 'bn' ? 'গ্রাহক সুবিধা সংরক্ষণ করুন' : 'Save Customer Benefits'}
            </Button>
          </div>
        </TabsContent>

        {/* Merchant Settings */}
        <TabsContent value="merchant" className="space-y-6">
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'bn' ? 'ইনস্ট্যান্ট ক্যাশব্যাক' : 'Instant Cashback'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'শতাংশ (%)' : 'Percentage (%)'}</Label>
                    <Input
                      type="number"
                      value={merchantSettings.instantCashback.percentage}
                      onChange={(e) => setMerchantSettings({
                        ...merchantSettings,
                        instantCashback: {
                          ...merchantSettings.instantCashback,
                          percentage: parseFloat(e.target.value)
                        }
                      })}
                      step="0.1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{language === 'bn' ? 'অ্যাফিলিয়েট ক্যাশব্যাক' : 'Affiliate Cashback'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'শতাংশ (%)' : 'Percentage (%)'}</Label>
                    <Input
                      type="number"
                      value={merchantSettings.affiliateCashback.percentage}
                      onChange={(e) => setMerchantSettings({
                        ...merchantSettings,
                        affiliateCashback: {
                          ...merchantSettings.affiliateCashback,
                          percentage: parseFloat(e.target.value)
                        }
                      })}
                      step="0.1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{language === 'bn' ? 'প্রফিট শেয়ার ক্যাশব্যাক' : 'Profit Share Cashback'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'শতাংশ (%)' : 'Percentage (%)'}</Label>
                    <Input
                      type="number"
                      value={merchantSettings.profitShareCashback.percentage}
                      onChange={(e) => setMerchantSettings({
                        ...merchantSettings,
                        profitShareCashback: {
                          ...merchantSettings.profitShareCashback,
                          percentage: parseFloat(e.target.value)
                        }
                      })}
                      step="0.1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{language === 'bn' ? 'শপিং ভাউচার' : 'Shopping Voucher'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'শতাংশ (%)' : 'Percentage (%)'}</Label>
                    <Input
                      type="number"
                      value={merchantSettings.shoppingVoucher.percentage}
                      onChange={(e) => setMerchantSettings({
                        ...merchantSettings,
                        shoppingVoucher: {
                          ...merchantSettings.shoppingVoucher,
                          percentage: parseFloat(e.target.value)
                        }
                      })}
                      step="0.1"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rank Incentive */}
            <Card>
              <CardHeader>
                <CardTitle>{language === 'bn' ? 'র্যাঙ্ক ইনসেন্টিভ' : 'Rank Incentive'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'ব্রোঞ্জ' : 'Bronze'}</Label>
                    <Input
                      type="number"
                      value={merchantSettings.rankIncentive.bronze}
                      onChange={(e) => setMerchantSettings({
                        ...merchantSettings,
                        rankIncentive: {
                          ...merchantSettings.rankIncentive,
                          bronze: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'সিলভার' : 'Silver'}</Label>
                    <Input
                      type="number"
                      value={merchantSettings.rankIncentive.silver}
                      onChange={(e) => setMerchantSettings({
                        ...merchantSettings,
                        rankIncentive: {
                          ...merchantSettings.rankIncentive,
                          silver: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'গোল্ড' : 'Gold'}</Label>
                    <Input
                      type="number"
                      value={merchantSettings.rankIncentive.gold}
                      onChange={(e) => setMerchantSettings({
                        ...merchantSettings,
                        rankIncentive: {
                          ...merchantSettings.rankIncentive,
                          gold: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'প্ল্যাটিনাম' : 'Platinum'}</Label>
                    <Input
                      type="number"
                      value={merchantSettings.rankIncentive.platinum}
                      onChange={(e) => setMerchantSettings({
                        ...merchantSettings,
                        rankIncentive: {
                          ...merchantSettings.rankIncentive,
                          platinum: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={() => handleSaveSettings('merchant', merchantSettings)}
              className="w-full"
            >
              {language === 'bn' ? 'মার্চেন্ট সেটিংস সংরক্ষণ করুন' : 'Save Merchant Settings'}
            </Button>
          </div>
        </TabsContent>

        {/* Co-Founder Settings */}
        <TabsContent value="cofounder" className="space-y-6">
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'bn' ? 'ইনস্ট্যান্ট ক্যাশব্যাক' : 'Instant Cashback'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'শতাংশ (%)' : 'Percentage (%)'}</Label>
                    <Input
                      type="number"
                      value={coFounderSettings.instantCashback.percentage}
                      onChange={(e) => setCoFounderSettings({
                        ...coFounderSettings,
                        instantCashback: {
                          ...coFounderSettings.instantCashback,
                          percentage: parseFloat(e.target.value)
                        }
                      })}
                      step="0.1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{language === 'bn' ? 'অ্যাফিলিয়েট ক্যাশব্যাক' : 'Affiliate Cashback'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'শতাংশ (%)' : 'Percentage (%)'}</Label>
                    <Input
                      type="number"
                      value={coFounderSettings.affiliateCashback.percentage}
                      onChange={(e) => setCoFounderSettings({
                        ...coFounderSettings,
                        affiliateCashback: {
                          ...coFounderSettings.affiliateCashback,
                          percentage: parseFloat(e.target.value)
                        }
                      })}
                      step="0.1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{language === 'bn' ? 'প্রফিট শেয়ার ক্যাশব্যাক' : 'Profit Share Cashback'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'শতাংশ (%)' : 'Percentage (%)'}</Label>
                    <Input
                      type="number"
                      value={coFounderSettings.profitShareCashback.percentage}
                      onChange={(e) => setCoFounderSettings({
                        ...coFounderSettings,
                        profitShareCashback: {
                          ...coFounderSettings.profitShareCashback,
                          percentage: parseFloat(e.target.value)
                        }
                      })}
                      step="0.1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{language === 'bn' ? 'শপিং ভাউচার' : 'Shopping Voucher'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'শতাংশ (%)' : 'Percentage (%)'}</Label>
                    <Input
                      type="number"
                      value={coFounderSettings.shoppingVoucher.percentage}
                      onChange={(e) => setCoFounderSettings({
                        ...coFounderSettings,
                        shoppingVoucher: {
                          ...coFounderSettings.shoppingVoucher,
                          percentage: parseFloat(e.target.value)
                        }
                      })}
                      step="0.1"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Partnership Commission */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Handshake className="h-5 w-5" />
                  {language === 'bn' ? 'পার্টনারশিপ কমিশন' : 'Partnership Commission'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'লেভেল ১ (%)' : 'Level 1 (%)'}</Label>
                    <Input
                      type="number"
                      value={coFounderSettings.partnershipCommission.level1}
                      onChange={(e) => setCoFounderSettings({
                        ...coFounderSettings,
                        partnershipCommission: {
                          ...coFounderSettings.partnershipCommission,
                          level1: parseFloat(e.target.value)
                        }
                      })}
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'লেভেল ২ (%)' : 'Level 2 (%)'}</Label>
                    <Input
                      type="number"
                      value={coFounderSettings.partnershipCommission.level2}
                      onChange={(e) => setCoFounderSettings({
                        ...coFounderSettings,
                        partnershipCommission: {
                          ...coFounderSettings.partnershipCommission,
                          level2: parseFloat(e.target.value)
                        }
                      })}
                      step="0.1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'লেভেল ৩ (%)' : 'Level 3 (%)'}</Label>
                    <Input
                      type="number"
                      value={coFounderSettings.partnershipCommission.level3}
                      onChange={(e) => setCoFounderSettings({
                        ...coFounderSettings,
                        partnershipCommission: {
                          ...coFounderSettings.partnershipCommission,
                          level3: parseFloat(e.target.value)
                        }
                      })}
                      step="0.1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={() => handleSaveSettings('cofounder', coFounderSettings)}
              className="w-full"
            >
              {language === 'bn' ? 'কো-ফাউন্ডার সেটিংস সংরক্ষণ করুন' : 'Save Co-Founder Settings'}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'bn' ? 'সেটিংস সংরক্ষণ নিশ্চিত করুন' : 'Confirm Settings Save'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === 'bn' 
                ? 'এই পরিবর্তনগুলি সংরক্ষণ করতে আপনার পাসওয়ার্ড লিখুন।'
                : 'Please enter your password to confirm saving these changes.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {language === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={language === 'bn' ? 'আপনার পাসওয়ার্ড লিখুন' : 'Enter your password'}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowConfirmDialog(false);
              setConfirmPassword("");
            }}>
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmSaveSettings}>
              {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}