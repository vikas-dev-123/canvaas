"use client";
import SubAccountDetails from "@/components/forms/subaccount-details";
import CustomModal from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import { IAgency } from "@/models/Agency";
import { ISubAccount } from "@/models/SubAccount";
import { IUser } from "@/models/User";
import { PlusCircleIcon } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
    user: IUser & {
        Agency:
            | (
                  | IAgency
                  | (null & {
                        SubAccount: ISubAccount[];
                        SideBarOption: any[];
                    })
              )
            | null;
    };
    id: string;
    className: string;
};

const CreateSubAccountButton = ({ user, id, className }: Props) => {
    const { setOpen } = useModal();

    const agencyDetails = user.Agency;

    if (!agencyDetails) return;

    return (
        <Button
            className={twMerge("w-full flex gap-4", className)}
            onClick={() => {
                setOpen(
                    <CustomModal title="Create a Subaccount" subheading="You can switch bettween">
                        <SubAccountDetails agencyDetails={agencyDetails} userId={user.id} userName={user.name} />
                    </CustomModal>
                );
            }}
        >
            <PlusCircleIcon size={15} />
            Create Sub Account
        </Button>
    );
};

export default CreateSubAccountButton;