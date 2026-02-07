import { getAgencyDetails } from '@/lib/queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RevenueChart from "@/components/charts/revenue-chart";
import CustomPieChart from "@/components/charts/pie-chart";
import { IndianRupee, Users, TrendingUp, Calendar, Settings, Plus, Eye, ArrowUpRight, Target } from "lucide-react";
import Link from 'next/link';
import { notFound } from 'next/navigation';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Page = async ({ params }: { params: { agencyId: string } }) => {
  const agencyData = await getAgencyDetails(params.agencyId);
  
  if (!agencyData) {
    notFound();
  }

  // Calculate statistics
  const totalSubAccounts = agencyData.SubAccount.length;
  const activeSubAccounts = agencyData.SubAccount.filter(sa => sa.id).length; // Assuming all are active for now
  
  // Mock data for charts (in a real app, this would come from analytics)
  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
  ];

  const subAccountDistribution = [
    { name: 'Active', value: activeSubAccounts },
    { name: 'Inactive', value: 0 },
    { name: 'Pending', value: 0 },
  ];

  return (
    <>

      <div className="h-full overflow-y-auto p-6 space-y-6 pb-8">
      {/* Header Section */}

    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

  {/* Left */}
  <div>
    <p className="mt-1 text-4xl font-bold text-black dark:text-white">
      Agency_Control_Deck
    </p>
    <h1 className="text-sm font-mono tracking-tight text-black dark:text-white">
      {agencyData.name}
    </h1>
  </div>

  {/* Right */}
  <div className="flex items-center gap-4">

    <Link href={`/agency/${params.agencyId}/settings`}>
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-lg
        border border-gray-300 dark:border-gray-700
        text-gray-700 dark:text-gray-300
        hover:bg-gray-100 dark:hover:bg-gray-800
        hover:text-black dark:hover:text-white
        transition-colors text-sm font-medium"
      >
        <Settings className="w-4 h-4" />
        <span>Config</span>
      </button>
    </Link>

    <Link href={`/agency/${params.agencyId}/all-subaccounts`}>
      <button
        className="flex items-center gap-2 px-5 py-2 rounded-lg
        bg-black text-white
        hover:bg-gray-900
        dark:bg-white dark:text-black
        dark:hover:bg-gray-200
        transition-colors text-sm font-bold
        shadow-[0_0_15px_rgba(0,0,0,0.25)]
        dark:shadow-[0_0_15px_rgba(255,255,255,0.25)]"
      >
        <Plus className="w-4 h-4" />
        <span>New_Sub_Account</span>
      </button>
    </Link>

  </div>
</div>



     {/* Stats Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

  {/* Total Revenue */}
  <Card className="relative group rounded-2xl border border-white/10 
    bg-white/80 dark:bg-[#101010]/80 backdrop-blur-xl
    transition-all duration-300 hover:-translate-y-1
    hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)]">

    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        Total_Revenue
      </CardTitle>
      <IndianRupee className="h-4 w-4 text-muted-foreground" />
    </CardHeader>

    <CardContent>
      <div className="text-3xl font-bold font-mono">₹124,500</div>
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-muted-foreground font-mono">Gross yield</p>
        <span className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-md
          text-emerald-400 bg-emerald-400/10">
          <ArrowUpRight className="w-3 h-3" />
          +12.5%
        </span>
      </div>
    </CardContent>

    <div className="absolute bottom-0 left-6 right-6 h-[2px] 
      bg-emerald-400/60 shadow-[0_-2px_10px_rgba(16,185,129,0.6)] rounded-full" />
  </Card>

  {/* Active Units */}
  <Card className="relative group rounded-2xl border border-white/10 
    bg-white/80 dark:bg-[#101010]/80 backdrop-blur-xl
    transition-all duration-300 hover:-translate-y-1
    hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)]">

    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        Active_Units
      </CardTitle>
      <Users className="h-4 w-4 text-muted-foreground" />
    </CardHeader>

    <CardContent>
      <div className="text-3xl font-bold font-mono">42</div>
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-muted-foreground font-mono">Nodes operational</p>
        <span className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-md
          text-emerald-400 bg-emerald-400/10">
          <ArrowUpRight className="w-3 h-3" />
          +3
        </span>
      </div>
    </CardContent>

    <div className="absolute bottom-0 left-6 right-6 h-[2px] 
      bg-emerald-400/60 shadow-[0_-2px_10px_rgba(16,185,129,0.6)] rounded-full" />
  </Card>

  {/* Goal Velocity */}
  <Card className="relative group rounded-2xl border border-white/10 
    bg-white/80 dark:bg-[#101010]/80 backdrop-blur-xl
    transition-all duration-300 hover:-translate-y-1
    hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)]">

    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        Goal_Velocity
      </CardTitle>
      <Target className="h-4 w-4 text-muted-foreground" />
    </CardHeader>

    <CardContent>
      <div className="text-3xl font-bold font-mono">64%</div>
      <div className="flex items-center justify-between mt-1">
        <p className="text-xs text-muted-foreground font-mono">
          Quarterly target
        </p>
        <span className="text-xs font-mono px-2 py-1 rounded-md
          text-muted-foreground bg-muted">
          0%
        </span>
      </div>
    </CardContent>

    <div className="absolute bottom-0 left-6 right-6 h-[2px] 
      bg-orange-400/60 shadow-[0_-2px_10px_rgba(251,146,60,0.6)] rounded-full" />
  </Card>

  {/* Last Sync */}
  <Card className="relative group rounded-2xl border border-white/10 
    bg-white/80 dark:bg-[#101010]/80 backdrop-blur-xl
    transition-all duration-300 hover:-translate-y-1
    hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)]">

    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        Last_Sync
      </CardTitle>
      <Calendar className="h-4 w-4 text-muted-foreground" />
    </CardHeader>

    <CardContent>
      <div className="text-3xl font-bold font-mono">Today</div>
      <p className="text-xs text-muted-foreground font-mono">
        14:02:59 UTC
      </p>
    </CardContent>

    <div className="absolute bottom-0 left-6 right-6 h-[2px] 
      bg-blue-400/60 shadow-[0_-2px_10px_rgba(96,165,250,0.6)] rounded-full" />
  </Card>

