import { currentUser } from "@clerk/nextjs/server";
import { AgencyService, UserService, AgencySidebarOptionService, SubAccountService, SubAccountSidebarOptionService, PermissionsService } from "@/services";
import { IAgency } from "@/models/Agency";
import { ISubAccount } from "@/models/SubAccount";
import { IAgencySidebarOption } from "@/models/AgencySidebarOption";
import { ISubAccountSidebarOption } from "@/models/SubAccountSidebarOption";
import { IPermissions } from "@/models/Permissions";

// Extended interfaces that include the dynamically added properties
interface IExtendedSubAccount extends ISubAccount {
    SidebarOption?: ISubAccountSidebarOption[];
}

interface IExtendedAgency extends IAgency {
    SubAccount?: IExtendedSubAccount[];
    SidebarOption?: IAgencySidebarOption[];
}

import React from "react";

import MenuOptions from "./menu-options";

import { UsersWithAgencySubAccountPermissionsSidebarOptions } from '@/lib/types';


type Props = {
    id: string;
    type: "agency" | "subaccount";
};


const Sidebar = async ({ id, type }: Props) => {
    const authUser = await currentUser();

    if (!authUser) return null;

    // Find user by email
    const userData = await UserService.findByEmail(authUser.emailAddresses[0].emailAddress);
    
    if (!userData) return null;
    
    // Get agency with related data
    let agencyWithExtendedData: IExtendedAgency | null = null;
    let permissions: IPermissions[] = [];
    let subaccounts: IExtendedSubAccount[] = [];
    
    if (userData.agencyId) {
        const agency = await AgencyService.findById(userData.agencyId);
        if (agency) {
            const sidebarOptions = await AgencySidebarOptionService.findByAgencyId(agency.id);
            const subAccounts = await SubAccountService.findByAgencyId(agency.id);
            
            // Add sidebar options to agency
            (agency as any).SidebarOption = sidebarOptions;
            
            // Add subaccounts with their sidebar options
            for (const subAccount of subAccounts) {
                const subAccountSidebarOptions = await SubAccountSidebarOptionService.findBySubAccountId(subAccount.id);
                (subAccount as any).SidebarOption = subAccountSidebarOptions;
            }
            
            (agency as any).SubAccount = subAccounts;
            agencyWithExtendedData = agency;
            
            // Get user permissions
            permissions = await PermissionsService.findByEmail(userData.email);
            subaccounts = subAccounts.filter((subaccount: IExtendedSubAccount) => 
                permissions.find((permission) => permission.subAccountId === subaccount.id && permission.access)
            );
        }
    }
    
    if (!agencyWithExtendedData) return null;
    
    const details = type === "agency" ? agencyWithExtendedData : agencyWithExtendedData.SubAccount?.find((subaccount: IExtendedSubAccount) => subaccount.id === id);
    
    if (!details) return null;
    
    const isWhiteLabeledAgency = agencyWithExtendedData.whiteLabel;
    
    let sideBarLogo = agencyWithExtendedData.agencyLogo || "/assets/plura-logo.svg";
    
    if (!isWhiteLabeledAgency && type === "subaccount") {
        const subaccountLogo = agencyWithExtendedData.SubAccount?.find((subaccount: IExtendedSubAccount) => subaccount.id === id)?.subAccountLogo;
        if (subaccountLogo) {
            sideBarLogo = subaccountLogo;
        }
    }
    
    const sidebarOpt = type === "agency" 
        ? agencyWithExtendedData.SidebarOption || [] 
        : agencyWithExtendedData.SubAccount?.find((subaccount: IExtendedSubAccount) => subaccount.id === id)?.SidebarOption ?? [];
    
    // Create a user object with extended properties
    const userWithExtendedProperties = {
        ...userData,
        Agency: agencyWithExtendedData,
        Permissions: permissions
    } as UsersWithAgencySubAccountPermissionsSidebarOptions;

    return (
        <MenuOptions 
            defaultOpen={true} 
            details={details} 
            id={id} 
            sidebarLogo={sideBarLogo} 
            sidebarOpt={sidebarOpt} 
            subAccounts={subaccounts} 
            user={userWithExtendedProperties} 
        />
    );
};

export default Sidebar
