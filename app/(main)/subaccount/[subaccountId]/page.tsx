"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { DollarSign, Users, TrendingUp, Calendar, Settings, Plus, Eye, Mail, Phone, MapPin } from "lucide-react";

interface SubAccountData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  subAccountLogo: string | null;
  companyEmail: string;
  companyPhone: string;
  address: string;
  city: string;
  zipCode: string;
  state: string;
  country: string;
  goal: number;
  Agency: {
    id: string;
    name: string;
  };
  Funnel: any[];
  Media: any[];
  Contact: any[];
  Ticket: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Page = ({ params }: { params: { subaccountId: string } }) => {
  const [subAccountData, setSubAccountData] = useState<SubAccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - replace with actual API call
  const mockSubAccountData: SubAccountData = {
    id: params.subaccountId,
    name: "Tech Startup Solutions",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-20T14:45:00Z",
    subAccountLogo: null,
    companyEmail: "contact@techstartup.com",
    companyPhone: "+1 (555) 987-6543",
    address: "456 Innovation Drive",
    city: "Austin",
    zipCode: "78701",
    state: "TX",
    country: "USA",
    goal: 25000,
    Agency: {
      id: "agency-1",
      name: "Digital Marketing Pro"
    },
    Funnel: [
      { id: "funnel-1", name: "Main Product Launch", published: true, createdAt: "2024-01-10" },
      { id: "funnel-2", name: "Lead Generation", published: false, createdAt: "2024-01-12" }
    ],
    Media: [
      { id: "media-1", name: "product-banner.jpg", type: "image" },
      { id: "media-2", name: "company-video.mp4", type: "video" }
    ],
    Contact: [
      { id: "contact-1", name: "John Smith", email: "john@example.com", status: "converted" },
      { id: "contact-2", name: "Sarah Johnson", email: "sarah@example.com", status: "lead" }
    ],
    Ticket: [
      { id: "ticket-1", name: "Website Optimization", status: "completed" },
      { id: "ticket-2", name: "SEO Audit", status: "in-progress" }
    ]
  };

  const revenueData = [
    { name: 'Mon', revenue: 1200 },
    { name: 'Tue', revenue: 1900 },
    { name: 'Wed', revenue: 1500 },
    { name: 'Thu', revenue: 2200 },
    { name: 'Fri', revenue: 1800 },
    { name: 'Sat', revenue: 2400 },
    { name: 'Sun', revenue: 1600 }
  ];

  const funnelPerformance = [
    { name: 'Awareness', value: 1000 },
    { name: 'Interest', value: 750 },
    { name: 'Consideration', value: 450 },
    { name: 'Conversion', value: 120 }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSubAccountData(mockSubAccountData);
      setLoading(false);
    }, 1000);
  }, [params.subaccountId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen ml-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!subAccountData) {
    return (
      <div className="flex items-center justify-center min-h-screen ml-[300px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Sub-Account not found</h2>
          <p className="text-gray-500 mt-2">The requested sub-account could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 ml-[300px]">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{subAccountData.name}</h1>
            <Badge variant="secondary">Sub-Account</Badge>
          </div>
          <p className="text-gray-500">Managed by {subAccountData.Agency.name}</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Funnel
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground">+8.2% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+142 new this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Funnels</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subAccountData.Funnel.filter(f => f.published).length}</div>
            <p className="text-xs text-muted-foreground">{subAccountData.Funnel.length} total funnels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12%</div>
            <p className="text-xs text-muted-foreground">Industry avg: 8%</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funnels">Funnels</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Performance</CardTitle>
                <CardDescription>Daily revenue trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{subAccountData.companyEmail}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{subAccountData.companyPhone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      {subAccountData.city}, {subAccountData.state} {subAccountData.zipCode}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Member since {new Date(subAccountData.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnels" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Sales Funnels</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Funnel
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subAccountData.Funnel.map((funnel) => (
              <Card key={funnel.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{funnel.name}</CardTitle>
                    <Badge variant={funnel.published ? "default" : "secondary"}>
                      {funnel.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <CardDescription>
                    Created {new Date(funnel.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Performance</span>
                    <span className="text-sm font-medium">85% conversion</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="flex-1" variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button className="flex-1" variant="outline">
                      <Settings className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Contact Management</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">1,247</p>
                  <p className="text-sm text-blue-800">Total Contacts</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">342</p>
                  <p className="text-sm text-green-800">Converted</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">905</p>
                  <p className="text-sm text-yellow-800">Leads</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {subAccountData.Contact.slice(0, 5).map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.email}</p>
                    </div>
                    <Badge variant={contact.status === 'converted' ? 'default' : 'secondary'}>
                      {contact.status === 'converted' ? 'Converted' : 'Lead'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Funnel Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={funnelPerformance}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {funnelPerformance.map((entry, index) => (
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
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Customer Acquisition Cost</span>
                  <span className="font-medium">$45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Lifetime Value</span>
                  <span className="font-medium">$1,250</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Churn Rate</span>
                  <Badge variant="default">2.3%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Email Open Rate</span>
                  <Badge variant="default">67%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sub-Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Company Name</label>
                    <p className="mt-1 text-gray-900">{subAccountData.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-gray-900">{subAccountData.companyEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-gray-900">{subAccountData.companyPhone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <p className="mt-1 text-gray-900">
                      {subAccountData.city}, {subAccountData.state} {subAccountData.zipCode}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Goals & Targets</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monthly Revenue Goal:</span>
                    <span className="font-medium">${subAccountData.goal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Progress:</span>
                    <Badge variant="default">49%</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
