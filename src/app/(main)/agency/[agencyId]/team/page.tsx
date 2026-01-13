import React from "react";
import DataTable from "./data-table";
import { Plus } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { columns } from "./columns";
import SendInvitation from "@/components/forms/send-invitation";
import { AgencyService } from "@/services";
import { getAuthUserDetails, getUsersWithAgencySubAccountPermissionsSidebarOptions } from "@/lib/queries";

type Props = {
    params: {
        agencyId: string;
    };
};

const Page = async ({ params }: Props) => {
    const authUser = await currentUser();
    const teamMembers = await getUsersWithAgencySubAccountPermissionsSidebarOptions(params.agencyId);

    if (!authUser) return null;
    const agencyDetails = await AgencyService.findById(params.agencyId);

    if (!agencyDetails) return;

    return (
        <DataTable
            actionButtonText={
                <>
                    <Plus size={15} />
                    Add
                </>
            }
            modalChildren={<SendInvitation agencyId={agencyDetails.id} />}
            filterValue="name"
            columns={columns}
            data={teamMembers}
        ></DataTable>
    );
};

export default Page;