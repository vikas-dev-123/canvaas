import { ChildrenProps } from "@/@types";
import BlurPage from "@/components/global/blur-page";
import InfoBar from "@/components/global/infobar";
import Sidebar from "@/components/sidebar";
import Unauthorized from "@/components/unauthorized";
import { getNotificationAndUser, verifyAndAcceptInvitation } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

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
    const agencyId = invitationAgencyId || params.agencyId;
    
    if (!agencyId) {
        return redirect(`/agency`);
    }

    if (user.privateMetadata.role !== "AGENCY_OWNER" && user.privateMetadata.role !== "AGENCY_ADMIN") return <Unauthorized />;

    let allNoti: any = [];
    const notifications = await getNotificationAndUser(agencyId);
    if (notifications) allNoti = notifications;

    return (
        <div className="h-screen overflow-hidden">
            <Sidebar id={params.agencyId} type="agency" />
            <div className="md:pl-[300px]">
                <InfoBar notifications={allNoti} role={allNoti.User?.role} />
                <div className="relative">
                    <BlurPage>{children}</BlurPage>
                </div>
            </div>
        </div>
    );
};

export default Layout;