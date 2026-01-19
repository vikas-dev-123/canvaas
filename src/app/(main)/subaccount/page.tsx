"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Unauthorized from "@/components/unauthorized";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Plus, Users } from "lucide-react";
import Link from "next/link";

interface SubAccount {
  id: string;
  name: string;
  companyEmail?: string;
  createdAt: Date;
}

const SubAccountsPage = ({ searchParams }: { searchParams: { state?: string; code?: string } }) => {
  const [subAccounts, setSubAccounts] = useState<SubAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubAccounts = async () => {
      try {
        // In a real implementation, you would get the agency ID from auth context
        // For now, we'll use a placeholder or implement proper auth integration
        const agencyId = "placeholder-agency-id"; // Replace with actual agency ID
        
        const response = await fetch(`/api/subaccounts?agencyId=${agencyId}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch subaccounts");
        }
        
        const result = await response.json();
        
        if (result.success) {
          setSubAccounts(result.data || []);
        } else {
          throw new Error(result.error || "Failed to fetch subaccounts");
        }

      } catch (error) {
        console.error("Error fetching subaccounts:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load subaccounts",
        });
        // Set empty array on error to show empty state
        setSubAccounts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubAccounts();
  }, []);

  // Handle OAuth redirects
  useEffect(() => {
    if (searchParams.state) {
      const statePath = searchParams.state.split("___")[0];
      const stateSubAccountId = searchParams.state.split("___")[1];
      
      if (stateSubAccountId) {
        window.location.href = `/subaccount/${stateSubAccountId}/${statePath}?code=${searchParams.code}`;
      }
    }
  }, [searchParams]);

  if (!hasPermission) {
    return <Unauthorized />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading subaccounts...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Sub Accounts</h1>
          <p className="text-muted-foreground mt-2">
            Manage your sub accounts and their settings
          </p>
        </div>
        <Button asChild>
          <Link href="#">
            <Plus className="mr-2 h-4 w-4" />
            Create Sub Account
          </Link>
        </Button>
      </div>

      {subAccounts.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No sub accounts yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by creating your first sub account
            </p>
            <Button asChild>
              <Link href="#">
                <Plus className="mr-2 h-4 w-4" />
                Create Sub Account
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subAccounts.map((subAccount) => (
            <Card key={subAccount.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {subAccount.name}
                </CardTitle>
                <CardDescription>
                  {subAccount.companyEmail || "No email configured"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Created {new Date(subAccount.createdAt).toLocaleDateString()}
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/subaccount/${subAccount.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <Users className="inline mr-2 h-4 w-4" />
        {subAccounts.length} sub account{subAccounts.length !== 1 ? "s" : ""} managed
      </div>
    </div>
  );
};

export default SubAccountsPage;