"use client";

import useMounted from "@/hooks/useMounted";
import {
  Agency,
  AgencySidebarOption,
  SubAccount,
  SubAccountSidebarOption,
} from "@prisma/client";
import clsx from "clsx";
import { ChevronsUpDown, Menu, PlusCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import Compass from "../icons/compass";
import { AspectRatio } from "../ui/aspect-ratio";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useModal } from "@/providers/modal-provider";
import CustomModal from "../global/custom-modal";
import SubAccountDetails from "../forms/subaccount-details";
import { Separator } from "../ui/separator";
import { icons } from "@/lib/constant";

type Props = {
  defaultOpen?: boolean;
  subAccounts: SubAccount[];
  sidebarOpt: AgencySidebarOption[] | SubAccountSidebarOption[];
  sidebarLogo: string;
  details: any;
  user: any;
  id: string;
};

const MenuOptions = ({
  defaultOpen,
  subAccounts,
  sidebarOpt,
  sidebarLogo,
  details,
  user,
}: Props) => {
  const mounted = useMounted();
  const { setOpen } = useModal();

  const openState = useMemo(
    () => (defaultOpen ? { open: true } : {}),
    [defaultOpen]
  );

  if (!mounted) return null;

  return (
    <Sheet modal={false} {...openState}>
      {/* Mobile Trigger */}
      <SheetTrigger asChild className="absolute left-4 top-4 z-[100] md:hidden">
        <Button
          variant="outline"
          size="icon"
          className="
            bg-white dark:bg-[#101010]
            border-neutral-300 dark:border-neutral-800
          "
        >
          <Menu className="text-black dark:text-white" />
        </Button>
      </SheetTrigger>

      <SheetContent
        showX={!defaultOpen}
        side="left"
        className={clsx(
          `
            fixed top-0 h-full p-6
            border-r transition-colors
            bg-white dark:bg-[#101010]
            border-neutral-200 dark:border-neutral-800
          `,
          {
            "hidden md:block w-[300px] z-0": defaultOpen,
            "block md:hidden w-full z-[100]": !defaultOpen,
          }
        )}
      >
        <div className="space-y-8">
          {/* LOGO */}
          <AspectRatio ratio={16 / 5}>
            <Image
              src={sidebarLogo}
              alt="Sidebar Logo"
              fill
              className="rounded-lg object-contain"
            />
          </AspectRatio>

          {/* ACCOUNT SWITCHER */}
          <Popover>
            <PopoverTrigger className="w-full">
              <div
                className="
                  flex items-center justify-between
                  p-4 rounded-xl border
                  bg-white dark:bg-[#101010]
                  border-neutral-200 dark:border-neutral-800
                  hover:bg-neutral-100 dark:hover:bg-neutral-900
                  transition
                "
              >
                <div className="flex items-center gap-3">
                  <Compass />
                  <div className="text-left">
                    <p className="text-sm font-medium text-black dark:text-white">
                      {details.name}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {details.address}
                    </p>
                  </div>
                </div>
                <ChevronsUpDown size={14} className="text-neutral-500" />
              </div>
            </PopoverTrigger>

            <PopoverContent
              className="
                w-80 rounded-xl border
                bg-white dark:bg-[#101010]
                border-neutral-200 dark:border-neutral-800
              "
            >
              <Command className="bg-transparent">
                <CommandInput placeholder="Search Accounts..." />
                <CommandList className="py-4">
                  <CommandEmpty>No Results Found</CommandEmpty>

                  {(user?.role === "AGENCY_OWNER" ||
                    user?.role === "AGENCY_ADMIN") &&
                    user?.Agency && (
                      <CommandGroup heading="AGENCY">
                        <CommandItem
                          className="
                            rounded-lg border
                            bg-white dark:bg-[#101010]
                            border-neutral-200 dark:border-neutral-800
                            hover:bg-neutral-100 dark:hover:bg-neutral-900
                          "
                        >
                          <Link
                            href={`/agency/${user.Agency.id}`}
                            className="flex gap-4 w-full"
                          >
                            <div className="relative w-14 h-10">
                              <Image
                                src={user.Agency.agencyLogo}
                                alt="Agency Logo"
                                fill
                                className="rounded-md object-contain"
                              />
                            </div>
                            <div>
                              <p className="text-sm text-black dark:text-white">
                                {user.Agency.name}
                              </p>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                {user.Agency.address}
                              </p>
                            </div>
                          </Link>
                        </CommandItem>
                      </CommandGroup>
                    )}

                  <CommandGroup heading="SUB_ACCOUNTS">
                    {subAccounts.map((sub) => (
                      <CommandItem
                        key={sub.id}
                        className="
                          rounded-lg
                          hover:bg-neutral-100 dark:hover:bg-neutral-900
                        "
                      >
                        <Link
                          href={`/subaccount/${sub.id}`}
                          className="flex gap-4 w-full"
                        >
                          <div className="relative w-14 h-10">
                            <Image
                              src={sub.subAccountLogo}
                              alt="Subaccount Logo"
                              fill
                              className="rounded-md object-contain"
                            />
                          </div>
                          <div>
                            <p className="text-sm text-black dark:text-white">
                              {sub.name}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              {sub.address}
                            </p>
                          </div>
                        </Link>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>

                {(user?.role === "AGENCY_OWNER" ||
                  user?.role === "AGENCY_ADMIN") && (
                  <Button
                    className="
                      w-full mt-4 gap-2
                      bg-black text-white
                      dark:bg-white dark:text-black
                      hover:opacity-90
                    "
                    onClick={() =>
                      setOpen(
                        <CustomModal
                          title="Create_Sub_Account"
                          subheading="Switch between agency & sub accounts"
                        >
                          <SubAccountDetails
                            agencyDetails={user.Agency as Agency}
                            userName={user.name}
                          />
                        </CustomModal>
                      )
                    }
                  >
                    <PlusCircleIcon size={16} />
                    Create Sub Account
                  </Button>
                )}
              </Command>
            </PopoverContent>
          </Popover>

          {/* MENU */}
          <div className="space-y-2">
            <p className="text-[10px] font-mono tracking-widest text-neutral-500">
              MENU_LINKS
            </p>
            <Separator className="bg-neutral-200 dark:bg-neutral-800" />

            <nav>
              <Command className="bg-transparent">
                <CommandInput placeholder="Search Modules..." />
                <CommandList className="py-4">
                  <CommandEmpty>No Results</CommandEmpty>
                  <CommandGroup>
                    {sidebarOpt.map((opt) => {
                      const Icon = icons.find(
                        (i) => i.value === opt.icon
                      )?.path;

                      return (
                        <CommandItem
                          key={opt.id}
                          className="
                            rounded-lg
                            hover:bg-neutral-100 dark:hover:bg-neutral-900
                          "
                        >
                          <Link
                            href={opt.link}
                            className="flex items-center gap-3 w-full"
                          >
                            {Icon && <div className="w-4 h-4 flex items-center justify-center"><div className="w-full h-full flex items-center justify-center scale-50 origin-top-left"><Icon /></div></div>}
                            <span className="text-sm text-black dark:text-white">
                              {opt.name}
                            </span>
                          </Link>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MenuOptions;
