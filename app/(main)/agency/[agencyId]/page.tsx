"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DollarSign, Users, TrendingUp, Calendar, Settings, Plus, Eye } from "lucide-react";

interface AgencyData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  companyEmail: string;
  companyPhone: string;
  whiteLabel: boolean;
  address: string;
  city: string;
  zipCode: string;
  state: string;
  country: string;
  goal: number;
  SubAccount: any[];
  SideBarOption: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Page = ({ params }: { params: { agencyId: string } }) => {
  const [agencyData, setAgencyData] = useState<AgencyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - replace with actual API call
  const mockAgencyData: AgencyData = {
    id: params.agencyId,
    name: "Digital Marketing Pro",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
    companyEmail: "hello@digitalmarketingpro.com",
    companyPhone: "+1 (555) 123-4567",
    whiteLabel: true,
    address: "123 Business Ave",
    city: "San Francisco",
    zipCode: "94105",
    state: "CA",
    country: "USA",
    goal: 50000,
    SubAccount: [
      { id: "1", name: "Tech Startup A", createdAt: "2024-01-10" },
      { id: "2", name: "E-commerce Store B", createdAt: "2024-01-12" },
      { id: "3", name: "Local Business C", createdAt: "2024-01-18" }
    ],
    SideBarOption: []
  };

  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
  ];

  const subAccountDistribution = [
    { name: 'Active', value: 3 },
    { name: 'Inactive', value: 1 },
    { name: 'Pending', value: 2 },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAgencyData(mockAgencyData);
      setLoading(false);
    }, 1000);
  }, [params.agencyId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!agencyData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Agency not found</h2>
          <p className="text-gray-500 mt-2">The requested agency could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{agencyData.name}</h1>
          <p className="text-gray-500 mt-1">Agency Dashboard</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Sub-Account
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,567</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sub-Accounts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agencyData.SubAccount.length}</div>
            <p className="text-xs text-muted-foreground">3 active this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">49%</div>
            <p className="text-xs text-muted-foreground">$24,567 of ${agencyData.goal}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Today</div>
            <p className="text-xs text-muted-foreground">{new Date(agencyData.updatedAt).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subaccounts">Sub-Accounts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Sub-Account
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Invite Team Member
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Agency Settings
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  View Public Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subaccounts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Sub-Accounts</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Sub-Account
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agencyData.SubAccount.map((subAccount) => (
              <Card key={subAccount.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{subAccount.name}</CardTitle>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <CardDescription>
                    Created {new Date(subAccount.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Last activity</span>
                    <span className="text-sm font-medium">2 days ago</span>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sub-Account Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={subAccountDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {subAccountDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Client Retention</span>
                  <Badge variant="default">92%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Avg. Project Value</span>
                  <span className="font-medium">$8,450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Response Time</span>
                  <span className="font-medium">2.3 hours</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Satisfaction Score</span>
                  <Badge variant="default">4.8/5</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agency Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Agency Name</label>
                  <p className="mt-1 text-gray-900">{agencyData.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900">{agencyData.companyEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-gray-900">{agencyData.companyPhone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <p className="mt-1 text-gray-900">
                    {agencyData.city}, {agencyData.state} {agencyData.zipCode}
                  </p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">White Label Status</h4>
                <Badge variant={agencyData.whiteLabel ? "default" : "secondary"}>
                  {agencyData.whiteLabel ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
