"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import MenuOptions from "./menu-options";
import Loading from "@/components/global/loading";

interface SidebarData {
  details: any;
  sidebarLogo: string;
  sidebarOpt: any[];
  subAccounts: any[];
  user: any;
}

type Props = {
  id: string;
  type: "agency" | "subaccount";
  userEmail: string;
};

const Sidebar = ({ id, type, userEmail }: Props) => {
  const [sidebarData, setSidebarData] = useState<SidebarData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const response = await fetch(`/api/sidebar/${id}/${type}?userEmail=${encodeURIComponent(userEmail)}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch sidebar data");
        }
        
        const result = await response.json();
        
        if (result.success) {
          setSidebarData(result.data);
        } else {
          throw new Error(result.error || "Failed to fetch sidebar data");
        }
      } catch (error) {
        console.error("Error fetching sidebar data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load sidebar data",
        });
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchSidebarData();
    }
  }, [id, type, userEmail]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!sidebarData) {
    return null;
  }

  return (
    <MenuOptions 
      defaultOpen={true} 
      details={sidebarData.details} 
      id={id} 
      sidebarLogo={sidebarData.sidebarLogo} 
      sidebarOpt={sidebarData.sidebarOpt} 
      subAccounts={sidebarData.subAccounts} 
      user={sidebarData.user} 
    />
  );
};

export default Sidebar
