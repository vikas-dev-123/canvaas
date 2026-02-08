"use client";
import SubAccountDetails from "@/components/forms/subaccount-details";
import CustomModal from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import {
  Agency,
  AgencySidebarOption,
  SubAccount,
  User,
} from "@prisma/client";
import { PlusCircleIcon } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  user: User & {
    Agency:
      | (
          | Agency
          | (null & {
              SubAccount: SubAccount[];
              SideBarOption: AgencySidebarOption[];
            })
        )
      | null;
  };
  id: string;
  className: string;
};

const CreateSubAccountButton = ({
  user,
  id,
  className,
}: Props) => {
  const { setOpen } = useModal();

  const agencyDetails = user.Agency;
  if (!agencyDetails) return;

  return (
    <Button
      className={twMerge(
        `
          w-full h-11
          flex items-center justify-center gap-3
          rounded-xl
          bg-black text-white
          dark:bg-white dark:text-black
          border border-neutral-200 dark:border-neutral-800
          hover:opacity-90
          shadow-[0_12px_24px_-12px_rgba(0,0,0,0.6)]
          transition-all
        `,
        className
      )}
      onClick={() => {
        setOpen(
          <CustomModal
            title="Create_Sub_Account"
            subheading="Provision a new workspace under this agency"
          >
            <SubAccountDetails
              agencyDetails={agencyDetails}
              userName={user.name}
            />
          </CustomModal>
        );
      }}
    >
      <PlusCircleIcon size={16} />
      <span className="text-sm font-semibold tracking-wide">
        Create_Sub_Account
      </span>
    </Button>
  );
};

export default CreateSubAccountButton;
