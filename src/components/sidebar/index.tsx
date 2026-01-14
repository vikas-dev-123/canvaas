import { getAuthUserDetails } from "@/lib/queries";

import React from "react";

import MenuOptions from "./menu-options";

import { UsersWithAgencySubAccountPermissionsSidebarOptions, IExtendedAgency } from '@/lib/types';


type Props = {
    id: string;
    type: "agency" | "subaccount";
};


const Sidebar = async ({ id, type }: Props) => {
    const user = await getAuthUserDetails() as UsersWithAgencySubAccountPermissionsSidebarOptions | null;

    if (!user) return null;

    if (!user.Agency) return null;

    // Type assertion to handle the dynamically added properties
    const agencyWithExtendedData = user.Agency as IExtendedAgency;
    
    const details = type === "agency" ? agencyWithExtendedData : agencyWithExtendedData.SubAccount?.find((subaccount) => subaccount.id === id);

    if (!details) return null;

    const isWhiteLabeledAgency = agencyWithExtendedData.whiteLabel;

    let sideBarLogo = agencyWithExtendedData.agencyLogo || "/assets/plura-logo.svg";

    if (!isWhiteLabeledAgency && type === "subaccount") {
        const subaccountLogo = agencyWithExtendedData.SubAccount?.find((subaccount) => subaccount.id === id)?.subAccountLogo;
        if (subaccountLogo) {
            sideBarLogo = subaccountLogo;
        }
    }

    const sidebarOpt = type === "agency" 
        ? agencyWithExtendedData.SidebarOption || [] 
        : agencyWithExtendedData.SubAccount?.find((subaccount) => subaccount.id === id)?.SidebarOption ?? [];

    const subaccounts = agencyWithExtendedData.SubAccount?.filter((subaccount) => 
        user.Permissions.find((permission) => permission.subAccountId === subaccount.id && permission.access)
    ) || [];

    return (
        <MenuOptions 
            defaultOpen={true} 
            details={details} 
            id={id} 
            sidebarLogo={sideBarLogo} 
            sidebarOpt={sidebarOpt} 
            subAccounts={subaccounts} 
            user={user} 
        />
    );
};

export default Sidebar
