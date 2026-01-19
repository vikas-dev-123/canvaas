"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import InfoBar from "@/components/global/infobar";
import Sidebar from "@/components/sidebar";
import Loading from "@/components/global/loading";
import { UserService, NotificationService } from "@/services";
import { useUser } from "@clerk/nextjs";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    subaccountId: string;
  };
}

const SubAccountLayout = ({ children, params }: LayoutProps) => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string>("SUBACCOUNT_USER");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch notifications
        const notificationsResponse = await fetch(`/api/notifications/subaccount/${params.subaccountId}`);
        if (notificationsResponse.ok) {
          const notificationsData = await notificationsResponse.json();
          setNotifications(notificationsData.data || []);
        }
        
        // Fetch user role (this would typically come from auth context)
        // For now, we'll default to SUBACCOUNT_USER
        setUserRole("SUBACCOUNT_USER");
        
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
  }, [params.subaccountId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!user?.emailAddresses?.[0]?.emailAddress) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div>User not authenticated</div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar 
        id={params.subaccountId} 
        type="subaccount" 
        userEmail={user.emailAddresses[0].emailAddress}
      />
      <div className="md:pl-[300px]">
        <InfoBar 
          notifications={notifications} 
          role={userRole} 
          subAccountId={params.subaccountId} 
        />
        <div className="relative h-full overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SubAccountLayout;