</div>



      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="space-y-6">
  <TabsList
  className="border-b border-gray-200 dark:border-gray-800
  bg-transparent   h-auto flex gap-8"
>
  <TabsTrigger
    value="overview"
    className="
      relative overflow-visible rounded-none bg-transparent px-0 pb-4
      text-sm font-medium
      text-gray-500 dark:text-gray-400
      hover:text-black dark:hover:text-white
      data-[state=active]:text-black dark:data-[state=active]:text-white
      transition-colors

      after:content-['']
      after:absolute after:left-0 after:-bottom-[1px]
      after:h-[2px] after:w-full
      after:bg-sky-500
      after:scale-x-0
      after:origin-left
      after:transition-transform after:duration-300
      data-[state=active]:after:scale-x-100
      after:shadow-[0_-2px_6px_rgba(14,165,233,0.6)]
    "
  >
    Overview
  </TabsTrigger>

  <TabsTrigger
    value="subaccounts"
    className="
      relative overflow-visible rounded-none bg-transparent px-0 pb-4
      text-sm font-medium
      text-gray-500 dark:text-gray-400
      hover:text-black dark:hover:text-white
      data-[state=active]:text-black dark:data-[state=active]:text-white
      transition-colors

      after:content-['']
      after:absolute after:left-0 after:-bottom-[1px]
      after:h-[2px] after:w-full
      after:bg-sky-500
      after:scale-x-0
      after:origin-left
      after:transition-transform after:duration-300
      data-[state=active]:after:scale-x-100
      after:shadow-[0_-2px_6px_rgba(14,165,233,0.6)]
    "
  >
    Sub-Accounts
  </TabsTrigger>

  <TabsTrigger
    value="analytics"
    className="
      relative overflow-visible rounded-none bg-transparent px-0 pb-4
      text-sm font-medium
      text-gray-500 dark:text-gray-400
      hover:text-black dark:hover:text-white
      data-[state=active]:text-black dark:data-[state=active]:text-white
      transition-colors

      after:content-['']
      after:absolute after:left-0 after:-bottom-[1px]
      after:h-[2px] after:w-full
      after:bg-sky-500
      after:scale-x-0
      after:origin-left
      after:transition-transform after:duration-300
      data-[state=active]:after:scale-x-100
      after:shadow-[0_-2px_6px_rgba(14,165,233,0.6)]
    "
  >
    Analytics
  </TabsTrigger>

  <TabsTrigger
    value="settings"
    className="
      relative overflow-visible rounded-none bg-transparent px-0 pb-4
      text-sm font-medium
      text-gray-500 dark:text-gray-400
      hover:text-black dark:hover:text-white
      data-[state=active]:text-black dark:data-[state=active]:text-white
      transition-colors

      after:content-['']
      after:absolute after:left-0 after:-bottom-[1px]
      after:h-[2px] after:w-full
      after:bg-sky-500
      after:scale-x-0
      after:origin-left
      after:transition-transform after:duration-300
      data-[state=active]:after:scale-x-100
      after:shadow-[0_-2px_6px_rgba(14,165,233,0.6)]
    "
  >
    Settings
  </TabsTrigger>
