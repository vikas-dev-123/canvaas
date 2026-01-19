"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import BlurPage from "@/components/global/blur-page";
import InfoBar from "@/components/global/infobar";
import Sidebar from "@/components/sidebar";
import Unauthorized from "@/components/unauthorized";
import Loading from "@/components/global/loading";
import { NotificationService } from "@/services";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    agencyId: string;
  };
}

const AgencyLayout = ({ children, params }: LayoutProps) => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string>("AGENCY_OWNER");
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.emailAddresses?.[0]?.emailAddress) {
          setHasPermission(false);
          return;
        }

        // In a real implementation, you would verify user permissions
        // For now, we'll assume agency owners/admins have access
        setUserRole("AGENCY_OWNER");
        setHasPermission(true);

        // Fetch notifications
        const notificationsResponse = await fetch(`/api/notifications/agency/${params.agencyId}`);
        if (notificationsResponse.ok) {
          const notificationsData = await notificationsResponse.json();
          setNotifications(notificationsData.data || []);
        }
        
      } catch (error) {
        console.error("Error fetching layout data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load dashboard data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, params.agencyId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!hasPermission || !user?.emailAddresses?.[0]?.emailAddress) {
    return <Unauthorized />;
  }

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar 
        id={params.agencyId} 
        type="agency" 
        userEmail={user.emailAddresses[0].emailAddress}
      />
      <div className="md:pl-[300px]">
        <InfoBar notifications={notifications} role={userRole} />
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  );
};

export default AgencyLayout;