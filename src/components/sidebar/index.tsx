import { getAuthUserDetails } from '@/lib/queries'
import React from 'react'
import MenuOptions from './menu-options'
import { UsersWithAgencySubAccountPermissionsSidebarOptions, IExtendedAgency } from '@/lib/types';

type Props = {
    id:string,
    type:'agency' | 'subaccount'
}


const Sidebar = async ( {id, type}:Props) => {
const user = await getAuthUserDetails() as UsersWithAgencySubAccountPermissionsSidebarOptions | null;

    if (!user) return;

    if (!user?.Agency) return;

    const agencyUser = user!; // We know user and user.Agency exist at this point
    // Type assertion to handle the dynamically added properties
    const agencyWithExtendedData = agencyUser.Agency as IExtendedAgency;
    
    const details = type === "agency" ? agencyWithExtendedData : agencyWithExtendedData.SubAccount?.find((subaccount) => subaccount.id === id);

    const isWhiteLabeledAgency = agencyWithExtendedData.whiteLabel;
    if (!details) return;

    let sideBarLogo = agencyWithExtendedData.agencyLogo || "/assets/plura-logo.svg";

    if (!isWhiteLabeledAgency) {
        if (type === "subaccount") {
            sideBarLogo = agencyWithExtendedData.SubAccount?.find((subaccount) => subaccount.id === id)?.subAccountLogo || agencyWithExtendedData.agencyLogo;
        }
    }

    const sidebarOpt = type === "agency" ? agencyWithExtendedData.SidebarOption || [] : agencyWithExtendedData.SubAccount?.find((subaccount) => subaccount.id === id)?.SidebarOption || [];

    const subaccounts = agencyWithExtendedData.SubAccount?.filter((subaccount) => agencyUser.Permissions.find((permission) => permission.subAccountId === subaccount.id && permission.access)) || [];


  return (
    <MenuOptions 
    defaultOpen={true}
    details={details} 
    id={id} 
    sidebarLogo={sideBarLogo} 
    sidebarOpt={sidebarOpt} 
    subAccounts={subaccounts} 
    user={user} />
  )
}

export default Sidebar
