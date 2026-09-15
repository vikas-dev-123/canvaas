import AgencyDetails from "@/components/forms/agency-details";
import UserDetails from "@/components/forms/user-details";
import { getAgencyDetails, getUserDetailsByAuthEmail } from "@/lib/queries";
import { getSession } from "@/lib/auth/getSession";

type Props = {
    params: {
        agencyId: string;
    };
};

const Page = async ({ params }: Props) => {
    const session = await getSession();
    if (!session) return null;

    const userDetails = await getUserDetailsByAuthEmail(session.email);

    if (!userDetails) return null;

    const agencyDetails = await getAgencyDetails(params.agencyId);

    if (!agencyDetails) return null;

    const subAccounts = agencyDetails.SubAccount;

    return (
        <div className="flex md:flex-row flex-col gap-4">
            <AgencyDetails data={agencyDetails} />
            <UserDetails type="agency" id={params.agencyId} subAccounts={subAccounts} userData={userDetails} />
        </div>
    );
};

export default Page;
