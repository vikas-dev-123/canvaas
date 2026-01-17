import { ChildrenProps } from "@/@types";
import BlurPage from "@/components/global/blur-page";
import InfoBar from "@/components/global/infobar";
import Sidebar from "@/components/sidebar";
import Unauthorized from "@/components/unauthorized";
import { verifyAndAcceptInvitation } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserService, NotificationService } from "@/services";

type Props = {
    params: {
        agencyId: string;
    };
} & ChildrenProps;

const Layout = async ({ children, params }: Props) => {
    const user = await currentUser();

    if (!user) {
        return redirect("/");
    }

    const invitationAgencyId = await verifyAndAcceptInvitation();
    
    // Use the agencyId from URL params, but also check for invitation
    const agencyIdToUse = invitationAgencyId || params.agencyId;
    
    if (!agencyIdToUse) {
        return redirect(`/agency`);
    }

    // Get user details to check role
    const userDetails = await UserService.findByEmail(user.emailAddresses[0].emailAddress);
    if (!userDetails || !userDetails.role) {
        return <Unauthorized />;
    }
    
    if (userDetails.role !== "AGENCY_OWNER" && userDetails.role !== "AGENCY_ADMIN") return <Unauthorized />;

    let allNoti: any = [];
    const notifications = await NotificationService.findByAgencyId(agencyIdToUse);
    
    // Populate user data for each notification
    if (notifications) {
        for (const notification of notifications) {
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
        }
        allNoti = notifications;
    }

    return (
        <div className="h-screen overflow-hidden">
            <Sidebar id={params.agencyId} type="agency" />
            <div className="md:pl-[300px]">
                <InfoBar notifications={allNoti} role={userDetails.role} />
                <div className="relative">
                    <BlurPage>{children}</BlurPage>
                </div>
            </div>
        </div>
    );
};

export default Layout;