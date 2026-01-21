import { getSubAccountDetails, getFunnels, getMedia, getContact } from '@/lib/queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RevenueChart from "@/components/charts/revenue-chart";
import CustomPieChart from "@/components/charts/pie-chart";
import { DollarSign, Users, TrendingUp, Calendar, Settings, Plus, Eye, Mail, Phone, MapPin } from "lucide-react";
import Link from 'next/link';
import { notFound } from 'next/navigation';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Page = async ({ params }: { params: { subaccountId: string } }) => {
  // Fetch all required data in parallel
  const [subAccountData, funnelsData, mediaData, contactsData] = await Promise.all([
    getSubAccountDetails(params.subaccountId),
    getFunnels(params.subaccountId),
    getMedia(params.subaccountId),
    getContact(params.subaccountId),
  ]);

  if (!subAccountData) {
    notFound();
  }

  // Extract data from responses
  const funnels = funnelsData || [];
  const media = mediaData?.Media || [];
  const contacts = contactsData?.Contact || [];

  // Add scroll container styles
  const scrollContainerClasses = "h-screen overflow-y-auto pb-8";
  
  // Calculate statistics
  const publishedFunnels = funnels.filter(f => f.published).length;
  const totalFunnels = funnels.length;
  const totalMedia = media.length;
  const totalContacts = contacts.length;

  // Mock data for charts (in a real app, this would come from analytics)
  const revenueData = [
    { name: 'Mon', revenue: 0 },
    { name: 'Tue', revenue: 0 },
    { name: 'Wed', revenue: 0 },
    { name: 'Thu', revenue: 0 },
    { name: 'Fri', revenue: 0 },
    { name: 'Sat', revenue: 0 },
    { name: 'Sun', revenue: 0 }
  ];

  const funnelPerformance = [
    { name: 'Awareness', value: 0 },
    { name: 'Interest', value: 0 },
    { name: 'Consideration', value: 0 },
    { name: 'Conversion', value: 0 }
  ];

  return (
    <div className="ml-[300px] h-screen overflow-hidden">
      <div className="h-full overflow-y-auto p-6 space-y-6 pb-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{subAccountData.name}</h1>
            <Badge variant="secondary">Sub-Account</Badge>
          </div>
          <p className="text-gray-500">Sub-account dashboard</p>
        </div>
        <div className="flex space-x-3">
          <Link href={`/subaccount/${params.subaccountId}/settings`}>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
          <Link href={`/subaccount/${params.subaccountId}/funnels`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Funnel
            </Button>
          </Link>
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
            <div className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">No data yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContacts}</div>
            <p className="text-xs text-muted-foreground">Total contacts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Funnels</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedFunnels}</div>
            <p className="text-xs text-muted-foreground">{totalFunnels} total funnels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Media Assets</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMedia}</div>
            <p className="text-xs text-muted-foreground">Files uploaded</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funnels">Funnels</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Your recent activity trends</CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueChart data={revenueData} />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
                <CardDescription>Recent activity summary</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-blue-800">Funnels Created</span>
                  <Badge variant="default">{totalFunnels}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-green-800">Published Funnels</span>
                  <Badge variant="default">{publishedFunnels}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium text-purple-800">Media Files</span>
                  <Badge variant="default">{totalMedia}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-medium text-orange-800">Contacts</span>
                  <Badge variant="default">{totalContacts}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnels" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Sales Funnels</h3>
            <Link href={`/subaccount/${params.subaccountId}/funnels`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Funnel
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {funnels.length > 0 ? (
              funnels.map((funnel) => (
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
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {funnel.description || "No description provided"}
                    </p>
                    <div className="flex space-x-2">
                      <Link href={`/subaccount/${params.subaccountId}/funnels/${funnel.id}`} className="flex-1">
                        <Button className="w-full" variant="outline">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/subaccount/${params.subaccountId}/funnels/${funnel.id}`} className="flex-1">
                        <Button className="w-full" variant="outline">
                          <Settings className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Funnels Yet</h3>
                <p className="text-gray-500 mb-6">Create your first sales funnel to get started</p>
                <Link href={`/subaccount/${params.subaccountId}/funnels`}>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Funnel
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Contact Management</h3>
            <Link href={`/subaccount/${params.subaccountId}/contacts`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </Link>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{totalContacts}</p>
                  <p className="text-sm text-blue-800">Total Contacts</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">0</p>
                  <p className="text-sm text-green-800">Converted</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{totalContacts}</p>
                  <p className="text-sm text-yellow-800">Leads</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {contacts.length > 0 ? (
                  contacts.slice(0, 5).map((contact: any) => (
                    <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.email}</p>
                      </div>
                      <Badge variant="secondary">Lead</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No contacts yet. Add your first contact to get started.</p>
                  </div>
                )}
              </div>
              
              {contacts.length > 5 && (
                <div className="mt-4 text-center">
                  <Link href={`/subaccount/${params.subaccountId}/contacts`}>
                    <Button variant="outline">View All Contacts</Button>
                  </Link>
                </div>
              )}
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
                <CustomPieChart data={funnelPerformance} colors={COLORS} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Customer Acquisition Cost</span>
                  <span className="font-medium">$0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Lifetime Value</span>
                  <span className="font-medium">$0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Churn Rate</span>
                  <Badge variant="default">0%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Email Open Rate</span>
                  <Badge variant="default">0%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sub-Account Information</CardTitle>
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
                    <Badge variant="default">0%</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default Page;
