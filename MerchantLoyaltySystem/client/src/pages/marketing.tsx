import { useState } from "react";
import { BellRing, Download, Share2, Eye, Users, TrendingUp, Image, FileText, Video, Star } from "lucide-react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Marketing() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const marketingTemplates = [
    {
      id: "1",
      title: "KOMARCE Loyalty Program",
      type: "banner",
      category: "loyalty",
      description: "Promote your participation in KOMARCE loyalty program",
      downloads: 245,
      views: 1240,
      image: "/api/placeholder/400/200",
    },
    {
      id: "2",
      title: "Point Rewards Available",
      type: "social",
      category: "promotion",
      description: "Announce reward points availability to customers",
      downloads: 189,
      views: 890,
      image: "/api/placeholder/400/200",
    },
    {
      id: "3",
      title: "Cashback Offer",
      type: "flyer",
      category: "cashback",
      description: "Highlight cashback benefits for customers",
      downloads: 156,
      views: 670,
      image: "/api/placeholder/400/200",
    },
    {
      id: "4",
      title: "Merchant Partnership",
      type: "banner",
      category: "partnership",
      description: "Show your KOMARCE merchant partnership",
      downloads: 134,
      views: 580,
      image: "/api/placeholder/400/200",
    },
    {
      id: "5",
      title: "QR Code Promotion",
      type: "poster",
      category: "qr",
      description: "Promote QR code point transfers",
      downloads: 98,
      views: 450,
      image: "/api/placeholder/400/200",
    },
    {
      id: "6",
      title: "Referral Program",
      type: "social",
      category: "referral",
      description: "Promote merchant referral opportunities",
      downloads: 87,
      views: 320,
      image: "/api/placeholder/400/200",
    },
  ];

  const marketingStats = [
    { title: "Templates Downloaded", value: 1200, change: "+25%", icon: Download },
    { title: "Campaign Views", value: 15600, change: "+18%", icon: Eye },
    { title: "Social Shares", value: 890, change: "+32%", icon: Share2 },
    { title: "Engagement Rate", value: "7.2%", change: "+0.8%", icon: TrendingUp },
  ];

  const customizationOptions = [
    { name: "merchantName", label: "Merchant Name", type: "text", placeholder: "Your Business Name" },
    { name: "merchantLogo", label: "Merchant Logo", type: "file", accept: "image/*" },
    { name: "contactInfo", label: "Contact Information", type: "text", placeholder: "Phone, Email, Address" },
    { name: "specialOffer", label: "Special Offer", type: "textarea", placeholder: "Describe your special offer" },
    { name: "colors", label: "Brand Colors", type: "color", placeholder: "#6366f1" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 overflow-hidden">
        <Header />
        
        <main className="p-6 overflow-y-auto h-full">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketing Tools</h1>
            <p className="text-gray-600">Access promotional materials and marketing resources for your business</p>
          </div>

          {/* Marketing Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {marketingStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="hover-scale">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                        <p className="text-komarce-emerald text-sm mt-1">
                          <TrendingUp className="w-4 h-4 inline mr-1" />
                          {stat.change} from last month
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-komarce-purple to-purple-600 rounded-xl flex items-center justify-center">
                        <Icon className="text-white w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Marketing Templates */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Marketing Templates</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                  <Button className="btn-primary">
                    <BellRing className="w-4 h-4 mr-2" />
                    Create Custom
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">All Templates</TabsTrigger>
                  <TabsTrigger value="banners">Banners</TabsTrigger>
                  <TabsTrigger value="social">Social Media</TabsTrigger>
                  <TabsTrigger value="flyers">Flyers</TabsTrigger>
                  <TabsTrigger value="posters">Posters</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {marketingTemplates.map((template) => (
                      <Card key={template.id} className="hover-scale cursor-pointer">
                        <CardContent className="p-0">
                          <div className="aspect-video bg-gradient-to-br from-komarce-purple to-purple-600 rounded-t-lg flex items-center justify-center">
                            <div className="text-white text-center">
                              <Image className="w-12 h-12 mx-auto mb-2" />
                              <p className="text-sm font-medium">{template.title}</p>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium text-gray-900">{template.title}</h3>
                              <Badge variant="secondary">{template.type}</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                              <div className="flex items-center">
                                <Download className="w-4 h-4 mr-1" />
                                {template.downloads}
                              </div>
                              <div className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {template.views}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline" className="flex-1">
                                    Customize
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Customize Template</DialogTitle>
                                  </DialogHeader>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <h4 className="font-medium mb-4">Template Preview</h4>
                                      <div className="aspect-video bg-gradient-to-br from-komarce-purple to-purple-600 rounded-lg flex items-center justify-center">
                                        <div className="text-white text-center">
                                          <Image className="w-8 h-8 mx-auto mb-2" />
                                          <p className="text-sm">{template.title}</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-medium mb-4">Customization Options</h4>
                                      <div className="space-y-4">
                                        {customizationOptions.map((option) => (
                                          <div key={option.name}>
                                            <Label htmlFor={option.name}>{option.label}</Label>
                                            {option.type === "textarea" ? (
                                              <Textarea
                                                id={option.name}
                                                placeholder={option.placeholder}
                                                className="mt-1"
                                              />
                                            ) : option.type === "color" ? (
                                              <Input
                                                id={option.name}
                                                type="color"
                                                className="mt-1 h-10"
                                              />
                                            ) : (
                                              <Input
                                                id={option.name}
                                                type={option.type}
                                                placeholder={option.placeholder}
                                                accept={option.accept}
                                                className="mt-1"
                                              />
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                      <div className="flex space-x-2 mt-6">
                                        <Button className="flex-1">Download</Button>
                                        <Button variant="outline" className="flex-1">Share</Button>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button size="sm" className="flex-1">
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                {/* Other tab contents would be similar but filtered */}
                <TabsContent value="banners">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {marketingTemplates.filter(t => t.type === "banner").map((template) => (
                      <Card key={template.id} className="hover-scale">
                        <CardContent className="p-4">
                          <div className="aspect-video bg-gradient-to-br from-komarce-purple to-purple-600 rounded-lg flex items-center justify-center mb-4">
                            <div className="text-white text-center">
                              <Image className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-sm">{template.title}</p>
                            </div>
                          </div>
                          <h3 className="font-medium mb-2">{template.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                          <Button size="sm" className="w-full">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Campaign Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-komarce-purple rounded-lg flex items-center justify-center">
                        <BellRing className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Loyalty Program Banner</p>
                        <p className="text-sm text-gray-600">Social Media Campaign</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-komarce-emerald">+24%</p>
                      <p className="text-sm text-gray-600">Engagement</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-komarce-amber rounded-lg flex items-center justify-center">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Cashback Promotion</p>
                        <p className="text-sm text-gray-600">Print Advertisement</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-komarce-emerald">+18%</p>
                      <p className="text-sm text-gray-600">Conversion</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-komarce-emerald rounded-lg flex items-center justify-center">
                        <Share2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">Referral Campaign</p>
                        <p className="text-sm text-gray-600">Digital Marketing</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-komarce-emerald">+32%</p>
                      <p className="text-sm text-gray-600">Referrals</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Marketing Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Brand Guidelines</h4>
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      KOMARCE brand colors, fonts, and logo usage guidelines
                    </p>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Logo Pack</h4>
                      <Image className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      High-resolution KOMARCE logos in various formats
                    </p>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download ZIP
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Video Templates</h4>
                      <Video className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Animated templates for social media and digital ads
                    </p>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Gallery
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Custom Campaign Creator */}
          <Card>
            <CardHeader>
              <CardTitle>Create Custom Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Campaign Details</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="campaignName">Campaign Name</Label>
                      <Input id="campaignName" placeholder="Enter campaign name" />
                    </div>
                    <div>
                      <Label htmlFor="campaignType">Campaign Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select campaign type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="social">Social Media</SelectItem>
                          <SelectItem value="print">Print Advertisement</SelectItem>
                          <SelectItem value="digital">Digital Marketing</SelectItem>
                          <SelectItem value="email">Email Campaign</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="campaignDescription">Description</Label>
                      <Textarea id="campaignDescription" placeholder="Describe your campaign" />
                    </div>
                    <div>
                      <Label htmlFor="targetAudience">Target Audience</Label>
                      <Input id="targetAudience" placeholder="Describe your target audience" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">Campaign Preview</h4>
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center text-gray-500">
                      <Image className="w-12 h-12 mx-auto mb-2" />
                      <p>Campaign Preview</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1">Create Campaign</Button>
                    <Button variant="outline" className="flex-1">Save Draft</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
