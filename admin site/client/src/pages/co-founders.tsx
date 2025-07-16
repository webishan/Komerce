import { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserCheck, Crown, Star, TrendingUp, DollarSign, Users, Building2, Plus, Edit, Eye } from "lucide-react";

interface CoFoundersProps {
  language: string;
  selectedCountry: string;
}

export default function CoFounders({ language, selectedCountry }: CoFoundersProps) {
  const { t } = useTranslation(language as any);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState("list");

  // Mock data - will be replaced with actual API calls
  const coFounders = [
    {
      id: 1,
      name: "Ahmed Rahman",
      email: "ahmed@komarce.com",
      phone: "+8801234567890",
      country: "Bangladesh",
      tier: "Founder",
      joinDate: "2025-01-15",
      totalCommission: 125000,
      activePartners: 15,
      status: "Active"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@komarce.com", 
      phone: "+60123456789",
      country: "Malaysia",
      tier: "Co-Founder",
      joinDate: "2025-02-10",
      totalCommission: 95000,
      activePartners: 12,
      status: "Active"
    }
  ];

  const partnershipStats = {
    totalCoFounders: 25,
    activePartners: 180,
    totalCommission: 2500000,
    monthlyGrowth: 15.5
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'bn' ? 'কো-ফাউন্ডার ব্যবস্থাপনা' : 'Co-Founder Management'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'bn' 
              ? 'কো-ফাউন্ডার এবং পার্টনারশিপ কমিশন পরিচালনা করুন'
              : 'Manage co-founders and partnership commissions'
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {selectedCountry === 'global' ? (language === 'bn' ? 'গ্লোবাল' : 'Global') : selectedCountry}
          </Badge>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {language === 'bn' ? 'নতুন কো-ফাউন্ডার' : 'Add Co-Founder'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {language === 'bn' ? 'নতুন কো-ফাউন্ডার যোগ করুন' : 'Add New Co-Founder'}
                </DialogTitle>
                <DialogDescription>
                  {language === 'bn' 
                    ? 'নতুন কো-ফাউন্ডারের তথ্য প্রবেশ করান'
                    : 'Enter details for the new co-founder'
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{language === 'bn' ? 'নাম' : 'Name'}</Label>
                  <Input placeholder={language === 'bn' ? 'পূর্ণ নাম' : 'Full name'} />
                </div>
                <div className="space-y-2">
                  <Label>{language === 'bn' ? 'ইমেইল' : 'Email'}</Label>
                  <Input type="email" placeholder={language === 'bn' ? 'ইমেইল ঠিকানা' : 'Email address'} />
                </div>
                <div className="space-y-2">
                  <Label>{language === 'bn' ? 'ফোন' : 'Phone'}</Label>
                  <Input placeholder={language === 'bn' ? 'ফোন নম্বর' : 'Phone number'} />
                </div>
                <div className="space-y-2">
                  <Label>{language === 'bn' ? 'টিয়ার' : 'Tier'}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'bn' ? 'টিয়ার নির্বাচন করুন' : 'Select tier'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="founder">
                        {language === 'bn' ? 'ফাউন্ডার' : 'Founder'}
                      </SelectItem>
                      <SelectItem value="co-founder">
                        {language === 'bn' ? 'কো-ফাউন্ডার' : 'Co-Founder'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </Button>
                <Button onClick={() => setShowAddDialog(false)}>
                  {language === 'bn' ? 'যোগ করুন' : 'Add Co-Founder'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'bn' ? 'মোট কো-ফাউন্ডার' : 'Total Co-Founders'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{partnershipStats.totalCoFounders}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <UserCheck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'bn' ? 'সক্রিয় পার্টনার' : 'Active Partners'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{partnershipStats.activePartners}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'bn' ? 'মোট কমিশন' : 'Total Commission'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ${partnershipStats.totalCommission.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'bn' ? 'মাসিক বৃদ্ধি' : 'Monthly Growth'}
                </p>
                <p className="text-2xl font-bold text-green-600">+{partnershipStats.monthlyGrowth}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {language === 'bn' ? 'কো-ফাউন্ডার তালিকা' : 'Co-Founders List'}
          </TabsTrigger>
          <TabsTrigger value="commissions" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            {language === 'bn' ? 'কমিশন ট্র্যাকিং' : 'Commission Tracking'}
          </TabsTrigger>
          <TabsTrigger value="partnerships" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            {language === 'bn' ? 'পার্টনারশিপ' : 'Partnerships'}
          </TabsTrigger>
        </TabsList>

        {/* Co-Founders List */}
        <TabsContent value="list" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'bn' ? 'কো-ফাউন্ডার তালিকা' : 'Co-Founders List'}</CardTitle>
              <CardDescription>
                {language === 'bn' 
                  ? 'সমস্ত কো-ফাউন্ডার এবং তাদের পারফরম্যান্স দেখুন'
                  : 'View all co-founders and their performance'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'bn' ? 'নাম' : 'Name'}</TableHead>
                    <TableHead>{language === 'bn' ? 'দেশ' : 'Country'}</TableHead>
                    <TableHead>{language === 'bn' ? 'টিয়ার' : 'Tier'}</TableHead>
                    <TableHead>{language === 'bn' ? 'যোগদানের তারিখ' : 'Join Date'}</TableHead>
                    <TableHead>{language === 'bn' ? 'মোট কমিশন' : 'Total Commission'}</TableHead>
                    <TableHead>{language === 'bn' ? 'সক্রিয় পার্টনার' : 'Active Partners'}</TableHead>
                    <TableHead>{language === 'bn' ? 'স্থিতি' : 'Status'}</TableHead>
                    <TableHead>{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coFounders.map((coFounder) => (
                    <TableRow key={coFounder.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{coFounder.name}</div>
                          <div className="text-sm text-gray-500">{coFounder.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{coFounder.country}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {coFounder.tier === 'Founder' ? (
                            <Crown className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <Star className="h-4 w-4 text-blue-500" />
                          )}
                          <span className="text-sm font-medium">{coFounder.tier}</span>
                        </div>
                      </TableCell>
                      <TableCell>{coFounder.joinDate}</TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600">
                          ${coFounder.totalCommission.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{coFounder.activePartners}</span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={coFounder.status === 'Active' ? 'default' : 'secondary'}
                          className={coFounder.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {coFounder.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commission Tracking */}
        <TabsContent value="commissions" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  {language === 'bn' ? 'কমিশন ট্র্যাকিং' : 'Commission Tracking'}
                </CardTitle>
                <CardDescription>
                  {language === 'bn' 
                    ? 'কো-ফাউন্ডারদের কমিশন এবং পেমেন্ট ট্র্যাক করুন'
                    : 'Track commissions and payments for co-founders'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {language === 'bn' ? 'কমিশন ট্র্যাকিং' : 'Commission Tracking'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'bn' 
                      ? 'কমিশন ট্র্যাকিং সিস্টেম শীঘ্রই আসছে...'
                      : 'Commission tracking system coming soon...'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Partnerships */}
        <TabsContent value="partnerships" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {language === 'bn' ? 'পার্টনারশিপ ব্যবস্থাপনা' : 'Partnership Management'}
                </CardTitle>
                <CardDescription>
                  {language === 'bn' 
                    ? 'পার্টনারশিপ এবং কমিশন স্ট্রাকচার পরিচালনা করুন'
                    : 'Manage partnerships and commission structures'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {language === 'bn' ? 'পার্টনারশিপ ব্যবস্থাপনা' : 'Partnership Management'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'bn' 
                      ? 'পার্টনারশিপ ব্যবস্থাপনা সিস্টেম শীঘ্রই আসছে...'
                      : 'Partnership management system coming soon...'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}