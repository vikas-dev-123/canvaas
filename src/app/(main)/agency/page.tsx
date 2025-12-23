import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
  const authUser = await currentUser();
  if (!authUser)
    return redirect(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/agency/sign-in");
  return (
    <div>
      Agency
    </div>
  );
};

export default page
