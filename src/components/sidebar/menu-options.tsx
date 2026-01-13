"use client";

import useMounted from "@/hooks/useMounted";
import { Agency, AgencySidebarOption, SubAccount, SubAccountSidebarOption } from "@/lib/interfaces";
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
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { useModal } from "@/providers/modal-provider";
import CustomModal from "../global/custom-modal";
import SubAccountDetails from "../forms/subaccount-details";
import { Separator } from "../ui/separator";
import { icons } from "@/lib/constants";

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
  id,
}: Props) => {
  const { setOpen } = useModal();
  const mounted = useMounted();

  const openState = useMemo(() => (defaultOpen ? { open: true } : {}), [defaultOpen]);

  if (!mounted) return null;

  return (
    <Sheet modal={false} {...openState}>
      {/* Mobile menu button */}
      <SheetTrigger asChild className="absolute left-4 top-4 z-[100] md:!hidden flex">
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent
        showX={!defaultOpen}
        side="left"
        className={clsx(
          "bg-background/80 backdrop-blur-xl fixed top-0 border-r p-6",
          {
            "hidden md:inline-block z-0 w-[300px]": defaultOpen,
            "inline-block md:hidden z-[100] w-full": !defaultOpen,
          }
        )}
      >
        <div>
          {/* Logo */}
          <AspectRatio ratio={16 / 5}>
            <Image
              src={sidebarLogo}
              alt="Sidebar Logo"
              fill
              className="rounded-md object-contain"
            />
          </AspectRatio>

          {/* Account Switcher */}
          <Popover>
            <PopoverTrigger asChild className="w-full">
              <Button
                variant="ghost"
                className="w-full p-4 my-4 flex items-center justify-between py-8"
              >
                <div className="flex items-center text-left gap-2">
                  <Compass />
                  <div className="flex flex-col">
                    {details.name}
                    <span className="text-muted-foreground">
                      {details.address}
                    </span>
                  </div>
                </div>
                <ChevronsUpDown size={12} className="text-muted-foreground" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 h-auto mt-4 z-[200]">
              <Command className="rounded-lg">
                <CommandInput placeholder="Accounts..." />
                <CommandList className="pb-16">
                  <CommandEmpty>No Results found</CommandEmpty>

                  {/* Agency */}
                  {(user?.role === "AGENCY_OWNER" ||
                    user?.role === "AGENCY_ADMIN") &&
                    user?.Agency && (
                      <CommandGroup heading="Agency">
                        <CommandItem className="!bg-transparent my-2 border p-2 rounded-md">
                          {defaultOpen ? (
                            <Link
                              href={`/agency/${user.Agency.id}`}
                              className="flex gap-4 w-full"
                            >
                              <div className="relative w-16">
                                <Image
                                  src={user.Agency.agencyLogo}
                                  alt="Agency Logo"
                                  fill
                                  className="rounded-md object-contain"
                                />
                              </div>
                              <div className="flex flex-col">
                                {user.Agency.name}
                                <span className="text-muted-foreground">
                                  {user.Agency.address}
                                </span>
                              </div>
                            </Link>
                          ) : (
                            <SheetClose asChild>
                              <Link
                                href={`/agency/${user.Agency.id}`}
                                className="flex gap-4 w-full"
                              >
                                <div className="relative w-16">
                                  <Image
                                    src={user.Agency.agencyLogo}
                                    alt="Agency Logo"
                                    fill
                                    className="rounded-md object-contain"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  {user.Agency.name}
                                  <span className="text-muted-foreground">
                                    {user.Agency.address}
                                  </span>
                                </div>
                              </Link>
                            </SheetClose>
                          )}
                        </CommandItem>
                      </CommandGroup>
                    )}

                  {/* Subaccounts */}
                  <CommandGroup heading="Accounts">
                    {subAccounts.length > 0
                      ? subAccounts.map((sub) => (
                          <CommandItem key={sub.id}>
                            {defaultOpen ? (
                              <Link
                                href={`/subaccount/${sub.id}`}
                                className="flex gap-4 w-full"
                              >
                                <div className="relative w-16">
                                  <Image
                                    src={sub.subAccountLogo}
                                    alt="Subaccount Logo"
                                    fill
                                    className="rounded-md object-contain"
                                  />
                                </div>
                                <div className="flex flex-col">
                                  {sub.name}
                                  <span className="text-muted-foreground">
                                    {sub.address}
                                  </span>
                                </div>
                              </Link>
                            ) : (
                              <SheetClose asChild>
                                <Link
                                  href={`/subaccount/${sub.id}`}
                                  className="flex gap-4 w-full"
                                >
                                  <div className="relative w-16">
                                    <Image
                                      src={sub.subAccountLogo}
                                      alt="Subaccount Logo"
                                      fill
                                      className="rounded-md object-contain"
                                    />
                                  </div>
                                  <div className="flex flex-col">
                                    {sub.name}
                                    <span className="text-muted-foreground">
                                      {sub.address}
                                    </span>
                                  </div>
                                </Link>
                              </SheetClose>
                            )}
                          </CommandItem>
                        ))
                      : "No Accounts"}
                  </CommandGroup>
                </CommandList>

                {/* Create Subaccount */}
                {(user?.role === "AGENCY_OWNER" ||
                  user?.role === "AGENCY_ADMIN") && (
                  <SheetClose asChild>
                    <Button
                      className="w-full flex gap-2"
                      onClick={() =>
                        setOpen(
                          <CustomModal
                            title="Create A Subaccount"
                            subheading="Switch between agency & subaccounts"
                          >
                            <SubAccountDetails
                              agencyDetails={user.Agency as Agency}
                              userId={user.id}
                              userName={user.name}
                            />
                          </CustomModal>
                        )
                      }
                    >
                      <PlusCircleIcon size={15} />
                      Create Sub Account
                    </Button>
                  </SheetClose>
                )}
              </Command>
            </PopoverContent>
          </Popover>

          <p className="text-muted-foreground text-xs mb-2">MENU LINKS</p>
          <Separator className="mb-4" />

          {/* Navigation */}
          <nav>
            <Command className="rounded-lg bg-transparent">
              <CommandInput placeholder="Search..." />
              <CommandList className="py-4">
                <CommandEmpty>No Results found</CommandEmpty>
                <CommandGroup>
                  {sidebarOpt.map((opt) => {
                    const Icon = icons.find((i) => i.value === opt.icon)?.path;
                    return (
                      <CommandItem key={opt.id}>
                        <Link
                          href={opt.link}
                          className="flex gap-2 items-center w-full"
                        >
                          {Icon && <Icon />}
                          <span>{opt.name}</span>
                        </Link>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MenuOptions;
