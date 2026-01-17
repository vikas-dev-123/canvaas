import React from "react";
import DataTable from "./data-table";
import { Plus } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { columns } from "./columns";
import SendInvitation from "@/components/forms/send-invitation";
import { AgencyService } from "@/services";
import { UserService, PermissionsService, SubAccountService } from "@/services";

type Props = {
    params: {
        agencyId: string;
    };
};

const Page = async ({ params }: Props) => {
    const authUser = await currentUser();
    
    // Get all users in the agency and enrich them with permissions and agency details
    const agencyUsers = await UserService.findByAgencyId(params.agencyId);
    
    if (!authUser) return null;
    const agencyDetails = await AgencyService.findById(params.agencyId);

    if (!agencyDetails) return;
    
    // Build the complex user data structure that the columns expect
    const teamMembers = await Promise.all(
        agencyUsers.map(async (user) => {
            // Get user permissions
            const permissions = await PermissionsService.findByEmail(user.email);
            
            // Enrich permissions with subaccount details
            const enrichedPermissions = await Promise.all(
                permissions.map(async (permission: any) => {
                    if (permission.subAccountId) {
                        const subAccount = await SubAccountService.findById(permission.subAccountId);
                        return { ...permission, SubAccount: subAccount };
                    }
                    return { ...permission, SubAccount: null };
                })
            );
            
            return {
                ...user,
                Agency: agencyDetails,
                Permissions: enrichedPermissions,
            };
        })
    );

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