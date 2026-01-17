import AgencyDetails from "@/components/forms/agency-details";
import UserDetails from "@/components/forms/user-details";
import { AgencyService, UserService, SubAccountService } from "@/services";
import { currentUser } from "@clerk/nextjs/server";

type Props = {
    params: {
        agencyId: string;
    };
};

const Page = async ({ params }: Props) => {
    const authUser = await currentUser();
    if (!authUser) return null;

    const userDetails = await UserService.findByEmail(authUser.emailAddresses[0].emailAddress);

    if (!userDetails) return null;

    const agencyDetails = await AgencyService.findById(params.agencyId);

    if (!agencyDetails) return null;

    const subAccounts = await SubAccountService.findByAgencyId(agencyDetails.id);

    return (
        <div className="flex md:flex-row flex-col gap-4">
            <AgencyDetails data={agencyDetails} />
            <UserDetails type="agency" id={params.agencyId} subAccounts={subAccounts} userData={userDetails} />
        </div>
    );
};

export default Page;