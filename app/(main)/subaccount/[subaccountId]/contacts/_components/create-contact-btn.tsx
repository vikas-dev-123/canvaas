"use client";
import ContactUserForm from "@/components/forms/contact-user-form";
import CustomModal from "@/components/global/custom-modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/providers/modal-provider";
import { Plus } from "lucide-react";
import React from "react";

type Props = {
  subaccountId: string;
};

const CreateContactButton = ({ subaccountId }: Props) => {
  const { setOpen } = useModal();

  const handleCreateContact = () => {
    setOpen(
      <CustomModal
        title="Create / Update Contact"
        subheading="Contacts are your customers & leads."
      >
        <ContactUserForm subaccountId={subaccountId} />
      </CustomModal>
    );
  };

  return (
    <Button
      onClick={handleCreateContact}
      className="
        flex items-center gap-2
        rounded-xl px-5 py-2.5
        bg-black text-white
        hover:bg-neutral-800
        dark:bg-white dark:text-black
        dark:hover:bg-neutral-200
        transition-all
        shadow-sm hover:shadow-md
      "
    >
      <Plus size={16} />
      Create Contact
    </Button>
  );
};

export default CreateContactButton;