</TabsList>



        <TabsContent value="overview" className="space-y-6">

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

    {/* Revenue Chart */}
    <div className="lg:col-span-2">
      <div
        className="h-full rounded-2xl p-6
        bg-white/80 dark:bg-black/60
        backdrop-blur-xl
        border border-gray-200 dark:border-gray-800"
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white">
              Resource_Yield
            </h3>
            <p className="text-xs font-mono text-gray-600 dark:text-gray-400">
              Monthly throughput metrics
            </p>
          </div>
        </div>

        {/* Chart */}
        <RevenueChart data={revenueData} />
      </div>
    </div>

    {/* Quick Actions */}
    <div>
      <div
        className="rounded-2xl p-6
        bg-white/80 dark:bg-black/60
        backdrop-blur-xl
        border border-gray-200 dark:border-gray-800"
      >
        <div className="flex items-center gap-2 mb-6">
          <h3 className="text-lg font-semibold text-black dark:text-white">
            Quick_Executions
          </h3>
        </div>

        <div className="space-y-3">

          <Link href={`/agency/${params.agencyId}/all-subaccounts`}>
            <button className="w-full flex items-center gap-3 p-4 rounded-xl
              border border-gray-200 dark:border-gray-800
              bg-transparent
              hover:bg-gray-100 dark:hover:bg-gray-900
              transition-all"
            >
              <Plus className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                New_Sub_Account
              </span>
            </button>
          </Link>

          <Link href={`/agency/${params.agencyId}/team`}>
            <button className="w-full flex items-center gap-3 p-4 rounded-xl
              border border-gray-200 dark:border-gray-800
              hover:bg-gray-100 dark:hover:bg-gray-900
              transition-all"
            >
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Invite_Operative
              </span>
            </button>
          </Link>

          <Link href={`/agency/${params.agencyId}/settings`}>
            <button className="w-full flex items-center gap-3 p-4 rounded-xl
              border border-gray-200 dark:border-gray-800
              hover:bg-gray-100 dark:hover:bg-gray-900
              transition-all"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                System_Params
              </span>
            </button>
          </Link>

          <button
            disabled
            className="w-full flex items-center gap-3 p-4 rounded-xl
            border border-gray-200 dark:border-gray-800
            opacity-50 cursor-not-allowed"
          >
            <Eye className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-500">
              Public_View
            </span>
          </button>

        </div>
      </div>
    </div>

  </div>
</TabsContent>


        {/* ===================== SUB-ACCOUNTS ===================== */}
