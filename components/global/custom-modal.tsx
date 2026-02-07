"use client";
import { useModal } from "@/providers/modal-provider";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type Props = {
  title: string;
  subheading: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

const CustomModal = ({ children, defaultOpen, subheading, title }: Props) => {
  const { isOpen, setClose } = useModal();

  return (
    <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
      <DialogContent
        className="
          overflow-auto
          h-screen md:h-fit md:max-h-[700px]
          rounded-none md:rounded-2xl
          border
          bg-white dark:bg-[#101010]
          border-neutral-200 dark:border-neutral-800
          shadow-[0_32px_64px_-20px_rgba(0,0,0,0.7)]
        "
      >
        <DialogHeader className="pt-8 space-y-2 text-left">
          <DialogTitle
            className="
              text-2xl font-bold tracking-tight
              text-black dark:text-white
            "
          >
            {title}
          </DialogTitle>

          <DialogDescription
            className="
              text-sm font-mono
              text-neutral-600 dark:text-neutral-400
            "
          >
            {subheading}
          </DialogDescription>
        </DialogHeader>

        <div className="pt-6">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
