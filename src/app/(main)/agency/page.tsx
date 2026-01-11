import AgencyDetails from '@/components/forms/agency-details';
import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries';
import { currentUser } from '@clerk/nextjs/server'
import { Plan } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react'

const Page = async ({searchParams}:{
  searchParams:{
    plan:Plan;
    state:string;
    code:string;
  }
}) => {
   
  const agencyId = await verifyAndAcceptInvitation();
  console.log("agencyId", agencyId);
  //get user details
  const user = await getAuthUserDetails();

   if (agencyId) {
        if (user?.role === "SUBACCOUNT_GUEST" || user?.role === "SUBACCOUNT_USER") {
            return redirect("/subaccount");
        } else if (user?.role === "AGENCY_OWNER" || user?.role === "AGENCY_ADMIN") {
            if (searchParams.plan) {
                return redirect(`/agency/${agencyId}/billing?plan=${searchParams.plan}`);
            }
            if (searchParams.state) {
                // Handle both launchpad__ and ___ formats
                const parts = searchParams.state.includes("___") 
                    ? searchParams.state.split("___")
                    : searchParams.state.split("__");
                
                const statePath = parts[0];
                const stateAgencyId = parts[1] || agencyId;
                
                if (!stateAgencyId) return <div>Not authorized</div>;
                return redirect(`/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`);
            } else {
                return redirect(`/agency/${agencyId}`);
            }
        } else {
            return <div>Not authorized</div>;
        }
    }

    const authUser = await currentUser();
  if (!authUser) {
    return redirect('/sign-in');
  }

  return (
    <div className="flex justify-center items-center mt-4">
      <div className="max-w-[850px] border p-4 rounded-xl">
        <h1 className="text-4xl">Create An Agency</h1>
        <AgencyDetails
          data={{
            companyEmail: authUser?.emailAddresses[0].emailAddress,
          }}
        />
      </div>
    </div>
  );
};

export default Page;