"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Building, 
  Users, 
  TrendingUp, 
  Calendar, 
  Mail, 
  Phone,
  MapPin,
  Globe
} from "lucide-react";
import Link from "next/link";

interface SubAccountData {
  id: string;
  name: string;
  companyEmail?: string;
  companyPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  subAccountLogo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubAccountDashboard = ({ params }: { params: { subaccountId: string } }) => {
  const [subAccountData, setSubAccountData] = useState<SubAccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubAccountData = async () => {
      try {
        const response = await fetch(`/api/subaccount/${params.subaccountId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch subaccount data");
        }
        const data = await response.json();
        setSubAccountData(data.data);
      } catch (error) {
        console.error("Error fetching subaccount data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load subaccount data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubAccountData();
  }, [params.subaccountId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading subaccount data...</div>
      </div>
    );
  }

  if (!subAccountData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-red-500">Subaccount not found</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{subAccountData.name}</h1>
          <p className="text-muted-foreground mt-2">
            Manage your subaccount settings and overview
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Active
        </Badge>
      </div>

      <Separator />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              Account is operational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Info</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subAccountData.companyEmail ? "Available" : "Not Set"}
            </div>
            <p className="text-xs text-muted-foreground">
              Email configuration
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(subAccountData.createdAt).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Account creation date
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Primary contact details for this subaccount
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subAccountData.companyEmail && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{subAccountData.companyEmail}</span>
              </div>
            )}
            
            {subAccountData.companyPhone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{subAccountData.companyPhone}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Information</CardTitle>
            <CardDescription>
              Physical address details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subAccountData.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div>{subAccountData.address}</div>
                  <div>
                    {subAccountData.city}, {subAccountData.state} {subAccountData.zipCode}
                  </div>
                  <div>{subAccountData.country}</div>
                </div>
              </div>
            )}
            
            {!subAccountData.address && (
              <p className="text-muted-foreground text-sm">
                No address information available
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href={`/subaccount/${params.subaccountId}/funnels`}>
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Funnels</CardTitle>
              <Globe className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Manage sales funnels
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/subaccount/${params.subaccountId}/pipelines`}>
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pipelines</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Track leads and deals
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/subaccount/${params.subaccountId}/contacts`}>
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contacts</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Manage customer contacts
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/subaccount/${params.subaccountId}/media`}>
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Media</CardTitle>
              <Building className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Upload and manage media
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>
            Configure your subaccount settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Link href={`/subaccount/${params.subaccountId}/settings`}>
              <Button variant="outline">
                Account Settings
              </Button>
            </Link>
            <Link href={`/subaccount/${params.subaccountId}/launchpad`}>
              <Button variant="outline">
                Launchpad
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubAccountDashboard;
