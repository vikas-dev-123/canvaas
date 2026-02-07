import { AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getAuthUserDetails } from "@/lib/queries";
import { SubAccount } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import DeleteButton from "./_components/delete-button";
import CreateSubAccountButton from "./_components/create--button";

type Props = {
  params: {
    agencyId: string;
  };
};

const Page = async ({ params }: Props) => {
  const user = await getAuthUserDetails();
  if (!user) return;

  return (
    <AlertDialog>
      <div className="flex flex-col gap-6 p-6 bg-white dark:bg-[#101010] min-h-screen">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">
              Sub_Accounts
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Manage all connected sub-accounts
            </p>
          </div>

          <CreateSubAccountButton
            user={user}
            id={params.agencyId}
            className="
              w-[220px]
              bg-black text-white
              dark:bg-white dark:text-black
              hover:opacity-90
            "
          />
        </div>

        {/* SEARCH + LIST */}
        <Command
          className="
            rounded-2xl
            bg-white dark:bg-[#101010]
            border border-neutral-200 dark:border-neutral-800
            shadow-[0_24px_48px_-18px_rgba(0,0,0,0.7)]
          "
        >
          <CommandInput
            placeholder="Search_Sub_Account..."
            className="
              h-12
              bg-white dark:bg-[#101010]
              border-b border-neutral-200 dark:border-neutral-800
              text-black dark:text-white
            "
          />

          <CommandList className="p-4">
            <CommandEmpty className="text-neutral-500 text-sm py-8 text-center">
              No Results Found
            </CommandEmpty>

            <CommandGroup heading="SUB_ACCOUNTS">
              {!!user.Agency?.SubAccount.length ? (
                user.Agency.SubAccount.map(
                  (subaccount: SubAccount) => (
                    <CommandItem
                      key={subaccount.id}
                      className="
                        flex items-center justify-between
                        rounded-xl p-4 my-3
                        border border-neutral-200 dark:border-neutral-800
                        bg-neutral-50 dark:bg-neutral-900/40
                        hover:bg-neutral-100 dark:hover:bg-neutral-900
                        transition-all
                      "
                    >
                      <Link
                        href={`/subaccount/${subaccount.id}`}
                        className="flex gap-4 items-center flex-1"
                      >
                        <div className="relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                          <Image
                            src={subaccount.subAccountLogo}
                            alt="subaccount logo"
                            fill
                            className="object-contain p-3"
                          />
                        </div>

                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-black dark:text-white">
                            {subaccount.name}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {subaccount.address}
                          </span>
                        </div>
                      </Link>

                      {/* DELETE */}
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          className="
                            ml-4
                            bg-red-600 text-white
                            hover:bg-red-700
                          "
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>

                      {/* CONFIRM MODAL */}
                      <AlertDialogContent
                        className="
                          bg-white dark:bg-[#101010]
                          border border-neutral-200 dark:border-neutral-800
                        "
                      >
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-left text-black dark:text-white">
                            Confirm_Deletion
                          </AlertDialogTitle>
                          <AlertDescription className="text-left text-neutral-600 dark:text-neutral-400">
                            This action cannot be undone. This will permanently
                            delete the sub-account and all related data.
                          </AlertDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="
                              bg-red-600 text-white
                              hover:bg-red-700
                            "
                          >
                            <DeleteButton
                              subaccountId={subaccount.id}
                            />
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </CommandItem>
                  )
                )
              ) : (
                <div className="text-neutral-500 text-center py-12">
                  No Sub Accounts Available
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </AlertDialog>
  );
};

export default Page;
