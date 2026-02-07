import { db } from "@/lib/db";
import React from "react";
import DataTable from "./data-table";
import { Plus } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { columns } from "./columns";
import SendInvitation from "@/components/forms/send-invitation";

type Props = {
  params: {
    agencyId: string;
  };
};

const Page = async ({ params }: Props) => {
  const authUser = await currentUser();

  const teamMembers = await db.user.findMany({
    where: {
      Agency: {
        id: params.agencyId,
      },
    },
    include: {
      Agency: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    },
  });

  if (!authUser) return null;

  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
    include: {
      SubAccount: true,
    },
  });

  if (!agencyDetails) return;

  return (
    <div
      className="
        w-full h-full
        p-6
        bg-white dark:bg-[#101010]
      "
    >
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Team_Members
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Manage users, roles, and sub-account access
        </p>
      </div>

      {/* TABLE WRAPPER */}
      <div
        className="
          rounded-2xl border
          bg-white dark:bg-[#101010]
          border-neutral-200 dark:border-neutral-800
          shadow-[0_24px_48px_-18px_rgba(0,0,0,0.6)]
        "
      >
        <DataTable
          actionButtonText={
            <span className="flex items-center gap-2">
              <Plus size={14} />
              Add_User
            </span>
          }
          modalChildren={<SendInvitation agencyId={agencyDetails.id} />}
          filterValue="name"
          columns={columns}
          data={teamMembers}
        />
      </div>
    </div>
  );
};

export default Page;
