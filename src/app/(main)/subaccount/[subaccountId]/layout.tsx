import { ChildrenProps } from "@/@types";
import InfoBar from "@/components/global/infobar";
import Sidebar from "@/components/sidebar";
import Unauthorized from "@/components/unauthorized";
import { verifyAndAcceptInvitation } from "@/lib/queries";
import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { UserService, PermissionsService, NotificationService, AgencyService, SubAccountService } from "@/services";

type Props = {
    params: {
        subaccountId: string;
    };
} & ChildrenProps;

const Layout = async ({ children, params }: Props) => {
    const agencyId = await verifyAndAcceptInvitation();
    if (!agencyId) return <Unauthorized />;

    const user = await currentUser();
    if (!user) redirect("/");

    let notifications: any = [];

    // Get user details to check role
    const userDetails = await UserService.findByEmail(user.emailAddresses[0].emailAddress);
    if (!userDetails || !userDetails.role) {
        return <Unauthorized />;
    }
    
    // Update Clerk metadata if needed to ensure consistency
    if (user.privateMetadata.role !== userDetails.role) {
        try {
            const clerk = await clerkClient();
            await clerk.users.updateUserMetadata(user.id, {
                privateMetadata: {
                    role: userDetails.role,
                },
            });
        } catch (error) {
            console.error('Error updating user metadata in Clerk:', error);
        }
    }
    
    // Use the role from the database as the authoritative source
    const userRole = userDetails.role;
    
    if (!userRole) {
        return <Unauthorized />;
    } else {
        // Use the existing userDetails from earlier
        // Get agency ID from user details if not available
        const agencyIdToUse = agencyId || userDetails.agencyId;
        
        if (!agencyIdToUse) {
            return <Unauthorized />;
        }
        
        // Get user permissions
        const permissions = await PermissionsService.findByEmail(user.emailAddresses[0].emailAddress);
        
        // Check if user has access to the subaccount
        // AGENCY_OWNER and AGENCY_ADMIN should have access to all subaccounts in their agency
        let hasPermission = false;
        
        if (userRole === "AGENCY_OWNER" || userRole === "AGENCY_ADMIN") {
            // Check if the subaccount belongs to the user's agency
            const subAccount = await SubAccountService.findById(params.subaccountId);
            if (subAccount && subAccount.agencyId === agencyIdToUse) {
                hasPermission = true;
            }
        } else {
            // For other roles, check specific permissions
            hasPermission = permissions.some((p) => p.access && p.subAccountId === params.subaccountId);
        }

        if (!hasPermission) {
            return <Unauthorized />;
        }
        
        // Get notifications
        const notificationsRaw = await NotificationService.findByAgencyId(agencyIdToUse);
        
        // Populate user data for each notification
        const allNotifications = [];
        if (notificationsRaw) {
            for (const notification of notificationsRaw) {
                try {
                    const user = await UserService.findById(notification.userId);
                    (notification as any).User = user;
                } catch (error) {
                    console.error('Error fetching user for notification:', error);
                    // Set a default user object if user is not found
                    (notification as any).User = {
                        name: 'System',
                        avatarUrl: '',
                    };
                }
                allNotifications.push(notification);
            }
        }

        if (userRole === "AGENCY_ADMIN" || userRole === "AGENCY_OWNER") {
            notifications = allNotifications;
        } else {
            const filteredNoti = allNotifications?.filter((item) => item.subAccountId === params.subaccountId);

            if (filteredNoti) notifications = filteredNoti;
        }
    }

    return (
        <div className="h-screen overflow-hidden">
            <Sidebar id={params.subaccountId} type="subaccount" />
            <div className="md:pl-[300px]">
                <InfoBar notifications={notifications} role={userRole as string} subAccountId={params.subaccountId as string} />
                <div className="relative">{children}</div>
            </div>
        </div>
    );
};

export default Layout;