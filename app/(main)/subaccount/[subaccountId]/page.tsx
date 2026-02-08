import {
  getSubAccountDetails,
  getFunnels,
  getMedia,
  getContact
} from '@/lib/queries'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import RevenueChart from "@/components/charts/revenue-chart"
import CustomPieChart from "@/components/charts/pie-chart"

import {
  Users,
  TrendingUp,
  Calendar,
  Settings,
  Plus,
  Eye,
  ArrowUpRight,
  IndianRupee
} from "lucide-react"

import Link from "next/link"
import { notFound } from "next/navigation"

const COLORS = ['#38bdf8', '#34d399', '#fbbf24', '#fb7185']

const Page = async ({ params }: { params: { subaccountId: string } }) => {
  const [subAccountData, funnelsData, mediaData, contactsData] =
    await Promise.all([
      getSubAccountDetails(params.subaccountId),
      getFunnels(params.subaccountId),
      getMedia(params.subaccountId),
      getContact(params.subaccountId),
    ])

  if (!subAccountData) notFound()

  const funnels = funnelsData || []
  const media = mediaData?.Media || []
  const contacts = contactsData?.Contact || []

  const publishedFunnels = funnels.filter(f => f.published).length

  const revenueData = [
    { name: 'Mon', revenue: 0 },
    { name: 'Tue', revenue: 0 },
    { name: 'Wed', revenue: 0 },
    { name: 'Thu', revenue: 0 },
    { name: 'Fri', revenue: 0 },
    { name: 'Sat', revenue: 0 },
    { name: 'Sun', revenue: 0 },
  ]

  const funnelPerformance = [
    { name: 'Awareness', value: 0 },
    { name: 'Interest', value: 0 },
    { name: 'Consideration', value: 0 },
    { name: 'Conversion', value: 0 },
  ]

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6 pb-10">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="text-4xl font-bold font-mono text-black dark:text-white">
            SubAccount_Control_Deck
          </p>
          <p className="text-sm font-mono text-muted-foreground">
            {subAccountData.name}
          </p>
        </div>

        <div className="flex gap-3">
          <Link href={`/subaccount/${params.subaccountId}/settings`}>
            <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700
              text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-900 transition">
              <Settings className="w-4 h-4 inline mr-2" />
              Config
            </button>
          </Link>

          <Link href={`/subaccount/${params.subaccountId}/funnels`}>
            <button className="px-5 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black
              font-bold shadow-lg hover:opacity-90 transition">
              <Plus className="w-4 h-4 inline mr-2" />
              New_Funnel
            </button>
          </Link>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {[
          { label: "Weekly_Revenue", value: "₹0", icon: IndianRupee },
          { label: "Contacts", value: contacts.length, icon: Users },
          { label: "Active_Funnels", value: publishedFunnels, icon: TrendingUp },
          { label: "Media_Assets", value: media.length, icon: Calendar },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}
            className="relative rounded-2xl bg-white/80 dark:bg-black/60
            backdrop-blur-xl border border-white/10
            hover:-translate-y-1 transition-all">

            <CardHeader className="flex flex-row justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-3xl font-bold font-mono">{value}</div>
              <span className="inline-flex items-center gap-1 mt-2 text-xs font-mono
                text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">
                <ArrowUpRight className="w-3 h-3" />
                Stable
              </span>
            </CardContent>

            <div className="absolute bottom-0 left-6 right-6 h-[2px]
              bg-emerald-400/60 rounded-full" />
          </Card>
        ))}
      </div>

      {/* ================= TABS ================= */}
      <Tabs defaultValue="overview" className="space-y-6">

        <TabsList className="bg-transparent border-b border-gray-200 dark:border-gray-800 gap-8">
          {["overview", "funnels", "contacts", "analytics", "settings"].map(tab => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="relative px-0 pb-4 bg-transparent rounded-none font-medium
              text-gray-500 dark:text-gray-400
              data-[state=active]:text-black dark:data-[state=active]:text-white
              after:absolute after:left-0 after:-bottom-[1px] after:h-[2px] after:w-full
              after:bg-sky-500 after:scale-x-0 data-[state=active]:after:scale-x-100
              after:transition-transform">
              {tab.toUpperCase()}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ================= OVERVIEW ================= */}
        <TabsContent value="overview" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl p-6 bg-white/80 dark:bg-black/60 backdrop-blur-xl border">
            <h3 className="text-lg font-semibold mb-4">Weekly_Activity</h3>
            <RevenueChart data={revenueData} />
          </div>

          <div className="rounded-2xl p-6 bg-white/80 dark:bg-black/60 backdrop-blur-xl border">
            <h3 className="text-lg font-semibold mb-6">Quick_Stats</h3>
            <div className="space-y-3 text-sm font-mono">
              <div className="flex justify-between"><span>Total_Funnels</span><span>{funnels.length}</span></div>
              <div className="flex justify-between"><span>Published</span><span>{publishedFunnels}</span></div>
              <div className="flex justify-between"><span>Contacts</span><span>{contacts.length}</span></div>
              <div className="flex justify-between"><span>Media</span><span>{media.length}</span></div>
            </div>
          </div>
        </TabsContent>

        {/* ================= FUNNELS ================= */}
        <TabsContent value="funnels" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Funnels_Control</h3>
            <Link href={`/subaccount/${params.subaccountId}/funnels`}>
              <button className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black font-bold">
                <Plus className="w-4 h-4 inline mr-2" />
                Add_Funnel
              </button>
            </Link>
          </div>

          {funnels.length === 0 ? (
            <div className="rounded-2xl p-12 text-center bg-white/80 dark:bg-black/60 border">
              <p className="text-sm font-mono text-muted-foreground">
                No_Funnels_Detected
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {funnels.map(funnel => (
                <div key={funnel.id}
                  className="rounded-2xl p-6 bg-white/80 dark:bg-black/60 border
                  hover:-translate-y-1 transition-all">
                  <div className="flex justify-between mb-3">
                    <h4 className="font-semibold">{funnel.name}</h4>
                    <Badge variant={funnel.published ? "default" : "secondary"}>
                      {funnel.published ? "LIVE" : "DRAFT"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Created {new Date(funnel.createdAt).toLocaleDateString()}
                  </p>
                  <Link href={`/subaccount/${params.subaccountId}/funnels/${funnel.id}`}>
                    <button className="w-full border rounded-lg py-2 hover:bg-gray-100 dark:hover:bg-gray-900">
                      <Eye className="w-4 h-4 inline mr-2" />
                      Open_Funnel
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ================= CONTACTS ================= */}
        <TabsContent value="contacts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Contacts_Registry</h3>
            <Link href={`/subaccount/${params.subaccountId}/contacts`}>
              <button className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black font-bold">
                <Plus className="w-4 h-4 inline mr-2" />
                Add_Contact
              </button>
            </Link>
          </div>

          {contacts.length === 0 ? (
            <div className="rounded-2xl p-12 text-center bg-white/80 dark:bg-black/60 border">
              <p className="text-sm font-mono text-muted-foreground">
                No_Contacts_Found
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map((contact: any) => (
                <div key={contact.id}
                  className="flex justify-between items-center p-4 rounded-xl
                  bg-white/80 dark:bg-black/60 border">
                  <div>
                    <p className="font-medium">{contact.name || "Unnamed_Contact"}</p>
                    <p className="text-xs text-muted-foreground">{contact.email}</p>
                  </div>
                  <Badge variant="secondary">LEAD</Badge>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ================= ANALYTICS ================= */}
        <TabsContent value="analytics" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl p-6 bg-white/80 dark:bg-black/60 border">
            <h3 className="text-lg font-semibold mb-4">Funnel_Distribution</h3>
            <CustomPieChart data={funnelPerformance} colors={COLORS} />
          </div>

          <div className="rounded-2xl p-6 bg-white/80 dark:bg-black/60 border">
            <h3 className="text-lg font-semibold mb-6">Performance_Metrics</h3>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between"><span>CAC</span><span>₹0</span></div>
              <div className="flex justify-between"><span>LTV</span><span>₹0</span></div>
              <div className="flex justify-between"><span>Churn</span><span>0%</span></div>
              <div className="flex justify-between"><span>Email_Open_Rate</span><span>0%</span></div>
            </div>
          </div>
        </TabsContent>

        {/* ================= SETTINGS ================= */}
        <TabsContent value="settings" className="rounded-2xl p-6 bg-white/80 dark:bg-black/60 border">
          <h3 className="text-lg font-semibold mb-6">SubAccount_Configuration</h3>

          <div className="grid md:grid-cols-2 gap-6 text-sm font-mono">
            <div>
              <span className="text-muted-foreground">Company</span>
              <p>{subAccountData.name}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Email</span>
              <p>{subAccountData.companyEmail}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Phone</span>
              <p>{subAccountData.companyPhone}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Location</span>
              <p>{subAccountData.city}, {subAccountData.state}</p>
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}

export default Page
