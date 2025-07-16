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
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Headphones, MessageSquare, Clock, CheckCircle, AlertCircle, Users, TrendingUp, Plus, Eye, MessageCircle } from "lucide-react";

interface CustomerCareProps {
  language: string;
  selectedCountry: string;
}

export default function CustomerCare({ language, selectedCountry }: CustomerCareProps) {
  const { t } = useTranslation(language as any);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState("tickets");

  // Mock data - will be replaced with actual API calls
  const tickets = [
    {
      id: "TKT-001",
      subject: "Payment Issue",
      customer: "Ahmed Rahman",
      email: "ahmed@example.com",
      priority: "High",
      status: "Open",
      category: "Payment",
      createdAt: "2025-01-15",
      assignedTo: "John Smith"
    },
    {
      id: "TKT-002", 
      subject: "Account Verification",
      customer: "Sarah Johnson",
      email: "sarah@example.com",
      priority: "Medium",
      status: "In Progress",
      category: "Account",
      createdAt: "2025-01-14",
      assignedTo: "Maria Garcia"
    }
  ];

  const stats = {
    totalTickets: 156,
    openTickets: 23,
    resolvedToday: 8,
    avgResponseTime: "2.5h"
  };

  const priorityColors = {
    "Low": "bg-green-100 text-green-800",
    "Medium": "bg-yellow-100 text-yellow-800", 
    "High": "bg-red-100 text-red-800",
    "Critical": "bg-purple-100 text-purple-800"
  };

  const statusColors = {
    "Open": "bg-blue-100 text-blue-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    "Resolved": "bg-green-100 text-green-800",
    "Closed": "bg-gray-100 text-gray-800"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'bn' ? 'কাস্টমার কেয়ার' : 'Customer Care'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'bn' 
              ? 'গ্রাহক সাপোর্ট টিকেট এবং অনুরোধ পরিচালনা করুন'
              : 'Manage customer support tickets and requests'
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            {selectedCountry === 'global' ? (language === 'bn' ? 'গ্লোবাল' : 'Global') : selectedCountry}
          </Badge>
          <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {language === 'bn' ? 'নতুন টিকেট' : 'New Ticket'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {language === 'bn' ? 'নতুন সাপোর্ট টিকেট তৈরি করুন' : 'Create New Support Ticket'}
                </DialogTitle>
                <DialogDescription>
                  {language === 'bn' 
                    ? 'গ্রাহকের জন্য একটি নতুন সাপোর্ট টিকেট তৈরি করুন'
                    : 'Create a new support ticket for a customer'
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'গ্রাহকের নাম' : 'Customer Name'}</Label>
                    <Input placeholder={language === 'bn' ? 'গ্রাহকের নাম লিখুন' : 'Enter customer name'} />
                  </div>
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'ইমেইল' : 'Email'}</Label>
                    <Input type="email" placeholder={language === 'bn' ? 'ইমেইল ঠিকানা' : 'Email address'} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'বিভাগ' : 'Category'}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'bn' ? 'বিভাগ নির্বাচন করুন' : 'Select category'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="payment">{language === 'bn' ? 'পেমেন্ট' : 'Payment'}</SelectItem>
                        <SelectItem value="account">{language === 'bn' ? 'অ্যাকাউন্ট' : 'Account'}</SelectItem>
                        <SelectItem value="technical">{language === 'bn' ? 'টেকনিক্যাল' : 'Technical'}</SelectItem>
                        <SelectItem value="general">{language === 'bn' ? 'সাধারণ' : 'General'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{language === 'bn' ? 'অগ্রাধিকার' : 'Priority'}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'bn' ? 'অগ্রাধিকার নির্বাচন করুন' : 'Select priority'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">{language === 'bn' ? 'কম' : 'Low'}</SelectItem>
                        <SelectItem value="medium">{language === 'bn' ? 'মাঝারি' : 'Medium'}</SelectItem>
                        <SelectItem value="high">{language === 'bn' ? 'উচ্চ' : 'High'}</SelectItem>
                        <SelectItem value="critical">{language === 'bn' ? 'জরুরি' : 'Critical'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{language === 'bn' ? 'বিষয়' : 'Subject'}</Label>
                  <Input placeholder={language === 'bn' ? 'টিকেটের বিষয়' : 'Ticket subject'} />
                </div>
                <div className="space-y-2">
                  <Label>{language === 'bn' ? 'বিবরণ' : 'Description'}</Label>
                  <Textarea 
                    placeholder={language === 'bn' ? 'সমস্যার বিস্তারিত বিবরণ লিখুন' : 'Describe the issue in detail'}
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowTicketDialog(false)}>
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </Button>
                <Button onClick={() => setShowTicketDialog(false)}>
                  {language === 'bn' ? 'টিকেট তৈরি করুন' : 'Create Ticket'}
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
                  {language === 'bn' ? 'মোট টিকেট' : 'Total Tickets'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTickets}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'bn' ? 'খোলা টিকেট' : 'Open Tickets'}
                </p>
                <p className="text-2xl font-bold text-red-600">{stats.openTickets}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'bn' ? 'আজ সমাধান' : 'Resolved Today'}
                </p>
                <p className="text-2xl font-bold text-green-600">{stats.resolvedToday}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'bn' ? 'গড় প্রতিক্রিয়া সময়' : 'Avg Response Time'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stats.avgResponseTime}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {language === 'bn' ? 'টিকেটসমূহ' : 'Tickets'}
          </TabsTrigger>
          <TabsTrigger value="live-chat" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            {language === 'bn' ? 'লাইভ চ্যাট' : 'Live Chat'}
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {language === 'bn' ? 'রিপোর্ট' : 'Reports'}
          </TabsTrigger>
        </TabsList>

        {/* Tickets */}
        <TabsContent value="tickets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'bn' ? 'সাপোর্ট টিকেটসমূহ' : 'Support Tickets'}</CardTitle>
              <CardDescription>
                {language === 'bn' 
                  ? 'সমস্ত গ্রাহক সাপোর্ট টিকেট দেখুন এবং পরিচালনা করুন'
                  : 'View and manage all customer support tickets'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'bn' ? 'টিকেট ID' : 'Ticket ID'}</TableHead>
                    <TableHead>{language === 'bn' ? 'গ্রাহক' : 'Customer'}</TableHead>
                    <TableHead>{language === 'bn' ? 'বিষয়' : 'Subject'}</TableHead>
                    <TableHead>{language === 'bn' ? 'বিভাগ' : 'Category'}</TableHead>
                    <TableHead>{language === 'bn' ? 'অগ্রাধিকার' : 'Priority'}</TableHead>
                    <TableHead>{language === 'bn' ? 'অবস্থা' : 'Status'}</TableHead>
                    <TableHead>{language === 'bn' ? 'বরাদ্দকৃত' : 'Assigned To'}</TableHead>
                    <TableHead>{language === 'bn' ? 'তারিখ' : 'Date'}</TableHead>
                    <TableHead>{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <span className="font-mono text-sm">{ticket.id}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ticket.customer}</div>
                          <div className="text-sm text-gray-500">{ticket.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{ticket.subject}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{ticket.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={priorityColors[ticket.priority as keyof typeof priorityColors]}>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[ticket.status as keyof typeof statusColors]}>
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket.assignedTo}</TableCell>
                      <TableCell>{ticket.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4" />
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

        {/* Live Chat */}
        <TabsContent value="live-chat" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                {language === 'bn' ? 'লাইভ চ্যাট সাপোর্ট' : 'Live Chat Support'}
              </CardTitle>
              <CardDescription>
                {language === 'bn' 
                  ? 'রিয়েল-টাইম গ্রাহক চ্যাট সাপোর্ট'
                  : 'Real-time customer chat support'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {language === 'bn' ? 'লাইভ চ্যাট সিস্টেম' : 'Live Chat System'}
                </h3>
                <p className="text-gray-600">
                  {language === 'bn' 
                    ? 'লাইভ চ্যাট সাপোর্ট সিস্টেম শীঘ্রই আসছে...'
                    : 'Live chat support system coming soon...'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {language === 'bn' ? 'কাস্টমার কেয়ার রিপোর্ট' : 'Customer Care Reports'}
              </CardTitle>
              <CardDescription>
                {language === 'bn' 
                  ? 'সাপোর্ট পারফরম্যান্স এবং মেট্রিক্স'
                  : 'Support performance and metrics'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {language === 'bn' ? 'রিপোর্ট সিস্টেম' : 'Reporting System'}
                </h3>
                <p className="text-gray-600">
                  {language === 'bn' 
                    ? 'বিস্তারিত রিপোর্ট সিস্টেম শীঘ্রই আসছে...'
                    : 'Detailed reporting system coming soon...'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}