<TabsContent value="subaccounts" className="space-y-6">

  {/* Header */}
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-xl font-semibold text-black dark:text-white">
        Sub_Accounts
      </h3>
      <p className="text-xs font-mono text-gray-600 dark:text-gray-400">
        Active operational units
      </p>
    </div>

    <Link href={`/agency/${params.agencyId}/all-subaccounts`}>
      <button
        className="flex items-center gap-2 px-5 py-2 rounded-lg
        bg-black text-white dark:bg-white dark:text-black
        hover:opacity-90 transition font-bold text-sm"
      >
        <Plus className="w-4 h-4" />
        Add_Sub_Account
      </button>
    </Link>
  </div>

  {/* Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {agencyData.SubAccount.map((subAccount) => (
      <div
        key={subAccount.id}
        className="relative rounded-2xl p-6
        bg-white/80 dark:bg-black/60
        backdrop-blur-xl
        border border-gray-200 dark:border-gray-800
        hover:-translate-y-1 transition-all duration-300"
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-black dark:text-white">
            {subAccount.name}
          </h4>
          <span className="text-xs font-mono px-2 py-1 rounded-md
            text-emerald-400 bg-emerald-400/10">
            ACTIVE
          </span>
        </div>

        <p className="text-xs font-mono text-gray-500 mb-6">
          Created {new Date(subAccount.createdAt).toLocaleDateString()}
        </p>

        <Link href={`/subaccount/${subAccount.id}`}>
          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg
            border border-gray-300 dark:border-gray-700
            hover:bg-gray-100 dark:hover:bg-gray-900
            transition text-sm font-medium"
          >
            <Eye className="w-4 h-4" />
            Open_Dashboard
          </button>
        </Link>

        <div className="absolute bottom-0 left-6 right-6 h-[2px]
          bg-emerald-400/60 rounded-full" />
      </div>
    ))}
  </div>
</TabsContent>

{/* ===================== ANALYTICS ===================== */}
<TabsContent value="analytics" className="space-y-6">

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    {/* Distribution */}
    <div
      className="rounded-2xl p-6
      bg-white/80 dark:bg-black/60
      backdrop-blur-xl
      border border-gray-200 dark:border-gray-800"
    >
      <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
        Sub_Account_Distribution
      </h3>

      <CustomPieChart data={subAccountDistribution} colors={COLORS} />
    </div>

    {/* Metrics */}
    <div
      className="rounded-2xl p-6
      bg-white/80 dark:bg-black/60
      backdrop-blur-xl
      border border-gray-200 dark:border-gray-800"
    >
      <h3 className="text-lg font-semibold text-black dark:text-white mb-6">
        Performance_Metrics
      </h3>

      <div className="space-y-4 text-sm">

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            Client_Retention
          </span>
          <span className="font-mono text-white bg-gray-900 px-2 py-1 rounded">
            0%
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            Avg_Project_Value
          </span>
          <span className="font-mono text-black dark:text-white">
            ₹0
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            Response_Time
          </span>
          <span className="font-mono text-gray-400">
            —
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            Satisfaction_Score
          </span>
          <span className="font-mono text-white bg-gray-900 px-2 py-1 rounded">
            0 / 5
          </span>
        </div>

      </div>
    </div>

  </div>
</TabsContent>

{/* ===================== SETTINGS ===================== */}
<TabsContent value="settings" className="space-y-6">

  <div
    className="rounded-2xl p-6
    bg-white/80 dark:bg-black/60
    backdrop-blur-xl
    border border-gray-200 dark:border-gray-800"
  >
    <h3 className="text-lg font-semibold text-black dark:text-white mb-6">
      Agency_Configuration
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

      <div>
        <label className="block text-gray-600 dark:text-gray-400 mb-1">
          Agency_Name
        </label>
        <p className="font-mono text-black dark:text-white">
          {agencyData.name}
        </p>
      </div>

      <div>
        <label className="block text-gray-600 dark:text-gray-400 mb-1">
          Email
        </label>
        <p className="font-mono text-black dark:text-white">
          {agencyData.companyEmail}
        </p>
      </div>

      <div>
        <label className="block text-gray-600 dark:text-gray-400 mb-1">
          Phone
        </label>
        <p className="font-mono text-black dark:text-white">
          {agencyData.companyPhone}
        </p>
      </div>

      <div>
        <label className="block text-gray-600 dark:text-gray-400 mb-1">
          Location
        </label>
        <p className="font-mono text-black dark:text-white">
          {agencyData.city}, {agencyData.state} {agencyData.zipCode}
        </p>
      </div>

    </div>

    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
      <h4 className="font-medium mb-2 text-black dark:text-white">
        White_Label_Status
      </h4>

      <span
        className={`inline-block text-xs font-mono px-3 py-1 rounded-md
        ${
          agencyData.whiteLabel
            ? "text-emerald-400 bg-emerald-400/10"
            : "text-gray-400 bg-gray-400/10"
        }`}
      >
        {agencyData.whiteLabel ? "ENABLED" : "DISABLED"}
      </span>
    </div>

  </div>
</TabsContent>

      </Tabs>
      </div>
    </>
  );
};

export default Page;
