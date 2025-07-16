import { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, Users, Shield, UserPlus, Edit, Eye, Trash2, Plus } from "lucide-react";

interface StaffProps {
  language: string;
  selectedCountry: string;
}

export default function Staff({ language, selectedCountry }: StaffProps) {
  const { t } = useTranslation(language as any);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Mock data - will be replaced with actual API calls
  const staffMembers = [
    {
      id: 1,
      name: "John Smith",
      email: "john@komarce.com",
      phone: "+8801234567890",
      role: "Admin",
      country: "Bangladesh",
      department: "Operations",
      joinDate: "2025-01-15",
      status: "Active"
    },
    {
      id: 2,
      name: "Maria Garcia",
      email: "maria@komarce.com",
      phone: "+60123456789",
      role: "Manager",
      country: "Malaysia",
      department: "Customer Support",
      joinDate: "2025-02-10", 
      status: "Active"
    }
  ];

  const roles = [
    { value: "super_admin", label: language === 'bn' ? 'সুপার অ্যাডমিন' : 'Super Admin' },
    { value: "country_admin", label: language === 'bn' ? 'কান্ট্রি অ্যাডমিন' : 'Country Admin' },
    { value: "manager", label: language === 'bn' ? 'ম্যানেজার' : 'Manager' },
    { value: "support", label: language === 'bn' ? 'সাপোর্ট' : 'Support' },
    { value: "analyst", label: language === 'bn' ? 'বিশ্লেষক' : 'Analyst' }
  ];

  const departments = [
    { value: "operations", label: language === 'bn' ? 'অপারেশন' : 'Operations' },
    { value: "support", label: language === 'bn' ? 'কাস্টমার সাপোর্ট' : 'Customer Support' },
    { value: "finance", label: language === 'bn' ? 'ফিন্যান্স' : 'Finance' },
    { value: "marketing", label: language === 'bn' ? 'মার্কেটিং' : 'Marketing' },
    { value: "tech", label: language === 'bn' ? 'টেকনোলজি' : 'Technology' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'bn' ? 'স্টাফ ব্যবস্থাপনা' : 'Staff Management'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'bn' 
              ? 'কর্মী এবং তাদের অনুমতি পরিচালনা করুন'
              : 'Manage staff members and their permissions'
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
                {language === 'bn' ? 'নতুন স্টাফ' : 'Add Staff'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {language === 'bn' ? 'নতুন স্টাফ যোগ করুন' : 'Add New Staff Member'}
                </DialogTitle>
                <DialogDescription>
                  {language === 'bn' 
                    ? 'নতুন স্টাফ সদস্যের তথ্য প্রবেশ করান'
                    : 'Enter details for the new staff member'
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
                  <Label>{language === 'bn' ? 'ভূমিকা' : 'Role'}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'bn' ? 'ভূমিকা নির্বাচন করুন' : 'Select role'} />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{language === 'bn' ? 'বিভাগ' : 'Department'}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'bn' ? 'বিভাগ নির্বাচন করুন' : 'Select department'} />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </Button>
                <Button onClick={() => setShowAddDialog(false)}>
                  {language === 'bn' ? 'যোগ করুন' : 'Add Staff'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'bn' ? 'মোট স্টাফ' : 'Total Staff'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{staffMembers.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'bn' ? 'সক্রিয় স্টাফ' : 'Active Staff'}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {staffMembers.filter(s => s.status === 'Active').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {language === 'bn' ? 'বিভাগসমূহ' : 'Departments'}
                </p>
                <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle>{language === 'bn' ? 'স্টাফ তালিকা' : 'Staff List'}</CardTitle>
          <CardDescription>
            {language === 'bn' 
              ? 'সমস্ত স্টাফ সদস্য এবং তাদের ভূমিকা দেখুন'
              : 'View all staff members and their roles'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'bn' ? 'নাম' : 'Name'}</TableHead>
                <TableHead>{language === 'bn' ? 'ভূমিকা' : 'Role'}</TableHead>
                <TableHead>{language === 'bn' ? 'বিভাগ' : 'Department'}</TableHead>
                <TableHead>{language === 'bn' ? 'দেশ' : 'Country'}</TableHead>
                <TableHead>{language === 'bn' ? 'যোগদানের তারিখ' : 'Join Date'}</TableHead>
                <TableHead>{language === 'bn' ? 'স্থিতি' : 'Status'}</TableHead>
                <TableHead>{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffMembers.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{staff.name}</div>
                      <div className="text-sm text-gray-500">{staff.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {staff.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{staff.department}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{staff.country}</Badge>
                  </TableCell>
                  <TableCell>{staff.joinDate}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={staff.status === 'Active' ? 'default' : 'secondary'}
                      className={staff.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {staff.status}
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
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}