import SubAccountDetails from "@/components/forms/subaccount-details";
import UserDetails from "@/components/forms/user-details";
import BlurPage from "@/components/global/blur-page";
import { currentUser } from "@clerk/nextjs/server";
import { UserService, SubAccountService, AgencyService } from "@/services";
import React from "react";

type Props = {
    params: {
        subaccountId: string;
    };
};

const Page = async ({ params }: Props) => {
    const authUser = await currentUser();
    if (!authUser) return;

    const userDetails = await UserService.findByEmail(authUser.emailAddresses[0].emailAddress);

    if (!userDetails) return;

    const subAccount = await SubAccountService.findById(params.subaccountId);

    if (!subAccount) return;

    const agencyDetails = await AgencyService.findById(subAccount?.agencyId);
    
    if (!agencyDetails) return;
    
    const subAccounts = await SubAccountService.findByAgencyId(agencyDetails.id);

    return (
        <BlurPage>
            <div className="flex lg:flex-row flex-col gap-4">
                <SubAccountDetails agencyDetails={agencyDetails} details={subAccount} userId={userDetails.id} userName={userDetails.name} />
                <UserDetails type="subaccount" id={params.subaccountId} subAccounts={subAccounts} userData={userDetails} />
            </div>
        </BlurPage>
    );
};

export default Page;